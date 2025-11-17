export interface PresetFormatting {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
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
  pageSize: 'letter' | 'a4' | 'legal';
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
  }
];
