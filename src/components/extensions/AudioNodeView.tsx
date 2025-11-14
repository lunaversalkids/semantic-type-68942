import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Draggable from 'react-draggable';

interface AudioNodeViewProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  selected: boolean;
}

export const AudioNodeView = ({ node, updateAttributes, selected }: AudioNodeViewProps) => {
  const { src, width, height } = node.attrs;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Generate random waveform for visualization
  useEffect(() => {
    const bars = Array.from({ length: 60 }, () => Math.random() * 100);
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

  const handleResize = (e: any, data: any) => {
    updateAttributes({
      width: data.size.width,
      height: data.size.height,
    });
  };

  return (
    <NodeViewWrapper className="audio-node-wrapper inline-block my-2">
      <Draggable
        bounds="parent"
        handle=".drag-handle"
        disabled={!isExpanded}
      >
        <div
          className="relative inline-block"
          style={{
            width: isExpanded ? `${width}px` : 'auto',
            height: isExpanded ? `${height}px` : 'auto',
          }}
        >
          <audio ref={audioRef} src={src} />
          
          {!isExpanded ? (
            // Purple diamond collapsed state
            <div
              onClick={() => setIsExpanded(true)}
              className="cursor-pointer inline-block"
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, hsl(280, 100%, 50%), hsl(280, 100%, 65%))',
                transform: 'rotate(45deg)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
              }}
            >
              <div
                style={{
                  transform: 'rotate(-45deg)',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          ) : (
            // Expanded audio player
            <div
              className={`drag-handle bg-background border-2 rounded-lg p-6 ${
                selected ? 'border-primary' : 'border-border'
              }`}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Waveform Visualization */}
              <div className="flex items-center justify-center gap-0.5 h-32 mb-4">
                {waveformBars.map((height, i) => {
                  const isActive = (i / waveformBars.length) * duration < currentTime;
                  return (
                    <div
                      key={i}
                      className="rounded-full transition-all"
                      style={{
                        width: '2px',
                        height: `${isPlaying && isActive ? height : height * 0.5}%`,
                        backgroundColor: 'hsl(280, 100%, 60%)',
                        opacity: isPlaying && isActive ? 1 : 0.3,
                      }}
                    />
                  );
                })}
              </div>

              {/* Progress Slider */}
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="mb-4"
              />

              {/* Controls */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">
                  {formatTime(currentTime)}
                </span>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={skipBackward}
                    className="rounded-full p-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <SkipBack className="w-5 h-5 text-primary" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="rounded-full p-4 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="rounded-full p-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <SkipForward className="w-5 h-5 text-primary" />
                  </button>
                </div>

                <span className="text-lg font-semibold text-primary">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Resize Handle */}
              {selected && (
                <div
                  className="absolute bottom-2 right-2 w-4 h-4 bg-primary rounded cursor-se-resize"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = width;
                    const startHeight = height;

                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaX = e.clientX - startX;
                      const deltaY = e.clientY - startY;
                      updateAttributes({
                        width: Math.max(250, startWidth + deltaX),
                        height: Math.max(250, startHeight + deltaY),
                      });
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </Draggable>
    </NodeViewWrapper>
  );
};
