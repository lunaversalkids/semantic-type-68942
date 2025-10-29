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
    
    const { state, view } = editor;
    const { doc } = state;
    const content = doc.textContent;
    const matches = findMatches();
    
    if (matches.length === 0 || index >= matches.length) return;
    
    // Find the position of the match in the text
    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    const allMatches = [...content.matchAll(regex)];
    const match = allMatches[index];
    
    if (match && match.index !== undefined) {
      // Calculate proper position in the document (Tiptap positions start at 1)
      const from = match.index + 1;
      const to = from + match[0].length;
      
      // Create a transaction that selects and scrolls to the match
      const tr = view.state.tr.setSelection(
        view.state.selection.constructor.create(view.state.doc, from, to)
      );
      
      // Scroll into view with padding to ensure it's not covered by the dialog
      view.dispatch(tr.scrollIntoView());
      
      // Focus the editor
      editor.commands.focus();
      
      // Additional scroll to center the match and ensure it's not covered by bottom dialog
      setTimeout(() => {
        const domSelection = view.domAtPos(from);
        if (domSelection.node) {
          const element = domSelection.node.nodeType === 1 
            ? domSelection.node as HTMLElement
            : domSelection.node.parentElement;
          
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }
      }, 50);
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

    const matches = findMatches();
    const matchCount = matches.length;
    
    if (matchCount === 0) {
      toast({
        title: 'No Matches',
        description: 'No matches found to replace',
      });
      return;
    }

    // Build pattern for replacement
    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    
    // Get current HTML content and replace within it to preserve formatting
    const html = editor.getHTML();
    const newHtml = html.replace(regex, replaceText);
    
    // Update content and maintain formatting
    editor.commands.setContent(newHtml);
    
    // Scroll to top to show the changes
    editor.commands.focus();
    editor.commands.setTextSelection(0);
    
    toast({
      title: 'Replace Complete',
      description: `Replaced ${matchCount} instance${matchCount !== 1 ? 's' : ''} of "${findText}"`,
    });
    
    // Reset the dialog state
    setTotalMatches(0);
    setCurrentMatch(0);
    setFindText('');
    setReplaceText('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] top-auto bottom-2 translate-y-0 data-[state=open]:slide-in-from-bottom-2 mx-4 sm:mx-8 py-3">
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="w-4 h-4" />
            Find & Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-2 items-end">
            <div>
              <Label htmlFor="find" className="text-xs">Find</Label>
              <Input
                id="find"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Search..."
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="replace" className="text-xs">Replace</Label>
              <Input
                id="replace"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace..."
                className="h-7 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFindPrevious} variant="outline" size="sm" className="h-7 text-xs flex-1" disabled={totalMatches === 0}>
                Previous
              </Button>
              <Button onClick={handleFindNext} variant="outline" size="sm" className="h-7 text-xs flex-1" disabled={totalMatches === 0}>
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex gap-4 flex-wrap items-center">
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
              
              <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)} className="flex gap-3">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="keep-style" id="keep-style" className="h-3 w-3" />
                  <Label htmlFor="keep-style" className="font-normal cursor-pointer text-xs">
                    Keep existing styles
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="reapply-rules" id="reapply-rules" className="h-3 w-3" />
                  <Label htmlFor="reapply-rules" className="font-normal cursor-pointer text-xs">
                    Re-apply semantic rules
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {totalMatches > 0 && (
              <div className="text-xs text-muted-foreground font-medium">
                {currentMatch} of {totalMatches}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
