import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { IconNodeView } from './IconNodeView';

export interface IconNodeAttributes {
  iconId: string;
  category: string;
  width: number;
  height: number;
  color: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iconNode: {
      insertIcon: (options: Partial<IconNodeAttributes>) => ReturnType;
    };
  }
}

export const IconNode = Node.create({
  name: 'iconNode',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      iconId: {
        default: 'square',
      },
      category: {
        default: 'core',
      },
      width: {
        default: 150,
      },
      height: {
        default: 150,
      },
      color: {
        default: '#000000',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="icon-node"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'icon-node' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconNodeView);
  },

  addCommands() {
    return {
      insertIcon:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
