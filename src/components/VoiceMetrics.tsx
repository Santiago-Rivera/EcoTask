import React from 'react';
import { User, Mic, Activity, MessageSquare } from 'lucide-react';

interface VoiceMetricsProps {
  pitch: number;
  intensity: number;
  voiceQuality: number;
  currentGender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
  transcription: string;
}

const VoiceMetrics: React.FC<VoiceMetricsProps> = ({
  pitch,
  intensity,
  voiceQuality,
  currentGender,
  transcription
}) => {
  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'MASCULINA': return 'text-blue-400';
      case 'FEMENINA': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getQualityLevel = (quality: number) => {
    if (quality > 0.8) return { text: 'EXCELENTE', color: 'text-green-400' };
    if (quality > 0.6) return { text: 'BUENA', color: 'text-yellow-400' };
    if (quality > 0.4) return { text: 'REGULAR', color: 'text-orange-400' };
    return { text: 'BAJA', color: 'text-red-400' };
  };

  const qualityLevel = getQualityLevel(voiceQuality);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Métricas de Voz */}
      <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Activity className="text-green-400" size={24} />
          MÉTRICAS_VOZ.EXE
        </h3>
        
        <div className="space-y-4">
          {/* Pitch */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm">FRECUENCIA_FUNDAMENTAL</span>
              <span className="text-green-400 font-mono text-lg">
                {pitch > 0 ? `${pitch.toFixed(1)} Hz` : '-- Hz'}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-200"
                style={{ width: `${Math.min((pitch / 400) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Intensidad */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm">INTENSIDAD_SEÑAL</span>
              <span className="text-green-400 font-mono text-lg">
                {(intensity * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-200"
                style={{ width: `${intensity * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Calidad */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm">CALIDAD_AUDIO</span>
              <span className={`font-mono text-lg ${qualityLevel.color}`}>
                {qualityLevel.text}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-200 ${
                  voiceQuality > 0.8 ? 'bg-green-400' :
                  voiceQuality > 0.6 ? 'bg-yellow-400' :
                  voiceQuality > 0.4 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${voiceQuality * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Género */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-green-400" size={20} />
                <span className="text-green-300 text-sm">CLASIFICACIÓN_GÉNERO</span>
              </div>
              <span className={`font-mono text-lg font-bold ${getGenderColor(currentGender)}`}>
                {currentGender}
              </span>
            </div>
            
            {/* Indicador visual del género */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentGender === 'MASCULINA' ? 'bg-blue-400' :
                    currentGender === 'FEMENINA' ? 'bg-pink-400' : 'bg-gray-400'
                  }`}
                  style={{ 
                    width: currentGender !== 'INDETERMINADA' ? '100%' : '50%',
                    marginLeft: currentGender === 'FEMENINA' ? 'auto' : '0'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>MASCULINA</span>
              <span>FEMENINA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcripción */}
      <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <MessageSquare className="text-green-400" size={24} />
          TRANSCRIPCIÓN_TIEMPO_REAL
        </h3>
        
        <div className="bg-gray-800 rounded-lg p-4 min-h-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="text-green-400" size={16} />
            <span className="text-green-300 text-sm">TEXTO_DETECTADO:</span>
          </div>
          
          <div className="text-green-100 text-sm leading-relaxed">
            {transcription || (
              <span className="text-gray-500 italic">
                Esperando entrada de audio...
              </span>
            )}
          </div>
          
          {transcription && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs text-gray-400">
                <span>PALABRAS: {transcription.split(' ').filter(w => w.length > 0).length}</span>
                <span>CARACTERES: {transcription.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMetrics;