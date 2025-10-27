import { Button } from '@/components/ui/button';
import { FileText, Sparkles, HelpCircle } from 'lucide-react';
interface HeaderProps {
  onHelpClick?: () => void;
}
export const Header = ({
  onHelpClick
}: HeaderProps) => {
  return <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">A Professional Semantic Word Processor Editor</h1>
          <p className="text-xs text-muted-foreground">Doc One</p>
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
    </header>;
};