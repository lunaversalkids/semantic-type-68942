import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, Replace } from 'lucide-react';

export const PermanentFindReplaceBar = () => {
  return (
    <div className="h-16 border-t border-sidebar-border bg-background px-6 flex items-center gap-4">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">Find and Replace</span>
        <Input 
          placeholder="Hexapoda" 
          className="w-48 h-9 bg-background border-sidebar-border"
          defaultValue="Hexapoda"
          disabled
        />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
            <Replace className="w-4 h-4" />
          </Button>
        </div>
        <Input 
          placeholder="intestata" 
          className="w-48 h-9 bg-background border-sidebar-border"
          defaultValue="intestata"
          disabled
        />
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Apply to change style preference</span>
        <Button variant="default" size="sm" className="bg-primary text-primary-foreground" disabled>
          Edit All
        </Button>
        <Button variant="default" size="sm" className="bg-primary text-primary-foreground" disabled>
          Replace
        </Button>
      </div>
    </div>
  );
};
