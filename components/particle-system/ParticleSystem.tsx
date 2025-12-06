import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleConfig, HandData, ParticleShape } from './types';
import { generatePositions, PARTICLE_COUNT } from './constants';

interface Props {
  config: ParticleConfig;
  handData: HandData;
  shouldReset: boolean;
  onResetComplete: () => void;
}

const ParticleSystem: React.FC<Props> = ({ config, handData, shouldReset, onResetComplete }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Buffers
  const targetPositions = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Physics State
  const velocities = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Smoothed Hand Values
  const smoothHandPos = useRef(new THREE.Vector3(0, 0, 0));
  const smoothPinch = useRef(0.5);
  const smoothSize = useRef(0.5);

  // Initialize Geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Initial random scattering
    for(let i=0; i<PARTICLE_COUNT*3; i++) {
      positions[i] = (Math.random() - 0.5) * 40;
      colors[i] = 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Update Colors & Targets on Config Change
  useEffect(() => {
    const newTargets = generatePositions(config.shape, PARTICLE_COUNT);
    targetPositions.current.set(newTargets);

    if (pointsRef.current) {
        const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;

        // Colors for gradients
        const baseColorObj = new THREE.Color(config.color);

        // Flower Gradient
        const flowerCenter = new THREE.Color('#FFD700'); // Gold
        const flowerMid = new THREE.Color('#FF1493');    // Deep Pink
        const flowerOuter = new THREE.Color('#9400D3');  // Dark Violet

        // Burst Gradient (Fire)
        const burstCore = new THREE.Color('#FFFFFF');    // White Hot
        const burstMid = new THREE.Color('#FFFF00');     // Yellow
        const burstOuter = new THREE.Color('#FF4500');   // Orange Red

        // Heart Gradient
        const heartCore = new THREE.Color('#8B0000');    // Dark Red
        const heartOuter = new THREE.Color('#FF6347');   // Tomato/Bright Red

        for(let i=0; i<PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const tx = newTargets[i3];
            const ty = newTargets[i3+1];
            const tz = newTargets[i3+2];
            const dist = Math.sqrt(tx*tx + ty*ty + tz*tz);

            let c = new THREE.Color();

            if (config.shape === ParticleShape.FLOWER) {
                // Gradient based on distance from center
                if (dist < 1.0) {
                    c.lerpColors(flowerCenter, flowerMid, dist / 1.0);
                } else {
                    c.lerpColors(flowerMid, flowerOuter, (dist - 1.0) / 2.5);
                }
            } else if (config.shape === ParticleShape.FIREWORKS) {
                // Random gradient for sparks + distance
                const rand = Math.random();
                if (rand > 0.8) c.copy(burstCore);
                else if (rand > 0.4) c.copy(burstMid);
                else c.copy(burstOuter);
            } else if (config.shape === ParticleShape.HEART) {
                // Volumetric gradient: Darker inside, brighter outside
                // Heart scale is small (~0.1 mult in constants), so dist is small
                // Normalized radius approx 0 to 2
                const normDist = dist / 2.0;
                c.lerpColors(heartCore, heartOuter, Math.min(1.0, normDist + 0.2));
            } else {
                // Starfield / Default
                c.copy(baseColorObj);
            }

            colors[i3] = c.r;
            colors[i3+1] = c.g;
            colors[i3+2] = c.b;
        }
        pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Dampen velocity on shape change
    if (!shouldReset) {
      for(let i=0; i<PARTICLE_COUNT*3; i++) {
        velocities.current[i] *= 0.1;
      }
    }
  }, [config.shape, config.color]);

  // Handle Manual Reset trigger
  useEffect(() => {
    if (shouldReset && pointsRef.current) {
       const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
       const targets = targetPositions.current;

       for(let i=0; i<PARTICLE_COUNT*3; i++) {
         positions[i] = targets[i] + (Math.random() - 0.5) * 2.0;
         velocities.current[i] = 0;
       }
       pointsRef.current.geometry.attributes.position.needsUpdate = true;
       onResetComplete();
    }
  }, [shouldReset, onResetComplete]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const targets = targetPositions.current;
    const vels = velocities.current;

    // Snappy Input Smoothing
    const lerpFactor = Math.min(delta * 20, 1.0);

    if (handData.isDetected) {
      smoothHandPos.current.lerp(new THREE.Vector3(handData.position.x, handData.position.y, 0), lerpFactor);
      smoothPinch.current = THREE.MathUtils.lerp(smoothPinch.current, handData.pinchDistance, lerpFactor);
      smoothSize.current = THREE.MathUtils.lerp(smoothSize.current, handData.handSize, lerpFactor);
    } else {
      smoothHandPos.current.lerp(new THREE.Vector3(0, 0, 0), delta);
      smoothPinch.current = THREE.MathUtils.lerp(smoothPinch.current, 0.5, delta);
      smoothSize.current = THREE.MathUtils.lerp(smoothSize.current, 0.5, delta);
    }

    // Rotations
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -smoothHandPos.current.y * 0.8, delta * 5);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, smoothHandPos.current.x * 0.8, delta * 5);

    const baseScale = 1.0 + (smoothSize.current * 0.8);
    pointsRef.current.scale.setScalar(baseScale);

    const isClosed = smoothPinch.current < 0.35;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      let px = positions[i3];
      let py = positions[i3+1];
      let pz = positions[i3+2];

      const distSq = px*px + py*py + pz*pz;
      // Leash logic
      if (distSq > 2000) {
         const tx = targets[i3];
         const ty = targets[i3+1];
         const tz = targets[i3+2];
         positions[i3] = tx + (Math.random()-0.5);
         positions[i3+1] = ty + (Math.random()-0.5);
         positions[i3+2] = tz + (Math.random()-0.5);
         vels[i3] = 0; vels[i3+1] = 0; vels[i3+2] = 0;
         continue;
      }

      const tx = targets[i3];
      const ty = targets[i3+1];
      const tz = targets[i3+2];

      let fx = 0, fy = 0, fz = 0;

      // --- Behavior Logic ---

      if (config.shape === ParticleShape.STARFIELD) {
         if (isClosed) {
            // Faster convergence - increased from 12.0 to 30.0
            fx += (tx - px) * 30.0;
            fy += (ty - py) * 30.0;
            fz += (tz - pz) * 30.0;
            fx += -pz * 3.0;
            fz += px * 3.0;
         } else {
            const dist = Math.sqrt(distSq) + 0.1;
            const dirX = px / dist;
            const dirY = py / dist;
            const dirZ = pz / dist;
            // Faster expansion - increased from 40.0 to 80.0
            const repulsion = 80.0 * smoothPinch.current;
            const noise = Math.sin(py * 0.5 + time * 5.0) * 5.0;
            fx += dirX * repulsion + noise;
            fy += dirY * repulsion;
            fz += dirZ * repulsion;

            // Limit expansion - keep within radius 10
            if (dist > 10.0) {
                const pull = (dist - 10.0) * 8.0;
                fx -= (px / dist) * pull;
                fy -= (py / dist) * pull;
                fz -= (pz / dist) * pull;
            }
         }

      } else if (config.shape === ParticleShape.FLOWER || config.shape === ParticleShape.HEART) {
         if (isClosed) {
            // Faster convergence
            fx += (tx - px) * 120.0;
            fy += (ty - py) * 120.0;
            fz += (tz - pz) * 120.0;

            // Add a little vibration
            fx += (Math.random() - 0.5) * 2.0;
            fy += (Math.random() - 0.5) * 2.0;
            fz += (Math.random() - 0.5) * 2.0;
         } else {
            // OPEN STATE: Gentle expansion, less flow, more concentrated

            // 1. Reduced Flow (much less turbulence)
            const freq = 0.3;
            const t = time * 0.8; // Slower
            const amp = 20.0; // Reduced from 60.0

            const flowX = Math.sin(py * freq + t) + Math.sin(pz * freq * 1.3 + t);
            const flowY = Math.cos(pz * freq + t) + Math.cos(px * freq * 1.7 + t);
            const flowZ = Math.sin(px * freq + t) + Math.sin(py * freq * 0.7 + t);

            fx += flowX * amp * 0.3; // Reduced from 0.5
            fy += flowY * amp * 0.3;
            fz += flowZ * amp * 0.3;

            // 2. Gentle Expansion (more concentrated)
            const d = Math.sqrt(distSq) + 0.01;
            const repulse = 10.0 / (d + 1.0); // Reduced from 15.0

            fx += (px / d) * repulse * 5.0; // Reduced from 10.0
            fy += (py / d) * repulse * 5.0;
            fz += (pz / d) * repulse * 5.0;

            // 3. Very Tight Containment (keep centered)
            if (d > 5.0) { // Reduced from 8.0
                const pull = (d - 5.0) * 10.0; // Stronger pull
                fx -= (px / d) * pull;
                fy -= (py / d) * pull;
                fz -= (pz / d) * pull;
            }
         }

      } else if (config.shape === ParticleShape.FIREWORKS) {
         if (isClosed) {
            // Faster compression - increased from 15.0 to 40.0
            fx += (tx - px) * 40.0;
            fy += (ty - py) * 40.0;
            fz += (tz - pz) * 40.0;
            // Jitter
            fx += (Math.random() - 0.5) * 10.0;
            fy += (Math.random() - 0.5) * 10.0;
            fz += (Math.random() - 0.5) * 10.0;
         } else {
            // Sparks flying wildly (High chaos, but with boundary)
            const dist = Math.sqrt(distSq) + 0.01;
            const dirX = px / dist;
            const dirY = py / dist;
            const dirZ = pz / dist;

            // Stronger Repulsion - increased from 25.0 to 50.0
            const repulsion = 50.0;
            fx += dirX * repulsion;
            fy += dirY * repulsion;
            fz += dirZ * repulsion;

            // High frequency noise for "sparks"
            fx += (Math.random() - 0.5) * 50.0;
            fy += (Math.random() - 0.5) * 50.0;
            fz += (Math.random() - 0.5) * 50.0;

            // Limit expansion boundary
            if (dist > 9.0) {
                const pull = (dist - 9.0) * 5.0;
                fx -= (px / dist) * pull;
                fy -= (py / dist) * pull;
                fz -= (pz / dist) * pull;
            }
         }
      }

      vels[i3]   += fx * delta;
      vels[i3+1] += fy * delta;
      vels[i3+2] += fz * delta;

      // Friction
      let friction = 0.90;
      if (isClosed) friction = 0.80;

      vels[i3]   *= friction;
      vels[i3+1] *= friction;
      vels[i3+2] *= friction;

      positions[i3]   += vels[i3] * delta;
      positions[i3+1] += vels[i3+1] * delta;
      positions[i3+2] += vels[i3+2] * delta;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        vertexColors={true}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;
