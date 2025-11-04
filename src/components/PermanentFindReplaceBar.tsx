import avatarIcon from '@/assets/avatar-icon.png';

export const PermanentFindReplaceBar = () => {
  return (
    <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2.5 px-3 flex items-center justify-center">
      <img 
        src={avatarIcon} 
        alt="Avatar" 
        className="h-full object-contain"
      />
    </div>
  );
};