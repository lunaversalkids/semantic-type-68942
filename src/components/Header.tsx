import { Button } from '@/components/ui/button';
import { Sparkles, HelpCircle, Save, Cloud, LogOut } from 'lucide-react';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onHelpClick?: () => void;
  onSaveClick?: () => void;
  onCloudClick?: () => void;
  onSignOut?: () => void;
  documentSaved?: boolean;
  userEmail?: string;
}

export const Header = ({
  onHelpClick,
  onSaveClick,
  onCloudClick,
  onSignOut,
  documentSaved = true,
  userEmail
}: HeaderProps) => {
  return <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg" />
        <div>
          <h1 className="text-xl font-bold">Doc One</h1>
          <p className="text-xs text-muted-foreground">A Professional Semantic Word Processor Editor</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="text-sm text-muted-foreground">{userEmail}</span>
        )}
        <Button variant="outline" size="sm" onClick={onHelpClick}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button variant="outline" size="sm" onClick={onCloudClick}>
          <Cloud className="w-4 h-4 mr-2" />
          My Documents
        </Button>
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assist
        </Button>
        <Button 
          size="sm" 
          onClick={onSaveClick}
          variant={documentSaved ? "default" : "default"}
          className={!documentSaved ? "animate-pulse" : ""}
        >
          <Save className="w-4 h-4 mr-2" />
          {documentSaved ? 'Save Document' : 'Save Changes'}
        </Button>
        {userEmail && (
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>;
};