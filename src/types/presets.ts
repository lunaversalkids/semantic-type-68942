export interface PresetFormatting {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  rulerPosition: number;
  headerFormat: {
    font: string;
    size: number;
    weight: number;
    alignment: 'left' | 'center' | 'right';
  };
  chapterTitleFormat: {
    font: string;
    size: number;
    weight: number;
    alignment: 'left' | 'center' | 'right';
    spacing: number;
  };
  bodyFormat: {
    font: string;
    size: number;
    lineHeight: number;
    paragraphSpacing: number;
    firstLineIndent: number;
  };
  sectionBreak: {
    style: 'asterisk' | 'line' | 'space' | 'ornament';
    spacing: number;
  };
  pageSize: {
    width: number;
    height: number;
    name: string;
  };
}

export interface PresetVariation {
  id: string;
  name: string;
  formatting: PresetFormatting;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  variations?: PresetVariation[];
  formatting: PresetFormatting;
}

export interface PresetCategory {
  id: string;
  name: string;
  icon: string;
  presets: Preset[];
}

export const defaultFormatting: PresetFormatting = {
  margins: { top: 1, bottom: 1, left: 1, right: 1 },
  rulerPosition: 1,
  headerFormat: {
    font: 'Inter',
    size: 12,
    weight: 400,
    alignment: 'center',
  },
  chapterTitleFormat: {
    font: 'Inter',
    size: 24,
    weight: 700,
    alignment: 'center',
    spacing: 2,
  },
  bodyFormat: {
    font: 'Inter',
    size: 16,
    lineHeight: 1.6,
    paragraphSpacing: 1,
    firstLineIndent: 0,
  },
  sectionBreak: {
    style: 'space',
    spacing: 2,
  },
  pageSize: {
    width: 8.5,
    height: 11,
    name: 'Letter',
  },
};

export const presetCategories: PresetCategory[] = [
  {
    id: 'novel',
    name: 'Novel',
    icon: '📖',
    presets: [
      {
        id: 'fantasy-novel',
        name: 'Fantasy Novel',
        description: 'Epic fantasy with decorative chapter headings',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Georgia',
            size: 28,
            weight: 700,
            alignment: 'center',
            spacing: 3,
          },
          bodyFormat: {
            font: 'Georgia',
            size: 14,
            lineHeight: 1.8,
            paragraphSpacing: 0.5,
            firstLineIndent: 0.5,
          },
          sectionBreak: {
            style: 'ornament',
            spacing: 2,
          },
        },
      },
      {
        id: 'superhero-novel',
        name: 'Superhero Novel',
        description: 'Bold, dynamic formatting for action-packed stories',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Inter',
            size: 32,
            weight: 900,
            alignment: 'left',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Inter',
            size: 15,
            lineHeight: 1.7,
            paragraphSpacing: 0.8,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'line',
            spacing: 1.5,
          },
        },
      },
      {
        id: 'romance-novel',
        name: 'Romance Novel',
        description: 'Elegant, flowing typography for romantic narratives',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Playfair Display',
            size: 26,
            weight: 600,
            alignment: 'center',
            spacing: 2.5,
          },
          bodyFormat: {
            font: 'Merriweather',
            size: 14,
            lineHeight: 1.9,
            paragraphSpacing: 0.6,
            firstLineIndent: 0.5,
          },
          sectionBreak: {
            style: 'asterisk',
            spacing: 2,
          },
        },
      },
      {
        id: 'mystery-novel',
        name: 'Mystery Novel',
        description: 'Sharp, suspenseful formatting with tight spacing',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Courier New',
            size: 24,
            weight: 700,
            alignment: 'left',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Georgia',
            size: 13,
            lineHeight: 1.6,
            paragraphSpacing: 0.4,
            firstLineIndent: 0.4,
          },
          sectionBreak: {
            style: 'line',
            spacing: 1,
          },
        },
      },
    ],
  },
  {
    id: 'textbook',
    name: 'Textbook',
    icon: '📚',
    presets: [
      {
        id: 'academic-textbook',
        name: 'Academic Textbook',
        description: 'Professional layout for educational content',
        formatting: {
          ...defaultFormatting,
          margins: { top: 1.5, bottom: 1.5, left: 1.25, right: 1.25 },
          chapterTitleFormat: {
            font: 'Inter',
            size: 30,
            weight: 800,
            alignment: 'left',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Inter',
            size: 14,
            lineHeight: 1.7,
            paragraphSpacing: 1,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'line',
            spacing: 2,
          },
        },
      },
      {
        id: 'study-guide',
        name: 'Study Guide',
        description: 'Compact format with clear section breaks',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Inter',
            size: 22,
            weight: 700,
            alignment: 'left',
            spacing: 1.5,
          },
          bodyFormat: {
            font: 'Inter',
            size: 13,
            lineHeight: 1.6,
            paragraphSpacing: 0.8,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'space',
            spacing: 1.5,
          },
        },
      },
    ],
  },
  {
    id: 'recipe',
    name: 'Recipe',
    icon: '🍳',
    presets: [
      {
        id: 'cookbook',
        name: 'Cookbook',
        description: 'Clean, structured format for recipes',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Inter',
            size: 28,
            weight: 700,
            alignment: 'center',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Inter',
            size: 14,
            lineHeight: 1.8,
            paragraphSpacing: 1.2,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'line',
            spacing: 2,
          },
        },
      },
    ],
  },
  {
    id: 'documentary',
    name: 'Documentary',
    icon: '🎬',
    presets: [
      {
        id: 'documentary-script',
        name: 'Documentary Script',
        description: 'Professional script format',
        formatting: {
          ...defaultFormatting,
          margins: { top: 1, bottom: 1, left: 1.5, right: 1 },
          chapterTitleFormat: {
            font: 'Courier New',
            size: 24,
            weight: 700,
            alignment: 'left',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Courier New',
            size: 12,
            lineHeight: 2,
            paragraphSpacing: 1,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'line',
            spacing: 2,
          },
        },
      },
    ],
  },
  {
    id: 'screenplay',
    name: 'Screenplay',
    icon: '🎭',
    presets: [
      {
        id: 'feature-screenplay',
        name: 'Feature Screenplay',
        description: 'Standard Hollywood screenplay format',
        formatting: {
          ...defaultFormatting,
          margins: { top: 1, bottom: 0.5, left: 1.5, right: 1 },
          chapterTitleFormat: {
            font: 'Courier New',
            size: 12,
            weight: 700,
            alignment: 'center',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Courier New',
            size: 12,
            lineHeight: 2,
            paragraphSpacing: 0,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'space',
            spacing: 2,
          },
          pageSize: {
            width: 8.5,
            height: 11,
            name: 'Letter',
          },
        },
      },
    ],
  },
  {
    id: 'manual',
    name: 'Manual',
    icon: '📘',
    presets: [
      {
        id: 'technical-manual',
        name: 'Technical Manual',
        description: 'Clear, structured format for instructions',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Inter',
            size: 26,
            weight: 700,
            alignment: 'left',
            spacing: 2,
          },
          bodyFormat: {
            font: 'Inter',
            size: 13,
            lineHeight: 1.7,
            paragraphSpacing: 1,
            firstLineIndent: 0,
          },
          sectionBreak: {
            style: 'line',
            spacing: 1.5,
          },
        },
      },
    ],
  },
  {
    id: 'biography',
    name: 'Biography',
    icon: '👤',
    presets: [
      {
        id: 'life-story',
        name: 'Life Story',
        description: 'Elegant format for biographical narratives',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Georgia',
            size: 26,
            weight: 600,
            alignment: 'center',
            spacing: 2.5,
          },
          bodyFormat: {
            font: 'Georgia',
            size: 14,
            lineHeight: 1.8,
            paragraphSpacing: 0.8,
            firstLineIndent: 0.5,
          },
          sectionBreak: {
            style: 'space',
            spacing: 2,
          },
        },
      },
    ],
  },
  {
    id: 'journal',
    name: 'Journal',
    icon: '📔',
    presets: [
      {
        id: 'personal-journal',
        name: 'Personal Journal',
        description: 'Intimate, handwritten-style format',
        formatting: {
          ...defaultFormatting,
          chapterTitleFormat: {
            font: 'Georgia',
            size: 22,
            weight: 600,
            alignment: 'left',
            spacing: 1.5,
          },
          bodyFormat: {
            font: 'Georgia',
            size: 13,
            lineHeight: 1.8,
            paragraphSpacing: 1,
            firstLineIndent: 0.3,
          },
          sectionBreak: {
            style: 'asterisk',
            spacing: 2,
          },
        },
      },
    ],
  },
  {
    id: 'scripture',
    name: 'Scripture',
    icon: '✝️',
    presets: [
      {
        id: 'biblical-text',
        name: 'Biblical Text',
        description: 'Traditional scripture formatting',
        formatting: {
          ...defaultFormatting,
          margins: { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 },
          chapterTitleFormat: {
            font: 'Georgia',
            size: 24,
            weight: 700,
            alignment: 'center',
            spacing: 3,
          },
          bodyFormat: {
            font: 'Georgia',
            size: 13,
            lineHeight: 1.6,
            paragraphSpacing: 0.5,
            firstLineIndent: 0.4,
          },
          sectionBreak: {
            style: 'ornament',
            spacing: 2.5,
          },
        },
      },
    ],
  },
];
