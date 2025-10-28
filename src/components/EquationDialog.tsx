import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EquationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquationInsert: (equation: string) => void;
}

export const EquationDialog = ({
  open,
  onOpenChange,
  onEquationInsert,
}: EquationDialogProps) => {
  const [equation, setEquation] = useState("");

  const handleInsert = () => {
    if (!equation.trim()) {
      toast.error("Please enter an equation");
      return;
    }

    onEquationInsert(equation);
    toast.success("Equation inserted!");
    onOpenChange(false);
    setEquation("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert Equation</DialogTitle>
          <DialogDescription>
            Enter your mathematical equation or formula
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="equation">Equation</Label>
            <Textarea
              id="equation"
              placeholder="E = mc²&#10;x² + y² = z²&#10;∫(x² + 1)dx"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              rows={4}
              className="font-mono resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Use Unicode symbols: × ÷ ± ² ³ √ ∫ ∑ π ∞ ≈ ≠ ≤ ≥
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
