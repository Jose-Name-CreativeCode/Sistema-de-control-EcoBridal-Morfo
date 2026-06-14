import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type PestControlTechnicianProps = {
  primaryColor: string;
  scale?: number;
};

export const PestControlTechnician: React.FC<PestControlTechnicianProps> = ({
  primaryColor,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const armRotate = interpolate(frame % 36, [0, 18, 36], [-8, 8, -8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sprayWidth = interpolate(frame, [0, 18, 40], [0, 120, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sprayOpacity = interpolate(frame, [0, 12, 30], [0, 0.8, 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 460,
        transform: `scale(${scale})`,
        transformOrigin: 'left bottom',
      }}
    >
      <svg viewBox="0 0 360 460" width="100%" height="100%">
        <ellipse cx="180" cy="430" rx="110" ry="24" fill="rgba(17,17,17,0.12)" />
        <rect x="126" y="122" width="112" height="146" rx="32" fill={primaryColor} />
        <rect x="132" y="130" width="100" height="38" rx="18" fill="#fff5d2" opacity="0.8" />
        <rect x="138" y="264" width="38" height="112" rx="18" fill="#222222" />
        <rect x="188" y="264" width="38" height="112" rx="18" fill="#222222" />
        <rect x="126" y="368" width="48" height="26" rx="8" fill="#111111" />
        <rect x="180" y="368" width="48" height="26" rx="8" fill="#111111" />
        <circle cx="182" cy="82" r="42" fill="#ffd5ad" />
        <path d="M146 78 Q182 28 220 78 L220 96 L146 96 Z" fill="#111111" />
        <circle cx="168" cy="82" r="5" fill="#111111" />
        <circle cx="196" cy="82" r="5" fill="#111111" />
        <path d="M166 102 Q182 114 198 102" fill="none" stroke="#111111" strokeWidth="4" />
        <rect x="98" y="136" width="36" height="122" rx="18" fill="#ffd5ad" />
        <g transform={`rotate(${armRotate} 246 182)`}>
          <rect x="230" y="136" width="36" height="112" rx="18" fill="#ffd5ad" />
          <rect x="254" y="204" width="76" height="18" rx="9" fill="#4f4d66" />
          <rect x="300" y="194" width="22" height="38" rx="8" fill="#222222" />
        </g>
        <rect x="88" y="160" width="40" height="78" rx="18" fill="#f0f0f0" />
        <rect x="64" y="186" width="46" height="94" rx="16" fill="#ffffff" stroke="#111111" strokeWidth="6" />
        <rect x="74" y="164" width="28" height="34" rx="12" fill="#111111" />
        <path d="M82 288 Q114 258 150 280" fill="none" stroke="#111111" strokeWidth="8" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 270,
          top: 198,
          width: sprayWidth,
          height: 60,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 100%)',
          clipPath: 'polygon(0 40%, 100% 0, 100% 100%)',
          opacity: sprayOpacity,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};
