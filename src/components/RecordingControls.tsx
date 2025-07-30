import React from 'react';
import { Play, Square, Save, FileText, Clock, User } from 'lucide-react';
import { RecordingSession } from '../types/Recording';

interface RecordingControlsProps {
  isRecording: boolean;
  isSessionRecording: boolean;
  currentSession: RecordingSession | null;
  onStartSession: () => void;
  onStopSession: () => void;
  onSaveSession: () => void;
  currentGender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isSessionRecording,
  currentSession,
  onStartSession,
  onStopSession,
  onSaveSession,
  currentGender
}) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'MASCULINA': return 'text-blue-400';
      case 'FEMENINA': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
        <FileText className="text-green-400" size={24} />
        Control de Sesión
      </h2>
      
      <div className="space-y-4">
        {/* Botones de control */}
        <div className="flex gap-2">
          <button
            onClick={isSessionRecording ? onStopSession : onStartSession}
            disabled={!isRecording}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              !isRecording
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : isSessionRecording
                ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
                : 'bg-green-600 hover:bg-green-700 text-black border border-green-400'
            }`}
          >
            {isSessionRecording ? <Square size={16} /> : <Play size={16} />}
            {isSessionRecording ? 'Detener' : 'Iniciar'} Sesión
          </button>
          
          {currentSession && !isSessionRecording && (
            <button
              onClick={onSaveSession}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 border border-blue-500"
            >
              <Save size={16} />
              Guardar
            </button>
          )}
        </div>

        {/* Información de la sesión */}
        {currentSession && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">ID_SESIÓN:</span>
              <span className="text-green-400 font-mono text-sm">{currentSession.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm flex items-center gap-1">
                <Clock size={14} />
                DURACIÓN:
              </span>
              <span className="text-green-400 font-mono">
                {formatDuration(currentSession.duration)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">MUESTRAS:</span>
              <span className="text-green-400 font-mono">{currentSession.voiceData.length}</span>
            </div>
            
            {currentSession.voiceData.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-green-300 text-sm">PITCH_PROMEDIO:</span>
                  <span className="text-green-400 font-mono">
                    {currentSession.averagePitch.toFixed(1)} Hz
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-300 text-sm flex items-center gap-1">
                    <User size={14} />
                    GÉNERO_DOMINANTE:
                  </span>
                  <span className={`font-mono font-bold ${getGenderColor(currentSession.dominantGender)}`}>
                    {currentSession.dominantGender}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Estado actual */}
        <div className="text-center">
          {isSessionRecording ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm">GRABANDO_SESIÓN</span>
            </div>
          ) : currentSession ? (
            <span className="text-yellow-400 text-sm">SESIÓN_PAUSADA</span>
          ) : (
            <span className="text-gray-500 text-sm">SIN_SESIÓN_ACTIVA</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingControls;