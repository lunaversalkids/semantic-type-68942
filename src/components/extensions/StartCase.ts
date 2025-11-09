import { Mark } from '@tiptap/core';

export const StartCase = Mark.create({
  name: 'startCase',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-start-case]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        'data-start-case': '',
        class: 'start-case',
      },
      0,
    ];
  },

  addCommands() {
    return {
      setStartCase:
        () =>
        ({ commands }: any) => {
          return commands.setMark(this.name);
        },
      unsetStartCase:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
      toggleStartCase:
        () =>
        ({ commands }: any) => {
          return commands.toggleMark(this.name);
        },
    } as any;
  },
});
