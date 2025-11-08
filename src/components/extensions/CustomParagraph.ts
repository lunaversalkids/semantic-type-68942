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
        renderHTML: attributes => {
          if (!attributes.textIndent || attributes.textIndent === '0px') {
            return {};
          }
          return {
            style: `text-indent: ${attributes.textIndent}`,
          };
        },
      },
      marginBottom: {
        default: '0px',
        parseHTML: element => element.style.marginBottom || '0px',
        renderHTML: attributes => {
          if (!attributes.marginBottom || attributes.marginBottom === '0px') {
            return {};
          }
          return {
            style: `margin-bottom: ${attributes.marginBottom}`,
          };
        },
      },
      lineHeight: {
        default: 'normal',
        parseHTML: element => element.style.lineHeight || 'normal',
        renderHTML: attributes => {
          if (!attributes.lineHeight || attributes.lineHeight === 'normal') {
            return {};
          }
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
      paddingLeft: {
        default: '0px',
        parseHTML: element => element.style.paddingLeft || '0px',
        renderHTML: attributes => {
          if (!attributes.paddingLeft || attributes.paddingLeft === '0px') {
            return {};
          }
          return {
            style: `padding-left: ${attributes.paddingLeft}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'p' }];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = this.options.HTMLAttributes;
    const mergedAttrs = mergeAttributes(attrs, HTMLAttributes);
    
    // Combine all style attributes
    const styles: string[] = [];
    if (mergedAttrs.style) {
      styles.push(mergedAttrs.style);
    }
    
    // Add individual style attributes
    const customAttrs = HTMLAttributes as any;
    if (customAttrs.textIndent && customAttrs.textIndent !== '0px') {
      styles.push(`text-indent: ${customAttrs.textIndent}`);
    }
    if (customAttrs.marginBottom && customAttrs.marginBottom !== '0px') {
      styles.push(`margin-bottom: ${customAttrs.marginBottom}`);
    }
    if (customAttrs.lineHeight && customAttrs.lineHeight !== 'normal') {
      styles.push(`line-height: ${customAttrs.lineHeight}`);
    }
    if (customAttrs.paddingLeft && customAttrs.paddingLeft !== '0px') {
      styles.push(`padding-left: ${customAttrs.paddingLeft}`);
    }

    const finalAttrs: any = {
      ...mergedAttrs,
      style: styles.length > 0 ? styles.join('; ') : undefined,
    };

    // Remove individual attributes from final output
    delete finalAttrs.textIndent;
    delete finalAttrs.marginBottom;
    delete finalAttrs.lineHeight;
    delete finalAttrs.paddingLeft;

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
