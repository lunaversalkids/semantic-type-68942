import { Button } from '@/components/ui/button';
import { History, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

interface LeftSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onStylesClick?: () => void;
}

export const LeftSidebar = ({ collapsed = false, onToggleCollapse, onStylesClick }: LeftSidebarProps) => {
  return (
    <div className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col items-center transition-all duration-300 ${collapsed ? 'w-0' : 'w-16'} overflow-hidden`}>
      <div className="flex flex-col items-center gap-4 py-4 w-full">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-10 w-10 text-primary hover:bg-sidebar-accent"
          title="History"
        >
          <History className="w-5 h-5" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-10 w-10 text-primary hover:bg-sidebar-accent"
          title="Styles"
          onClick={onStylesClick}
        >
          <Palette className="w-5 h-5" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
