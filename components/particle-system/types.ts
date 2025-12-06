export enum ParticleShape {
  STARFIELD = 'STARFIELD',
  HEART = 'HEART',
  FLOWER = 'FLOWER',
  FIREWORKS = 'FIREWORKS'
}

export interface ParticleConfig {
  shape: ParticleShape;
  color: string;
  particleCount: number;
}

export interface HandData {
  isDetected: boolean;
  pinchDistance: number; // 0 (closed) to 1 (open)
  position: { x: number; y: number }; // Normalized screen coordinates (-1 to 1)
  velocity: { x: number; y: number }; // Speed of hand movement
  handSize: number; // Proxy for Z-depth (how close hand is to camera)
}

export interface HandTrackerProps {
  onHandUpdate: (data: HandData) => void;
}
