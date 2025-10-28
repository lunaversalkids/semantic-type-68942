import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontWeight: {
      setFontWeight: (fontWeight: string) => ReturnType;
      unsetFontWeight: () => ReturnType;
    };
  }
}

export const FontWeight = Mark.create({
  name: 'fontWeight',

  addOptions() {
    return {
      types: ['textStyle'],
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      fontWeight: {
        default: null,
        parseHTML: (element) => element.style.fontWeight || null,
        renderHTML: (attributes) => {
          if (!attributes.fontWeight) {
            return {};
          }
          return {
            style: `font-weight: ${attributes.fontWeight}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const fontWeight = (element as HTMLElement).style.fontWeight;
          return fontWeight ? { fontWeight } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontWeight:
        (fontWeight: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { fontWeight });
        },
      unsetFontWeight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
