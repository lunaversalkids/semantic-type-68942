import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Edit2, Trash2, Mic } from 'lucide-react';
import { useState } from 'react';
import { formatTime } from '@/utils/audioUtils';

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
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onStartNewRecording: () => void;
}

export const RecordingsLibraryDialog = ({
  open,
  onOpenChange,
  recordings,
  onRename,
  onDelete,
  onStartNewRecording
}: RecordingsLibraryDialogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Note Recordings</span>
            <Button onClick={onStartNewRecording} size="sm">
              <Mic className="w-4 h-4 mr-2" />
              New Recording
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto space-y-3 pr-2">
          {recordings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recordings yet</p>
              <p className="text-sm mt-1">Click "New Recording" to start</p>
            </div>
          ) : (
            recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
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
                      onBlur={() => saveEdit(recording.id)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(recording)}
                    title="Rename"
                  >
                    <Edit2 className="w-4 h-4" />
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
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
