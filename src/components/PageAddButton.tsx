import { Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PageAddButtonProps {
  pageNumber: number;
  onAddPage: () => void;
  onAddPageWithBackground: () => void;
  onChangeBackground: () => void;
  onCopyPage: () => void;
  headerVisible?: boolean;
  footerVisible?: boolean;
  onToggleHeader?: () => void;
  onToggleFooter?: () => void;
}

export const PageAddButton = ({
  pageNumber,
  onAddPage,
  onAddPageWithBackground,
  onChangeBackground,
  onCopyPage,
  headerVisible,
  footerVisible,
  onToggleHeader,
  onToggleFooter,
}: PageAddButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="page-add-button-wrapper">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            className="page-add-button-trigger"
            title="Add or modify page"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 p-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start hover:bg-accent/10 transition-colors text-primary"
              onClick={() => handleAction(onAddPageWithBackground)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Page with Background
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-accent/10 transition-colors text-primary"
              onClick={() => handleAction(onChangeBackground)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Change Background to Page
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-accent/10 transition-colors text-primary"
              onClick={() => handleAction(onCopyPage)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Duplicate Page
            </Button>
            {(onToggleHeader !== undefined || onToggleFooter !== undefined) && (
              <div className="px-2 py-3 mt-2 border-t border-border/20">
                <div className="text-xs text-muted-foreground mb-2 font-medium">Toggle Visibility:</div>
                <div className="flex flex-col gap-2">
                  {onToggleHeader !== undefined && (
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:bg-accent/10 p-2 rounded-md transition-colors"
                      onClick={() => handleAction(onToggleHeader)}
                    >
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          "border-primary hover:border-primary/80"
                        )}
                      >
                        {headerVisible && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#8B70F7] to-[#A78BFA]" />
                        )}
                      </div>
                      <span className="text-sm text-primary">{headerVisible ? 'Hide Header' : 'Show Header'}</span>
                    </div>
                  )}
                  {onToggleFooter !== undefined && (
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:bg-accent/10 p-2 rounded-md transition-colors"
                      onClick={() => handleAction(onToggleFooter)}
                    >
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          "border-primary hover:border-primary/80"
                        )}
                      >
                        {footerVisible && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#8B70F7] to-[#A78BFA]" />
                        )}
                      </div>
                      <span className="text-sm text-primary">{footerVisible ? 'Hide Footer' : 'Show Footer'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
