import avatarIcon from '@/assets/avatar-icon.png';

export const PermanentFindReplaceBar = () => {
  return (
    <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] h-20 w-full flex items-center justify-center px-6">
      <img 
        src={avatarIcon} 
        alt="Avatar" 
        className="h-16 w-auto object-contain"
      />
    </div>
  );
};