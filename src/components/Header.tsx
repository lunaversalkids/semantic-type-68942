import { Pen, Navigation, Search, Cloud, FileDown, FileUp, File, BookOpen } from 'lucide-react';
import newInfinityButton from '@/assets/new-infinity-button.png';
import penIcon from '@/assets/pen-icon.png';
import quotationIcon from '@/assets/quotation-icon.png';
import textFrameIcon from '@/assets/text-frame-icon.png';
import paletteIcon from '@/assets/palette-icon.png';
import searchIcon from '@/assets/search-icon.png';
import cloudIcon from '@/assets/cloud-icon.png';
import singlePageIcon from '@/assets/single-page-icon.png';
import doublePageIcon from '@/assets/double-page-icon.png';
import importExportIcon from '@/assets/import-export-icon.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface HeaderProps {
  onFindClick?: () => void;
  onDocumentClick?: () => void;
  onCloudClick?: () => void;
  onPenModeClick?: () => void;
  onStylusModeClick?: () => void;
  onQuotationClick?: () => void;
  onTextFrameClick?: () => void;
  onPaletteClick?: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  onPdfImportClick?: () => void;
  onPageViewerClick?: () => void;
  pageViewerOpen?: boolean;
  onLayoutToggle?: () => void;
  isDoublePageLayout?: boolean;
}
export const Header = ({
  onFindClick,
  onDocumentClick,
  onCloudClick,
  onPenModeClick,
  onStylusModeClick,
  onQuotationClick,
  onTextFrameClick,
  onPaletteClick,
  onExportClick,
  onImportClick,
  onPdfImportClick,
  onPageViewerClick,
  pageViewerOpen,
  onLayoutToggle,
  isDoublePageLayout
}: HeaderProps) => {
  return <header className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
      {/* Brand */}
      <div className="flex items-center gap-0.5 font-extrabold justify-start w-[340px]">
        <button onClick={onPageViewerClick} className={`transition-all hover:opacity-80 ${pageViewerOpen ? 'shadow-lg ring-2 ring-[#8D60FF]/50 rounded-full' : ''}`}>
          <img src={newInfinityButton} alt="" className="w-10 h-10" />
        </button>
        <div className="text-[hsl(var(--ink))]">Doc One</div>
      </div>

      {/* Title - Centered */}
      <div className="flex items-center justify-center w-full">
        <button onClick={onDocumentClick} className="flex items-center gap-2.5 px-3.5 py-2 border border-[hsl(var(--stroke))] rounded-full bg-[hsla(253,100%,64%,0.12)] text-[#4E3DC9] font-bold hover:bg-[hsla(253,100%,64%,0.18)] transition-colors mx-auto" title="Save/Load Documents">
          <span className="text-lg">∞</span>
          <span>Insects</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end gap-2 w-[340px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Pen & Stylus">
              <img src={penIcon} alt="" className="w-full h-full object-cover" />
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

        <button onClick={onQuotationClick} className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Quotation">
          <img src={quotationIcon} alt="" className="w-full h-full object-cover" />
        </button>

        <button onClick={onTextFrameClick} className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Text Frame">
          <img src={textFrameIcon} alt="" className="w-full h-full object-cover" />
        </button>

        <button onClick={onPaletteClick} className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Color Palette">
          <img src={paletteIcon} alt="" className="w-full h-full object-cover" />
        </button>

        <button onClick={onFindClick} className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Find & Replace">
          <img src={searchIcon} alt="" className="w-full h-full object-cover" />
        </button>
        
        <button onClick={onCloudClick} className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="My Documents">
          <img src={cloudIcon} alt="" className="w-full h-full object-cover" />
        </button>

        <button 
          onClick={onLayoutToggle} 
          className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" 
          title={isDoublePageLayout ? "Switch to Single Page" : "Switch to Double Page"}
        >
          <img 
            src={isDoublePageLayout ? doublePageIcon : singlePageIcon} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors overflow-hidden" title="Import/Export">
              <img src={importExportIcon} alt="" className="w-full h-full object-cover" />
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