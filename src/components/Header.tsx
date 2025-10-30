import { Button } from '@/components/ui/button';
import { Sparkles, HelpCircle, Save, Cloud } from 'lucide-react';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onHelpClick?: () => void;
  onSaveClick?: () => void;
  onCloudClick?: () => void;
  documentSaved?: boolean;
}

export const Header = ({
  onHelpClick,
  onSaveClick,
  onCloudClick,
  documentSaved = true
}: HeaderProps) => {
  return (
    <header className="h-16 border-b border-sidebar-border bg-primary px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
        <span className="text-lg font-semibold text-primary-foreground">Doc One</span>
      </div>

      <div className="flex items-center gap-2 bg-primary/30 px-4 py-2 rounded-lg">
        <Sparkles className="w-5 h-5 text-primary-foreground/80" />
        <span className="text-sm font-medium text-primary-foreground">Insects</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Comments">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Edit">
          <Save className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Add">
          <Sparkles className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Search" onClick={onHelpClick}>
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Cloud" onClick={onCloudClick}>
          <Cloud className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" title="Fullscreen">
          <Save className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};