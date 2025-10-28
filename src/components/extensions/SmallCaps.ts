import { Mark } from '@tiptap/core';

export const SmallCaps = Mark.create({
  name: 'smallCaps',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-small-caps]',
      },
      {
        style: 'font-variant-caps=small-caps',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        'data-small-caps': '',
        style: 'font-variant-caps: small-caps;',
      },
      0,
    ];
  },

  addCommands() {
    return {
      toggleSmallCaps:
        () =>
        ({ commands }: any) => {
          return commands.toggleMark(this.name);
        },
    } as any;
  },
});
