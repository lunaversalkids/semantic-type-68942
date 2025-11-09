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
      setSmallCaps:
        () =>
        ({ commands }: any) => {
          return commands.setMark(this.name);
        },
      unsetSmallCaps:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
      toggleSmallCaps:
        () =>
        ({ commands }: any) => {
          return commands.toggleMark(this.name);
        },
    } as any;
  },
});
