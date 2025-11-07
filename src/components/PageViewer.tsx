import { useState } from 'react';
import { Search, ChevronDown, BookOpen, Maximize2, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import infinityIcon from '@/assets/new-infinity-icon.png';

interface PageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onPageClick?: (pageNumber: number) => void;
}

export const PageViewer = ({ isOpen, onClose, totalPages, onPageClick }: PageViewerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  // Generate array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageSelect = (pageNum: number) => {
    if (!selectMode) return;
    
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNum)) {
        newSet.delete(pageNum);
      } else {
        newSet.add(pageNum);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allPages = new Set(pages);
    setSelectedPages(allPages);
    toast.success(`All ${totalPages} pages selected`, {
      description: 'Every page in the viewer has been selected',
      duration: 2000,
    });
  };

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelectedPages(new Set());
  };

  return (
    <div 
      className={`fixed top-[70px] left-3 bottom-[98px] w-[340px] z-50 bg-[#E8E4F3] rounded-[var(--radius)] shadow-[0_20px_60px_rgba(96,48,200,.24)] flex flex-col transition-all duration-300 ease-out ${
        isOpen 
          ? 'translate-x-0 opacity-100' 
          : '-translate-x-[calc(100%+12px)] opacity-0 pointer-events-none'
      }`}
    >
      {/* Header Section */}
      <div className="p-6 space-y-3 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8D60FF]" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl text-[#8D60FF] placeholder:text-[#8D60FF]/60 focus:border-[#8D60FF] focus:ring-2 focus:ring-[#8D60FF]/20 text-sm shadow-lg"
          />
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-3 items-center">
          <Select value={searchFilter} onValueChange={setSearchFilter}>
            <SelectTrigger className="flex items-center gap-1.5 px-2 py-1 text-[#8D60FF] font-semibold text-xs hover:bg-white/40 rounded-lg transition-colors justify-self-start w-auto border-0 bg-transparent">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="bookmarks">Bookmarks</SelectItem>
              <SelectItem value="footnotes">Footnotes</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-10 h-10 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl flex items-center justify-center shadow-lg justify-self-center">
            <BookOpen className="w-4.5 h-4.5 text-[#8D60FF]" />
          </div>

          <button 
            onClick={() => {
              if (selectMode) {
                handleCancelSelect();
              } else {
                setSelectMode(true);
              }
            }}
            className={`px-2 py-1 text-[#8D60FF] font-semibold text-xs hover:bg-white/40 rounded-lg transition-colors justify-self-end ${selectMode ? 'bg-white/40' : ''}`}
          >
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      {/* Page Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4">
          {pages.map((pageNum) => {
            const isSelected = selectedPages.has(pageNum);
            return (
              <div key={pageNum} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    if (selectMode) {
                      handlePageSelect(pageNum);
                    } else {
                      onPageClick?.(pageNum);
                      onClose();
                    }
                  }}
                  className={`relative aspect-[8.5/11] bg-white transition-all duration-300 group w-full ${
                    isSelected 
                      ? 'shadow-[0_0_20px_8px_rgba(139,92,246,0.4)] ring-2 ring-[#8D60FF]/60 scale-[1.02]' 
                      : 'shadow-[0_4px_12px_rgba(139,92,246,0.1)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.15)] hover:scale-[1.02]'
                  }`}
                >
                {/* Page Content Preview - This would show actual page content */}
                <div className="w-full h-full overflow-hidden p-3">
                  <div className="text-left text-xs text-gray-400 space-y-1.5">
                    <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-4/5 h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
                  </div>
                </div>

                {/* Infinity Icon */}
                <div className="absolute bottom-2 left-2">
                  <img src={infinityIcon} alt="" className="w-6 h-6" />
                </div>

                {/* Page Number Overlay on Hover */}
                <div className="absolute inset-0 bg-[#8D60FF]/0 group-hover:bg-[#8D60FF]/5 flex items-center justify-center transition-all duration-300">
                  <span className="text-[#8D60FF] font-bold text-base opacity-0 group-hover:opacity-100 transition-opacity">
                    Page {pageNum}
                  </span>
                </div>
              </button>
              
              {/* Page Number Below Thumbnail */}
              <div className="text-center">
                <span className={`font-semibold text-xs transition-colors ${
                  isSelected ? 'text-[#7C4DFF]' : 'text-[#8D60FF]'
                }`}>
                  {pageNum}
                </span>
              </div>
            </div>
          )}
          )}
        </div>
      </div>

      {/* Bottom Toolbar - Only shown in select mode */}
      {selectMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/80 backdrop-blur-md border-2 border-[#C4B5FD]/40 rounded-2xl shadow-[0_8px_24px_rgba(139,92,246,0.2)] px-3 py-1.5 flex items-center gap-3">
            <button
              onClick={handleCancelSelect}
              className="text-[#8D60FF] font-bold text-sm hover:text-[#7C4DFF] transition-colors"
            >
              Done
            </button>

            <div className="w-px h-5 bg-[#C4B5FD]/30"></div>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleSelectAll}
              className="w-7 h-7 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
              title="Select All Pages"
            >
              <Copy className="w-3.5 h-3.5" strokeWidth={1.5} style={{ strokeDasharray: '2,2' }} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
              title="Add Page"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Button>

            <div className="w-8 h-8 bg-[#8D60FF] rounded-full flex items-center justify-center hover:bg-[#7C4DFF] transition-colors cursor-pointer shadow-md">
              <img src={infinityIcon} alt="" className="w-4.5 h-4.5" />
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
              title="Expand"
            >
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
