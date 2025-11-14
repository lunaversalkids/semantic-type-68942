import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AudioNodeView } from './AudioNodeView';

export interface AudioNodeAttributes {
  src: string;
  width: number;
  height: number;
  diamondSize: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audioNode: {
      insertAudio: (options: Partial<AudioNodeAttributes>) => ReturnType;
    };
  }
}

export const AudioNode = Node.create({
  name: 'audioNode',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      width: {
        default: 300,
      },
      height: {
        default: 300,
      },
      diamondSize: {
        default: 60,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="audio-node"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'audio-node' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioNodeView);
  },

  addCommands() {
    return {
      insertAudio:
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
