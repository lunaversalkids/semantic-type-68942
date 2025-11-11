import { Plus, EyeOff } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PageAddButtonProps {
  pageNumber: number;
  onAddPage: () => void;
  onAddPageWithBackground: () => void;
  onChangeBackground: () => void;
  onCopyPage: () => void;
  onHideHeader?: () => void;
  onHideFooter?: () => void;
}

export const PageAddButton = ({
  pageNumber,
  onAddPage,
  onAddPageWithBackground,
  onChangeBackground,
  onCopyPage,
  onHideHeader,
  onHideFooter,
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
            
            {/* Hide Header/Footer Options - Side by Side */}
            <div className="flex gap-1 mt-1">
              {onHideHeader && (
                <Button
                  variant="ghost"
                  className="flex-1 justify-start hover:bg-accent/10 transition-colors text-primary text-sm"
                  onClick={() => handleAction(onHideHeader)}
                >
                  <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                  Hide Header
                </Button>
              )}
              {onHideFooter && (
                <Button
                  variant="ghost"
                  className="flex-1 justify-start hover:bg-accent/10 transition-colors text-primary text-sm"
                  onClick={() => handleAction(onHideFooter)}
                >
                  <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                  Hide Footer
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
