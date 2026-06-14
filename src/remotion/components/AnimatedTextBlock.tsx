import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type AnimatedTextBlockProps = {
  title: string;
  subtitle?: string;
  cta?: string;
  align: 'left' | 'center';
  top: number;
  left: number;
  width: number;
  accentColor: string;
  mode: 'bounce' | 'slide' | 'rise';
};

export const AnimatedTextBlock: React.FC<AnimatedTextBlockProps> = ({
  title,
  subtitle,
  cta,
  align,
  top,
  left,
  width,
  accentColor,
  mode,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = spring({
    frame,
    fps,
    config: {damping: 11, stiffness: 120},
  });

  const yOffset =
    mode === 'bounce'
      ? interpolate(frame, [0, 16, 28], [80, -16, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : mode === 'slide'
        ? interpolate(frame, [0, 18], [38, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })
        : interpolate(frame, [0, 18], [56, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleChars = Math.floor(interpolate(frame, [0, 24], [0, title.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        opacity,
        transform: `translateY(${yOffset}px) scale(${0.96 + reveal * 0.04})`,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255, 250, 242, 0.9)',
          padding: '18px 24px',
          borderRadius: 28,
          marginBottom: 24,
          border: `3px solid ${accentColor}`,
          boxShadow: '0 16px 30px rgba(0,0,0,0.14)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 92,
            lineHeight: 0.95,
            fontWeight: 900,
            color: '#111111',
            letterSpacing: -2,
          }}
        >
          {title.slice(0, titleChars)}
        </h1>
      </div>
      {subtitle ? (
        <p
          style={{
            margin: 0,
            fontSize: 42,
            lineHeight: 1.12,
            maxWidth: width,
            fontWeight: 700,
            color: '#2d2d2d',
            backgroundColor: 'rgba(255, 250, 242, 0.76)',
            padding: '16px 22px',
            borderRadius: 24,
          }}
        >
          {subtitle}
        </p>
      ) : null}
      {cta ? (
        <div
          style={{
            marginTop: 28,
            padding: '18px 28px',
            borderRadius: 999,
            backgroundColor: '#111111',
            color: accentColor,
            fontSize: 36,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {cta}
        </div>
      ) : null}
    </div>
  );
};
