import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Card } from '@/components/ui/card';

interface EditorProps {
  onSelectionChange?: (text: string) => void;
}

export const Editor = ({ onSelectionChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: `
      <h1>The Semantic Editor</h1>
      <p>This is a professional document editor with semantic styling capabilities. Select text and apply named styles like <strong>Definition</strong>, <em>Term</em>, or <em>Verse</em>.</p>
      <h2>Key Features</h2>
      <ul>
        <li>Apply semantic styles that carry meaning beyond appearance</li>
        <li>Find and replace while preserving or re-applying styles</li>
        <li>Define rules to automatically style matching text</li>
        <li>Create beautiful, consistent documents</li>
      </ul>
      <h2>Example Terms</h2>
      <p>Words like <strong>Elohim</strong> or <strong>H1234</strong> can be automatically styled based on semantic rules you define.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      onSelectionChange?.(text);
    },
  });

  return (
    <div className="h-full flex items-start justify-center bg-[hsl(var(--editor-bg))] p-8 overflow-auto">
      <Card className="w-full max-w-4xl min-h-[11in] bg-[hsl(var(--page-bg))] shadow-lg p-16">
        <EditorContent editor={editor} />
      </Card>
    </div>
  );
};
