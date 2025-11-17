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
  const [isMinimized, setIsMinimized] = useState(false);
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
        size={{ width: isMinimized ? 'auto' : width, height: 'auto' }}
        position={{ x: 0, y: 0 }}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateAttributes({
            width: ref.offsetWidth,
          });
        }}
        minWidth={isMinimized ? 40 : 300}
        maxWidth={isMinimized ? 64 : 800}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        bounds="parent"
        className="audio-player-rnd"
        disableDragging={false}
      >
        <audio ref={audioRef} src={src} />

        {isMinimized ? (
          // Minimized State - Purple Ball with Play Button and Expand Line
          <div
            className="relative cursor-move group"
            onClick={() => setIsMinimized(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              style={{ width: width || 64, height: width || 64 }}
            >
              <svg
                viewBox="0 0 24 24"
                className="text-white fill-white"
                style={{ width: (width || 64) * 0.5, height: (width || 64) * 0.5 }}
              >
                <path d="M 8 12 Q 8 8, 12 8 Q 16 8, 16 12 Q 16 16, 12 16 Q 8 16, 8 12 Z M 12 12 Q 12 8, 16 8 Q 20 8, 20 12 Q 20 16, 16 16 Q 12 16, 12 12 Z" />
              </svg>
            </button>
            
            {/* Expand Line - appears on hover at top-left corner */}
            <div 
              className="absolute left-0 top-0 -translate-y-2 -translate-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
            >
              <div className="w-4 h-0.5 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" />
            </div>

            {/* Resize Handle Ball - Bottom Right Corner of Minimized Ball */}
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50 cursor-se-resize hover:scale-110 transition-transform z-20"
              style={{ 
                pointerEvents: 'none',
                transform: 'translate(50%, 50%)'
              }}
            />
          </div>
        ) : (
          // Expanded State - Full Player
          <div
            className="relative p-6 rounded-2xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm border-2 border-purple-200/30 h-full cursor-move"
            style={{ 
              boxShadow: selected ? '0 0 0 3px hsl(266, 100%, 70%)' : 'none',
            }}
          >
            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center transition-all hover:scale-105 z-10"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(167, 139, 250, 0.4))' }}
              >
                {/* Rounded triangular play-button shape (Reuleaux Triangle) */}
                <path
                  d="M 20 50 Q 20 20, 35 15 Q 50 10, 65 15 Q 80 20, 85 35 Q 90 50, 85 65 Q 80 75, 70 80 Q 60 85, 50 85 Q 35 85, 25 75 Q 20 65, 20 50 Z"
                  fill="url(#purpleGradient)"
                  stroke="none"
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(266, 100%, 75%)" />
                    <stop offset="100%" stopColor="hsl(266, 100%, 65%)" />
                  </linearGradient>
                </defs>
                {/* Infinity symbol */}
                <path
                  d="M 35 50 Q 35 45, 40 45 Q 45 45, 50 50 Q 55 55, 60 55 Q 65 55, 65 50 Q 65 45, 60 45 Q 55 45, 50 50 Q 45 55, 40 55 Q 35 55, 35 50 Z"
                  fill="white"
                  stroke="none"
                />
              </svg>
            </button>
        
        {/* Play Button and Title Row */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            )}
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
              className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/40 transition-all hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
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
        )}
        
        {/* Resize Handle Ball - Bottom Right Corner */}
        {!isMinimized && (
          <div 
            className="absolute bottom-1 right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50 cursor-se-resize hover:scale-125 hover:shadow-xl hover:shadow-purple-500/60 transition-all z-20"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </Rnd>
    </NodeViewWrapper>
  );
};
