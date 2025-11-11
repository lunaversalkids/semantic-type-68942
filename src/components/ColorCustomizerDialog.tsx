import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ColorCustomizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAKRA_COLORS = [
  { name: 'Root', light: '#FF6B6B', dark: '#FF0000', darkMode: '#8B0000' },
  { name: 'Sacral', light: '#FFA07A', dark: '#FF7F00', darkMode: '#CC5500' },
  { name: 'Solar Plexus', light: '#FFE66D', dark: '#FFFF00', darkMode: '#B8860B' },
  { name: 'Heart', light: '#90EE90', dark: '#00FF00', darkMode: '#228B22' },
  { name: 'Throat', light: '#87CEEB', dark: '#0000FF', darkMode: '#00008B' },
  { name: 'Third Eye', light: '#9370DB', dark: '#4B0082', darkMode: '#2E0854' },
  { name: 'Crown', light: '#DDA0DD', dark: '#8A2BE2', darkMode: '#4B0082' },
];

const DEFAULT_COLORS = {
  light: '#A78BFA',
  dark: '#8B70F7'
};

export const ColorCustomizerDialog = ({ open, onOpenChange }: ColorCustomizerDialogProps) => {
  const [mode, setMode] = useState<'custom' | 'chakra' | 'default'>('default');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [customLightColor, setCustomLightColor] = useState(DEFAULT_COLORS.light);
  const [customDarkColor, setCustomDarkColor] = useState(DEFAULT_COLORS.dark);
  const [chakraMode, setChakraMode] = useState<'auto' | 'single' | 'dual'>('auto');
  const [selectedChakra1, setSelectedChakra1] = useState(0);
  const [selectedChakra2, setSelectedChakra2] = useState(1);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('docOneColorPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setMode(prefs.mode || 'default');
        setDarkModeEnabled(prefs.darkMode || false);
        setCustomLightColor(prefs.customLight || DEFAULT_COLORS.light);
        setCustomDarkColor(prefs.customDark || DEFAULT_COLORS.dark);
        setChakraMode(prefs.chakraMode || 'auto');
        setSelectedChakra1(prefs.chakra1 || 0);
        setSelectedChakra2(prefs.chakra2 || 1);
        applyColors(prefs);
      } catch (e) {
        console.error('Failed to load color preferences', e);
      }
    }
  }, []);

  const applyColors = (prefs?: any) => {
    const config = prefs || {
      mode,
      darkMode: darkModeEnabled,
      customLight: customLightColor,
      customDark: customDarkColor,
      chakraMode,
      chakra1: selectedChakra1,
      chakra2: selectedChakra2
    };

    const root = document.documentElement;

    // Helper to convert hex to HSL
    const hexToHSL = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return '253 100% 64%';
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `${h} ${s}% ${l}%`;
    };

    if (config.mode === 'default') {
      // Reset to default colors
      root.style.setProperty('--accent', '253 100% 64%');
      root.style.setProperty('--accent-2', '253 100% 56%');
      root.style.setProperty('--accent-3', '253 80% 85%');
      root.style.setProperty('--primary', '253 100% 64%');
    } else if (config.mode === 'custom') {
      // Apply custom colors
      const light = config.darkMode ? adjustForDarkMode(config.customLight) : config.customLight;
      const dark = config.darkMode ? adjustForDarkMode(config.customDark) : config.customDark;
      
      const lightHSL = hexToHSL(light);
      const darkHSL = hexToHSL(dark);
      
      root.style.setProperty('--accent', lightHSL);
      root.style.setProperty('--accent-2', darkHSL);
      root.style.setProperty('--accent-3', lightHSL);
      root.style.setProperty('--primary', lightHSL);
    } else if (config.mode === 'chakra') {
      // Apply chakra colors
      let light, dark;
      
      if (config.chakraMode === 'auto') {
        // Auto-cycle through chakra colors based on time of day
        const hour = new Date().getHours();
        const chakraIndex = Math.floor((hour / 24) * CHAKRA_COLORS.length);
        const chakra = CHAKRA_COLORS[chakraIndex];
        light = config.darkMode ? chakra.darkMode : chakra.light;
        dark = config.darkMode ? adjustForDarkMode(chakra.darkMode) : chakra.dark;
      } else if (config.chakraMode === 'single') {
        const chakra = CHAKRA_COLORS[config.chakra1];
        light = config.darkMode ? chakra.darkMode : chakra.light;
        dark = config.darkMode ? adjustForDarkMode(chakra.darkMode) : chakra.dark;
      } else {
        // Dual mode - blend two chakra colors
        const chakra1 = CHAKRA_COLORS[config.chakra1];
        const chakra2 = CHAKRA_COLORS[config.chakra2];
        light = config.darkMode ? chakra1.darkMode : chakra1.light;
        dark = config.darkMode ? chakra2.darkMode : chakra2.dark;
      }
      
      const lightHSL = hexToHSL(light);
      const darkHSL = hexToHSL(dark);
      
      root.style.setProperty('--accent', lightHSL);
      root.style.setProperty('--accent-2', darkHSL);
      root.style.setProperty('--accent-3', lightHSL);
      root.style.setProperty('--primary', lightHSL);
    }
  };

  const adjustForDarkMode = (color: string) => {
    // Convert hex to RGB and darken
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const factor = 0.6;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const handleApply = () => {
    const prefs = {
      mode,
      darkMode: darkModeEnabled,
      customLight: customLightColor,
      customDark: customDarkColor,
      chakraMode,
      chakra1: selectedChakra1,
      chakra2: selectedChakra2
    };
    
    localStorage.setItem('docOneColorPrefs', JSON.stringify(prefs));
    applyColors(prefs);
    toast.success('Color theme applied successfully');
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultPrefs = {
      mode: 'default',
      darkMode: false,
      customLight: DEFAULT_COLORS.light,
      customDark: DEFAULT_COLORS.dark,
      chakraMode: 'auto',
      chakra1: 0,
      chakra2: 1
    };
    
    setMode('default');
    setDarkModeEnabled(false);
    setCustomLightColor(DEFAULT_COLORS.light);
    setCustomDarkColor(DEFAULT_COLORS.dark);
    setChakraMode('auto');
    setSelectedChakra1(0);
    setSelectedChakra2(1);
    
    localStorage.setItem('docOneColorPrefs', JSON.stringify(defaultPrefs));
    applyColors(defaultPrefs);
    toast.success('Interface colors restored to default');
    onOpenChange(false);
  };

  // Live preview on color changes (but don't save yet)
  useEffect(() => {
    if (open) {
      applyColors();
    }
  }, [mode, darkModeEnabled, customLightColor, customDarkColor, chakraMode, selectedChakra1, selectedChakra2, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#8B7AB8]">Color Customization</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="dark-mode" className="text-base font-semibold">Dark Mode (Night Mode)</Label>
              <p className="text-sm text-muted-foreground">Optimize interface for nighttime use</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkModeEnabled}
              onCheckedChange={setDarkModeEnabled}
            />
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="custom">Custom Colors</TabsTrigger>
              <TabsTrigger value="chakra">Chakra Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="default" className="space-y-4">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Original purple gradient theme will be restored</p>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="light-color" className="text-sm font-semibold mb-2 block">Light Color</Label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="light-color"
                      type="color"
                      value={customLightColor}
                      onChange={(e) => setCustomLightColor(e.target.value)}
                      className="w-20 h-12 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customLightColor}
                      onChange={(e) => setCustomLightColor(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#A78BFA"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Controls lighter interface areas</p>
                </div>

                <div>
                  <Label htmlFor="dark-color" className="text-sm font-semibold mb-2 block">Dark Color</Label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="dark-color"
                      type="color"
                      value={customDarkColor}
                      onChange={(e) => setCustomDarkColor(e.target.value)}
                      className="w-20 h-12 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customDarkColor}
                      onChange={(e) => setCustomDarkColor(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#8B70F7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Controls darker interface areas</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chakra" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-semibold">Chakra Mode:</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={chakraMode === 'auto' ? 'default' : 'outline'}
                      onClick={() => setChakraMode('auto')}
                    >
                      Auto-Cycle
                    </Button>
                    <Button
                      size="sm"
                      variant={chakraMode === 'single' ? 'default' : 'outline'}
                      onClick={() => setChakraMode('single')}
                    >
                      Single
                    </Button>
                    <Button
                      size="sm"
                      variant={chakraMode === 'dual' ? 'default' : 'outline'}
                      onClick={() => setChakraMode('dual')}
                    >
                      Dual
                    </Button>
                  </div>
                </div>

                {chakraMode === 'auto' && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Interface will automatically cycle through all 7 chakra colors throughout the day
                    </p>
                  </div>
                )}

                {chakraMode === 'single' && (
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Select Chakra Color</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {CHAKRA_COLORS.map((chakra, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedChakra1(idx)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            selectedChakra1 === idx ? 'border-primary shadow-lg scale-105' : 'border-transparent hover:border-border'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: darkModeEnabled ? chakra.darkMode : chakra.light }}
                          />
                          <span className="text-xs font-medium text-center">{chakra.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chakraMode === 'dual' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">First Chakra Color (Light)</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {CHAKRA_COLORS.map((chakra, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedChakra1(idx)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                              selectedChakra1 === idx ? 'border-primary shadow-lg' : 'border-transparent hover:border-border'
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: darkModeEnabled ? chakra.darkMode : chakra.light }}
                            />
                            <span className="text-[10px] font-medium text-center">{chakra.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Second Chakra Color (Dark)</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {CHAKRA_COLORS.map((chakra, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedChakra2(idx)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                              selectedChakra2 === idx ? 'border-primary shadow-lg' : 'border-transparent hover:border-border'
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: darkModeEnabled ? chakra.darkMode : chakra.dark }}
                            />
                            <span className="text-[10px] font-medium text-center">{chakra.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset to Default
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-gradient-to-r from-[#8B70F7] to-[#A78BFA] hover:from-[#7C5FE6] hover:to-[#9670E6]">
              Apply Colors
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
