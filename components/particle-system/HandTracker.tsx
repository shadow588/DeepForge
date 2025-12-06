import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandData } from './types';

interface Props {
  onHandUpdate: (data: HandData) => void;
}

const HandTracker: React.FC<Props> = ({ onHandUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef<number | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  // Physics tracking refs
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );

        if (!mounted) return;

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        handLandmarkerRef.current = handLandmarker;
        startWebcam();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
      }
    };

    setupMediaPipe();

    return () => {
      mounted = false;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWebcam = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user"
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
  };

  const predictWebcam = () => {
    if (!videoRef.current || !handLandmarkerRef.current) return;

    let startTimeMs = performance.now();

    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;

      const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // --- 1. Hand Size / Depth Estimation ---
        // Distance between Wrist (0) and Middle Finger MCP (9)
        // This is a stable reference for hand size regardless of finger curling
        const wrist = landmarks[0];
        const middleMCP = landmarks[9];
        const handRefSize = Math.sqrt(
          Math.pow(wrist.x - middleMCP.x, 2) +
          Math.pow(wrist.y - middleMCP.y, 2) +
          Math.pow(wrist.z - middleMCP.z, 2)
        );

        // Normalize hand size for Z-depth (0 to 1)
        // Typical range for webcam: 0.05 (far) to 0.3 (close)
        let handSize = (handRefSize - 0.05) / (0.25 - 0.05);
        handSize = Math.max(0, Math.min(1, handSize));

        // --- 2. Scale-Invariant Pinch Detection ---
        // Thumb tip (4) vs Index tip (8)
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const rawDistance = Math.sqrt(
          Math.pow(thumbTip.x - indexTip.x, 2) +
          Math.pow(thumbTip.y - indexTip.y, 2) +
          Math.pow(thumbTip.z - indexTip.z, 2)
        );

        // Divide by handRefSize to get a ratio independent of camera distance
        const pinchRatio = rawDistance / handRefSize;

        // Tuned Ratio Thresholds:
        // ~0.2 or less is usually closed
        // ~0.5 or more is open
        let pinchFactor = (pinchRatio - 0.2) / (0.5 - 0.2);
        pinchFactor = Math.max(0, Math.min(1, pinchFactor));

        // --- 3. Position Tracking ---
        const rawX = middleMCP.x;
        const rawY = middleMCP.y;

        const x = (1 - rawX) * 2 - 1;
        const y = -(rawY * 2 - 1);

        // --- 4. Velocity Calculation ---
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTimeRef.current) / 1000;
        let velocity = { x: 0, y: 0 };

        if (deltaTime > 0 && deltaTime < 0.2) {
           velocity.x = (x - lastPositionRef.current.x) / deltaTime;
           velocity.y = (y - lastPositionRef.current.y) / deltaTime;
        }

        lastPositionRef.current = { x, y };
        lastTimeRef.current = currentTime;

        onHandUpdate({
          isDetected: true,
          pinchDistance: pinchFactor,
          position: { x, y },
          velocity,
          handSize
        });
      } else {
        onHandUpdate({
          isDetected: false,
          pinchDistance: 1.0,
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          handSize: 0.5
        });
      }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-0 h-0"
      />
    </div>
  );
};

export default HandTracker;
