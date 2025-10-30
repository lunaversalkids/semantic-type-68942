import { Pen, Navigation, Search, Cloud, Share2 } from 'lucide-react';

interface HeaderProps {
  onFindClick?: () => void;
}

export const Header = ({ onFindClick }: HeaderProps) => {
  return (
    <header className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2 grid grid-cols-[220px_1fr_360px] items-center gap-2">
      {/* Brand */}
      <div className="flex items-center gap-2.5 font-extrabold">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#8D60FF] to-[#6A3CFF] text-white grid place-items-center text-xs">
          ONE
        </div>
        <div className="text-[hsl(var(--ink))]">Doc One</div>
      </div>

      {/* Title */}
      <div className="flex items-center justify-center">
        <button className="flex items-center gap-2.5 px-3.5 py-2 border border-[hsl(var(--stroke))] rounded-full bg-[hsla(253,100%,64%,0.12)] text-[#4E3DC9] font-bold hover:bg-[hsla(253,100%,64%,0.18)] transition-colors">
          <span className="text-lg">∞</span>
          <span>Insects</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end gap-2">
        <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Pen / Insert">
          <Pen className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Stylus Mode">
          <Navigation className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        <button 
          onClick={onFindClick}
          className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" 
          title="Find & Replace"
        >
          <Search className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Cloud">
          <Cloud className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Share/Export">
          <Share2 className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      </div>
    </header>
  );
};
