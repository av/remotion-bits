import React from 'react';

export const MotionPrimitivesCardIcon: React.FC = () => {
  return (
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
      <style>
        {`
          @keyframes motionPrimitive {
            0%, 5% {
              transform: translate(-50%, -50%) rotate(0deg);
              border-radius: 0.25rem;
              background-color: var(--color-primary);
            }
            25%, 30% {
              transform: translate(50%, -50%) rotate(90deg);
              border-radius: 50%;
              background-color: white;
            }
            50%, 55% {
              transform: translate(50%, 50%) rotate(0deg);
              border-radius: 0.125rem;
              background-color: var(--color-primary);
            }
            75%, 80% {
              transform: translate(-50%, 50%) rotate(-90deg);
              border-radius: 0 50% 50% 50%;
              background-color: white;
            }
            100% {
              transform: translate(-50%, -50%) rotate(0deg);
              border-radius: 0.25rem;
              background-color: var(--color-primary);
            }
          }
        `}
      </style>
      <div
        className="w-4 h-4"
        style={{
          animation: 'motionPrimitive 3s ease-in-out infinite'
        }}
      />
    </div>
  );
};
