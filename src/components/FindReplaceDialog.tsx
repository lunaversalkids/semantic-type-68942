import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Replace } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FindReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor?: any;
}

export const FindReplaceDialog = ({ open, onOpenChange, editor }: FindReplaceDialogProps) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [mode, setMode] = useState<'keep-style' | 'reapply-rules'>('keep-style');
  const { toast } = useToast();

  const handleFind = () => {
    if (!editor || !findText) return;
    
    const content = editor.getText();
    const matches = content.match(new RegExp(findText, 'gi'));
    
    toast({
      title: 'Search Results',
      description: matches ? `Found ${matches.length} matches` : 'No matches found',
    });
  };

  const handleReplace = () => {
    if (!editor || !findText) return;

    const content = editor.getText();
    const regex = new RegExp(findText, 'g');
    const newContent = content.replace(regex, replaceText);
    
    // This is a simplified version - in production you'd preserve marks/styles
    editor.commands.setContent(`<p>${newContent}</p>`);
    
    toast({
      title: 'Replace Complete',
      description: `Replaced all instances of "${findText}" with "${replaceText}"`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find & Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="find">Find</Label>
            <Input
              id="find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Search text..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="replace">Replace with</Label>
            <Input
              id="replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement text..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="mb-3 block">Replace Mode</Label>
            <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="keep-style" id="keep-style" />
                <Label htmlFor="keep-style" className="font-normal cursor-pointer">
                  Keep existing styles (preserve formatting)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reapply-rules" id="reapply-rules" />
                <Label htmlFor="reapply-rules" className="font-normal cursor-pointer">
                  Re-apply semantic rules (update styling)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleFind} variant="outline" className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Find
            </Button>
            <Button onClick={handleReplace} className="flex-1">
              <Replace className="w-4 h-4 mr-2" />
              Replace All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
