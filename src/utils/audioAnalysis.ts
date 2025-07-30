// Utilidades para análisis de audio más preciso

export function calculatePitch(analyser: AnalyserNode): number {
  const bufferLength = analyser.fftSize;
  const buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);

  // Usar autocorrelación para detectar pitch más precisamente
  const pitch = autoCorrelate(buffer, analyser.context.sampleRate);
  
  // Filtrar valores fuera del rango de voz humana
  if (pitch < 50 || pitch > 500) {
    return 0;
  }

  return pitch;
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / SIZE);
  
  // Si el volumen es muy bajo, no hay pitch detectable
  if (rms < 0.01) return 0;

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;

  // Encontrar el inicio y final de la señal significativa
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const correlations = new Array(SIZE);
  let maxCorrelation = 0;
  let bestOffset = -1;

  // Calcular autocorrelación
  for (let offset = r1; offset < r2; offset++) {
    let correlation = 0;
    for (let i = r1; i < r2; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - (correlation / (r2 - r1));
    correlations[offset] = correlation;

    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestOffset = offset;
    }
  }

  // Refinar usando interpolación parabólica
  if (bestOffset > 0 && bestOffset < correlations.length - 1) {
    const y1 = correlations[bestOffset - 1];
    const y2 = correlations[bestOffset];
    const y3 = correlations[bestOffset + 1];
    
    const a = (y1 - 2 * y2 + y3) / 2;
    const b = (y3 - y1) / 2;
    
    if (a !== 0) {
      bestOffset = bestOffset - b / (2 * a);
    }
  }

  return bestOffset > 0 ? sampleRate / bestOffset : 0;
}

export function calculateIntensity(analyser: AnalyserNode): number {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }

  return (sum / bufferLength) / 255; // Normalizar a 0-1
}

export function calculateVoiceQuality(analyser: AnalyserNode): number {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  // Calcular la relación señal-ruido aproximada
  const fundamentalRange = Math.floor(bufferLength * 0.1); // Primeros 10% para fundamentales
  const noiseRange = Math.floor(bufferLength * 0.8); // Últimos 80% para ruido

  let fundamentalEnergy = 0;
  let noiseEnergy = 0;

  for (let i = 0; i < fundamentalRange; i++) {
    fundamentalEnergy += dataArray[i];
  }

  for (let i = noiseRange; i < bufferLength; i++) {
    noiseEnergy += dataArray[i];
  }

  const snr = fundamentalEnergy / (noiseEnergy + 1); // +1 para evitar división por cero
  return Math.min(snr / 10, 1); // Normalizar y limitar a 1
}