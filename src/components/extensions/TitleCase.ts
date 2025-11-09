import { Mark } from '@tiptap/core';

export const TitleCase = Mark.create({
  name: 'titleCase',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-title-case]',
      },
      {
        style: 'text-transform=capitalize',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        'data-title-case': '',
        style: 'text-transform: capitalize;',
      },
      0,
    ];
  },

  addCommands() {
    return {
      setTitleCase:
        () =>
        ({ commands }: any) => {
          return commands.setMark(this.name);
        },
      unsetTitleCase:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
      toggleTitleCase:
        () =>
        ({ commands }: any) => {
          return commands.toggleMark(this.name);
        },
    } as any;
  },
});
