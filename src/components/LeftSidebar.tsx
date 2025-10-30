import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

export const LeftSidebar = () => {
  return (
    <div className="h-full bg-primary w-16 flex flex-col items-center py-4 border-r border-primary/20">
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-10 w-10 text-primary-foreground hover:bg-primary/80 rounded-full"
        title="History"
      >
        <History className="w-6 h-6" />
      </Button>
    </div>
  );
};
