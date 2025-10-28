import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { coreShapes } from "./icons/CoreShapes";

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIconSelect: (iconId: string, category: string) => void;
}

export const IconPicker = ({ open, onOpenChange, onIconSelect }: IconPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("core");

  const filteredShapes = coreShapes.filter(
    (shape) =>
      shape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shape.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconClick = (iconId: string) => {
    onIconSelect(iconId, selectedCategory);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Insert Shape or Icon</DialogTitle>
          <DialogDescription>
            Choose from geometric shapes, sacred symbols, and more
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="core">Core Shapes</TabsTrigger>
              <TabsTrigger value="quantum" disabled>Quantum</TabsTrigger>
              <TabsTrigger value="christian" disabled>Christian</TabsTrigger>
              <TabsTrigger value="nature" disabled>Nature</TabsTrigger>
            </TabsList>

            <TabsContent value="core" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-4 gap-4">
                  {filteredShapes.map((shape) => {
                    const IconComponent = shape.component;
                    return (
                      <Button
                        key={shape.id}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
                        onClick={() => handleIconClick(shape.id)}
                      >
                        <IconComponent className="w-8 h-8" />
                        <span className="text-xs text-center">{shape.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
