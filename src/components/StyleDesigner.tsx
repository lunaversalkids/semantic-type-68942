import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { TextStyle } from '@/types/styles';

const AVAILABLE_FONTS = ['Inter', 'Graphik', 'Literata', 'Source Serif', 'Georgia', 'Monaco'];

interface StyleDesignerProps {
  style: TextStyle;
  onClose: () => void;
  onSave: (updates: Partial<TextStyle>) => void;
}

export const StyleDesigner = ({ style, onClose, onSave }: StyleDesignerProps) => {
  const [formData, setFormData] = useState({
    font: style.font || 'Inter',
    weight: style.weight || 400,
    size: style.size || 12,
    color: style.color || '#22163F',
    caps: 'None',
    cols: 1,
    gutter: 16,
    span: 'auto',
    wrap: 'none'
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      font: formData.font,
      weight: formData.weight,
      size: formData.size,
      color: formData.color
    });
  };

  const handleReset = () => {
    setFormData({
      font: style.font || 'Inter',
      weight: style.weight || 400,
      size: style.size || 12,
      color: style.color || '#22163F',
      caps: 'None',
      cols: 1,
      gutter: 16,
      span: 'auto',
      wrap: 'none'
    });
  };

  return (
    <div className="fixed top-3 right-[388px] bottom-24 w-[420px] bg-white border border-[#E6D8FF] rounded-[14px] shadow-[0_12px_28px_rgba(96,48,200,0.14)] flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 bg-gradient-to-b from-[#EDE3FF] to-[#E6DBFF] border-b border-[#E6D8FF] rounded-t-[14px]">
        <div className="font-extrabold text-[#22163F]">Design: {style.name}</div>
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-[#E6D8FF]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="p-3.5 flex flex-col gap-3.5">
          {/* Typography */}
          <fieldset className="border border-[#E6D8FF] rounded-xl p-3">
            <legend className="px-1.5 text-[#5A4A86] font-bold text-sm">Typography</legend>
            
            <div className="space-y-2">
              <div>
                <Label className="text-[13px] mb-1.5 block">Font</Label>
                <Select value={formData.font} onValueChange={(val) => updateField('font', val)}>
                  <SelectTrigger className="h-9 rounded-lg border-[#E6D8FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FONTS.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Weight</Label>
                <Select value={formData.weight.toString()} onValueChange={(val) => updateField('weight', parseInt(val))}>
                  <SelectTrigger className="h-9 rounded-lg border-[#E6D8FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">Regular</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semibold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Size (pt)</Label>
                <Input 
                  type="number" 
                  min="8" 
                  max="72" 
                  value={formData.size}
                  onChange={(e) => updateField('size', parseInt(e.target.value))}
                  className="h-9 rounded-lg border-[#E6D8FF]"
                />
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Color</Label>
                <Input 
                  type="color" 
                  value={formData.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  className="h-9 rounded-lg border-[#E6D8FF] cursor-pointer"
                />
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Capitalization</Label>
                <Select value={formData.caps} onValueChange={(val) => updateField('caps', val)}>
                  <SelectTrigger className="h-9 rounded-lg border-[#E6D8FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="All Caps">All Caps</SelectItem>
                    <SelectItem value="Small Caps">Small Caps</SelectItem>
                    <SelectItem value="Title Case">Title Case</SelectItem>
                    <SelectItem value="Start Case">Start Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          {/* Column Layout */}
          <fieldset className="border border-[#E6D8FF] rounded-xl p-3">
            <legend className="px-1.5 text-[#5A4A86] font-bold text-sm">Column Layout</legend>
            
            <div className="space-y-2">
              <div>
                <Label className="text-[13px] mb-1.5 block">Columns</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="4" 
                  value={formData.cols}
                  onChange={(e) => updateField('cols', parseInt(e.target.value))}
                  className="h-9 rounded-lg border-[#E6D8FF]"
                />
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Gutter (pt)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="96" 
                  value={formData.gutter}
                  onChange={(e) => updateField('gutter', parseInt(e.target.value))}
                  className="h-9 rounded-lg border-[#E6D8FF]"
                />
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Span</Label>
                <Select value={formData.span} onValueChange={(val) => updateField('span', val)}>
                  <SelectTrigger className="h-9 rounded-lg border-[#E6D8FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="all">Span All Columns</SelectItem>
                    <SelectItem value="none">No Span</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[13px] mb-1.5 block">Wrap Text</Label>
                <Select value={formData.wrap} onValueChange={(val) => updateField('wrap', val)}>
                  <SelectTrigger className="h-9 rounded-lg border-[#E6D8FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tight">Tight</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="through">Through</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          {/* Preview */}
          <div className="border border-dashed border-[#E6D8FF] rounded-xl p-3 bg-[#FAF8FF]">
            <div 
              className="text-base"
              style={{
                fontFamily: formData.font,
                fontWeight: formData.weight,
                fontSize: `${formData.size}pt`,
                color: formData.color,
                textTransform: formData.caps === 'All Caps' ? 'uppercase' : 'none',
                fontVariantCaps: formData.caps === 'Small Caps' ? 'all-small-caps' : 'normal'
              }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-lg border-[#E6D8FF]"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#A77CFF] to-[#7A49FF] hover:opacity-90 text-white border-0"
            >
              Apply to Style
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
