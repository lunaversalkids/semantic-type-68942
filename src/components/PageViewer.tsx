import { useState } from 'react';
import { Search, ChevronDown, BookOpen, Maximize2, Plus, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import infinityIcon from '@/assets/new-infinity-icon.png';
import bookmarkIcon from '@/assets/bookmark-icon.png';

interface PageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onPageClick?: (pageNumber: number) => void;
  onAddPage?: () => void;
  onCopyPages?: (pageNumbers: number[], editorContent: string, insertBeforePage?: number) => void;
  editor?: any;
}

export const PageViewer = ({ isOpen, onClose, totalPages, onPageClick, onAddPage, onCopyPages, editor }: PageViewerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [selectMode, setSelectMode] = useState(false);
  const [rotateMode, setRotateMode] = useState(false);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pageRotations, setPageRotations] = useState<Map<number, number>>(new Map());
  const [copiedPages, setCopiedPages] = useState<number[]>([]);
  const [copiedContent, setCopiedContent] = useState<string>('');
  const [openPageMenu, setOpenPageMenu] = useState<number | null>(null);
  const [isSinglePage, setIsSinglePage] = useState(true);

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
    setRotateMode(false);
    setSelectedPages(new Set());
    setCopiedPages([]);
  };

  const handleRotatePages = () => {
    setPageRotations(prev => {
      const newRotations = new Map(prev);
      selectedPages.forEach(pageNum => {
        const currentRotation = newRotations.get(pageNum) || 0;
        newRotations.set(pageNum, (currentRotation + 90) % 360);
      });
      return newRotations;
    });
  };

  const handleCopyPages = () => {
    if (selectedPages.size === 0) {
      toast.info('No pages selected', {
        description: 'Please select pages to copy',
        duration: 2000,
      });
      return;
    }

    const pageNumbersArray = Array.from(selectedPages).sort((a, b) => a - b);
    setCopiedPages(pageNumbersArray);
    
    // Capture the current editor content
    if (editor) {
      const content = editor.getHTML();
      setCopiedContent(content);
    }
    
    toast.success(`${selectedPages.size} page${selectedPages.size > 1 ? 's' : ''} copied`, {
      description: `Page${selectedPages.size > 1 ? 's' : ''} ${pageNumbersArray.join(', ')} ready to paste`,
      duration: 2000,
    });
  };

  const handlePastePages = () => {
    if (copiedPages.length === 0 || !copiedContent) {
      toast.info('No pages copied', {
        description: 'Please copy pages first before pasting',
        duration: 2000,
      });
      return;
    }
    
    if (selectedPages.size === 0) {
      toast.info('No insertion point selected', {
        description: 'Please select a page to paste before',
        duration: 2000,
      });
      return;
    }
    
    // Find the first selected page to insert before
    const insertBeforePage = Math.min(...Array.from(selectedPages));
    
    onCopyPages?.(copiedPages, copiedContent, insertBeforePage);
    
    toast.success(`${copiedPages.length} page${copiedPages.length > 1 ? 's' : ''} pasted`, {
      description: `Inserted before page ${insertBeforePage}`,
      duration: 2000,
    });
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
            <SelectContent className="w-48 p-0 bg-white border-2 border-[#C4B5FD]/40 shadow-[0_8px_24px_rgba(139,92,246,0.2)] z-50">
              <SelectItem value="all" className="px-4 py-2.5 text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 cursor-pointer">All Pages</SelectItem>
              <SelectItem value="bookmarks" className="px-4 py-2.5 text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 cursor-pointer">Bookmarks</SelectItem>
              <SelectItem value="footnotes" className="px-4 py-2.5 text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 cursor-pointer">Footnotes</SelectItem>
            </SelectContent>
          </Select>

          <button 
            onClick={() => setIsSinglePage(!isSinglePage)}
            className="w-10 h-10 bg-white/60 backdrop-blur-sm border-2 border-[#C4B5FD]/40 rounded-xl flex items-center justify-center shadow-lg justify-self-center hover:bg-white/80 hover:scale-105 transition-all duration-300 cursor-pointer"
            title={isSinglePage ? "Switch to double-page layout" : "Switch to single-page layout"}
          >
            {isSinglePage ? (
              <FileText className="w-4.5 h-4.5 text-[#8D60FF]" />
            ) : (
              <BookOpen className="w-4.5 h-4.5 text-[#8D60FF]" />
            )}
          </button>

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
      <div className={`flex-1 overflow-y-auto px-6 pt-6 ${selectMode ? 'pb-24' : 'pb-6'}`}>
        <div className={`grid ${isSinglePage ? 'grid-cols-1' : 'grid-cols-2'} gap-4 transition-all duration-300`}>
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
                  style={{ transform: `rotate(${pageRotations.get(pageNum) || 0}deg)` }}
                  className={`relative aspect-[8.5/11] bg-white group w-full transition-all duration-500 ease-out ${
                    isSelected 
                      ? 'shadow-[0_0_20px_8px_rgba(139,92,246,0.4)] ring-2 ring-[#8D60FF]/60 scale-[1.02]' 
                      : 'shadow-[0_4px_12px_rgba(139,92,246,0.1)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.15)] hover:scale-[1.02]'
                  }`}
                >
                {/* Bookmark Icon */}
                <div className="absolute -top-2 -right-2 z-20">
                  <img src={bookmarkIcon} alt="" className="w-10 h-14 drop-shadow-lg" />
                </div>

                {/* Page Content Preview - This would show actual page content */}
                <div className="w-full h-full overflow-hidden p-3">
                  <div className="text-left text-xs text-gray-400 space-y-1.5">
                    <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-4/5 h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                    <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
                  </div>
                </div>

                {/* Infinity Icon with Menu */}
                <Popover open={openPageMenu === pageNum} onOpenChange={(open) => setOpenPageMenu(open ? pageNum : null)}>
                  <PopoverTrigger asChild>
                    <button 
                      className="absolute bottom-1 left-1 z-10 hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <img src={infinityIcon} alt="" className="w-6 h-6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-56 p-0 bg-gradient-to-br from-white/95 to-[#F5F0FF]/95 backdrop-blur-md border-2 border-[#C4B5FD]/40 shadow-[0_8px_32px_rgba(139,92,246,0.3)] rounded-xl" 
                    sideOffset={8}
                    align="start"
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddPage?.();
                          setOpenPageMenu(null);
                          toast.success('Page added');
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Page
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Extract the specific page content
                          setCopiedPages([pageNum]);
                          if (editor) {
                            const fullContent = editor.getHTML();
                            const pageBreak = '<div class="page-break" data-type="page-break"></div>';
                            const pages = fullContent.split(pageBreak);
                            
                            // Get the content of the specific page (accounting for 0-based index)
                            const pageContent = pages[pageNum - 1] || pages[0];
                            setCopiedContent(pageContent);
                            
                            console.log('Copied page:', pageNum, 'Content length:', pageContent.length);
                          }
                          toast.success('Page copied', {
                            description: `Page ${pageNum} ready to paste`,
                            duration: 2000,
                          });
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      {copiedPages.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (copiedContent && editor) {
                              console.log('Pasting content at page:', pageNum, 'Content:', copiedContent.substring(0, 100));
                              
                              // Get current content and split by page breaks
                              const currentContent = editor.getHTML();
                              const pageBreak = '<div class="page-break" data-type="page-break"></div>';
                              const pages = currentContent.split(pageBreak);
                              
                              // Insert copied content before the target page (pageNum - 1 for 0-based index)
                              const insertIndex = pageNum - 1;
                              pages.splice(insertIndex, 0, copiedContent);
                              
                              // Rejoin and set the new content
                              const newContent = pages.join(pageBreak);
                              editor.commands.setContent(newContent);
                              
                              console.log('Content pasted successfully');
                              
                              toast.success('Page pasted', {
                                description: `Inserted before page ${pageNum}`,
                                duration: 2000,
                              });
                              
                              // Also trigger the parent callback if provided
                              if (onCopyPages) {
                                onCopyPages(copiedPages, copiedContent, pageNum);
                              }
                            }
                            setOpenPageMenu(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors animate-fade-in"
                        >
                          Paste
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Copy Background feature coming soon');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                      >
                        Copy Background
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPageRotations(prev => {
                            const newRotations = new Map(prev);
                            const currentRotation = newRotations.get(pageNum) || 0;
                            newRotations.set(pageNum, (currentRotation + 90) % 360);
                            return newRotations;
                          });
                          toast.success('Page rotated');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                      >
                        Rotate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPages(new Set([pageNum]));
                          if (editor) {
                            const content = editor.getHTML();
                            onCopyPages?.([pageNum], content, pageNum + 1);
                          }
                          toast.success('Page duplicated');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Create Template feature coming soon');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                      >
                        Create Template
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Clear Page feature coming soon');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                      >
                        Clear Page
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Delete feature coming soon');
                          setOpenPageMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors border-t border-[#C4B5FD]/30 text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

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
              onClick={() => {
                if (rotateMode) {
                  setRotateMode(false);
                  setSelectedPages(new Set());
                } else {
                  handleCancelSelect();
                }
              }}
              className="text-[#8D60FF] font-bold text-sm hover:text-[#7C4DFF] transition-colors"
            >
              Done
            </button>

            <div className="w-px h-5 bg-[#C4B5FD]/30"></div>

            <button
              onClick={handleCopyPages}
              className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md border-2 border-[#C4B5FD]/40 hover:scale-105"
              title="Copy Selected Pages"
            >
              <Copy className="w-4 h-4 text-[#8D60FF]" strokeWidth={2} />
            </button>

            {selectMode && copiedPages.length > 0 && (
              <button
                onClick={handlePastePages}
                className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md border-2 border-[#C4B5FD]/40 animate-fade-in hover:scale-105"
                title="Paste Copied Pages"
              >
                <span className="text-[#8D60FF] font-bold text-sm">P</span>
              </button>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onAddPage?.()}
              className="w-7 h-7 text-[#8D60FF] hover:bg-[#8D60FF]/10 hover:text-[#7C4DFF]"
              title="Add Page"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Button>

            <Popover open={undefined} onOpenChange={undefined}>
              <PopoverTrigger asChild>
                <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-md border-2 border-[#C4B5FD]/40">
                  <img src={infinityIcon} alt="" className="w-4.5 h-4.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0 bg-white border-2 border-[#C4B5FD]/40 shadow-[0_8px_24px_rgba(139,92,246,0.2)]" sideOffset={8}>
                {selectedPages.size === 0 ? (
                  <button
                    onClick={(e) => {
                      handleSelectAll();
                      // Close popover smoothly
                      const popoverTrigger = e.currentTarget.closest('[data-radix-popper-content-wrapper]');
                      if (popoverTrigger) {
                        setTimeout(() => {
                          document.body.click();
                        }, 300);
                      }
                    }}
                    className="w-full px-4 py-3 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                  >
                    Select All Pages
                  </button>
                ) : (
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        handleCancelSelect();
                        setTimeout(() => document.body.click(), 300);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={() => {
                        toast.info('Move feature coming soon');
                        setTimeout(() => document.body.click(), 300);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                    >
                      Move
                    </button>
                    <button
                      onClick={() => {
                        setRotateMode(true);
                        setTimeout(() => document.body.click(), 300);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                    >
                      Rotate
                    </button>
                    <button
                      onClick={() => {
                        toast.info('Bookmark feature coming soon');
                        setTimeout(() => document.body.click(), 300);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors"
                    >
                      Bookmark
                    </button>
                    <button
                      onClick={() => {
                        toast.info('Delete feature coming soon');
                        setTimeout(() => document.body.click(), 300);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[#8D60FF] font-semibold text-sm hover:bg-[#8D60FF]/10 transition-colors border-t border-[#C4B5FD]/30 text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {rotateMode && (
              <button
                onClick={handleRotatePages}
                className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md border-2 border-[#C4B5FD]/40 hover:rotate-90"
                title="Rotate Selected Pages"
              >
                <svg className="w-4 h-4 text-[#8D60FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </button>
            )}

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
