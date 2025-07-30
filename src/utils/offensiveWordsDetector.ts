// Categorías de palabras negativas
const offensiveWordsList = [
  // Insultos generales
  'maldito', 'maldita', 'idiota', 'estúpido', 'estúpida',
  'tonto', 'tonta', 'imbécil', 'pendejo', 'pendeja',
  'estupidez', 'basura', 'inútil', 'inutil', 'tarado',
  'tarada', 'bobo', 'boba', 'baboso', 'babosa',
  'burro', 'burra', 'torpe', 'ignorante',
  
  // Palabras de odio y amenazas
  'odio', 'muerte', 'matar', 'golpear', 'amenazar',
  'destruir', 'venganza', 'vengarse', 'acabar',
  
  // Discriminación
  'racista', 'xenófobo', 'xenofoba', 'homofóbico', 'homofobico',
  'discriminar', 'segregar', 'marginar',
  
  // Acoso y bullying
  'fracasado', 'fracasada', 'perdedor', 'perdedora', 'cobarde',
  'débil', 'debil', 'inservible', 'bueno para nada',
  
  // Lenguaje agresivo
  'pelear', 'golpiza', 'paliza', 'violencia', 'agredir',
  'atacar', 'herir', 'lastimar',
  
  // Groserías
  'mierda', 'puta', 'puto', 'carajo', 'joder',
  'imbecil', 'estupido', 'estupida',
  
  // Desprecio
  'asco', 'repugnante', 'asqueroso', 'asquerosa', 'despreciable',
  'miserable', 'patético', 'patetica',
  
  // Amenazas
  'amenaza', 'advertencia', 'cuidado', 'atente', 'vas a ver',
  'te vas a arrepentir', 'me las pagarás', 'me las pagaras'
];

export interface OffensiveWordDetection {
  word: string;
  timestamp: number;
}

export const detectOffensiveWords = (text: string): OffensiveWordDetection[] => {
  // Normalizar el texto: convertir a minúsculas y eliminar acentos
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?¡¿]/g, ''); // Eliminar signos de puntuación comunes
  
  const detections: OffensiveWordDetection[] = [];
  const timestamp = Date.now();

  // Dividir el texto en palabras
  const words = normalizedText
    .split(/\s+/)
    .map(word => word.replace(/[^\w\s]/g, ''))
    .filter(word => word.length > 0);

  // Buscar coincidencias
  words.forEach((word, index) => {
    const normalizedWord = word.trim();
    // Obtener contexto de palabras cercanas
    const contextStart = Math.max(0, index - 2);
    const contextEnd = Math.min(words.length, index + 3);
    const phraseContext = words.slice(contextStart, contextEnd).join(' ');

    offensiveWordsList.forEach(offensive => {
      const normalizedOffensive = offensive.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      if (normalizedWord === normalizedOffensive || phraseContext.includes(normalizedOffensive)) {
        const matchingSegment = text.split(/\s+/).find(w => 
          w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedWord)
        ) || normalizedWord;

        if (!detections.some(d => d.word === matchingSegment)) {
          detections.push({
            word: matchingSegment,
            timestamp
          });
        }
      }
    });
  });

  return detections;
};
