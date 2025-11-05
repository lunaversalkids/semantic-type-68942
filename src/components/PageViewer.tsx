import { useState } from 'react';
import { Search, ChevronDown, BookOpen, Maximize2, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import infinityIcon from '@/assets/infinity-icon.png';

interface PageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onPageClick?: (pageNumber: number) => void;
}

export const PageViewer = ({ isOpen, onClose, totalPages, onPageClick }: PageViewerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Generate array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-[#E8E4F3] flex flex-col">
      {/* Header Section */}
      <div className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D60FF]" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-2xl text-[#8D60FF] placeholder:text-[#8D60FF]/60 focus:border-[#8D60FF] focus:ring-2 focus:ring-[#8D60FF]/20 text-base shadow-lg"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 text-[#8D60FF] font-semibold text-lg hover:bg-white/40 rounded-lg transition-colors">
            All Pages
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-[#8D60FF]" />
          </div>

          <button className="px-4 py-2 text-[#8D60FF] font-semibold text-lg hover:bg-white/40 rounded-lg transition-colors">
            Select
          </button>
        </div>
      </div>

      {/* Page Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pages.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                onPageClick?.(pageNum);
                onClose();
              }}
              className="relative aspect-[8.5/11] bg-white rounded-2xl shadow-[0_8px_24px_rgba(139,92,246,0.12)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.2)] transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Page Content Preview - This would show actual page content */}
              <div className="w-full h-full rounded-2xl overflow-hidden p-4">
                <div className="text-left text-xs text-gray-400 space-y-2">
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
                  <div className="w-4/5 h-2 bg-gray-100 rounded"></div>
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                </div>
              </div>

              {/* Infinity Icon Badge */}
              <div className="absolute bottom-3 left-3 w-8 h-8 bg-[#8D60FF] rounded-full flex items-center justify-center shadow-lg">
                <img src={infinityIcon} alt="" className="w-5 h-5" />
              </div>

              {/* Page Number Overlay on Hover */}
              <div className="absolute inset-0 bg-[#8D60FF]/0 group-hover:bg-[#8D60FF]/5 rounded-2xl flex items-center justify-center transition-all duration-300">
                <span className="text-[#8D60FF] font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Page {pageNum}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/80 backdrop-blur-md border-2 border-[#C4B5FD]/40 rounded-[20px] shadow-[0_12px_40px_rgba(139,92,246,0.24)] px-6 py-4 flex items-center gap-6">
          <button
            onClick={onClose}
            className="text-[#8D60FF] font-bold text-base hover:text-[#7C4DFF] transition-colors"
          >
            Done
          </button>

          <div className="w-px h-8 bg-[#C4B5FD]/30"></div>

          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Select Multiple"
          >
            <Copy className="w-5 h-5" strokeWidth={1.5} style={{ strokeDasharray: '2,2' }} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Add Page"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </Button>

          <div className="w-10 h-10 bg-[#8D60FF] rounded-full flex items-center justify-center hover:bg-[#7C4DFF] transition-colors cursor-pointer shadow-lg">
            <img src={infinityIcon} alt="" className="w-6 h-6" />
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
            title="Expand"
          >
            <Maximize2 className="w-5 h-5" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
};
