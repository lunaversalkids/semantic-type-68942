import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Rnd } from 'react-rnd';

interface AudioNodeViewProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  selected: boolean;
}

export const AudioNodeView = ({ node, updateAttributes, selected }: AudioNodeViewProps) => {
  const { src, width = 600 } = node.attrs;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Generate random waveform for visualization
  useEffect(() => {
    const bars = Array.from({ length: 80 }, () => Math.random() * 100);
    setWaveformBars(bars);
  }, []);

  // Update time while playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          animationRef.current = requestAnimationFrame(updateTime);
        }
      };
      animationRef.current = requestAnimationFrame(updateTime);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);

  // Load audio metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <NodeViewWrapper className="audio-node-wrapper my-4">
      <Rnd
        size={{ width, height: 'auto' }}
        position={{ x: 0, y: 0 }}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateAttributes({
            width: ref.offsetWidth,
          });
        }}
        minWidth={400}
        maxWidth={800}
        enableResizing={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        bounds="parent"
        className="audio-player-rnd"
      >
        <div
          className="relative p-6 rounded-2xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm border-2 border-purple-200/30 h-full cursor-move"
          style={{ 
            boxShadow: selected ? '0 0 0 3px hsl(266, 100%, 70%)' : 'none',
          }}
        >
          <audio ref={audioRef} src={src} />
        
        {/* Play Button and Title Row */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className="relative w-20 h-20 flex items-center justify-center transition-all hover:scale-105"
            style={{
              background: '#000000',
              borderRadius: '20px 8px 20px 8px',
              clipPath: 'polygon(12% 3%, 92% 50%, 92% 50%, 12% 97%, 3% 90%, 3% 10%)',
            }}
          >
            {/* Infinity Symbol */}
            <svg 
              viewBox="0 0 48 24" 
              className="w-10 h-5 absolute"
              fill="white"
            >
              <path d="M15 12c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6c1.5 0 2.9-0.6 4-1.5l2-1.5 2 1.5c1.1 0.9 2.5 1.5 4 1.5 3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6" 
                    stroke="white" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round" />
            </svg>
          </button>
          <h3 className="text-2xl font-medium text-purple-300/80 tracking-wide">
            Time for Healing
          </h3>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-4 flex items-end justify-center h-32 gap-1 px-2">
          {waveformBars.map((height, index) => {
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            const barProgress = (index / waveformBars.length) * 100;
            const isActive = barProgress <= progress;
            
            return (
              <div
                key={index}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${height}%`,
                  backgroundColor: isActive 
                    ? 'hsl(266, 100%, 70%)'
                    : 'hsl(266, 100%, 70%)',
                  opacity: isActive ? 1 : 0.6,
                  minWidth: '3px',
                  maxWidth: '8px',
                }}
              />
            );
          })}
        </div>

        {/* Slider */}
        <div className="mb-2 px-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Time Display and Controls */}
        <div className="flex items-center justify-between px-2">
          <span className="text-4xl font-bold text-purple-600">
            {formatTime(currentTime)}
          </span>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={skipBackward}
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-md shadow-purple-500/30 transition-all hover:scale-105"
            >
              <SkipBack className="w-6 h-6 text-white fill-white" />
            </button>
            
            <button
              onClick={togglePlay}
              className="relative w-16 h-16 flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: '#000000',
                borderRadius: '16px 6px 16px 6px',
                clipPath: 'polygon(12% 3%, 92% 50%, 92% 50%, 12% 97%, 3% 90%, 3% 10%)',
              }}
            >
              {/* Infinity Symbol */}
              <svg 
                viewBox="0 0 48 24" 
                className="w-8 h-4 absolute"
                fill="white"
              >
                <path d="M15 12c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6c1.5 0 2.9-0.6 4-1.5l2-1.5 2 1.5c1.1 0.9 2.5 1.5 4 1.5 3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6" 
                      stroke="white" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round"
                      strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={skipForward}
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-md shadow-purple-500/30 transition-all hover:scale-105"
            >
              <SkipForward className="w-6 h-6 text-white fill-white" />
            </button>
          </div>

          <span className="text-4xl font-bold text-purple-600">
            {formatTime(duration)}
          </span>
        </div>
        </div>
        
        {/* Corner Resize Handles */}
        {selected && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 bg-purple-600 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-purple-500/50 cursor-nw-resize" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-purple-600 rounded-full translate-x-1/2 -translate-y-1/2 shadow-lg shadow-purple-500/50 cursor-ne-resize" />
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-purple-600 rounded-full -translate-x-1/2 translate-y-1/2 shadow-lg shadow-purple-500/50 cursor-sw-resize" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 rounded-full translate-x-1/2 translate-y-1/2 shadow-lg shadow-purple-500/50 cursor-se-resize" />
          </>
        )}
      </Rnd>
    </NodeViewWrapper>
  );
};
