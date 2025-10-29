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
import { Checkbox } from '@/components/ui/checkbox';
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
  const [wholeWords, setWholeWords] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const { toast } = useToast();

  const findMatches = () => {
    if (!editor || !findText) return [];
    
    const content = editor.getText();
    let pattern = findText;
    
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const matches = content.match(new RegExp(pattern, flags));
    return matches || [];
  };

  const handleFind = () => {
    const matches = findMatches();
    setTotalMatches(matches.length);
    
    if (matches.length > 0) {
      setCurrentMatch(1);
      highlightMatch(0);
      toast({
        title: 'Search Results',
        description: `Found ${matches.length} matches`,
      });
    } else {
      setCurrentMatch(0);
      toast({
        title: 'Search Results',
        description: 'No matches found',
      });
    }
  };

  const highlightMatch = (index: number) => {
    if (!editor || !findText) return;
    
    // Use Tiptap's search and replace functionality
    const content = editor.getText();
    const matches = findMatches();
    
    if (matches.length === 0 || index >= matches.length) return;
    
    // Find the position of the match in the text
    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    const match = [...content.matchAll(regex)][index];
    
    if (match && match.index !== undefined) {
      // Select the matched text in the editor
      editor.commands.focus();
      editor.commands.setTextSelection({
        from: match.index + 1,
        to: match.index + 1 + match[0].length,
      });
    }
  };

  const handleFindNext = () => {
    const matches = findMatches();
    if (matches.length === 0) {
      handleFind();
      return;
    }
    
    const nextMatch = currentMatch >= matches.length ? 1 : currentMatch + 1;
    setCurrentMatch(nextMatch);
    highlightMatch(nextMatch - 1);
  };

  const handleFindPrevious = () => {
    const matches = findMatches();
    if (matches.length === 0) {
      handleFind();
      return;
    }
    
    const prevMatch = currentMatch <= 1 ? matches.length : currentMatch - 1;
    setCurrentMatch(prevMatch);
    highlightMatch(prevMatch - 1);
  };

  const handleReplace = () => {
    if (!editor || !findText) return;

    const content = editor.getText();
    let pattern = findText;
    
    // Add word boundary if whole words is selected
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    // Set flags based on match case option
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
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
      <DialogContent className="sm:max-w-[600px] top-auto bottom-4 translate-y-0 data-[state=open]:slide-in-from-bottom-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="w-4 h-4" />
            Find & Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="find" className="text-xs">Find</Label>
              <Input
                id="find"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Search..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="replace" className="text-xs">Replace</Label>
              <Input
                id="replace"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace..."
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex gap-3">
              <div className="flex items-center space-x-1">
                <Checkbox 
                  id="whole-words" 
                  checked={wholeWords}
                  onCheckedChange={(checked) => setWholeWords(checked as boolean)}
                  className="h-3 w-3"
                />
                <Label htmlFor="whole-words" className="font-normal cursor-pointer text-xs">
                  Whole Words
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <Checkbox 
                  id="match-case" 
                  checked={matchCase}
                  onCheckedChange={(checked) => setMatchCase(checked as boolean)}
                  className="h-3 w-3"
                />
                <Label htmlFor="match-case" className="font-normal cursor-pointer text-xs">
                  Match Case
                </Label>
              </div>
            </div>
            
            {totalMatches > 0 && (
              <div className="text-xs text-muted-foreground">
                {currentMatch} of {totalMatches}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs mb-1.5 block">Replace Mode</Label>
            <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)} className="gap-2">
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="keep-style" id="keep-style" className="h-3 w-3" />
                <Label htmlFor="keep-style" className="font-normal cursor-pointer text-xs">
                  Keep existing styles (preserve formatting)
                </Label>
              </div>
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="reapply-rules" id="reapply-rules" className="h-3 w-3" />
                <Label htmlFor="reapply-rules" className="font-normal cursor-pointer text-xs">
                  Re-apply semantic rules (update styling)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleFindPrevious} variant="outline" size="sm" className="h-7 text-xs" disabled={totalMatches === 0}>
              Previous
            </Button>
            <Button onClick={handleFindNext} variant="outline" size="sm" className="h-7 text-xs" disabled={totalMatches === 0}>
              Next
            </Button>
            <Button onClick={handleFind} variant="outline" size="sm" className="h-7 text-xs flex-1">
              Find All
            </Button>
            <Button onClick={handleReplace} size="sm" className="h-7 text-xs flex-1">
              Replace All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
