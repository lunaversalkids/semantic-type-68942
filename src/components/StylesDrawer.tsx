import { X, Plus } from 'lucide-react';

interface StylesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const styles = [
  { name: 'Body', sample: 'The quick brown fox', tag: 'body', color: 'text-[hsl(var(--ink-weak))]', italic: false },
  { name: 'Definition', sample: 'The quick brown fox', tag: 'definition', color: 'text-[#4E3DC9]', italic: true },
  { name: 'Term', sample: 'The quick brown fox', tag: 'term', color: 'text-[#6C3AFF]', italic: false },
  { name: "Strong's Number", sample: 'H1234', tag: 'strong', color: 'text-[#8E7BFF]', italic: false },
  { name: 'Additional Notes', sample: 'The quick brown fox', tag: 'notes', color: 'text-[#6B5BA0]', italic: true },
];

export const StylesDrawer = ({ open, onClose }: StylesDrawerProps) => {
  if (!open) return null;

  return (
    <aside className="fixed top-3 right-3 bottom-[98px] w-[320px] bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_12px_28px_rgba(96,48,200,.14)] p-2.5 grid grid-rows-[auto_1fr] gap-2 z-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-extrabold flex items-center gap-2.5">
          <span className="text-lg">🎨</span>
          <span className="text-[hsl(var(--ink))]">Styles</span>
        </div>
        <div className="flex gap-2">
          <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors">
            <Plus className="w-4 h-4 text-[hsl(var(--ink))]" />
          </button>
          <button 
            onClick={onClose}
            className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors"
          >
            <X className="w-4 h-4 text-[hsl(var(--ink))]" />
          </button>
        </div>
      </div>

      {/* Card List */}
      <div className="overflow-auto flex flex-col gap-2.5 pr-1">
        {styles.map((style) => (
          <button
            key={style.tag}
            className="grid grid-cols-[1fr_auto] gap-2 items-center p-3 bg-white border border-[hsl(var(--stroke))] rounded-xl hover:bg-[hsl(var(--panel-2))] transition-colors text-left"
          >
            <div>
              <div className="font-extrabold text-[hsl(var(--ink))]">{style.name}</div>
              <div className={`text-[13px] ${style.color} ${style.italic ? 'italic' : ''}`}>
                {style.sample}
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[hsl(var(--chip))] text-[hsl(var(--chip-t))] rounded-full font-semibold text-xs">
              {style.tag}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};
