import React, { useEffect, useRef } from 'react';

interface CelebrationConfettiProps {
  triggerKey?: string | number;
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  angle: number;
  angularVelocity: number;
  opacity: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;
}

const BRAND_COLORS = [
  '#fdc502', // Rumah Bersinar gold
  '#f1b607', // Warm amber
  '#ea580c', // Bright orange
  '#16a34a', // Emerald green
  '#10b981', // Mint green
  '#f59e0b', // Sunflower amber
  '#3b82f6', // Bright sky blue
  '#ec4899', // Joyful pink
];

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  triggerKey = 'default',
  durationMs = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = (canvas.width = parent ? parent.clientWidth : window.innerWidth);
    const height = (canvas.height = parent ? parent.clientHeight : window.innerHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();
    const particles: Particle[] = [];
    const count = 75;

    // Create celebratory burst from two origins (left & right centers)
    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      const originX = isLeft ? width * 0.25 : width * 0.75;
      const originY = height * 0.35;

      const angle = isLeft
        ? (Math.PI * 0.2) + Math.random() * (Math.PI * 0.5) // spray upwards & right
        : (Math.PI * 0.3) + Math.random() * (Math.PI * 0.5); // spray upwards & left

      const speed = 7 + Math.random() * 9;
      const vx = Math.cos(angle) * speed * (isLeft ? 1 : -1) * (0.8 + Math.random() * 0.6);
      const vy = -Math.sin(angle) * speed - (Math.random() * 4);

      particles.push({
        x: originX,
        y: originY,
        vx,
        vy,
        size: 5 + Math.random() * 6,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'rect' : 'star',
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        decay: 0.0035 + Math.random() * 0.004,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
      });
    }

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      for (let p of particles) {
        if (p.opacity <= 0.01) continue;
        activeParticles++;

        // Physics updates
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24; // gentle gravity
        p.vx *= 0.985; // drag
        p.angle += p.angularVelocity;
        p.wobble += p.wobbleSpeed;
        p.opacity = Math.max(0, p.opacity - p.decay);

        // Render particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const wobbleScale = Math.sin(p.wobble);

        if (p.shape === 'rect') {
          ctx.fillRect(
            -p.size / 2,
            (-p.size / 2) * wobbleScale,
            p.size * 1.5,
            p.size * wobbleScale
          );
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, (p.size / 2) * Math.abs(wobbleScale || 1), 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
        }

        ctx.restore();
      }

      if (elapsed < durationMs && activeParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [triggerKey, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 w-full h-full rounded-3xl overflow-hidden print:hidden"
      aria-hidden="true"
    />
  );
};
