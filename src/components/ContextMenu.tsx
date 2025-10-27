import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tag, Palette, Sparkles, FileText } from 'lucide-react';
import { ReactNode } from 'react';

interface EditorContextMenuProps {
  children: ReactNode;
  editor?: any;
  onApplyToAll?: () => void;
  onAIAssist?: (action: string) => void;
}

export const EditorContextMenu = ({ children, editor, onApplyToAll, onAIAssist }: EditorContextMenuProps) => {
  if (!editor) return <>{children}</>;

  const applySemanticTag = (tag: string, color: string, weight?: number, italic?: boolean) => {
    const chain = editor.chain().focus();
    
    if (color) chain.setColor(color);
    if (weight && weight >= 600) chain.setBold();
    if (italic) chain.setItalic();
    
    chain.run();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Tag className="w-4 h-4 mr-2" />
            Tag as Semantic Style
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => applySemanticTag('definition', '#4A2FBF', 600, true)}>
              <span className="font-semibold italic" style={{ color: '#4A2FBF' }}>Definition</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('term', '#7B61FF', 500)}>
              <span className="font-medium" style={{ color: '#7B61FF' }}>Term</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('verse', '#555555', 400, true)}>
              <span className="italic" style={{ color: '#555555' }}>Verse</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('strong', '#A28CFF', 500)}>
              <span style={{ color: '#A28CFF', fontFamily: 'Monaco' }}>Strong's Number</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('footnote', '#666666', 400)}>
              <span style={{ color: '#666666', fontSize: '12px' }}>Footnote</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem>
          <FileText className="w-4 h-4 mr-2" />
          Insert Footnote
        </ContextMenuItem>

        <ContextMenuItem onClick={onApplyToAll}>
          <Palette className="w-4 h-4 mr-2" />
          Apply to All Instances...
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assist
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onAIAssist?.('grammar')}>Grammar Check</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('clarity')}>Improve Clarity</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('summarize')}>Summarize</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('alphabetize')}>Alphabetize List</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
