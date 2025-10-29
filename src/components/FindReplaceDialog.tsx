import { useState, useEffect } from 'react';
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

  // Auto-populate find field with selected text when dialog opens
  useEffect(() => {
    if (open && editor) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, '');
      if (selectedText && selectedText.trim()) {
        setFindText(selectedText.trim());
      }
    }
  }, [open, editor]);

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
    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    const allMatches = [...content.matchAll(regex)];
    
    if (allMatches.length === 0 || index >= allMatches.length) return;
    
    const match = allMatches[index];
    if (!match || match.index === undefined) return;
    
    // Calculate position by walking through the document
    let docPosition = 0;
    let found = false;
    let targetFrom = 0;
    let targetTo = 0;
    
    editor.state.doc.descendants((node, pos) => {
      if (found) return false;
      
      if (node.isText && node.text) {
        const nodeStart = docPosition;
        const nodeEnd = docPosition + node.text.length;
        
        // Check if match is in this text node
        if (match.index! >= nodeStart && match.index! < nodeEnd) {
          const offset = match.index! - nodeStart;
          targetFrom = pos + offset;
          targetTo = targetFrom + match[0].length;
          found = true;
          return false;
        }
        
        docPosition += node.text.length;
      }
      return true;
    });
    
    if (found) {
      // Select the text
      editor.chain().focus().setTextSelection({ from: targetFrom, to: targetTo }).run();
      
      // Scroll into view with delay to ensure selection is set
      setTimeout(() => {
        const { view } = editor;
        const coords = view.coordsAtPos(targetFrom);
        const editorRect = view.dom.getBoundingClientRect();
        const scrollTop = coords.top - editorRect.top - (window.innerHeight / 3);
        
        view.dom.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }, 100);
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

    let pattern = findText;
    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    
    if (mode === 'keep-style') {
      // Keep existing style: replace text in HTML preserving all formatting
      const html = editor.getHTML();
      const newHtml = html.replace(regex, replaceText);
      editor.commands.setContent(newHtml);
    } else {
      // Re-apply semantic rules: capture style from selected/first styled word
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, '');
      
      // Check if current selection matches the search
      let styleMarks: any[] = [];
      const selectionMatches = selectedText.toLowerCase() === findText.toLowerCase() || 
                              (matchCase && selectedText === findText);
      
      if (selectionMatches) {
        // Capture marks from current selection
        editor.state.doc.nodesBetween(from, to, (node) => {
          if (node.isText && node.marks.length > 0) {
            styleMarks = node.marks;
            return false;
          }
        });
      } else {
        // Find first styled occurrence in document
        let foundStyled = false;
        editor.state.doc.descendants((node, pos) => {
          if (foundStyled) return false;
          
          if (node.isText && node.text && node.marks.length > 0) {
            const textMatch = node.text.match(regex);
            if (textMatch) {
              styleMarks = node.marks;
              foundStyled = true;
              return false;
            }
          }
          return true;
        });
      }
      
      // Replace all occurrences with captured style
      const allMatches = [...content.matchAll(regex)];
      let processedMatches = 0;
      
      allMatches.forEach((match) => {
        if (match.index === undefined) return;
        
        let docPos = 0;
        let targetFrom = 0;
        let targetTo = 0;
        let found = false;
        
        editor.state.doc.descendants((node, pos) => {
          if (found) return false;
          
          if (node.isText && node.text) {
            const nodeStart = docPos;
            const nodeEnd = docPos + node.text.length;
            
            if (match.index! >= nodeStart && match.index! < nodeEnd) {
              const offset = match.index! - nodeStart;
              targetFrom = pos + offset + (processedMatches * (replaceText.length - findText.length));
              targetTo = targetFrom + match[0].length;
              found = true;
              return false;
            }
            
            docPos += node.text.length;
          }
          return true;
        });
        
        if (found) {
          // Delete old text and insert new with marks
          const chain = editor.chain().focus();
          chain.setTextSelection({ from: targetFrom, to: targetTo });
          chain.deleteSelection();
          chain.insertContent(replaceText);
          
          // Apply captured style marks
          if (styleMarks.length > 0) {
            const newTo = targetFrom + replaceText.length;
            chain.setTextSelection({ from: targetFrom, to: newTo });
            styleMarks.forEach((mark) => {
              chain.setMark(mark.type.name, mark.attrs);
            });
          }
          
          chain.run();
          processedMatches++;
        }
      });
    }
    
    editor.commands.focus();
    editor.commands.setTextSelection(1);
    
    setTimeout(() => {
      editor.view.dom.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    toast({
      title: 'Replace Complete',
      description: `Replaced ${matchCount} match${matchCount !== 1 ? 'es' : ''} of "${findText}"`,
    });
    
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
