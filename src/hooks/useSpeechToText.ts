import { useEffect, useRef } from 'react';

interface UseSpeechToTextProps {
  isRecording: boolean;
  onTranscriptionChange: (text: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const useSpeechToText = ({ isRecording, onTranscriptionChange }: UseSpeechToTextProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const restartTimeoutRef = useRef<number>();

  useEffect(() => {
    // Verificar soporte del navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('El navegador no soporta reconocimiento de voz');
      return;
    }

    // Crear y configurar reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configuración optimizada
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 3;

    // Eventos de audio
    recognition.onaudiostart = () => {
      console.log('Comenzó la captura de audio');
    };

    recognition.onstart = () => {
      isListeningRef.current = true;
      console.log('Reconocimiento de voz iniciado');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Procesar todos los resultados
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        // Buscar la alternativa con mayor confianza
        let bestAlternative = result[0];
        for (let j = 1; j < result.length; j++) {
          if (result[j].confidence > bestAlternative.confidence) {
            bestAlternative = result[j];
          }
        }

        if (result.isFinal) {
          finalTranscript += bestAlternative.transcript + ' ';
        } else {
          interimTranscript += bestAlternative.transcript + ' ';
        }
      }

      // Actualizar referencias
      transcriptRef.current = finalTranscript.trim();
      interimTranscriptRef.current = interimTranscript.trim();

      // Enviar el texto completo
      const fullText = `${transcriptRef.current} ${interimTranscriptRef.current}`.trim();
      console.log('Texto reconocido:', fullText);
      onTranscriptionChange(fullText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Error en reconocimiento de voz:', event.error);
      isListeningRef.current = false;
      
      if (isRecording && event.error !== 'no-speech' && recognitionRef.current) {
        if (restartTimeoutRef.current) {
          window.clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = window.setTimeout(() => {
          try {
            if (recognitionRef.current && isRecording) {
              recognitionRef.current.start();
              console.log('Reintentando después de error...');
            }
          } catch (e) {
            console.error('Error al reintentar el reconocimiento:', e);
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      console.log('Reconocimiento de voz terminado');
      isListeningRef.current = false;
      
      if (isRecording && recognitionRef.current) {
        if (restartTimeoutRef.current) {
          window.clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = window.setTimeout(() => {
          try {
            if (recognitionRef.current && !isListeningRef.current) {
              recognitionRef.current.start();
              console.log('Reconocimiento reiniciado automáticamente');
            }
          } catch (e) {
            console.error('Error al reiniciar el reconocimiento:', e);
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    // Iniciar si isRecording es true
    if (isRecording && !isListeningRef.current) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
      }
    }

    return () => {
      if (restartTimeoutRef.current) {
        window.clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error al detener el reconocimiento:', error);
        }
      }
    };
  }, [isRecording, onTranscriptionChange]);

  // Efecto adicional para manejar cambios en isRecording
  useEffect(() => {
    if (isRecording && !isListeningRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
      }
    } else if (!isRecording && isListeningRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error al detener el reconocimiento:', error);
      }
    }
  }, [isRecording]);
};

export default useSpeechToText;
