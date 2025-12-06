import * as THREE from 'three';
import { ParticleShape } from './types';

export const PARTICLE_COUNT = 24000;

// Helper to generate positions based on shape
export const generatePositions = (shape: ParticleShape, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const tempVec = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    if (shape === ParticleShape.STARFIELD) {
      // A dense sphere (The "Star" or "Sun")
      const r = 5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      tempVec.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

    } else if (shape === ParticleShape.HEART) {
      // Larger front-facing Heart
      const t = Math.random() * Math.PI * 2;

      // Heart curve
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Minimal Z-depth for front-facing
      const zScale = 1.5; // Further reduced
      let z = (Math.random() - 0.5) * zScale;

      // Less volume fill for flatter appearance
      const scale = Math.pow(Math.random(), 0.4);

      tempVec.set(x * scale, y * scale, z * scale).multiplyScalar(0.20); // Doubled from 0.10

    } else if (shape === ParticleShape.FLOWER) {
      // Smaller, fuller front-facing Flower
      const layer = Math.floor(Math.pow(Math.random(), 0.3) * 6); // More layers
      const petals = 8;

      const t = Math.random() * Math.PI * 2;

      // Stronger petal fill
      const petalAngle = (t * petals) % (Math.PI * 2);
      const petalShape = Math.pow(Math.abs(Math.cos(petalAngle / 2)), 0.2); // Fuller

      // Smaller, denser radius
      const rBase = 0.2 + layer * 0.25; // Reduced from 0.3 + 0.4
      const rVariation = Math.random() * 0.08; // Less variation
      const r = rBase + petalShape * 0.5 - rVariation;

      // Very minimal Z for flat, front-facing
      const zCurve = Math.sin(petalAngle / 2) * 0.03; // Further reduced
      const zLayer = layer * 0.05; // Further reduced
      const z = zCurve + zLayer + (Math.random() - 0.5) * 0.02;

      tempVec.set(
        r * Math.cos(t),
        r * Math.sin(t),
        z
      );

    } else if (shape === ParticleShape.FIREWORKS) {
      // Much larger sphere for impressive burst effect
      const r = 3.0 * Math.cbrt(Math.random()); // Doubled to 3.0
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      tempVec.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    positions[i3] = tempVec.x;
    positions[i3 + 1] = tempVec.y;
    positions[i3 + 2] = tempVec.z;
  }

  return positions;
};
