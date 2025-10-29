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
    
    const content = editor.getText();
    const matches = findMatches();
    
    if (matches.length === 0 || index >= matches.length) return;
    
    // Build search pattern
    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    const allMatches = [...content.matchAll(regex)];
    const match = allMatches[index];
    
    if (match && match.index !== undefined) {
      // Find the actual position in the document
      let pos = 1; // Tiptap positions start at 1
      let textPos = 0;
      
      editor.state.doc.descendants((node, nodePos) => {
        if (node.isText && node.text) {
          const nodeTextStart = textPos;
          const nodeTextEnd = textPos + node.text.length;
          
          // Check if our match is in this text node
          if (match.index! >= nodeTextStart && match.index! < nodeTextEnd) {
            const offsetInNode = match.index! - nodeTextStart;
            pos = nodePos + offsetInNode;
            return false; // Stop iteration
          }
          
          textPos += node.text.length;
        } else if (node.isText === false && node.textContent) {
          textPos += node.textContent.length;
        }
        return true;
      });
      
      const from = pos;
      const to = from + match[0].length;
      
      // Set selection and scroll into view
      editor.commands.setTextSelection({ from, to });
      editor.commands.focus();
      
      // Ensure it scrolls to center view
      setTimeout(() => {
        const { view } = editor;
        const domAtPos = view.domAtPos(from);
        const element = domAtPos.node.nodeType === 1 
          ? domAtPos.node as HTMLElement
          : domAtPos.node.parentElement;
        
        element?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
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

    const content = editor.getText();
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
    
    if (mode === 'keep-style') {
      // Replace in HTML to preserve all formatting
      const html = editor.getHTML();
      const newHtml = html.replace(regex, replaceText);
      editor.commands.setContent(newHtml);
    } else {
      // Re-apply semantic rules: capture style from first match and apply to all
      const allMatches = [...content.matchAll(regex)];
      
      // Find the first match in the document to capture its marks
      let firstMatchMarks: any[] = [];
      let firstMatchPos = -1;
      
      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.text && firstMatchPos === -1) {
          const nodeText = node.text;
          const match = nodeText.match(regex);
          if (match && match.index !== undefined) {
            firstMatchPos = pos + match.index;
            firstMatchMarks = node.marks;
            return false;
          }
        }
        return true;
      });
      
      // Replace all matches and apply the captured marks
      let offset = 0;
      allMatches.forEach((match) => {
        if (match.index === undefined) return;
        
        let actualPos = 1;
        let textPos = 0;
        
        editor.state.doc.descendants((node, nodePos) => {
          if (node.isText && node.text) {
            const nodeTextStart = textPos;
            const nodeTextEnd = textPos + node.text.length;
            
            if (match.index! >= nodeTextStart && match.index! < nodeTextEnd) {
              const offsetInNode = match.index! - nodeTextStart;
              actualPos = nodePos + offsetInNode;
              return false;
            }
            
            textPos += node.text.length;
          } else if (node.isText === false && node.textContent) {
            textPos += node.textContent.length;
          }
          return true;
        });
        
        const from = actualPos + offset;
        const to = from + match[0].length;
        
        // Replace text and apply marks
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .insertContent(replaceText)
          .run();
        
        // Apply the captured marks to the replacement
        if (firstMatchMarks.length > 0) {
          const newFrom = from;
          const newTo = from + replaceText.length;
          
          firstMatchMarks.forEach((mark) => {
            editor.chain()
              .focus()
              .setTextSelection({ from: newFrom, to: newTo })
              .setMark(mark.type.name, mark.attrs)
              .run();
          });
        }
        
        offset += replaceText.length - match[0].length;
      });
    }
    
    // Focus editor and scroll to first replacement
    editor.commands.focus();
    editor.commands.setTextSelection(1);
    
    // Scroll to top to show changes
    setTimeout(() => {
      const editorElement = document.querySelector('.ProseMirror');
      editorElement?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    toast({
      title: 'Replace Complete',
      description: `Replaced ${matchCount} instance${matchCount !== 1 ? 's' : ''} of "${findText}"`,
    });
    
    // Reset the dialog state
    setTotalMatches(0);
    setCurrentMatch(0);
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
