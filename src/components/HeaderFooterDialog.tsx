import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface HeaderFooterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: HeaderFooterSettings) => void;
  existingConfig?: HeaderFooterSettings | null;
}

export interface HeaderFooterSettings {
  showHeader: boolean;
  showFooter: boolean;
  layoutStyle: 'single' | 'two' | 'three';
  headerContent: any;
  footerContent: any;
  headerHeight: number;
  footerHeight: number;
}

export const HeaderFooterDialog = ({ open, onOpenChange, onSave, existingConfig }: HeaderFooterDialogProps) => {
  const [settings, setSettings] = useState<HeaderFooterSettings>({
    showHeader: false,
    showFooter: false,
    layoutStyle: 'single',
    headerContent: '',
    footerContent: '',
    headerHeight: 60,
    footerHeight: 60,
  });

  useEffect(() => {
    if (existingConfig && open) {
      setSettings(existingConfig);
    }
  }, [existingConfig, open]);

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-lavender-100 border-2 border-purple-200 animate-fade-in animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-900">Headers & Footers</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Area Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-purple-900">Select Area</Label>
            <div className="flex gap-4">
              <div 
                className={`flex-1 backdrop-blur-lg bg-white/80 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  settings.showHeader 
                    ? 'border-[#8B70F7] shadow-[0_0_20px_rgba(139,112,247,0.4)] bg-[rgba(139,112,247,0.1)]' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSettings({ ...settings, showHeader: !settings.showHeader })}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="header"
                    checked={settings.showHeader}
                    onCheckedChange={(checked) => setSettings({ ...settings, showHeader: !!checked })}
                    className="data-[state=checked]:bg-[#8B70F7] data-[state=checked]:border-[#8B70F7]"
                  />
                  <Label htmlFor="header" className="text-base font-medium cursor-pointer text-purple-900">
                    Header
                  </Label>
                </div>
              </div>

              <div 
                className={`flex-1 backdrop-blur-lg bg-white/80 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  settings.showFooter 
                    ? 'border-[#8B70F7] shadow-[0_0_20px_rgba(139,112,247,0.4)] bg-[rgba(139,112,247,0.1)]' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSettings({ ...settings, showFooter: !settings.showFooter })}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="footer"
                    checked={settings.showFooter}
                    onCheckedChange={(checked) => setSettings({ ...settings, showFooter: !!checked })}
                    className="data-[state=checked]:bg-[#8B70F7] data-[state=checked]:border-[#8B70F7]"
                  />
                  <Label htmlFor="footer" className="text-base font-medium cursor-pointer text-purple-900">
                    Footer
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Style Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-purple-900">Layout Style</Label>
            <RadioGroup 
              value={settings.layoutStyle} 
              onValueChange={(value: 'single' | 'two' | 'three') => setSettings({ ...settings, layoutStyle: value })}
              className="space-y-3"
            >
              <div 
                className={`backdrop-blur-lg bg-white/80 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  settings.layoutStyle === 'single' 
                    ? 'border-[#8B70F7] shadow-[0_0_20px_rgba(139,112,247,0.4)] bg-[rgba(139,112,247,0.1)]' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSettings({ ...settings, layoutStyle: 'single' })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="single" id="single" className="border-[#8B70F7] text-[#8B70F7]" />
                  <Label htmlFor="single" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-purple-900">Single Row</div>
                        <div className="text-sm text-purple-700">Full-width single text area</div>
                      </div>
                      <div className="w-16 h-8 border-2 border-purple-400 rounded" />
                    </div>
                  </Label>
                </div>
              </div>

              <div 
                className={`backdrop-blur-lg bg-white/80 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  settings.layoutStyle === 'two' 
                    ? 'border-[#8B70F7] shadow-[0_0_20px_rgba(139,112,247,0.4)] bg-[rgba(139,112,247,0.1)]' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSettings({ ...settings, layoutStyle: 'two' })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="two" id="two" className="border-[#8B70F7] text-[#8B70F7]" />
                  <Label htmlFor="two" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-purple-900">Two Columns</div>
                        <div className="text-sm text-purple-700">Side by side columns</div>
                      </div>
                      <div className="w-16 h-8 flex gap-1">
                        <div className="flex-1 border-2 border-purple-400 rounded" />
                        <div className="flex-1 border-2 border-purple-400 rounded" />
                      </div>
                    </div>
                  </Label>
                </div>
              </div>

              <div 
                className={`backdrop-blur-lg bg-white/80 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  settings.layoutStyle === 'three' 
                    ? 'border-[#8B70F7] shadow-[0_0_20px_rgba(139,112,247,0.4)] bg-[rgba(139,112,247,0.1)]' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSettings({ ...settings, layoutStyle: 'three' })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="three" id="three" className="border-[#8B70F7] text-[#8B70F7]" />
                  <Label htmlFor="three" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-purple-900">Three Columns</div>
                        <div className="text-sm text-purple-700">Left, Center, Right sections</div>
                      </div>
                      <div className="w-16 h-8 flex gap-1">
                        <div className="flex-1 border-2 border-purple-400 rounded" />
                        <div className="flex-1 border-2 border-purple-400 rounded" />
                        <div className="flex-1 border-2 border-purple-400 rounded" />
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-purple-300 text-purple-900 hover:bg-purple-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-[#8f6eff] to-[#b893ff] text-white shadow-[0_0_20px_rgba(139,112,247,0.4)] hover:shadow-[0_0_25px_rgba(139,112,247,0.6)]"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
