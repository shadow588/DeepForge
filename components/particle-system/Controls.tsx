import React from 'react';
import { ParticleShape, ParticleConfig, HandData } from './types';
import { HexColorPicker } from "react-colorful";
import {
  Maximize2,
  Minimize2,
  Stars,
  Heart,
  Flower2,
  Zap,
  Hand,
  Settings2,
  RefreshCcw
} from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  handData: HandData;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  onRefresh: () => void;
}

const Controls: React.FC<Props> = ({ config, setConfig, handData, toggleFullscreen, isFullscreen, onRefresh }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showPanel, setShowPanel] = React.useState(true);

  // Default Colors Per Shape
  const shapeDefaults: Record<ParticleShape, string> = {
    [ParticleShape.STARFIELD]: '#FFFACD', // Lemon Chiffon
    [ParticleShape.FLOWER]: '#FF1493',    // Deep Pink (Base for gradient)
    [ParticleShape.FIREWORKS]: '#FF4500', // Orange Red (Base for sparks)
    [ParticleShape.HEART]: '#FF0000',     // Red
  };

  const shapes = [
    { id: ParticleShape.STARFIELD, icon: Stars, label: 'Stars' },
    { id: ParticleShape.FLOWER, icon: Flower2, label: 'Flower' },
    { id: ParticleShape.FIREWORKS, icon: Zap, label: 'Burst' },
    { id: ParticleShape.HEART, icon: Heart, label: 'Heart' },
  ];

  const handleShapeChange = (shapeId: ParticleShape) => {
    setConfig({
        shape: shapeId,
        color: shapeDefaults[shapeId],
        particleCount: config.particleCount
    });
  };

  return (
    <>
      {/* Top Right Header / Status */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-40">
        <div className={clsx(
          "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300",
          handData.isDetected
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        )}>
          <Hand size={14} className={handData.isDetected ? "animate-pulse" : ""} />
          <span className="text-xs font-medium tracking-wide uppercase">
            {handData.isDetected ? "Hand Detected" : "No Hand Detected"}
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white/80"
          title="Reset Particles"
        >
          <RefreshCcw size={18} />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white/80"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Main Control Panel */}
      <div className={clsx(
        "absolute top-6 left-6 z-40 transition-all duration-500 ease-out",
        showPanel ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-72 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Particle Flow
            </h1>
            <div className="flex gap-2">
               <div
                  className="w-6 h-6 rounded-full cursor-pointer border-2 border-white/20 hover:scale-110 transition-transform"
                  style={{ backgroundColor: config.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
               />
            </div>
          </div>

          {showColorPicker && (
            <div className="mb-6 relative z-50">
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPicker(false)}
              />
              <div className="relative z-50">
                 <HexColorPicker
                   color={config.color}
                   onChange={(color) => setConfig(prev => ({ ...prev, color }))}
                   style={{ width: '100%', height: '150px' }}
                 />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {shapes.map((s) => {
              const isActive = config.shape === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => handleShapeChange(s.id)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 group overflow-hidden",
                    isActive
                      ? "bg-white/10 border-blue-500/50 text-white"
                      : "bg-transparent border-white/5 text-white/40 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-blue-500/10 blur-xl"></span>
                  )}
                  <Icon size={24} className={clsx("relative z-10 transition-transform duration-300", isActive && "scale-110")} />
                  <span className="text-xs font-medium relative z-10">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Status</span>
              <span>{handData.isDetected ? `${Math.round(handData.pinchDistance * 100)}% Open` : 'Idle'}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
               <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${handData.isDetected ? handData.pinchDistance * 100 : 50}%` }}
               />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button for Panel */}
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="absolute top-6 left-6 z-40 p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/80 hover:text-white transition-all"
        >
          <Settings2 size={20} />
        </button>
      )}

      {showPanel && (
        <button
          onClick={() => setShowPanel(false)}
          className="absolute top-6 left-[280px] z-40 p-2 bg-transparent text-white/30 hover:text-white/80 transition-all"
        >
          ✕
        </button>
      )}

      {/* Instructions Overlay (Fades out) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
        <p className="text-white/40 text-sm animate-pulse">
           Show hand to camera • Open/Close to breathe
        </p>
      </div>
    </>
  );
};

export default Controls;
