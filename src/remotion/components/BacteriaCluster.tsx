import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type BacteriaClusterProps = {
  accentColor: string;
};

const germs = [
  {left: 560, top: 820, size: 94, delay: 0},
  {left: 760, top: 900, size: 72, delay: 6},
  {left: 430, top: 1040, size: 84, delay: 12},
  {left: 690, top: 1110, size: 62, delay: 18},
  {left: 540, top: 1230, size: 74, delay: 24},
];

export const BacteriaCluster: React.FC<BacteriaClusterProps> = ({accentColor}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {germs.map((germ, index) => {
        const bob = interpolate(
          (frame + germ.delay) % 40,
          [0, 20, 40],
          [0, -16, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );
        const opacity = interpolate(frame, [germ.delay, germ.delay + 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: germ.left,
              top: germ.top + bob,
              width: germ.size,
              height: germ.size,
              opacity,
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="28" fill={accentColor} />
              <circle cx="50" cy="50" r="16" fill="#fff6d2" opacity={0.8} />
              {Array.from({length: 8}).map((_, spikeIndex) => {
                const angle = (Math.PI * 2 * spikeIndex) / 8;
                const x1 = 50 + Math.cos(angle) * 28;
                const y1 = 50 + Math.sin(angle) * 28;
                const x2 = 50 + Math.cos(angle) * 42;
                const y2 = 50 + Math.sin(angle) * 42;
                return (
                  <line
                    key={spikeIndex}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#111111"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                );
              })}
              <circle cx="42" cy="46" r="5" fill="#111111" />
              <circle cx="58" cy="46" r="5" fill="#111111" />
              <path d="M36 63 Q50 73 64 63" fill="none" stroke="#111111" strokeWidth="5" />
            </svg>
          </div>
        );
      })}
    </>
  );
};
