"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BeamOptions {
  initialX: number;
  translateX: number;
  duration: number;
  repeatDelay: number;
  delay?: number;
  className?: string;
  height?: string;
}

interface CollisionMechanismProps {
  beamOptions: BeamOptions;
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
}

interface ExplosionProps {
  delay: number;
}

const Explosion: React.FC<ExplosionProps> = ({ delay }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        ease: "easeOut",
        delay: delay,
        repeat: Infinity,
        repeatDelay: 5,
      }}
      className="absolute inset-0 z-50 [mask-image:radial-gradient(100px_100px_at_center,white,transparent)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400 to-transparent h-2 w-full rounded-full blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-1 w-full rounded-full blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent via-yellow-400 to-transparent h-0.5 w-full rounded-full blur-sm" />
    </motion.div>
  );
};

const CollisionMechanism: React.FC<CollisionMechanismProps> = ({
  beamOptions,
  containerRef,
  parentRef,
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState(false);
  const [beamKey, setBeamKey] = useState(0);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !collision
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          setCollision(true);
        }
      }
    };

    const animationId = setInterval(checkCollision, 50);

    return () => clearInterval(animationId);
  }, [collision, containerRef, parentRef]);

  useEffect(() => {
    if (collision) {
      setTimeout(() => {
        setCollision(false);
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate={{
          translateY: ["40vh", "-40vh"],
          translateX: [`${beamOptions.initialX}px`, `${beamOptions.translateX}px`],
        }}
        transition={{
          duration: beamOptions.duration,
          repeat: Infinity,
          repeatDelay: beamOptions.repeatDelay,
          delay: beamOptions.delay || 0,
          ease: "linear",
        }}
        className={`absolute left-0 top-20 m-auto rounded-full shadow-lg ${
          beamOptions.className || ""
        }`}
        style={{
          width: '2px',
          height: beamOptions.height || '56px',
          background: 'linear-gradient(to top, rgba(255, 107, 107, 0.8), rgba(238, 90, 36, 0.6), transparent)',
          boxShadow: '0 0 10px rgba(255, 107, 107, 0.6), 0 0 20px rgba(238, 90, 36, 0.4)',
          filter: 'blur(0.5px)'
        }}
      />
      <AnimatePresence>
        {collision && (
          <Explosion delay={0} />
        )}
      </AnimatePresence>
    </>
  );
};

interface AceternityBackgroundBeamsWithCollisionProps {
  children?: React.ReactNode;
  className?: string;
}

export const AceternityBackgroundBeamsWithCollision: React.FC<AceternityBackgroundBeamsWithCollisionProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams: BeamOptions[] = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "",
      height: "80px"
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "",
      height: "48px"
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "",
      height: "24px"
    },
  ];

  return (
    <div
      ref={parentRef}
      className={`absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {beams.map((beam, index) => (
        <CollisionMechanism
          key={`${beam.initialX}-beam-idx-${index}`}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      
      {/* Subtle glow from top */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '256px',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 107, 107, 0.08) 0%, rgba(238, 90, 36, 0.04) 40%, transparent 70%)',
          zIndex: 1
        }}
      />
      
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-gradient-to-t from-slate-900 to-transparent w-full inset-x-0 pointer-events-none h-32"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(34, 42, 53, 0.12)",
        }}
      />
    </div>
  );
};

AceternityBackgroundBeamsWithCollision.displayName = "AceternityBackgroundBeamsWithCollision";

export default AceternityBackgroundBeamsWithCollision;