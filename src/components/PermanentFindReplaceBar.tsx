import avatarIcon from '@/assets/avatar-icon.png';

export const PermanentFindReplaceBar = () => {
  return (
    <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] h-20 w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 px-6">
      <div className="w-[340px]"></div>
      <div className="flex items-center justify-center w-full">
        <img 
          src={avatarIcon} 
          alt="Avatar" 
          className="h-[72px] w-auto object-contain mx-auto"
        />
      </div>
      <div className="w-[340px]"></div>
    </div>
  );
};