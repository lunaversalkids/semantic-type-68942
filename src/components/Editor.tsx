import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Card } from '@/components/ui/card';
import { EditorContextMenu } from './ContextMenu';

interface EditorProps {
  onSelectionChange?: (text: string) => void;
  onEditorReady?: (editor: any) => void;
  onApplyToAll?: () => void;
  onAIAssist?: (action: string) => void;
  onInsertFootnote?: () => void;
  pageNumbersVisibility?: Record<number, boolean>;
  onTogglePageNumber?: (pageNum: number) => void;
}

export const Editor = ({ 
  onSelectionChange, 
  onEditorReady, 
  onApplyToAll, 
  onAIAssist, 
  onInsertFootnote, 
  pageNumbersVisibility = { 1: true, 2: true },
  onTogglePageNumber 
}: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
    onCreate: ({ editor }) => {
      onEditorReady?.(editor);
    },
  });

  return (
    <div className="h-full flex items-start justify-center bg-[hsl(var(--editor-bg))] p-8 overflow-auto">
      <div className="flex gap-8 editor-pages">
        <EditorContextMenu 
          editor={editor}
          onApplyToAll={onApplyToAll}
          onAIAssist={onAIAssist}
          onInsertFootnote={onInsertFootnote}
          onTogglePageNumber={() => onTogglePageNumber?.(1)}
          showPageNumber={pageNumbersVisibility[1]}
          pageNumber={1}
        >
          <Card className="w-[8.5in] min-h-[11in] bg-[hsl(var(--page-bg))] shadow-lg p-16 relative">
            <EditorContent editor={editor} />
            {pageNumbersVisibility[1] && (
              <div className="absolute bottom-8 right-8 text-sm text-muted-foreground">
                Page 1
              </div>
            )}
          </Card>
        </EditorContextMenu>
        <EditorContextMenu 
          editor={editor}
          onApplyToAll={onApplyToAll}
          onAIAssist={onAIAssist}
          onInsertFootnote={onInsertFootnote}
          onTogglePageNumber={() => onTogglePageNumber?.(2)}
          showPageNumber={pageNumbersVisibility[2]}
          pageNumber={2}
        >
          <Card className="w-[8.5in] min-h-[11in] bg-[hsl(var(--page-bg))] shadow-lg p-16 relative flex items-center justify-center text-muted-foreground">
            <p>Page 2</p>
            {pageNumbersVisibility[2] && (
              <div className="absolute bottom-8 right-8 text-sm text-muted-foreground">
                Page 2
              </div>
            )}
          </Card>
        </EditorContextMenu>
      </div>
    </div>
  );
};
