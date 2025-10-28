import { Mark, mergeAttributes } from '@tiptap/core';

export interface FootnoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footnote: {
      setFootnote: (attributes?: { id: string; number: number; content: string }) => ReturnType;
      unsetFootnote: () => ReturnType;
    };
  }
}

export const Footnote = Mark.create<FootnoteOptions>({
  name: 'footnote',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-footnote-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-footnote-id': attributes.id,
          };
        },
      },
      number: {
        default: null,
        parseHTML: element => element.getAttribute('data-footnote-number'),
        renderHTML: attributes => {
          if (!attributes.number) {
            return {};
          }
          return {
            'data-footnote-number': attributes.number,
          };
        },
      },
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-footnote-content'),
        renderHTML: attributes => {
          if (!attributes.content) {
            return {};
          }
          return {
            'data-footnote-content': attributes.content,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup[data-footnote-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: 'footnote-ref',
    }), HTMLAttributes.number || '1'];
  },

  addCommands() {
    return {
      setFootnote: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      unsetFootnote: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});
