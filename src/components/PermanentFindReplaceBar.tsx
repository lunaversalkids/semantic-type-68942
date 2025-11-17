import avatarIcon from '@/assets/avatar-icon.png';
import { useState } from 'react';

export const PermanentFindReplaceBar = () => {
  const [isEstherOpen, setIsEstherOpen] = useState(false);

  const handleEstherClick = () => {
    setIsEstherOpen(!isEstherOpen);
    // TODO: Open Esther AI Assistant interface
  };

  return (
    <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] h-20 w-full flex items-center justify-center">
      <img 
        src={avatarIcon} 
        alt="Esther AI Assistant" 
        className="h-[72px] w-auto object-contain cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(139,112,247,0.6)]"
        onClick={handleEstherClick}
      />
    </div>
  );
};