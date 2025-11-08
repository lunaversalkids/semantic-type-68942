import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Bold, Italic } from 'lucide-react';
import { TextStyle } from '@/types/styles';
import { useState } from 'react';
interface LeftSidebarProps {
  styles: TextStyle[];
  onStylesChange: (styles: TextStyle[]) => void;
}
export const LeftSidebar = ({
  styles,
  onStylesChange
}: LeftSidebarProps) => {
  const [stylesExpanded, setStylesExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const handleAddStyle = () => {
    const newStyle: TextStyle = {
      id: `style-${Date.now()}`,
      name: 'New Style',
      tag: 'custom',
      font: 'Inter',
      size: 16,
      weight: 400,
      italic: false,
      color: '#222222',
      lineHeight: 1.6
    };
    onStylesChange([...styles, newStyle]);
    setEditingId(newStyle.id);
  };
  const handleDeleteStyle = (id: string) => {
    onStylesChange(styles.filter(s => s.id !== id));
    if (editingId === id) setEditingId(null);
  };
  const handleUpdateStyle = (id: string, updates: Partial<TextStyle>) => {
    onStylesChange(styles.map(s => s.id === id ? {
      ...s,
      ...updates
    } : s));
  };
  const toggleStyles = () => {
    setStylesExpanded(!stylesExpanded);
    setEditingId(null);
  };
  const width = stylesExpanded ? 'w-[340px]' : 'w-16';
  return <div className={`h-full bg-sidebar border-r border-sidebar-border flex transition-all duration-300 ${width} overflow-hidden`}>
      {/* Icon Column */}
      <div className="w-16 flex-shrink-0 flex flex-col items-center gap-4 py-4">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent" onClick={toggleStyles}>
          {stylesExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Styles Panel */}
      {stylesExpanded && <div className="flex-1 flex flex-col p-2.5 gap-2 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="font-extrabold flex items-center gap-2.5">
              <span className="text-lg">🎨</span>
              <span className="text-foreground">Styles</span>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={handleAddStyle} className="h-9 w-9">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={toggleStyles} className="h-9 w-9">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card List */}
          <div className="overflow-auto flex flex-col gap-2.5 pr-1 flex-1">
            {styles.map(style => <div key={style.id} className="p-3 bg-background border border-border rounded-xl">
                {editingId === style.id ? <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Input value={style.name} onChange={e => handleUpdateStyle(style.id, {
                name: e.target.value
              })} className="font-bold h-8" />
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteStyle(style.id)} className="h-8 w-8 ml-2">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Tag</Label>
                        <Input value={style.tag || ''} onChange={e => handleUpdateStyle(style.id, {
                  tag: e.target.value
                })} className="h-8 mt-1" />
                      </div>

                      <div>
                        <Label className="text-xs">Font</Label>
                        <Select value={style.font} onValueChange={value => handleUpdateStyle(style.id, {
                  font: value
                })}>
                          <SelectTrigger className="h-8 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Size</Label>
                          <Input type="number" value={style.size || 16} onChange={e => handleUpdateStyle(style.id, {
                    size: parseInt(e.target.value)
                  })} className="h-8 mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Weight</Label>
                          <Input type="number" value={style.weight || 400} onChange={e => handleUpdateStyle(style.id, {
                    weight: parseInt(e.target.value)
                  })} className="h-8 mt-1" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="color" value={style.color || '#222222'} onChange={e => handleUpdateStyle(style.id, {
                    color: e.target.value
                  })} className="h-8 w-16 p-1" />
                          <Input type="text" value={style.color || '#222222'} onChange={e => handleUpdateStyle(style.id, {
                    color: e.target.value
                  })} className="h-8 flex-1" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant={style.italic ? "default" : "outline"} onClick={() => handleUpdateStyle(style.id, {
                  italic: !style.italic
                })} className="h-8 w-8 p-0">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant={style.weight && style.weight >= 600 ? "default" : "outline"} onClick={() => handleUpdateStyle(style.id, {
                  weight: style.weight && style.weight >= 600 ? 400 : 700
                })} className="h-8 w-8 p-0">
                          <Bold className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button size="sm" onClick={() => setEditingId(null)} className="w-full">
                      Done
                    </Button>
                  </div> : <div className="cursor-pointer" onClick={() => setEditingId(style.id)}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-extrabold text-foreground">{style.name}</div>
                      <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full font-semibold text-xs">
                        {style.tag}
                      </span>
                    </div>
                    <div className="text-[13px]" style={{
              color: style.color,
              fontStyle: style.italic ? 'italic' : 'normal',
              fontFamily: style.font,
              fontSize: style.size ? `${style.size}px` : '13px',
              fontWeight: style.weight
            }}>
                      The quick brown fox
                    </div>
                  </div>}
              </div>)}
          </div>
        </div>}
    </div>;
};