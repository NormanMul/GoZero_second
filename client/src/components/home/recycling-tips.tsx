import { useState, useEffect } from 'react';
import { recyclingTips } from '@/lib/recycling-data';

export function RecyclingTips() {
  const [tip, setTip] = useState('');

  // Get a random tip on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * recyclingTips.length);
    setTip(recyclingTips[randomIndex]);
  }, []);

  // Get a new random tip
  const getNewTip = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * recyclingTips.length);
    } while (recyclingTips[newIndex] === tip && recyclingTips.length > 1);
    
    setTip(recyclingTips[newIndex]);
  };

  return (
    <div className="p-4">
      <h2 className="text-base font-bold mb-3">Recycling Tips</h2>
      <div className="bg-white gozero-shadow rounded-xl p-4">
        <h3 className="font-medium text-sm mb-2">Did you know?</h3>
        <p className="text-xs text-[#757575] mb-3">{tip}</p>
        <button 
          onClick={getNewTip}
          className="text-xs text-[#00AA13] font-medium"
        >
          More tips
        </button>
      </div>
    </div>
  );
}
