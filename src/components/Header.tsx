import { Button } from '@/components/ui/button';
import { Sparkles, HelpCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onHelpClick?: () => void;
}

export const Header = ({ onHelpClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Semantic Editor Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Semantic Editor</h1>
          <p className="text-xs text-muted-foreground">Professional document styling</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onHelpClick}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assist
        </Button>
        <Button size="sm">
          Save Document
        </Button>
      </div>
    </header>
  );
};
