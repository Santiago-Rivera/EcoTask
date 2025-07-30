import React, { useEffect, useRef } from 'react';
import { calculatePitch, calculateIntensity, calculateVoiceQuality } from '../utils/audioAnalysis';

interface ToneAnalyzerProps {
  analyser: AnalyserNode;
  onPitchChange: (pitch: number) => void;
  onIntensityChange: (intensity: number) => void;
  onQualityChange: (quality: number) => void;
}

const ToneAnalyzer: React.FC<ToneAnalyzerProps> = ({
  analyser,
  onPitchChange,
  onIntensityChange,
  onQualityChange
}) => {
  const animationRef = useRef<number>();
  const pitchHistoryRef = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateAnalysis = () => {
      if (!analyser) return;

      const pitch = calculatePitch(analyser);
      const intensity = calculateIntensity(analyser);
      const quality = calculateVoiceQuality(analyser);

      // Suavizar el pitch usando un promedio móvil
      pitchHistoryRef.current.push(pitch);
      if (pitchHistoryRef.current.length > 5) {
        pitchHistoryRef.current.shift();
      }

      const smoothedPitch = pitchHistoryRef.current.reduce((sum, p) => sum + p, 0) / pitchHistoryRef.current.length;

      onPitchChange(smoothedPitch);
      onIntensityChange(intensity);
      onQualityChange(quality);

      // Dibujar visualización
      drawFrequencyChart();

      animationRef.current = requestAnimationFrame(updateAnalysis);
    };

    updateAnalysis();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, onPitchChange, onIntensityChange, onQualityChange]);

  const drawFrequencyChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    // Dibujar barras de frecuencia
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * height;

      // Color basado en la frecuencia
      const hue = (i / bufferLength) * 120; // De rojo a verde
      ctx.fillStyle = `hsl(${hue + 120}, 100%, 50%)`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    // Dibujar líneas de referencia para rangos de voz
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Línea para rango masculino (85-180 Hz)
    const maleRangeX = (180 / (analyser.context.sampleRate / 2)) * width;
    ctx.beginPath();
    ctx.moveTo(maleRangeX, 0);
    ctx.lineTo(maleRangeX, height);
    ctx.stroke();

    // Línea para rango femenino (165-265 Hz)
    const femaleRangeX = (265 / (analyser.context.sampleRate / 2)) * width;
    ctx.beginPath();
    ctx.moveTo(femaleRangeX, 0);
    ctx.lineTo(femaleRangeX, height);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-48 bg-black border border-green-500 rounded"
      />
      
      <div className="grid grid-cols-2 gap-2 text-xs text-green-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>RANGO_MASCULINO: 85-180Hz</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>RANGO_FEMENINO: 165-265Hz</span>
        </div>
      </div>
    </div>
  );
};

export default ToneAnalyzer;