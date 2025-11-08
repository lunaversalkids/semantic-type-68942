import { Node, mergeAttributes } from '@tiptap/core';

export const CustomParagraph = Node.create({
  name: 'paragraph',
  priority: 1000,
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      textIndent: {
        default: '0px',
        parseHTML: element => element.style.textIndent || '0px',
      },
      marginBottom: {
        default: '0px',
        parseHTML: element => element.style.marginBottom || '0px',
      },
      lineHeight: {
        default: 'normal',
        parseHTML: element => element.style.lineHeight || 'normal',
      },
      paddingLeft: {
        default: '0px',
        parseHTML: element => element.style.paddingLeft || '0px',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'p' }];
  },

  renderHTML({ HTMLAttributes }) {
    // Build style string from custom attributes
    const styles: string[] = [];
    
    if (HTMLAttributes.textIndent && HTMLAttributes.textIndent !== '0px') {
      styles.push(`text-indent: ${HTMLAttributes.textIndent}`);
    }
    if (HTMLAttributes.marginBottom && HTMLAttributes.marginBottom !== '0px') {
      styles.push(`margin-bottom: ${HTMLAttributes.marginBottom}`);
    }
    if (HTMLAttributes.lineHeight && HTMLAttributes.lineHeight !== 'normal') {
      styles.push(`line-height: ${HTMLAttributes.lineHeight}`);
    }
    if (HTMLAttributes.paddingLeft && HTMLAttributes.paddingLeft !== '0px') {
      styles.push(`padding-left: ${HTMLAttributes.paddingLeft}`);
    }

    // Merge with any existing styles
    const attrs = mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes);
    
    // Clean up - remove custom attributes so they don't appear as HTML attributes
    const finalAttrs: any = { ...attrs };
    delete finalAttrs.textIndent;
    delete finalAttrs.marginBottom;
    delete finalAttrs.lineHeight;
    delete finalAttrs.paddingLeft;
    
    // Apply combined styles
    if (styles.length > 0) {
      finalAttrs.style = styles.join('; ');
    }

    return ['p', finalAttrs, 0];
  },

  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.setNode(this.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setParagraph(),
    };
  },
});
