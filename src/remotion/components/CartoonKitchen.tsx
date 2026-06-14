import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

type CartoonKitchenProps = {
  primaryColor: string;
};

export const CartoonKitchen: React.FC<CartoonKitchenProps> = ({primaryColor}) => {
  const frame = useCurrentFrame();
  const windowGlow = interpolate(frame, [0, 90, 450], [0.45, 0.7, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #4f4d66 0%, #665a48 34%, #d8b46b 35%, #f8d88e 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 220,
          width: 300,
          height: 320,
          borderRadius: 30,
          backgroundColor: '#2f3549',
          border: '12px solid #fff6d7',
          boxShadow: '0 18px 40px rgba(0,0,0,0.16)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 18,
            borderRadius: 20,
            background: `linear-gradient(180deg, rgba(246,195,20,${windowGlow}) 0%, rgba(255, 230, 155, 0.18) 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 8,
            marginLeft: -4,
            backgroundColor: '#fff6d7',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 500,
          top: 250,
          width: 420,
          height: 210,
          borderRadius: 28,
          backgroundColor: '#fff6e8',
          boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 42,
            width: 110,
            height: 110,
            borderRadius: 999,
            border: '14px solid #131313',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 178,
            top: 36,
            width: 180,
            height: 22,
            borderRadius: 999,
            backgroundColor: primaryColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 178,
            top: 86,
            width: 148,
            height: 18,
            borderRadius: 999,
            backgroundColor: '#222222',
            opacity: 0.16,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 178,
            top: 132,
            width: 196,
            height: 18,
            borderRadius: 999,
            backgroundColor: '#222222',
            opacity: 0.12,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 68,
          right: 68,
          bottom: 380,
          height: 380,
          borderRadius: 50,
          backgroundColor: '#ffe9b7',
          border: '6px solid rgba(17,17,17,0.06)',
          boxShadow: '0 28px 44px rgba(0,0,0,0.12)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 760,
          height: 38,
          borderRadius: 999,
          backgroundColor: '#fff7df',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 360,
          height: 30,
          borderRadius: 999,
          backgroundColor: 'rgba(17,17,17,0.08)',
        }}
      />
      {[110, 330, 550, 770].map((left, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left,
            bottom: 450,
            width: 180,
            height: 260,
            borderRadius: 30,
            border: '4px solid rgba(17,17,17,0.08)',
            backgroundColor: 'rgba(255,255,255,0.18)',
          }}
        />
      ))}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            right: 98 + index * 92,
            bottom: 860,
            width: 54,
            height: 140,
            borderRadius: 18,
            backgroundColor: ['#f28d52', '#f6c314', '#fff6e8'][index],
            boxShadow: '0 14px 20px rgba(0,0,0,0.12)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
