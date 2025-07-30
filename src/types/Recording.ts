export interface VoiceData {
  timestamp: number;
  pitch: number;
  intensity: number;
  voiceQuality: number;
  gender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
}

export interface RecordingSession {
  id: string;
  startTime: number;
  endTime?: number;
  voiceData: VoiceData[];
  averagePitch: number;
  averageIntensity: number;
  averageQuality: number;
  dominantGender: 'MASCULINA' | 'FEMENINA' | 'INDETERMINADA';
  duration: number;
}