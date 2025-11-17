import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { presetCategories, PresetCategory, Preset, PresetVariation } from '@/types/presets';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface ChapterPresetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPreset?: (variation: PresetVariation) => void;
}

export function ChapterPresetsDialog({ open, onOpenChange, onApplyPreset }: ChapterPresetsDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<PresetVariation | null>(null);

  const handleCategoryClick = (category: PresetCategory) => {
    setSelectedCategory(category);
    setSelectedPreset(null);
    setSelectedVariation(null);
  };

  const handlePresetClick = (preset: Preset) => {
    setSelectedPreset(preset);
    setSelectedVariation(null);
  };

  const handleVariationClick = (variation: PresetVariation) => {
    setSelectedVariation(variation);
  };

  const handleApply = () => {
    if (selectedVariation && onApplyPreset) {
      onApplyPreset(selectedVariation);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedCategory(null);
    setSelectedPreset(null);
    setSelectedVariation(null);
  };

  const handleBack = () => {
    if (selectedVariation) {
      setSelectedVariation(null);
    } else if (selectedPreset) {
      setSelectedPreset(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-[hsl(var(--panel-2))]">
        <DialogHeader className="px-6 py-4 border-b border-[hsl(var(--stroke))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={!selectedCategory}
                className="rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="rounded-lg px-6"
              >
                Cancel
              </Button>
            </div>
            <DialogTitle className="text-2xl font-semibold">Chapter Presets</DialogTitle>
            <Button
              onClick={handleApply}
              disabled={!selectedVariation}
              className="rounded-lg px-6"
            >
              Apply
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-full overflow-hidden">
          {/* Column 1: Categories */}
          <div className="w-64 border-r border-[hsl(var(--stroke))] bg-[hsl(var(--panel))]">
            <ScrollArea className="h-full">
              <div className="p-2">
                {presetCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors text-base",
                      selectedCategory?.id === category.id
                        ? "bg-[hsl(var(--accent-2))] text-foreground font-medium"
                        : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Column 2: Presets (appears when category selected) */}
          {selectedCategory && (
            <div className="w-64 border-r border-[hsl(var(--stroke))] bg-[hsl(var(--panel))] animate-slide-in-right">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {selectedCategory.presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors text-base",
                        selectedPreset?.id === preset.id
                          ? "bg-[hsl(var(--accent-2))] text-foreground font-medium"
                          : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Column 3: Variations (appears when preset selected) */}
          {selectedPreset && (
            <div className="w-64 border-r border-[hsl(var(--stroke))] bg-[hsl(var(--panel))] animate-slide-in-right">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {selectedPreset.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => handleVariationClick(variation)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors text-base",
                        selectedVariation?.id === variation.id
                          ? "bg-[hsl(var(--accent-2))] text-foreground font-medium"
                          : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                      )}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Column 4: Live Preview (appears when variation selected) */}
          {selectedVariation && (
            <div className="flex-1 bg-background animate-fade-in">
              <ScrollArea className="h-full">
                <div className="p-8">
                  <div 
                    className="bg-white mx-auto shadow-lg"
                    style={{
                      width: selectedVariation.formatting.pageSize === 'letter' ? '8.5in' : '210mm',
                      minHeight: selectedVariation.formatting.pageSize === 'letter' ? '11in' : '297mm',
                      paddingTop: `${selectedVariation.formatting.marginTop}in`,
                      paddingBottom: `${selectedVariation.formatting.marginBottom}in`,
                      paddingLeft: `${selectedVariation.formatting.marginLeft}in`,
                      paddingRight: `${selectedVariation.formatting.marginRight}in`,
                    }}
                  >
                    {/* Chapter Title */}
                    {selectedVariation.formatting.chapterTitleFormat && (
                      <h1
                        style={{
                          fontSize: `${selectedVariation.formatting.chapterTitleFormat.fontSize}pt`,
                          fontWeight: selectedVariation.formatting.chapterTitleFormat.fontWeight,
                          textAlign: selectedVariation.formatting.chapterTitleFormat.alignment,
                          marginBottom: `${selectedVariation.formatting.chapterTitleFormat.spacing}pt`,
                          fontFamily: selectedVariation.formatting.fontFamily,
                        }}
                      >
                        Chapter 1
                      </h1>
                    )}

                    {/* Body Text Preview */}
                    <div
                      style={{
                        fontSize: `${selectedVariation.formatting.fontSize}pt`,
                        lineHeight: selectedVariation.formatting.lineHeight,
                        fontFamily: selectedVariation.formatting.fontFamily,
                      }}
                    >
                      <p
                        style={{
                          marginBottom: `${selectedVariation.formatting.paragraphSpacing}pt`,
                          textIndent: selectedVariation.formatting.indentFirstLine 
                            ? `${selectedVariation.formatting.indentSize}in` 
                            : '0',
                        }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh eu'smed tincidunt ut laoreet dolors magnam diquamers.
                      </p>
                      <p
                        style={{
                          marginBottom: `${selectedVariation.formatting.paragraphSpacing}pt`,
                          textIndent: selectedVariation.formatting.indentFirstLine 
                            ? `${selectedVariation.formatting.indentSize}in` 
                            : '0',
                        }}
                      >
                        Vivimius nem vlus verbits dus, notud asum lincidum ut, taoreet dolore magng diquvam erst, volurpat. Ut vàsl enim ad minim veniam, quis nostrud exeresriation vilamcorver suscip't lobords nis! ut alloup ox es corm.
                      </p>
                      <p
                        style={{
                          marginBottom: `${selectedVariation.formatting.paragraphSpacing}pt`,
                          textIndent: selectedVariation.formatting.indentFirstLine 
                            ? `${selectedVariation.formatting.indentSize}in` 
                            : '0',
                        }}
                      >
                        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty state when no variation selected */}
          {!selectedVariation && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a preset to preview formatting
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
