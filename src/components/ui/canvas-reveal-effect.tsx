"use client";

import React, { useEffect, useRef, useState } from 'react';

interface CanvasRevealEffectProps {
  colors?: [number, number, number][];
  dotSize?: number;
  animationSpeed?: number;
  containerClassName?: string;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  colors = [[255, 107, 107], [238, 90, 36], [245, 158, 11]],
  dotSize = 2,
  animationSpeed = 0.3,
  containerClassName = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Animation variables
    let startTime = Date.now();
    const dots: Array<{
      x: number;
      y: number;
      opacity: number;
      delay: number;
      color: [number, number, number];
    }> = [];

    // Create dots grid
    const spacing = dotSize * 8;
    const rect = canvas.getBoundingClientRect();
    
    for (let x = 0; x < rect.width; x += spacing) {
      for (let y = 0; y < rect.height; y += spacing) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const delay = (distance / Math.max(rect.width, rect.height)) * 2000; // Max 2 second delay
        
        dots.push({
          x,
          y,
          opacity: 0,
          delay,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    // Animation loop
    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentTime = Date.now() - startTime;
      ctx.clearRect(0, 0, rect.width, rect.height);

      dots.forEach(dot => {
        if (currentTime > dot.delay) {
          const elapsed = (currentTime - dot.delay) * animationSpeed;
          dot.opacity = Math.min(1, elapsed / 1000); // Fade in over 1 second
          
          if (dot.opacity > 0) {
            ctx.globalAlpha = dot.opacity;
            ctx.fillStyle = `rgb(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, dotSize, animationSpeed, isVisible]);

  return (
    <div 
      className={`absolute inset-0 ${containerClassName}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    </div>
  );
};

export default CanvasRevealEffect;