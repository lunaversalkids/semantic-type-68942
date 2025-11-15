import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { RecordingState } from '@/hooks/useAudioRecorder';
import { formatTime } from '@/utils/audioUtils';

interface RecordingControlsProps {
  recordingState: RecordingState;
  recordingTime: number;
  onToggleRecording: () => void;
  onStop: () => void;
  interimTranscript?: string;
}

export const RecordingControls = ({
  recordingState,
  recordingTime,
  onToggleRecording,
  onStop,
  interimTranscript = '',
}: RecordingControlsProps) => {
  const [showStop, setShowStop] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  const handleMouseDown = () => {
    // Prevent any interaction when stop button is visible
    if (showStop) return;
    
    isHoldingRef.current = true;
    holdTimerRef.current = window.setTimeout(() => {
      if (isHoldingRef.current) {
        setShowStop(true);
      }
    }, 300);
  };

  const handleMouseUp = () => {
    // Prevent any interaction when stop button is visible
    if (showStop) return;
    
    isHoldingRef.current = false;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    // This is a tap - toggle recording
    onToggleRecording();
  };

  const handleStopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStop();
    setShowStop(false);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      {/* Stop button - appears above mic when holding */}
      {showStop && (
        <button
          onClick={handleStopClick}
          className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-full shadow-[0_10px_28px_rgba(96,48,200,.16)] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Square className="w-4 h-4 fill-current text-red-500" />
          <span className="text-sm font-medium">STOP</span>
        </button>
      )}

      {/* Interim transcript display */}
      {interimTranscript && recordingState === 'recording' && (
        <div className="max-w-md px-4 py-2 bg-[hsl(var(--panel))] border border-purple-500/30 rounded-lg shadow-lg">
          <p className="text-sm text-muted-foreground italic">
            {interimTranscript}
          </p>
        </div>
      )}

      {/* Timer display */}
      {recordingState !== 'idle' && (
        <div className="px-4 py-2 bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-full shadow-lg">
          <span className="text-sm font-mono font-medium tabular-nums">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Main recording button */}
      <div className="relative">
        {/* Pulse animation ring */}
        {recordingState === 'recording' && (
          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse-ring" />
        )}
        
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`relative w-16 h-16 rounded-full border-2 grid place-items-center transition-all duration-200 shadow-[0_10px_28px_rgba(96,48,200,.16)] ${
            recordingState === 'recording'
              ? 'bg-purple-500/20 border-purple-500'
              : recordingState === 'paused'
              ? 'bg-yellow-500/20 border-yellow-500'
              : 'bg-[hsl(var(--panel))] border-[hsl(var(--stroke))]'
          }`}
          title={
            recordingState === 'idle'
              ? 'Start Recording'
              : recordingState === 'recording'
              ? 'Pause Recording'
              : 'Resume Recording'
          }
        >
          <Mic 
            className={`w-6 h-6 transition-colors ${
              recordingState === 'recording'
                ? 'text-purple-500'
                : recordingState === 'paused'
                ? 'text-yellow-500'
                : 'text-foreground'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
