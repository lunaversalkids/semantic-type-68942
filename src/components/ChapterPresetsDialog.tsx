import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { presetCategories, PresetCategory, Preset, PresetVariation, PresetFormatting } from '@/types/presets';
import { cn } from '@/lib/utils';

interface ChapterPresetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPreset?: (formatting: PresetFormatting) => void;
}

export const ChapterPresetsDialog = ({
  open,
  onOpenChange,
  onApplyPreset,
}: ChapterPresetsDialogProps) => {
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
    const formatting = selectedVariation?.formatting || selectedPreset?.formatting;
    if (formatting && onApplyPreset) {
      onApplyPreset(formatting);
      onOpenChange(false);
    }
  };

  const getCurrentFormatting = (): PresetFormatting | null => {
    if (selectedVariation) return selectedVariation.formatting;
    if (selectedPreset) return selectedPreset.formatting;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[85vh] p-0 gap-0 bg-background border-[hsl(var(--stroke))]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--stroke))]">
          <h2 className="text-xl font-semibold text-foreground">Chapter Presets</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-md hover:bg-[hsl(var(--panel-2))] transition-colors grid place-items-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Multi-column container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: Categories */}
          <div className="w-64 border-r border-[hsl(var(--stroke))] bg-[hsl(var(--panel))]">
            <ScrollArea className="h-full">
              <div className="p-2">
                {presetCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-colors mb-1 flex items-center gap-3",
                      selectedCategory?.id === category.id
                        ? "bg-[hsl(var(--accent))] text-white"
                        : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                    )}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Column 2: Presets */}
          {selectedCategory && (
            <div className="w-72 border-r border-[hsl(var(--stroke))] bg-[hsl(var(--panel))] animate-slide-in-right">
              <ScrollArea className="h-full">
                <div className="p-2">
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                    {selectedCategory.name} Presets
                  </div>
                  {selectedCategory.presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-colors mb-1",
                        selectedPreset?.id === preset.id
                          ? "bg-[hsl(var(--accent))] text-white"
                          : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                      )}
                    >
                      <div className="font-medium mb-1">{preset.name}</div>
                      <div className={cn(
                        "text-xs",
                        selectedPreset?.id === preset.id ? "text-white/80" : "text-muted-foreground"
                      )}>
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Column 3: Preview */}
          {selectedPreset && (
            <div className="flex-1 bg-background animate-slide-in-right">
              <div className="h-full flex flex-col">
                <div className="px-6 py-3 border-b border-[hsl(var(--stroke))]">
                  <h3 className="font-semibold text-foreground">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPreset.name} - {selectedPreset.description}
                  </p>
                </div>
                
                <ScrollArea className="flex-1">
                  <PreviewDocument formatting={getCurrentFormatting()} />
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Column 4: Variations (if available) */}
          {selectedPreset?.variations && selectedPreset.variations.length > 0 && (
            <div className="w-64 border-l border-[hsl(var(--stroke))] bg-[hsl(var(--panel))] animate-slide-in-right">
              <ScrollArea className="h-full">
                <div className="p-2">
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Style Variations
                  </div>
                  {selectedPreset.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => handleVariationClick(variation)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-colors mb-1",
                        selectedVariation?.id === variation.id
                          ? "bg-[hsl(var(--accent))] text-white"
                          : "hover:bg-[hsl(var(--panel-2))] text-foreground"
                      )}
                    >
                      <div className="font-medium">{variation.name}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedPreset && (
          <div className="px-6 py-4 border-t border-[hsl(var(--stroke))] flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedVariation ? selectedVariation.name : selectedPreset.name}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent-2))] text-white"
              >
                Apply Preset
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Preview Document Component
const PreviewDocument = ({ formatting }: { formatting: PresetFormatting | null }) => {
  if (!formatting) return null;

  return (
    <div 
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg my-8"
      style={{
        width: `${formatting.pageSize.width}in`,
        minHeight: `${formatting.pageSize.height}in`,
      }}
    >
      {/* Margins visualization */}
      <div
        style={{
          paddingTop: `${formatting.margins.top}in`,
          paddingBottom: `${formatting.margins.bottom}in`,
          paddingLeft: `${formatting.margins.left}in`,
          paddingRight: `${formatting.margins.right}in`,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: formatting.headerFormat.font,
            fontSize: `${formatting.headerFormat.size}pt`,
            fontWeight: formatting.headerFormat.weight,
            textAlign: formatting.headerFormat.alignment,
            marginBottom: '1rem',
            color: '#666',
          }}
        >
          Your Header Text
        </div>

        {/* Chapter Title */}
        <div
          style={{
            fontFamily: formatting.chapterTitleFormat.font,
            fontSize: `${formatting.chapterTitleFormat.size}pt`,
            fontWeight: formatting.chapterTitleFormat.weight,
            textAlign: formatting.chapterTitleFormat.alignment,
            marginBottom: `${formatting.chapterTitleFormat.spacing}rem`,
            color: '#000',
          }}
        >
          Chapter One
        </div>

        {/* Body Text */}
        <div
          style={{
            fontFamily: formatting.bodyFormat.font,
            fontSize: `${formatting.bodyFormat.size}pt`,
            lineHeight: formatting.bodyFormat.lineHeight,
          }}
        >
          <p
            style={{
              marginBottom: `${formatting.bodyFormat.paragraphSpacing}rem`,
              textIndent: `${formatting.bodyFormat.firstLineIndent}in`,
            }}
          >
            This is a preview of your document with the selected formatting applied. The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p
            style={{
              marginBottom: `${formatting.bodyFormat.paragraphSpacing}rem`,
              textIndent: `${formatting.bodyFormat.firstLineIndent}in`,
            }}
          >
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          {/* Section Break */}
          <div
            style={{
              textAlign: 'center',
              margin: `${formatting.sectionBreak.spacing}rem 0`,
            }}
          >
            {formatting.sectionBreak.style === 'asterisk' && '* * *'}
            {formatting.sectionBreak.style === 'line' && <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />}
            {formatting.sectionBreak.style === 'ornament' && '❖'}
            {formatting.sectionBreak.style === 'space' && <div style={{ height: `${formatting.sectionBreak.spacing}rem` }} />}
          </div>

          <p
            style={{
              marginBottom: `${formatting.bodyFormat.paragraphSpacing}rem`,
              textIndent: `${formatting.bodyFormat.firstLineIndent}in`,
            }}
          >
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
        </div>
      </div>
    </div>
  );
};
