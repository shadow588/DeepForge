import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src="/deepforge_logo_black.jpg"
        alt="DeepForge"
        className="h-12"
      />
      <span className="text-xl tracking-tight">
        <span className="font-medium">Deep</span>
        <span className="font-bold">Forge</span>
      </span>
    </div>
  );
};

export default Logo;