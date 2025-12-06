import React, { useState } from 'react';
import NeuralTopology from '../components/NeuralTopology';
import ParticleDemo from '../components/ParticleDemo';

const Demo: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="w-full min-h-screen bg-surface pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Interactive Labs</h1>
        <p className="text-secondary">Explore our latest web-based experiments.</p>
      </div>

      {/* Carousel Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden w-full px-4">
          {/* Slides Wrapper */}
          <div
             className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
             style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
             {/* Slide 1: Particle AR */}
             <div className="w-full flex-shrink-0 px-2">
                 <ParticleDemo />
             </div>

             {/* Slide 2: D3 Topology */}
             <div className="w-full flex-shrink-0 px-2">
                 <NeuralTopology key={`topology-${activeSlide}`} isActive={activeSlide === 1} />
             </div>
          </div>
        </div>
      </div>

      {/* iOS Style Control */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-full p-1.5 flex h-14 w-64">
           {/* Moving Pill Background */}
           <div 
             className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
             style={{ 
               width: 'calc(50% - 6px)', 
               left: activeSlide === 0 ? '6px' : 'calc(50% + 0px)' 
             }}
           />

           <button 
             onClick={() => setActiveSlide(0)}
             className={`relative z-10 w-1/2 h-full rounded-full text-sm font-medium transition-colors duration-200 ${activeSlide === 0 ? 'text-black' : 'text-zinc-500 hover:text-black'}`}
           >
             Particle AR
           </button>
           <button 
             onClick={() => setActiveSlide(1)}
             className={`relative z-10 w-1/2 h-full rounded-full text-sm font-medium transition-colors duration-200 ${activeSlide === 1 ? 'text-black' : 'text-zinc-500 hover:text-black'}`}
           >
             Topology
           </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;