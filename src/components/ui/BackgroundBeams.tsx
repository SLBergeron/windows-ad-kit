'use client'

import React from 'react'

export function BackgroundBeams() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 107, 107, 0)" />
            <stop offset="50%" stopColor="rgba(255, 107, 107, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 107, 107, 0)" />
          </linearGradient>
          <linearGradient id="beam2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </linearGradient>
          <linearGradient id="beam3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        
        {/* Animated Beams */}
        <g>
          <path
            d="M-100 -100 L400 400 L300 500 L-200 0 Z"
            fill="url(#beam1)"
            style={{
              animation: 'beam1 8s ease-in-out infinite',
              opacity: 0.7
            }}
          />
          <path
            d="M600 -100 L1100 400 L1000 500 L500 0 Z"
            fill="url(#beam2)"
            style={{
              animation: 'beam2 10s ease-in-out infinite',
              animationDelay: '2s',
              opacity: 0.5
            }}
          />
          <path
            d="M200 1000 L700 500 L800 600 L300 1100 Z"
            fill="url(#beam3)"
            style={{
              animation: 'beam3 12s ease-in-out infinite',
              animationDelay: '4s',
              opacity: 0.3
            }}
          />
          <path
            d="M-200 500 L300 100 L400 200 L-100 600 Z"
            fill="url(#beam1)"
            style={{
              animation: 'beam1 15s ease-in-out infinite reverse',
              animationDelay: '1s',
              opacity: 0.4
            }}
          />
          <path
            d="M800 1000 L1300 500 L1200 400 L700 900 Z"
            fill="url(#beam2)"
            style={{
              animation: 'beam2 9s ease-in-out infinite',
              animationDelay: '3s',
              opacity: 0.6
            }}
          />
        </g>
      </svg>
      
      <style jsx>{`
        @keyframes beam1 {
          0%, 100% {
            transform: translateX(-50px) translateY(-50px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(50px) translateY(50px) rotate(5deg);
            opacity: 0.8;
          }
        }
        
        @keyframes beam2 {
          0%, 100% {
            transform: translateX(30px) translateY(-30px) rotate(-2deg);
            opacity: 0.2;
          }
          50% {
            transform: translateX(-30px) translateY(30px) rotate(3deg);
            opacity: 0.7;
          }
        }
        
        @keyframes beam3 {
          0%, 100% {
            transform: translateX(-20px) translateY(40px) rotate(1deg);
            opacity: 0.1;
          }
          50% {
            transform: translateX(40px) translateY(-20px) rotate(-4deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default BackgroundBeams