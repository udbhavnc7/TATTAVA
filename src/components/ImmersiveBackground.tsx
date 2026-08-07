import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  twinkle: number;
  phase: number;
}

/**
 * Immersive 3D starfield / particle nebula that slowly drifts behind the app
 * and reacts to the pointer. Lightweight canvas — no WebGL required. Hovering
 * draws a soft radial "gravity" trail and connects nearby particles with
 * translucent tethers for a futuristic feel.
 */
export default function ImmersiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = canvas.width = window.innerWidth * DPR;
      height = canvas.height = window.innerHeight * DPR;
    };
    resize();
    window.addEventListener('resize', resize);

    let pointer = { x: -9999, y: -9999, active: false };

    const count = Math.min(130, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.2 + Math.random() * 0.8, // depth factor for parallax
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.8 + Math.random() * 1.8,
      hue: Math.random() > 0.5 ? 190 : 275, // teal / purple
      twinkle: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX * DPR;
      pointer.y = e.clientY * DPR;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const draw = (t: number) => {
      if (reduced) {
        // Static sparse field, no animation
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,240,255,0.15)';
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Drift
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.phase += 0.015;

        // Pointer gravity + rush effect
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = ((220 - dist) / 220) * 0.4;
            p.vx += (dx / (dist || 1)) * force * 0.05;
            p.vy += (dy / (dist || 1)) * force * 0.05;
            p.vx *= 0.92;
            p.vy *= 0.92;
          }
        }

        // Draw particle dot with pulsing glow
        const alpha = p.twinkle * (0.5 + 0.5 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Tether nearby particles to the pointer for a constellation effect
      if (pointer.active) {
        ctx.lineWidth = DPR * 0.5;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            const a = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(181,60,255,${a})`;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 w-full h-full"
    />
  );
}