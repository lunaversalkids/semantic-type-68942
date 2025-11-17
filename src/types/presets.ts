export interface PresetFormatting {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginInside?: number; // For binding side (inside margin)
  marginOutside?: number; // For outer edge
  lineHeight: number;
  paragraphSpacing: number;
  indentFirstLine: boolean;
  indentSize: number;
  fontSize: number;
  fontFamily: string;
  headerFormat?: {
    fontSize: number;
    alignment: 'left' | 'center' | 'right';
    spacing: number;
  };
  chapterTitleFormat?: {
    fontSize: number;
    fontWeight: number;
    alignment: 'left' | 'center' | 'right';
    spacing: number;
  };
  pageSize: 'letter' | 'a4' | 'legal' | 'custom';
  pageWidth?: number; // In inches (for custom sizes)
  pageHeight?: number; // In inches (for custom sizes)
  chapterStartPosition?: number; // Distance from top in inches
  dropCap?: boolean; // First letter styling
  runningHeader?: boolean; // Running header with page numbers
  sectionBreaks?: boolean; // Section breaks between chapters
}

export interface PresetVariation {
  id: string;
  name: string;
  formatting: PresetFormatting;
}

export interface Preset {
  id: string;
  name: string;
  variations: PresetVariation[];
}

export interface PresetCategory {
  id: string;
  name: string;
  presets: Preset[];
}

export const presetCategories: PresetCategory[] = [
  {
    id: 'novel',
    name: 'Novel',
    presets: [
      {
        id: 'fantasy',
        name: 'Fantasy Novel',
        variations: [
          {
            id: 'fantasy-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          },
          {
            id: 'fantasy-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'romance',
        name: 'Romance Novel',
        variations: [
          {
            id: 'romance-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'mystery',
        name: 'Mystery Novel',
        variations: [
          {
            id: 'mystery-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Courier New',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'superhero',
        name: 'Superhero Novel',
        variations: [
          {
            id: 'superhero-action',
            name: 'Action',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'scifi',
        name: 'Science Fiction Novel',
        variations: [
          {
            id: 'scifi-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'thriller',
        name: 'Thriller Novel',
        variations: [
          {
            id: 'thriller-intense',
            name: 'Intense',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'horror',
        name: 'Horror Novel',
        variations: [
          {
            id: 'horror-dark',
            name: 'Dark',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'historical',
        name: 'Historical Fiction Novel',
        variations: [
          {
            id: 'historical-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'adventure',
        name: 'Adventure Novel',
        variations: [
          {
            id: 'adventure-action',
            name: 'Action',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'contemporary',
        name: 'Contemporary Fiction Novel',
        variations: [
          {
            id: 'contemporary-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'literary',
        name: 'Literary Fiction Novel',
        variations: [
          {
            id: 'literary-elegant',
            name: 'Elegant',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ya',
        name: 'Young Adult (YA) Novel',
        variations: [
          {
            id: 'ya-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'dystopian',
        name: 'Dystopian Novel',
        variations: [
          {
            id: 'dystopian-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'new-adult',
        name: 'New Adult Novel',
        variations: [
          {
            id: 'new-adult-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'post-apocalyptic',
        name: 'Post-Apocalyptic Novel',
        variations: [
          {
            id: 'post-apocalyptic-gritty',
            name: 'Gritty',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'high-fantasy',
        name: 'High Fantasy',
        variations: [
          {
            id: 'high-fantasy-epic',
            name: 'Epic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'center',
                spacing: 28
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'urban-fantasy',
        name: 'Urban Fantasy',
        variations: [
          {
            id: 'urban-fantasy-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'dark-fantasy',
        name: 'Dark Fantasy',
        variations: [
          {
            id: 'dark-fantasy-gothic',
            name: 'Gothic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'mythic-fantasy',
        name: 'Mythic Fantasy',
        variations: [
          {
            id: 'mythic-fantasy-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'portal-fantasy',
        name: 'Portal Fantasy',
        variations: [
          {
            id: 'portal-fantasy-adventure',
            name: 'Adventure',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'sword-sorcery',
        name: 'Sword & Sorcery',
        variations: [
          {
            id: 'sword-sorcery-action',
            name: 'Action',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'fairytale-retelling',
        name: 'Fairy-Tale Retelling',
        variations: [
          {
            id: 'fairytale-retelling-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        variations: [
          {
            id: 'cyberpunk-neon',
            name: 'Neon',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Courier New',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'space-opera',
        name: 'Space Opera',
        variations: [
          {
            id: 'space-opera-epic',
            name: 'Epic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'time-travel',
        name: 'Time Travel',
        variations: [
          {
            id: 'time-travel-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'biopunk',
        name: 'Biopunk / Genetic Sci-Fi',
        variations: [
          {
            id: 'biopunk-clinical',
            name: 'Clinical',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ai-robotics',
        name: 'AI / Robotics Sci-Fi',
        variations: [
          {
            id: 'ai-robotics-technical',
            name: 'Technical',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'hard-scifi',
        name: 'Hard Sci-Fi',
        variations: [
          {
            id: 'hard-scifi-technical',
            name: 'Technical',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'cozy-mystery',
        name: 'Cozy Mystery',
        variations: [
          {
            id: 'cozy-mystery-charming',
            name: 'Charming',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 600,
                alignment: 'center',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'detective-mystery',
        name: 'Detective Mystery',
        variations: [
          {
            id: 'detective-mystery-noir',
            name: 'Noir',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Courier New',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'crime-thriller-mystery',
        name: 'Crime Thriller',
        variations: [
          {
            id: 'crime-thriller-mystery-intense',
            name: 'Intense',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'paranormal-mystery',
        name: 'Paranormal Mystery',
        variations: [
          {
            id: 'paranormal-mystery-supernatural',
            name: 'Supernatural',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'contemporary-romance',
        name: 'Contemporary Romance',
        variations: [
          {
            id: 'contemporary-romance-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'fantasy-romance',
        name: 'Fantasy Romance',
        variations: [
          {
            id: 'fantasy-romance-enchanting',
            name: 'Enchanting',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 600,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'paranormal-romance',
        name: 'Paranormal Romance',
        variations: [
          {
            id: 'paranormal-romance-sensual',
            name: 'Sensual',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'historical-romance',
        name: 'Historical Romance',
        variations: [
          {
            id: 'historical-romance-regency',
            name: 'Regency',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'dark-romance',
        name: 'Dark Romance',
        variations: [
          {
            id: 'dark-romance-intense',
            name: 'Intense',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'psychological-thriller',
        name: 'Psychological Thriller',
        variations: [
          {
            id: 'psychological-thriller-suspenseful',
            name: 'Suspenseful',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'crime-thriller',
        name: 'Crime Thriller',
        variations: [
          {
            id: 'crime-thriller-gritty',
            name: 'Gritty',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'espionage-thriller',
        name: 'Espionage Thriller',
        variations: [
          {
            id: 'espionage-thriller-tactical',
            name: 'Tactical',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'techno-thriller',
        name: 'Techno-Thriller',
        variations: [
          {
            id: 'techno-thriller-digital',
            name: 'Digital',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'paranormal-horror',
        name: 'Paranormal Horror',
        variations: [
          {
            id: 'paranormal-horror-haunting',
            name: 'Haunting',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'gothic-horror',
        name: 'Gothic Horror',
        variations: [
          {
            id: 'gothic-horror-atmospheric',
            name: 'Atmospheric',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'creature-horror',
        name: 'Creature Horror',
        variations: [
          {
            id: 'creature-horror-visceral',
            name: 'Visceral',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'psychological-horror',
        name: 'Psychological Horror',
        variations: [
          {
            id: 'psychological-horror-unsettling',
            name: 'Unsettling',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'war-historical',
        name: 'War',
        variations: [
          {
            id: 'war-historical-epic',
            name: 'Epic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ancient-classical',
        name: 'Ancient / Classical',
        variations: [
          {
            id: 'ancient-classical-scholarly',
            name: 'Scholarly',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'medieval',
        name: 'Medieval',
        variations: [
          {
            id: 'medieval-period',
            name: 'Period',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 600,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'victorian',
        name: 'Victorian',
        variations: [
          {
            id: 'victorian-elegant',
            name: 'Elegant',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'early-american',
        name: 'Early American',
        variations: [
          {
            id: 'early-american-colonial',
            name: 'Colonial',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ya-fantasy',
        name: 'YA Fantasy',
        variations: [
          {
            id: 'ya-fantasy-modern',
            name: 'Modern',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ya-scifi',
        name: 'YA Sci-Fi',
        variations: [
          {
            id: 'ya-scifi-futuristic',
            name: 'Futuristic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ya-romance',
        name: 'YA Romance',
        variations: [
          {
            id: 'ya-romance-heartfelt',
            name: 'Heartfelt',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'ya-dystopian',
        name: 'YA Dystopian',
        variations: [
          {
            id: 'ya-dystopian-rebellion',
            name: 'Rebellion',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: '6x9-manuscript',
        name: '6×9 Novel Manuscript',
        variations: [
          {
            id: '6x9-manuscript-print',
            name: 'Print Ready',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: '5x8-booklet',
        name: '5×8 Fiction Booklet',
        variations: [
          {
            id: '5x8-booklet-standard',
            name: 'Standard',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: '5-06x7-81-outline',
        name: '5.06×7.81 Novel Outline',
        variations: [
          {
            id: '5-06x7-81-outline-compact',
            name: 'Compact',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'center',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'beautiful-interior',
        name: 'Beautiful Novel Interior',
        variations: [
          {
            id: 'beautiful-interior-elegant',
            name: 'Elegant',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 28
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'classic-novel',
        name: 'Classic Novel Writing',
        variations: [
          {
            id: 'classic-novel-traditional',
            name: 'Traditional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'kdp-paperback-6x9',
        name: 'Amazon KDP Paperback 6×9',
        variations: [
          {
            id: 'kdp-paperback-6x9-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'fiction-layout-5-5x8-5',
        name: 'Fiction Layout 5.5×8.5 Digest',
        variations: [
          {
            id: 'fiction-layout-5-5x8-5-digest',
            name: 'Digest',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'center',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'easy-6x9',
        name: 'Easy-to-Use 6×9 Format',
        variations: [
          {
            id: 'easy-6x9-simple',
            name: 'Simple',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'modern-interior-5-5x8-5',
        name: 'Modern Interior 5.5×8.5',
        variations: [
          {
            id: 'modern-interior-5-5x8-5-contemporary',
            name: 'Contemporary',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'clean-interior-6x9',
        name: 'Clean Interior 6×9',
        variations: [
          {
            id: 'clean-interior-6x9-minimal',
            name: 'Minimal',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 22
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'premium-6x9',
        name: 'Premium 6×9 Template',
        variations: [
          {
            id: 'premium-6x9-professional',
            name: 'Professional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 26
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'standard-6x9',
        name: 'Standard 6×9 Template',
        variations: [
          {
            id: 'standard-6x9-basic',
            name: 'Basic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'editable-5x8',
        name: '5×8 Editable Template',
        variations: [
          {
            id: 'editable-5x8-flexible',
            name: 'Flexible',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'center',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'professional-looking',
        name: 'Professional-Looking Template',
        variations: [
          {
            id: 'professional-looking-polished',
            name: 'Polished',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'textbook',
    name: 'Textbook',
    presets: [
      {
        id: 'academic',
        name: 'Academic Textbook',
        variations: [
          {
            id: 'academic-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.5,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Times New Roman',
              headerFormat: {
                fontSize: 10,
                alignment: 'center',
                spacing: 0
              },
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'technical',
        name: 'Technical Manual',
        variations: [
          {
            id: 'technical-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.4,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'professional-textbook',
        name: 'Professional Textbook',
        variations: [
          {
            id: 'professional-textbook-layout',
            name: 'Professional Layout',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.5,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'non-fiction',
    name: 'Non-Fiction',
    presets: [
      {
        id: 'nonfiction-8-5x11',
        name: '8.5×11 Nonfiction Outline',
        variations: [
          {
            id: 'nonfiction-8-5x11-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'nonfiction-6x9',
        name: '6×9 Non Fiction',
        variations: [
          {
            id: 'nonfiction-6x9-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'nonfiction-5-5x8-5',
        name: 'Best Non-Fiction 5.5×8.5',
        variations: [
          {
            id: 'nonfiction-5-5x8-5-modern',
            name: 'Modern',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: '7-5x10-book',
        name: '7.5×10 Book Template',
        variations: [
          {
            id: '7-5x10-book-large',
            name: 'Large Format',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'kdp-5-5x8-5',
        name: '5.5×8.5 KDP Template',
        variations: [
          {
            id: 'kdp-5-5x8-5-ebook',
            name: 'eBook',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'manuscript-8-5x11',
        name: 'Book Manuscript 8.5×11',
        variations: [
          {
            id: 'manuscript-8-5x11-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'kdp-6-69x9-61',
        name: 'KDP Template 6.69×9.61',
        variations: [
          {
            id: 'kdp-6-69x9-61-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'a4'
            }
          }
        ]
      },
      {
        id: '5-25x8-print',
        name: '5.25×8 Print Template',
        variations: [
          {
            id: '5-25x8-print-standard',
            name: 'Standard',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 700,
                alignment: 'center',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'reports',
    name: 'Reports',
    presets: [
      {
        id: 'business-report',
        name: 'Business Report',
        variations: [
          {
            id: 'business-report-professional',
            name: 'Professional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.5,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'recipe',
    name: 'Recipe',
    presets: [
      {
        id: 'cookbook',
        name: 'Cookbook',
        variations: [
          {
            id: 'cookbook-classic',
            name: 'Classic',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 14,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'documentary',
    name: 'Documentary',
    presets: [
      {
        id: 'script',
        name: 'Documentary Script',
        variations: [
          {
            id: 'script-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.5,
              marginRight: 1,
              lineHeight: 2,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 12,
              fontFamily: 'Courier',
              chapterTitleFormat: {
                fontSize: 12,
                fontWeight: 700,
                alignment: 'left',
                spacing: 12
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'screenplay',
    name: 'Screenplay',
    presets: [
      {
        id: 'feature',
        name: 'Feature Film',
        variations: [
          {
            id: 'feature-standard',
            name: 'Industry Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.5,
              marginRight: 1,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 12,
              fontFamily: 'Courier',
              chapterTitleFormat: {
                fontSize: 12,
                fontWeight: 700,
                alignment: 'center',
                spacing: 12
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'manual',
    name: 'Manual',
    presets: [
      {
        id: 'user-guide',
        name: 'User Guide',
        variations: [
          {
            id: 'user-guide-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.5,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'syllabus',
        name: 'Syllabus Manual',
        variations: [
          {
            id: 'syllabus-academic',
            name: 'Academic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.5,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Calibri',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 18
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'biography',
    name: 'Biography',
    presets: [
      {
        id: 'memoir',
        name: 'Memoir',
        variations: [
          {
            id: 'memoir-classic',
            name: 'Classic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 600,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'autobiography',
        name: 'Professional Autobiography',
        variations: [
          {
            id: 'autobiography-professional',
            name: 'Professional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'journal',
    name: 'Journal',
    presets: [
      {
        id: 'personal',
        name: 'Personal Journal',
        variations: [
          {
            id: 'personal-casual',
            name: 'Casual',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 1,
              marginRight: 1,
              lineHeight: 1.6,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 14,
                fontWeight: 600,
                alignment: 'left',
                spacing: 16
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'scripture',
    name: 'Scripture',
    presets: [
      {
        id: 'biblical',
        name: 'Biblical Text',
        variations: [
          {
            id: 'biblical-traditional',
            name: 'Traditional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.5,
              marginRight: 1.5,
              lineHeight: 1.8,
              paragraphSpacing: 8,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'childrens-books',
    name: "Children's Books",
    presets: [
      {
        id: 'picture-book',
        name: '32 Page Picture Book',
        variations: [
          {
            id: 'picture-book-standard',
            name: 'Standard Layout',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.75,
              marginRight: 0.75,
              lineHeight: 1.8,
              paragraphSpacing: 16,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 14,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 22,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'letter'
            }
          }
        ]
      },
      {
        id: 'kids-story',
        name: 'Kids Story Book',
        variations: [
          {
            id: 'kids-story-modern',
            name: 'Modern',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.75,
              marginRight: 0.75,
              lineHeight: 2,
              paragraphSpacing: 14,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 13,
              fontFamily: 'Comic Sans MS',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'center',
                spacing: 20
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'book-covers',
    name: 'Book Covers',
    presets: [
      {
        id: '6x9-cover',
        name: '6×9 Book Cover',
        variations: [
          {
            id: '6x9-cover-standard',
            name: 'Standard',
            formatting: {
              marginTop: 0.5,
              marginBottom: 0.5,
              marginLeft: 0.5,
              marginRight: 0.5,
              lineHeight: 1.5,
              paragraphSpacing: 0,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 12,
              fontFamily: 'Arial',
              chapterTitleFormat: {
                fontSize: 24,
                fontWeight: 700,
                alignment: 'center',
                spacing: 12
              },
              pageSize: 'letter'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'professional-templates',
    name: 'Professional Book Templates',
    presets: [
      {
        id: '6x9-standard',
        name: '6×9 Standard Book',
        variations: [
          {
            id: '6x9-classic',
            name: 'Classic',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.75,
              marginRight: 0.75,
              marginInside: 0.875,
              marginOutside: 0.625,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 22,
                fontWeight: 700,
                alignment: 'center',
                spacing: 36
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 2.5,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: true
            }
          },
          {
            id: '6x9-modern',
            name: 'Modern',
            formatting: {
              marginTop: 0.875,
              marginBottom: 0.875,
              marginLeft: 0.75,
              marginRight: 0.75,
              marginInside: 1,
              marginOutside: 0.75,
              lineHeight: 1.6,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 600,
                alignment: 'left',
                spacing: 28
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 2,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: false
            }
          },
          {
            id: '6x9-premium',
            name: 'Premium',
            formatting: {
              marginTop: 0.875,
              marginBottom: 0.875,
              marginLeft: 0.875,
              marginRight: 0.875,
              marginInside: 1.125,
              marginOutside: 0.75,
              lineHeight: 1.8,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 24,
                fontWeight: 700,
                alignment: 'center',
                spacing: 42
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 3,
              dropCap: true,
              runningHeader: true,
              sectionBreaks: true
            }
          }
        ]
      },
      {
        id: '6x9-manuscript',
        name: '6×9 Manuscript',
        variations: [
          {
            id: '6x9-manuscript-standard',
            name: 'Standard',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              marginInside: 1.25,
              marginOutside: 1,
              lineHeight: 2,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 2,
              dropCap: false,
              runningHeader: false,
              sectionBreaks: true
            }
          }
        ]
      },
      {
        id: '6x9-kdp',
        name: '6×9 KDP Paperback',
        variations: [
          {
            id: '6x9-kdp-standard',
            name: 'Standard',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.75,
              marginRight: 0.75,
              marginInside: 0.875,
              marginOutside: 0.625,
              lineHeight: 1.5,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.5,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'center',
                spacing: 32
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 2.25,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: true
            }
          },
          {
            id: '6x9-kdp-compact',
            name: 'Compact',
            formatting: {
              marginTop: 0.625,
              marginBottom: 0.625,
              marginLeft: 0.625,
              marginRight: 0.625,
              marginInside: 0.75,
              marginOutside: 0.5,
              lineHeight: 1.4,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.4,
              fontSize: 10,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 28
              },
              pageSize: 'custom',
              pageWidth: 6,
              pageHeight: 9,
              chapterStartPosition: 2,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: false
            }
          }
        ]
      },
      {
        id: '5.5x8.5-digest',
        name: '5.5×8.5 Digest',
        variations: [
          {
            id: '5.5x8.5-novel',
            name: 'Novel',
            formatting: {
              marginTop: 0.625,
              marginBottom: 0.625,
              marginLeft: 0.625,
              marginRight: 0.625,
              marginInside: 0.75,
              marginOutside: 0.5,
              lineHeight: 1.5,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.4,
              fontSize: 11,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'center',
                spacing: 28
              },
              pageSize: 'custom',
              pageWidth: 5.5,
              pageHeight: 8.5,
              chapterStartPosition: 2,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: true
            }
          },
          {
            id: '5.5x8.5-nonfiction',
            name: 'Non-Fiction',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.625,
              marginRight: 0.625,
              marginInside: 0.875,
              marginOutside: 0.625,
              lineHeight: 1.6,
              paragraphSpacing: 6,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'custom',
              pageWidth: 5.5,
              pageHeight: 8.5,
              chapterStartPosition: 1.5,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: false
            }
          },
          {
            id: '5.5x8.5-modern',
            name: 'Modern Interior',
            formatting: {
              marginTop: 0.75,
              marginBottom: 0.75,
              marginLeft: 0.75,
              marginRight: 0.75,
              marginInside: 0.875,
              marginOutside: 0.625,
              lineHeight: 1.5,
              paragraphSpacing: 8,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 10,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 600,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'custom',
              pageWidth: 5.5,
              pageHeight: 8.5,
              chapterStartPosition: 1.75,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: false
            }
          }
        ]
      },
      {
        id: '8.5x11-textbook',
        name: '8.5×11 Textbook',
        variations: [
          {
            id: '8.5x11-professional',
            name: 'Professional',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1,
              marginRight: 1,
              marginInside: 1.25,
              marginOutside: 1,
              lineHeight: 1.5,
              paragraphSpacing: 10,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 11,
              fontFamily: 'Georgia',
              chapterTitleFormat: {
                fontSize: 20,
                fontWeight: 700,
                alignment: 'left',
                spacing: 24
              },
              pageSize: 'letter',
              chapterStartPosition: 1.5,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: false
            }
          },
          {
            id: '8.5x11-academic',
            name: 'Academic',
            formatting: {
              marginTop: 1,
              marginBottom: 1,
              marginLeft: 1.25,
              marginRight: 1.25,
              marginInside: 1.5,
              marginOutside: 1,
              lineHeight: 1.8,
              paragraphSpacing: 12,
              indentFirstLine: false,
              indentSize: 0,
              fontSize: 12,
              fontFamily: 'Times New Roman',
              chapterTitleFormat: {
                fontSize: 18,
                fontWeight: 700,
                alignment: 'left',
                spacing: 20
              },
              pageSize: 'letter',
              chapterStartPosition: 1.5,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: true
            }
          }
        ]
      },
      {
        id: '5.06x7.81-compact',
        name: '5.06×7.81 Compact Novel',
        variations: [
          {
            id: '5.06x7.81-standard',
            name: 'Standard',
            formatting: {
              marginTop: 0.625,
              marginBottom: 0.625,
              marginLeft: 0.5,
              marginRight: 0.5,
              marginInside: 0.625,
              marginOutside: 0.5,
              lineHeight: 1.5,
              paragraphSpacing: 0,
              indentFirstLine: true,
              indentSize: 0.4,
              fontSize: 10,
              fontFamily: 'Garamond',
              chapterTitleFormat: {
                fontSize: 16,
                fontWeight: 700,
                alignment: 'center',
                spacing: 24
              },
              pageSize: 'custom',
              pageWidth: 5.06,
              pageHeight: 7.81,
              chapterStartPosition: 1.75,
              dropCap: false,
              runningHeader: true,
              sectionBreaks: true
            }
          }
        ]
      }
    ]
  }
];
