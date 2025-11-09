import { Mark } from '@tiptap/core';

export const AllCaps = Mark.create({
  name: 'allCaps',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-all-caps]',
      },
      {
        style: 'text-transform=uppercase',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        'data-all-caps': '',
        style: 'text-transform: uppercase;',
      },
      0,
    ];
  },

  addCommands() {
    return {
      setAllCaps:
        () =>
        ({ commands }: any) => {
          return commands.setMark(this.name);
        },
      unsetAllCaps:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
      toggleAllCaps:
        () =>
        ({ commands }: any) => {
          return commands.toggleMark(this.name);
        },
    } as any;
  },
});
