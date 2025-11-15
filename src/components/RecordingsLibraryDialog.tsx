import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Edit2, Trash2, Mic, Check, Archive, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { formatTime } from '@/utils/audioUtils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export interface Recording {
  id: string;
  name: string;
  audioBlob: Blob;
  duration: number;
  timestamp: Date;
}

interface RecordingsLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordings: Recording[];
  trashedRecordings: Recording[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onDeleteFromTrash: (ids: string[]) => void;
  onRestore: (id: string) => void;
  onStartNewRecording: () => void;
}

export const RecordingsLibraryDialog = ({
  open,
  onOpenChange,
  recordings,
  trashedRecordings,
  onRename,
  onDelete,
  onDeleteFromTrash,
  onRestore,
  onStartNewRecording
}: RecordingsLibraryDialogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [viewMode, setViewMode] = useState<'saved' | 'trash'>('saved');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();
  
  const currentRecordings = viewMode === 'saved' ? recordings : trashedRecordings;
  const isAllSelected = selectedIds.length === currentRecordings.length && currentRecordings.length > 0;

  const getDialogWidth = () => {
    const count = currentRecordings.length;
    if (count <= 2) return "max-w-2xl";
    if (count <= 4) return "max-w-4xl";
    return "max-w-6xl";
  };

  const getGridCols = () => {
    const count = currentRecordings.length;
    if (count <= 2) return "grid-cols-1";
    if (count <= 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const handleDownload = (recording: Recording) => {
    const url = URL.createObjectURL(recording.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEdit = (recording: Recording) => {
    setEditingId(recording.id);
    setEditName(recording.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
      toast({
        title: "Saved confirmed",
        description: "Recording name has been updated successfully.",
      });
    }
    setEditingId(null);
    setEditName('');
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecordings.map(r => r.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      onDeleteFromTrash(selectedIds);
      setSelectedIds([]);
    }
  };

  const switchToTrash = () => {
    setViewMode('trash');
    setSelectedIds([]);
    setEditingId(null);
  };

  const switchToSaved = () => {
    setViewMode('saved');
    setSelectedIds([]);
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getDialogWidth()} max-h-[80vh]`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Note Recordings</span>
              <div className="flex gap-1">
                <Button 
                  onClick={switchToSaved} 
                  variant={viewMode === 'saved' ? 'default' : 'outline'}
                  size="sm"
                >
                  Saved
                </Button>
                <Button 
                  onClick={switchToTrash} 
                  variant={viewMode === 'trash' ? 'default' : 'outline'}
                  size="sm"
                  className="relative"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Trash
                  {trashedRecordings.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                      {trashedRecordings.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            <Button onClick={onStartNewRecording} size="sm">
              <Mic className="w-4 h-4 mr-2" />
              New Recording
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          {viewMode === 'trash' && trashedRecordings.length > 0 && (
            <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {selectedIds.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>
          )}
          
          {currentRecordings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {viewMode === 'saved' ? (
                <>
                  <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recordings yet</p>
                  <p className="text-sm mt-1">Click "New Recording" to start</p>
                </>
              ) : (
                <>
                  <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Trash is empty</p>
                  <p className="text-sm mt-1">Canceled recordings will appear here</p>
                </>
              )}
            </div>
          ) : (
            <div className={`grid ${getGridCols()} gap-3`}>
              {currentRecordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                {viewMode === 'trash' && (
                  <Checkbox 
                    checked={selectedIds.includes(recording.id)}
                    onCheckedChange={() => toggleSelection(recording.id)}
                  />
                )}
                <audio
                  src={URL.createObjectURL(recording.audioBlob)}
                  controls
                  className="flex-1 h-10"
                />
                
                <div className="flex-1 min-w-0">
                  {editingId === recording.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(recording.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setEditName('');
                        }
                      }}
                      autoFocus
                      className="h-8"
                    />
                  ) : (
                    <div>
                      <p className="font-medium truncate">{recording.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(recording.duration)} • {recording.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  {viewMode === 'saved' ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (editingId === recording.id) {
                            saveEdit(recording.id);
                          } else {
                            startEdit(recording);
                          }
                        }}
                        title={editingId === recording.id ? "Save" : "Rename"}
                      >
                        {editingId === recording.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Edit2 className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(recording)}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(recording.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRestore(recording.id)}
                      title="Restore"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
