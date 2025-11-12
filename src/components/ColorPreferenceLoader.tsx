import { useEffect } from 'react';

const DEFAULT_COLORS = {
  light: '#A78BFA',
  dark: '#8B70F7'
};

const CHAKRA_COLORS = [
  { name: 'Root', light: '#FF6B6B', dark: '#FF0000', darkMode: '#8B0000' },
  { name: 'Sacral', light: '#FFA07A', dark: '#FF7F00', darkMode: '#CC5500' },
  { name: 'Solar Plexus', light: '#FFE66D', dark: '#FFFF00', darkMode: '#B8860B' },
  { name: 'Heart', light: '#90EE90', dark: '#00FF00', darkMode: '#228B22' },
  { name: 'Throat', light: '#87CEEB', dark: '#0000FF', darkMode: '#00008B' },
  { name: 'Third Eye', light: '#9370DB', dark: '#4B0082', darkMode: '#2E0854' },
  { name: 'Crown', light: '#DDA0DD', dark: '#8A2BE2', darkMode: '#4B0082' },
];

export const ColorPreferenceLoader = () => {
  useEffect(() => {
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

    const adjustForDarkMode = (color: string) => {
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

    const applyColors = (config: any) => {
      const root = document.documentElement;

      if (config.mode === 'default') {
        root.style.setProperty('--accent', '253 100% 64%');
        root.style.setProperty('--accent-2', '253 100% 56%');
        root.style.setProperty('--accent-3', '253 80% 85%');
        root.style.setProperty('--primary', '253 100% 64%');
        root.style.setProperty('--ring', '253 100% 64%');
        root.style.setProperty('--sidebar-primary', '253 100% 64%');
        root.style.setProperty('--sidebar-ring', '253 100% 64%');
      } else if (config.mode === 'custom') {
        const light = config.darkMode ? adjustForDarkMode(config.customLight) : config.customLight;
        const dark = config.darkMode ? adjustForDarkMode(config.customDark) : config.customDark;
        
        const lightHSL = hexToHSL(light);
        const darkHSL = hexToHSL(dark);
        
        root.style.setProperty('--accent', lightHSL);
        root.style.setProperty('--accent-2', darkHSL);
        root.style.setProperty('--accent-3', lightHSL);
        root.style.setProperty('--primary', lightHSL);
        root.style.setProperty('--ring', lightHSL);
        root.style.setProperty('--sidebar-primary', lightHSL);
        root.style.setProperty('--sidebar-ring', lightHSL);
      } else if (config.mode === 'chakra') {
        let light, dark;
        
        if (config.chakraMode === 'auto') {
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
        root.style.setProperty('--ring', lightHSL);
        root.style.setProperty('--sidebar-primary', lightHSL);
        root.style.setProperty('--sidebar-ring', lightHSL);
      }
    };

    // Load and apply saved color preferences
    const saved = localStorage.getItem('docOneColorPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        applyColors(prefs);
      } catch (e) {
        console.error('Failed to load color preferences', e);
        // Apply defaults on error
        applyColors({
          mode: 'default',
          darkMode: false,
          customLight: DEFAULT_COLORS.light,
          customDark: DEFAULT_COLORS.dark,
          chakraMode: 'auto',
          chakra1: 0,
          chakra2: 1
        });
      }
    }
  }, []);

  return null;
};
