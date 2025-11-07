import { Pen, Navigation, Search, Cloud, FileDown, FileUp } from 'lucide-react';
import infinityIcon from '@/assets/infinity-icon.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface HeaderProps {
  onFindClick?: () => void;
  onDocumentClick?: () => void;
  onCloudClick?: () => void;
  onPenModeClick?: () => void;
  onStylusModeClick?: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  onPdfImportClick?: () => void;
  onPageViewerClick?: () => void;
  pageViewerOpen?: boolean;
}
export const Header = ({
  onFindClick,
  onDocumentClick,
  onCloudClick,
  onPenModeClick,
  onStylusModeClick,
  onExportClick,
  onImportClick,
  onPdfImportClick,
  onPageViewerClick,
  pageViewerOpen
}: HeaderProps) => {
  return <header className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2 grid grid-cols-[220px_1fr_360px] items-center gap-2">
      {/* Brand */}
      <div className="flex items-center gap-2.5 font-extrabold">
        <button onClick={onPageViewerClick} className={`w-7 h-7 rounded-lg bg-gradient-to-b from-[#8D60FF] to-[#6A3CFF] text-white grid place-items-center text-xs transition-all hover:from-[#9D70FF] hover:to-[#7A4CFF] ${pageViewerOpen ? 'shadow-lg ring-2 ring-[#8D60FF]/50' : ''}`}>
          ONE
        </button>
        <div className="text-[hsl(var(--ink))]">Doc One</div>
      </div>

      {/* Title - Centered */}
      <div className="flex items-center justify-center">
        <button onClick={onDocumentClick} className="flex items-center gap-2.5 px-3.5 py-2 border border-[hsl(var(--stroke))] rounded-full bg-[hsla(253,100%,64%,0.12)] text-[#4E3DC9] font-bold hover:bg-[hsla(253,100%,64%,0.18)] transition-colors" title="Save/Load Documents">
          <span className="text-lg">∞</span>
          <span>Insects</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Pen & Stylus">
              <Pen className="w-4 h-4 text-[hsl(var(--ink))]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background z-50">
            <DropdownMenuItem onClick={onPenModeClick}>
              <Pen className="w-4 h-4 mr-2" />
              Pen / Insert Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onStylusModeClick}>
              <Navigation className="w-4 h-4 mr-2" />
              Stylus Mode
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={onFindClick} className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Find & Replace">
          <Search className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        
        <button onClick={onCloudClick} className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="My Documents">
          <Cloud className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>

        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 min-w-[36px] px-2.5 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Import/Export">
              <FileDown className="w-4 h-4 text-[hsl(var(--ink))]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background z-50">
            <DropdownMenuItem onClick={onImportClick}>
              <FileUp className="w-4 h-4 mr-2" />
              Standard Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPdfImportClick}>
              <FileUp className="w-4 h-4 mr-2" />
              PDF with Style Inference
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportClick}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};