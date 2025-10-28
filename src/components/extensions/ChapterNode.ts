import { Node, mergeAttributes } from '@tiptap/core';

export interface ChapterOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    chapter: {
      setChapter: (attributes?: { title: string; number?: number }) => ReturnType;
    };
  }
}

export const Chapter = Node.create<ChapterOptions>({
  name: 'chapter',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'block+',

  addAttributes() {
    return {
      title: {
        default: 'New Chapter',
        parseHTML: element => element.getAttribute('data-chapter-title'),
        renderHTML: attributes => {
          return {
            'data-chapter-title': attributes.title,
          };
        },
      },
      number: {
        default: null,
        parseHTML: element => element.getAttribute('data-chapter-number'),
        renderHTML: attributes => {
          if (!attributes.number) {
            return {};
          }
          return {
            'data-chapter-number': attributes.number,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-chapter-title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: 'chapter',
    }), 0];
  },

  addCommands() {
    return {
      setChapter: attributes => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        });
      },
    };
  },
});
