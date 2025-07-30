import React from 'react';

interface OffensiveWordsPanelProps {
  offensiveWords: Array<{
    word: string;
    timestamp: number;
  }>;
}

const OffensiveWordsPanel: React.FC<OffensiveWordsPanelProps> = ({ offensiveWords }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Palabras Ofensivas Detectadas</h2>
      {offensiveWords.length === 0 ? (
        <p className="text-gray-500">No se han detectado palabras ofensivas</p>
      ) : (
        <ul className="space-y-2">
          {offensiveWords.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-red-50 p-2 rounded">
              <span className="text-red-600 font-medium">{item.word}</span>
              <span className="text-gray-500 text-sm">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OffensiveWordsPanel;
