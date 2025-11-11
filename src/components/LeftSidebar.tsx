import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Bold, Italic } from 'lucide-react';
import { TextStyle } from '@/types/styles';
import { useState } from 'react';
interface LeftSidebarProps {
  styles: TextStyle[];
  onStylesChange: (styles: TextStyle[]) => void;
  pageCount?: number;
  wordCount?: number;
}
export const LeftSidebar = ({
  styles,
  onStylesChange,
  pageCount = 0,
  wordCount = 0
}: LeftSidebarProps) => {
  const [stylesExpanded, setStylesExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
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
  return <div className={`h-full bg-sidebar border-r border-sidebar-border flex transition-all duration-300 ${width} overflow-hidden relative`}>
      {/* Page Counter - Square, stays centered and fixed */}
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="bg-[hsl(253,45%,85%)] text-[hsl(266,50%,35%)] font-bold text-center flex flex-col items-center justify-center w-[56px] h-[56px] rounded-md shadow-sm">
          <div className="text-[8px] tracking-[0.15em] leading-none mb-1">PAGE</div>
          <div className="text-xl leading-none">{pageCount}</div>
        </div>
      </div>

      {/* Icon Column */}
      <div className="w-16 flex-shrink-0 flex flex-col items-center pt-[72px] pb-4">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent mb-4" onClick={toggleStyles}>
          {stylesExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
        {!stylesExpanded && <div className="writing-mode-vertical text-sm font-medium text-muted-foreground uppercase tracking-wide mt-14" style={{
        writingMode: 'vertical-rl'
      }}>
          Smart Styling
        </div>}
      </div>

      {/* Styles Panel */}
      {stylesExpanded && <div className="flex-1 flex flex-col p-2.5 gap-2 overflow-hidden pt-[72px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-[#8B7AB8] uppercase tracking-wide">Smart Styling</h2>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={handleAddStyle} className="h-9 w-9">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={toggleStyles} className="h-9 w-9 text-muted-foreground hover:bg-sidebar-accent">
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
                          <SelectContent className="max-h-60">
                            <SelectItem value="Graphik">Graphik</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Garamond">Garamond</SelectItem>
                            <SelectItem value="Palatino">Palatino</SelectItem>
                            <SelectItem value="Bookman">Bookman</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Lucida Console">Lucida Console</SelectItem>
                            <SelectItem value="Tahoma">Tahoma</SelectItem>
                            <SelectItem value="Lucida Sans">Lucida Sans</SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                            <SelectItem value="Gill Sans">Gill Sans</SelectItem>
                            <SelectItem value="Century Gothic">Century Gothic</SelectItem>
                            <SelectItem value="Franklin Gothic Medium">Franklin Gothic Medium</SelectItem>
                            <SelectItem value="Cambria">Cambria</SelectItem>
                            <SelectItem value="Calibri">Calibri</SelectItem>
                            <SelectItem value="Consolas">Consolas</SelectItem>
                            <SelectItem value="Didot">Didot</SelectItem>
                            <SelectItem value="Futura">Futura</SelectItem>
                            <SelectItem value="Optima">Optima</SelectItem>
                            <SelectItem value="Baskerville">Baskerville</SelectItem>
                            <SelectItem value="Inter">Inter</SelectItem>
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
                        <div className="mt-1">
                          <Popover open={colorPickerOpen === style.id} onOpenChange={(open) => setColorPickerOpen(open ? style.id : null)}>
                            <PopoverTrigger asChild>
                              <button 
                                className="w-full h-8 rounded-lg border-2 border-gray-300 hover:border-[#8B7AB8] transition-colors cursor-pointer"
                                style={{ backgroundColor: style.color || '#222222' }}
                                aria-label="Choose color"
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3 bg-white border-2 border-white shadow-[0_0_40px_rgba(200,180,255,0.4)] z-50" align="start">
                              <div className="max-h-[280px] overflow-y-auto overflow-x-hidden border border-gray-300">
                                <div className="grid grid-cols-16 gap-0">
                                  {/* Grayscale row */}
                                  {['#EFEFEF', '#DEDEDE', '#CECECE', '#BEBEBE', '#AEAEAE', '#9E9E9E', '#8E8E8E', '#7E7E7E', 
                                    '#6E6E6E', '#5E5E5E', '#4E4E4E', '#3E3E3E', '#2E2E2E', '#1E1E1E', '#0E0E0E', '#000000'].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => { 
                                        handleUpdateStyle(style.id, { color });
                                        setColorPickerOpen(null);
                                      }}
                                      className="w-[17.5px] h-[17.5px] hover:scale-105 transition-transform border-0"
                                      style={{ backgroundColor: color }}
                                      aria-label={`Select ${color}`}
                                    />
                                  ))}
                                  
                                  {/* Color spectrum rows */}
                                  {[
                                    ['#003050', '#000060', '#00004D', '#4B0082', '#660066', '#6B0066', '#7A004D', '#6B0000', '#8B0000', '#A00000', '#B54B00', '#A55000', '#6B3800', '#6B6B00', '#4D5F1E', '#004400'],
                                    ['#004D80', '#0000A0', '#0000CD', '#000099', '#7B008B', '#800080', '#9B0066', '#8B0000', '#B22222', '#CD0000', '#DC5B23', '#CC5500', '#8B5A00', '#8B8B00', '#6B8E23', '#228B22'],
                                    ['#006BB3', '#0033FF', '#4169E1', '#0066FF', '#6A5ACD', '#9932CC', '#CC0066', '#CD0000', '#FF0000', '#FF3300', '#FF6B23', '#FF7700', '#D27A00', '#CDB700', '#9ACD32', '#32CD32'],
                                    ['#0080FF', '#0066FF', '#4682B4', '#1E90FF', '#7B68EE', '#9370DB', '#BA55D3', '#FF0066', '#FF4500', '#FF6600', '#FF8C00', '#FFA500', '#FFB900', '#FFD700', '#ADFF2F', '#7FFF00'],
                                    ['#00BFFF', '#4DA6FF', '#5DADE2', '#66B3FF', '#8A7FD3', '#9966FF', '#DA70D6', '#FF6699', '#FF7F7F', '#FF9966', '#FFB366', '#FFB84D', '#FFCC00', '#FFEB00', '#D4FF00', '#90EE90'],
                                    ['#6DD5ED', '#87CEEB', '#89CFF0', '#99CCFF', '#9999FF', '#B19CD9', '#E6A8D7', '#FFB6C1', '#FFB3BA', '#FFCC99', '#FFD6A5', '#FFDA8F', '#FFE066', '#FFFF99', '#E8FF99', '#B4FFB4'],
                                    ['#AED9E0', '#B0E0E6', '#C1E7F4', '#CCDDFF', '#C8BFE7', '#E0BBE4', '#F4C2C2', '#FFC0CB', '#FFCCCB', '#FFE0B2', '#FFE5B4', '#FFEDB3', '#FFF3CC', '#FFFDD0', '#F0FFCC', '#D5FFD5'],
                                    ['#D4F1F4', '#E0F6F6', '#E6F7FF', '#EDE7F6', '#F3E5F5', '#FDEEF4', '#FFF0F5', '#FFF5F7', '#FFF5EE', '#FFF8E1', '#FFFBEA', '#FFFEF0', '#FFFEF5', '#FFFFEB', '#FAFFF0', '#F0FFF0']
                                  ].map((row, rowIndex) => (
                                    row.map((color) => (
                                      <button
                                        key={`${rowIndex}-${color}`}
                                        onClick={() => { 
                                          handleUpdateStyle(style.id, { color });
                                          setColorPickerOpen(null);
                                        }}
                                        className="w-[17.5px] h-[17.5px] hover:scale-105 transition-transform border-0"
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select ${color}`}
                                      />
                                    ))
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
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