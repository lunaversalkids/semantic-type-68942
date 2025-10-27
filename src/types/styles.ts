export interface TextStyle {
  id: string;
  name: string;
  tag?: string;
  font?: string;
  size?: number;
  weight?: number;
  italic?: boolean;
  color?: string;
  superscript?: boolean;
  lineHeight?: number;
}

export interface SemanticRule {
  id: string;
  type: 'lexical' | 'regex' | 'manual';
  match?: string;
  caseInsensitive?: boolean;
  applyStyle: string;
  tag: string;
  scope: 'instance' | 'document';
  priority: number;
  enabled: boolean;
}

export const defaultStyles: TextStyle[] = [
  {
    id: 'body',
    name: 'Body',
    tag: 'body',
    font: 'Inter',
    size: 16,
    weight: 400,
    lineHeight: 1.6,
    color: '#222222',
  },
  {
    id: 'definition',
    name: 'Definition',
    tag: 'definition',
    font: 'Inter',
    size: 16,
    weight: 600,
    italic: true,
    lineHeight: 1.6,
    color: '#4A2FBF',
  },
  {
    id: 'term',
    name: 'Term',
    tag: 'term',
    font: 'Inter',
    size: 16,
    weight: 500,
    lineHeight: 1.6,
    color: '#7B61FF',
  },
  {
    id: 'verse',
    name: 'Verse',
    tag: 'verse',
    font: 'Georgia',
    size: 15,
    weight: 400,
    italic: true,
    lineHeight: 1.8,
    color: '#555555',
  },
  {
    id: 'strong',
    name: "Strong's Number",
    tag: 'strong',
    font: 'Monaco',
    size: 13,
    weight: 500,
    lineHeight: 1.6,
    color: '#A28CFF',
  },
  {
    id: 'footnote',
    name: 'Footnote',
    tag: 'footnote',
    font: 'Inter',
    size: 12,
    weight: 400,
    lineHeight: 1.4,
    color: '#666666',
    superscript: true,
  },
  {
    id: 'notes',
    name: 'Additional Notes',
    tag: 'notes',
    font: 'Inter',
    size: 14,
    weight: 400,
    italic: true,
    lineHeight: 1.5,
    color: '#888888',
  },
];
