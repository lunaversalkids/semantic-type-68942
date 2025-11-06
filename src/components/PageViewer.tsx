import { useState } from 'react';
import { Search, ChevronDown, BookOpen, Maximize2, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import infinityIcon from '@/assets/new-infinity-icon.png';

interface PageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onPageClick?: (pageNumber: number) => void;
}

export const PageViewer = ({ isOpen, onClose, totalPages, onPageClick }: PageViewerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Generate array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div 
      className={`fixed top-[70px] left-3 bottom-[98px] w-[340px] z-50 bg-[#E8E4F3] rounded-[var(--radius)] shadow-[0_20px_60px_rgba(96,48,200,.24)] flex flex-col transition-all duration-300 ease-out ${
        isOpen 
          ? 'translate-x-0 opacity-100' 
          : '-translate-x-[calc(100%+12px)] opacity-0 pointer-events-none'
      }`}
    >
      {/* Header Section */}
      <div className="p-6 space-y-4 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D60FF]" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl text-[#8D60FF] placeholder:text-[#8D60FF]/60 focus:border-[#8D60FF] focus:ring-2 focus:ring-[#8D60FF]/20 text-sm shadow-lg"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-3 py-1.5 text-[#8D60FF] font-semibold text-base hover:bg-white/40 rounded-lg transition-colors">
            All Pages
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="w-11 h-11 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-[#8D60FF]" />
          </div>

          <button className="px-3 py-1.5 text-[#8D60FF] font-semibold text-base hover:bg-white/40 rounded-lg transition-colors">
            Select
          </button>
        </div>
      </div>

      {/* Page Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {pages.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                onPageClick?.(pageNum);
                onClose();
              }}
              className="relative aspect-[8.5/11] bg-white rounded-lg shadow-[0_4px_12px_rgba(139,92,246,0.1)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Page Content Preview - This would show actual page content */}
              <div className="w-full h-full rounded-lg overflow-hidden p-3">
                <div className="text-left text-xs text-gray-400 space-y-1.5">
                  <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                  <div className="w-4/5 h-1.5 bg-gray-100 rounded"></div>
                  <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
                </div>
              </div>

              {/* Infinity Icon Badge */}
              <div className="absolute bottom-2 left-2 w-7 h-7 bg-[#8D60FF] rounded-full flex items-center justify-center shadow-md">
                <img src={infinityIcon} alt="" className="w-4 h-4" />
              </div>

              {/* Page Number Overlay on Hover */}
              <div className="absolute inset-0 bg-[#8D60FF]/0 group-hover:bg-[#8D60FF]/5 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-[#8D60FF] font-bold text-base opacity-0 group-hover:opacity-100 transition-opacity">
                  Page {pageNum}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/80 backdrop-blur-md border-2 border-[#C4B5FD]/40 rounded-2xl shadow-[0_8px_24px_rgba(139,92,246,0.2)] px-4 py-2.5 flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-[#8D60FF] font-bold text-sm hover:text-[#7C4DFF] transition-colors"
          >
            Done
          </button>

          <div className="w-px h-6 bg-[#C4B5FD]/30"></div>

          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Select Multiple"
          >
            <Copy className="w-4 h-4" strokeWidth={1.5} style={{ strokeDasharray: '2,2' }} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Add Page"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </Button>

          <div className="w-9 h-9 bg-[#8D60FF] rounded-full flex items-center justify-center hover:bg-[#7C4DFF] transition-colors cursor-pointer shadow-md">
            <img src={infinityIcon} alt="" className="w-5 h-5" />
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
};
