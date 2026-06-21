import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  trigger: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (trigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset particles
    particlesRef.current = [];
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const colors = ['#F97316', '#FB923C', '#22C55E', '#3B82F6', '#EC4899', '#FBBF24'];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height / 2 + (Math.random() - 0.5) * 80,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.8) * 12 - 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let runAnimation = false;

      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.28; // gravity
        p.speedX *= 0.97; // air resistance
        p.rotation += p.rotationSpeed;

        if (p.speedY > 0) {
          p.opacity -= 0.015; // fade out on downward fall
        }

        if (p.opacity > 0 && p.y < canvas.height) {
          runAnimation = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (runAnimation) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger]);

  // Adjust canvas bounds on load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 402;
      canvas.height = 874;
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="phone-confetti-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1100,
        width: '100%',
        height: '100%'
      }}
    />
  );
};
