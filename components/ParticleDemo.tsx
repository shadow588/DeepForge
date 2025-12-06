import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleConfig, ParticleShape, HandData } from './particle-system/types';
import ParticleSystem from './particle-system/ParticleSystem';
import Controls from './particle-system/Controls';
import HandTracker from './particle-system/HandTracker';
import { Play } from 'lucide-react';

const ParticleDemo: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [config, setConfig] = useState<ParticleConfig>({
    shape: ParticleShape.STARFIELD,
    color: '#FFFACD',
    particleCount: 4000
  });

  const [handData, setHandData] = useState<HandData>({
    isDetected: false,
    pinchDistance: 0.5,
    position: { x: 0.5, y: 0.5 },
    velocity: { x: 0, y: 0 },
    handSize: 0.5
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  const toggleFullscreen = () => {
    const container = document.querySelector('.particle-demo-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      (container as HTMLElement).requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = () => {
    setShouldReset(true);
  };

  return (
    <div className="particle-demo-container relative w-full h-[600px] bg-black rounded-xl overflow-hidden">

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <ParticleSystem
              config={config}
              handData={started ? handData : { isDetected: false, pinchDistance: 0.5, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, handSize: 0.5 }}
              shouldReset={shouldReset}
              onResetComplete={() => setShouldReset(false)}
            />
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
                intensity={1.5}
              />
            </EffectComposer>
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* Start Button Overlay (only show before starting) */}
      {!started && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
          <button
            onClick={() => setStarted(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Play size={24} className="group-hover:translate-x-1 transition-transform" />
            <span>Start Interactive Experience</span>
          </button>
          <p className="mt-6 text-white/60 text-sm">Click to enable hand gesture control</p>
        </div>
      )}

      {/* AI Hand Tracking (only load after starting) */}
      {started && <HandTracker onHandUpdate={setHandData} />}

      {/* UI Controls (only show after starting) */}
      {started && (
        <Controls
          config={config}
          setConfig={setConfig}
          handData={handData}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default ParticleDemo;
