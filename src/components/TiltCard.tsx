import { ReactNode, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  style?: React.CSSProperties;
}

/**
 * A wrapper that gives any card a subtle 3D "follow the cursor" tilt with a
 * glossy specular highlight. Drop it around dashboard cards / panels to make
 * the workspace feel dimensional and interactive.
 */
export default function TiltCard({ children, className, intensity = 10, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRx = useSpring(rx, { stiffness: 240, damping: 18, mass: 0.5 });
  const springRy = useSpring(ry, { stiffness: 240, damping: 18, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      ry.set((px - 0.5) * intensity);
      rx.set((0.5 - py) * intensity);
      glareX.set(px * 100);
      glareY.set(py * 100);
    },
    [intensity, rx, ry, glareX, glareY]
  );

  const onMouseLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rx, ry, glareX, glareY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective: 900,
        rotateX: springRx,
        rotateY: springRy,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}