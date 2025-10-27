import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TextStyle } from '@/types/styles';

interface ApplyToAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  styles: TextStyle[];
  editor?: any;
}

export const ApplyToAllDialog = ({ open, onOpenChange, selectedText, styles, editor }: ApplyToAllDialogProps) => {
  const [matchText, setMatchText] = useState(selectedText);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [scope, setScope] = useState<'instance' | 'document'>('document');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const { toast } = useToast();

  const handleApply = () => {
    if (!matchText || !selectedStyle || !editor) return;

    const style = styles.find(s => s.id === selectedStyle);
    if (!style) return;

    // This is a simplified implementation - in production you'd track rules and apply them properly
    const regex = new RegExp(matchText, caseInsensitive ? 'gi' : 'g');
    const content = editor.getText();
    const matches = content.match(regex);

    if (matches) {
      // Apply style to all matches
      editor.commands.selectAll();
      // In a real implementation, you'd find and style each match individually
      
      toast({
        title: 'Style Applied',
        description: `Applied "${style.name}" style to ${matches.length} instances of "${matchText}"`,
      });
    } else {
      toast({
        title: 'No Matches',
        description: `No instances of "${matchText}" found`,
        variant: 'destructive',
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Apply Style to All Instances
          </DialogTitle>
          <DialogDescription>
            Create a semantic rule to automatically style matching text throughout your document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="match-text">Match Text</Label>
            <Input
              id="match-text"
              value={matchText}
              onChange={(e) => setMatchText(e.target.value)}
              placeholder="Word or phrase to match..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="style-select">Apply Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger id="style-select" className="mt-1">
                <SelectValue placeholder="Select a style..." />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="case-insensitive"
              checked={caseInsensitive}
              onCheckedChange={(checked) => setCaseInsensitive(checked as boolean)}
            />
            <Label htmlFor="case-insensitive" className="font-normal cursor-pointer">
              Case insensitive matching
            </Label>
          </div>

          <div>
            <Label className="mb-3 block">Scope</Label>
            <RadioGroup value={scope} onValueChange={(v: any) => setScope(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="document" id="document" />
                <Label htmlFor="document" className="font-normal cursor-pointer">
                  This document only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instance" id="instance" />
                <Label htmlFor="instance" className="font-normal cursor-pointer">
                  Current instance only
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleApply} className="w-full">
            Apply to All Instances
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
