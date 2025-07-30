import { useState, useEffect } from 'react';

interface AudioAnalysisResult {
  pitch: number;
  intensity: number;
  voiceQuality: number;
  gender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
}

const useAudioFileAnalysis = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    setAudioContext(ctx);
    return () => {
      ctx.close();
    };
  }, []);

  const processAudioFile = async (file: File): Promise<void> => {
    if (!audioContext) return;
    
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const newAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(newAudioBuffer);
      setDuration(newAudioBuffer.duration);
      setCurrentTime(0);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error al procesar el archivo de audio:', error);
      setIsProcessing(false);
    }
  };

  const analyzeAudioChunk = (audioData: Float32Array): AudioAnalysisResult => {
    // Análisis de frecuencia usando FFT
    const analyser = audioContext!.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    
    // Crear buffer temporal y nodo de fuente
    const tempBuffer = audioContext!.createBuffer(1, audioData.length, audioContext!.sampleRate);
    tempBuffer.copyToChannel(audioData, 0);
    const tempSource = audioContext!.createBufferSource();
    tempSource.buffer = tempBuffer;
    
    // Conectar para análisis
    tempSource.connect(analyser);
    analyser.connect(audioContext!.destination);
    
    // Obtener datos de frecuencia
    analyser.getFloatFrequencyData(dataArray);
    
    // Calcular pitch promedio
    let maxFrequency = 0;
    let maxAmplitude = -Infinity;
    
    for (let i = 0; i < bufferLength; i++) {
      const frequency = i * audioContext!.sampleRate / analyser.fftSize;
      const amplitude = dataArray[i];
      
      if (amplitude > maxAmplitude && frequency >= 50 && frequency <= 500) {
        maxAmplitude = amplitude;
        maxFrequency = frequency;
      }
    }
    
    // Calcular intensidad
    const intensity = audioData.reduce((sum, value) => sum + Math.abs(value), 0) / audioData.length;
    
    // Determinar género basado en el pitch
    let gender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
    if (maxFrequency < 165) {
      gender = 'MASCULINA';
    } else if (maxFrequency > 180) {
      gender = 'FEMENINA';
    } else {
      gender = 'INDETERMINADA';
    }
    
    // Calcular calidad de voz basada en la consistencia de la señal
    const voiceQuality = calculateVoiceQuality(audioData);
    
    return {
      pitch: maxFrequency,
      intensity,
      voiceQuality,
      gender
    };
  };

  const calculateVoiceQuality = (audioData: Float32Array): number => {
    // Calcular la variación de la señal
    let sum = 0;
    let prevValue = audioData[0];
    
    for (let i = 1; i < audioData.length; i++) {
      const diff = Math.abs(audioData[i] - prevValue);
      sum += diff;
      prevValue = audioData[i];
    }
    
    const avgVariation = sum / audioData.length;
    // Normalizar a un valor entre 0 y 1, donde menos variación = mejor calidad
    return Math.max(0, Math.min(1, 1 - (avgVariation * 10)));
  };

  const playAudio = () => {
    if (!audioBuffer || !audioContext) return;
    
    // Detener reproducción actual si existe
    if (source) {
      source.stop();
      setSource(null);
    }
    
    const newSource = audioContext.createBufferSource();
    newSource.buffer = audioBuffer;
    newSource.connect(audioContext.destination);
    
    newSource.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    newSource.start(0);
    setSource(newSource);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (source) {
      source.stop();
      setSource(null);
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const analyzeFullAudio = (): AudioAnalysisResult[] => {
    if (!audioBuffer) return [];
    
    const results: AudioAnalysisResult[] = [];
    const channelData = audioBuffer.getChannelData(0);
    const chunkSize = audioContext!.sampleRate * 0.05; // Analizar en chunks de 50ms
    
    for (let i = 0; i < channelData.length; i += chunkSize) {
      const chunk = channelData.slice(i, i + chunkSize);
      results.push(analyzeAudioChunk(chunk));
    }
    
    return results;
  };

  return {
    processAudioFile,
    analyzeFullAudio,
    playAudio,
    stopAudio,
    isProcessing,
    isPlaying,
    currentTime,
    duration
  };
};

export default useAudioFileAnalysis;
