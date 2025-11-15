import { useState, useEffect } from 'react';
import { X, Mic, Download, Trash2, Edit2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { RecordingControls } from '@/components/RecordingControls';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { createAudioURL } from '@/utils/audioUtils';

interface Note {
  id: string;
  name: string;
  transcript: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
}

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
}

export const NotesDrawer = ({ isOpen, onClose, editor }: NotesDrawerProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [recordingActive, setRecordingActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const {
    recordingState,
    recordingTime,
    audioBlob,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset: resetRecording,
  } = useAudioRecorder();

  const handleTranscript = (text: string, isFinal: boolean) => {
    if (isFinal) {
      setCurrentTranscript(prev => prev + text + ' ');
      setInterimTranscript('');
    } else {
      setInterimTranscript(text);
    }
  };

  const { isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition(handleTranscript);

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('voiceNotes');
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('voiceNotes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  // Save recording when done
  useEffect(() => {
    if (audioBlob && !recordingActive && recordingState === 'idle') {
      const audioUrl = createAudioURL(audioBlob);
      const newNote: Note = {
        id: Date.now().toString(),
        name: `Note ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        transcript: currentTranscript.trim() || 'No transcript',
        audioUrl,
        createdAt: new Date().toISOString(),
        duration: recordingTime,
      };
      
      saveNotes([newNote, ...notes]);
      setCurrentTranscript('');
      resetRecording();
      
      toast({
        title: 'Note Saved',
        description: 'Your recording has been saved successfully',
      });
    }
  }, [audioBlob, recordingActive, recordingState]);

  const handleStartRecording = () => {
    setRecordingActive(true);
    startRecording();
    if (isSpeechSupported) {
      startListening();
    }
  };

  const handleToggleRecording = () => {
    if (recordingState === 'recording') {
      pauseRecording();
      stopListening();
    } else if (recordingState === 'paused') {
      resumeRecording();
      if (isSpeechSupported) {
        startListening();
      }
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    stopListening();
    setRecordingActive(false);
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, name: editName.trim() } : note
      );
      saveNotes(updatedNotes);
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    toast({
      title: 'Note Deleted',
      description: 'Recording has been removed',
    });
  };

  const handleDownload = (note: Note) => {
    fetch(note.audioUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.name}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: 'Download Started',
          description: 'Your recording is being downloaded',
        });
      });
  };

  const handleInsertTranscript = (transcript: string) => {
    if (editor) {
      editor.commands.insertContent(transcript + '\n\n');
      toast({
        title: 'Transcript Inserted',
        description: 'Text has been added to your document',
      });
    }
  };

  const handlePlayPause = (note: Note) => {
    if (playingId === note.id && audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(note.audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.play();
      setAudioElement(audio);
      setPlayingId(note.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[80vh] bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--stroke))]">
          <h2 className="text-xl font-bold">Voice Notes</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Recording Section */}
        {!recordingActive ? (
          <div className="p-4 border-b border-[hsl(var(--stroke))] flex justify-center">
            <Button
              onClick={handleStartRecording}
              className="gap-2"
            >
              <Mic className="w-4 h-4" />
              Start New Recording
            </Button>
          </div>
        ) : (
          <div className="p-4 border-b border-[hsl(var(--stroke))] relative min-h-[120px] flex items-center justify-center">
            <RecordingControls
              recordingState={recordingState}
              recordingTime={recordingTime}
              onToggleRecording={handleToggleRecording}
              onStop={handleStopRecording}
              interimTranscript={interimTranscript}
            />
          </div>
        )}

        {/* Notes List */}
        <ScrollArea className="flex-1 p-4">
          {notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No voice notes yet</p>
              <p className="text-sm">Start recording to create your first note</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="p-4 bg-[hsl(var(--panel-2))] border border-[hsl(var(--stroke))] rounded-lg"
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-2">
                    {editingId === note.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(note.id);
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditName('');
                            }
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleRename(note.id)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <h3 className="font-semibold">{note.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()} • {Math.floor(note.duration / 1000)}s
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Transcript */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {note.transcript}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlayPause(note)}
                    >
                      {playingId === note.id && audioElement && !audioElement.paused ? (
                        <Pause className="w-3 h-3 mr-1" />
                      ) : (
                        <Play className="w-3 h-3 mr-1" />
                      )}
                      {playingId === note.id && audioElement && !audioElement.paused ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInsertTranscript(note.transcript)}
                    >
                      Insert Text
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditName(note.name);
                      }}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(note)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(note.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
