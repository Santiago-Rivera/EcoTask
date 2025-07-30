import React, { useCallback, useState } from 'react';
import useAudioFileAnalysis from '../hooks/useAudioFileAnalysis';
import VoiceMetrics from './VoiceMetrics';

interface AudioFileUploaderProps {
  onAnalysisComplete?: (results: any) => void;
}

const AudioFileUploader: React.FC<AudioFileUploaderProps> = ({ onAnalysisComplete }) => {
  const {
    processAudioFile,
    analyzeFullAudio,
    playAudio,
    stopAudio,
    isProcessing,
    isPlaying,
    duration
  } = useAudioFileAnalysis();

  const [currentMetrics, setCurrentMetrics] = useState<{
    pitch: number;
    intensity: number;
    voiceQuality: number;
    currentGender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
    transcription: string;
  }>({
    pitch: 0,
    intensity: 0,
    voiceQuality: 0,
    currentGender: 'INDETERMINADA',
    transcription: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar que sea un archivo de audio
    if (!file.type.startsWith('audio/')) {
      alert('Por favor, seleccione un archivo de audio válido');
      return;
    }

    try {
      await processAudioFile(file);
      const results = analyzeFullAudio();
      
      // Calcular promedios para mostrar métricas generales
      const avgMetrics = results.reduce((acc, curr) => ({
        pitch: acc.pitch + curr.pitch,
        intensity: acc.intensity + curr.intensity,
        voiceQuality: acc.voiceQuality + curr.voiceQuality,
        genderCounts: {
          ...acc.genderCounts,
          [curr.gender]: (acc.genderCounts[curr.gender] || 0) + 1
        }
      }), {
        pitch: 0,
        intensity: 0,
        voiceQuality: 0,
        genderCounts: {} as Record<string, number>
      });

      const totalSamples = results.length;
      const dominantGender = Object.entries(avgMetrics.genderCounts)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      setCurrentMetrics({
        pitch: avgMetrics.pitch / totalSamples,
        intensity: avgMetrics.intensity / totalSamples,
        voiceQuality: avgMetrics.voiceQuality / totalSamples,
        currentGender: dominantGender as 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA',
        transcription: `Archivo de audio: ${file.name}\nDuración: ${duration.toFixed(2)} segundos`
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      alert('Error al procesar el archivo de audio');
    }
  };

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio, stopAudio]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">
          Análisis de Archivo de Audio
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Seleccionar Archivo
              </span>
            </label>
            
            <button
              onClick={handlePlayPause}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isProcessing}
            >
              {isPlaying ? 'Detener' : 'Reproducir'}
            </button>
          </div>

          {isProcessing && (
            <div className="text-green-400">
              Procesando archivo...
            </div>
          )}
        </div>
      </div>

      <VoiceMetrics
        pitch={currentMetrics.pitch}
        intensity={currentMetrics.intensity}
        voiceQuality={currentMetrics.voiceQuality}
        currentGender={currentMetrics.currentGender}
        transcription={currentMetrics.transcription}
      />
    </div>
  );
};

export default AudioFileUploader;
