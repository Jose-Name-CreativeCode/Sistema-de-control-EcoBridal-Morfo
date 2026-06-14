import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AnimatedTextBlock} from '../components/AnimatedTextBlock';
import {BacteriaCluster} from '../components/BacteriaCluster';
import {CartoonKitchen} from '../components/CartoonKitchen';
import {CartoonCockroach} from '../components/CartoonCockroach';
import {PestControlTechnician} from '../components/PestControlTechnician';

export type SceneText = {
  title: string;
  subtitle?: string;
  cta?: string;
};

export type BrandConfig = {
  brandName: string;
  phone: string;
  primaryColor: string;
  ctaLabel: string;
};

export type CockroachInstagramReelProps = {
  brand: BrandConfig;
  totalFrames: number;
  sceneTexts: {
    hook: SceneText;
    warning: SceneText;
    risk: SceneText;
    solution: SceneText;
  };
};

export const defaultCockroachReelProps: CockroachInstagramReelProps = {
  brand: {
    brandName: 'EcoBridal Control',
    phone: '55 1234 5678',
    primaryColor: '#f6c314',
    ctaLabel: 'Agenda tu servicio',
  },
  totalFrames: 450,
  sceneTexts: {
    hook: {
      title: '¿Viste una cucaracha?',
      subtitle: 'No siempre viene sola.',
    },
    warning: {
      title: 'Puede haber más escondidas.',
      subtitle: 'Se mueven por grietas y rincones.',
    },
    risk: {
      title: 'Contaminan superficies y alimentos.',
      subtitle: 'Actúa antes de que el problema crezca.',
    },
    solution: {
      title: 'Prevén a tiempo.',
      subtitle: 'Control profesional de plagas',
      cta: 'Agenda tu servicio',
    },
  },
};

const sceneRanges = {
  hook: {from: 0, duration: 90},
  warning: {from: 90, duration: 120},
  risk: {from: 210, duration: 120},
  solution: {from: 330, duration: 120},
};

const palette = {
  black: '#111111',
  white: '#fffaf2',
  warmLight: '#ffe3a6',
  warmMid: '#ffce63',
  warmDark: '#e5a200',
  brown: '#654321',
  alert: '#ff7b54',
  softShadow: 'rgba(0, 0, 0, 0.18)',
};

const sceneContainer: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
};

const badgeStyle = (primaryColor: string): React.CSSProperties => ({
  position: 'absolute',
  top: 68,
  left: 60,
  padding: '16px 24px',
  borderRadius: 999,
  backgroundColor: 'rgba(255, 250, 242, 0.9)',
  border: `3px solid ${primaryColor}`,
  color: palette.black,
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  boxShadow: `0 18px 30px ${palette.softShadow}`,
});

const footerStyle = (primaryColor: string): React.CSSProperties => ({
  position: 'absolute',
  bottom: 56,
  left: 54,
  right: 54,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  padding: '22px 28px',
  borderRadius: 36,
  backgroundColor: 'rgba(17, 17, 17, 0.92)',
  border: `2px solid ${primaryColor}`,
  color: palette.white,
  boxShadow: `0 24px 38px ${palette.softShadow}`,
});

const shadowBlob = (
  left: number,
  top: number,
  scale: number,
  opacity: number,
): React.CSSProperties => ({
  position: 'absolute',
  width: 120 * scale,
  height: 70 * scale,
  left,
  top,
  borderRadius: 999,
  backgroundColor: `rgba(17,17,17,${opacity})`,
  filter: 'blur(8px)',
});

export const CockroachInstagramReel: React.FC<CockroachInstagramReelProps> = ({
  brand,
  sceneTexts,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const masterScale = interpolate(frame, [0, 450], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const vignetteOpacity = interpolate(frame, [0, 180, 450], [0.08, 0.16, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${palette.warmLight} 0%, ${brand.primaryColor} 45%, ${palette.warmDark} 100%)`,
        fontFamily: '"Trebuchet MS", "Avenir Next", sans-serif',
        transform: `scale(${masterScale})`,
      }}
    >
      <CartoonKitchen primaryColor={brand.primaryColor} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 42%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0) 44%)',
          opacity: vignetteOpacity,
        }}
      />

      <div style={badgeStyle(brand.primaryColor)}>{brand.brandName}</div>

      <Sequence from={sceneRanges.hook.from} durationInFrames={sceneRanges.hook.duration}>
        <SceneHook text={sceneTexts.hook} primaryColor={brand.primaryColor} />
      </Sequence>

      <Sequence from={sceneRanges.warning.from} durationInFrames={sceneRanges.warning.duration}>
        <SceneWarning text={sceneTexts.warning} primaryColor={brand.primaryColor} />
      </Sequence>

      <Sequence from={sceneRanges.risk.from} durationInFrames={sceneRanges.risk.duration}>
        <SceneRisk text={sceneTexts.risk} primaryColor={brand.primaryColor} />
      </Sequence>

      <Sequence from={sceneRanges.solution.from} durationInFrames={sceneRanges.solution.duration}>
        <SceneSolution
          text={sceneTexts.solution}
          primaryColor={brand.primaryColor}
          phone={brand.phone}
          ctaLabel={brand.ctaLabel}
        />
      </Sequence>

      <div style={footerStyle(brand.primaryColor)}>
        <span style={{fontSize: 36, fontWeight: 900}}>Control de plagas</span>
        <span style={{fontSize: 30, fontWeight: 700}}>{brand.phone}</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneHook: React.FC<{text: SceneText; primaryColor: string}> = ({
  text,
  primaryColor,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cockroachX = interpolate(frame, [0, 28], [-180, 210], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.21, 0.9, 0.31, 1),
  });
  const cockroachY = interpolate(frame, [0, 28], [1360, 1220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoom = interpolate(frame, [0, 90], [1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const shineOpacity = interpolate(frame, [10, 36], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{...sceneContainer, transform: `scale(${zoom})`}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 72% 28%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 30%)',
          opacity: shineOpacity,
        }}
      />
      <div style={{...shadowBlob(150, 1310, 1.4, 0.16)}} />
      <div style={{position: 'absolute', left: cockroachX, top: cockroachY}}>
        <CartoonCockroach scale={1.45} facing="right" />
      </div>
      <AnimatedTextBlock
        title={text.title}
        subtitle={text.subtitle}
        align="left"
        top={250}
        left={70}
        width={620}
        accentColor={primaryColor}
        mode="bounce"
      />
      <AlertPill text="Hook visual" top={980} left={70} />
    </div>
  );
};

const SceneWarning: React.FC<{text: SceneText; primaryColor: string}> = ({
  text,
  primaryColor,
}) => {
  const frame = useCurrentFrame();
  const reveal = spring({
    frame,
    fps: useVideoConfig().fps,
    config: {damping: 12, stiffness: 110},
  });
  const alertScale = interpolate(frame, [0, 22, 50], [0.8, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={sceneContainer}>
      <div style={{...shadowBlob(410, 1120, 1.7, 0.18)}} />
      <div style={{position: 'absolute', left: 430, top: 1020}}>
        <CartoonCockroach scale={1.5} facing="left" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          right: 86,
          width: 100,
          height: 100,
          borderRadius: 999,
          backgroundColor: palette.alert,
          color: palette.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 50,
          fontWeight: 900,
          transform: `scale(${alertScale})`,
          boxShadow: `0 16px 30px rgba(255, 123, 84, 0.35)`,
        }}
      >
        !
      </div>
      {[
        {left: 156, top: 1120, scale: 0.62, delay: 10},
        {left: 820, top: 1180, scale: 0.52, delay: 18},
        {left: 250, top: 1420, scale: 0.48, delay: 28},
        {left: 722, top: 1452, scale: 0.58, delay: 34},
      ].map((shadow, index) => {
        const opacity = interpolate(frame, [shadow.delay, shadow.delay + 14], [0, 0.28], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={index}
            style={{
              ...shadowBlob(shadow.left, shadow.top, shadow.scale, opacity),
              transform: `scale(${reveal})`,
            }}
          />
        );
      })}
      <AnimatedTextBlock
        title={text.title}
        subtitle={text.subtitle}
        align="center"
        top={250}
        left={120}
        width={840}
        accentColor={primaryColor}
        mode="slide"
      />
      <AlertPill text="Revisa grietas y rincones" top={760} left={230} />
    </div>
  );
};

const SceneRisk: React.FC<{text: SceneText; primaryColor: string}> = ({
  text,
  primaryColor,
}) => {
  const frame = useCurrentFrame();
  const panX = interpolate(frame, [0, 120], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{...sceneContainer, transform: `translateX(${panX}px)`}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 320,
          height: 280,
          borderRadius: 42,
          backgroundColor: 'rgba(255, 250, 242, 0.74)',
          border: '4px solid rgba(17,17,17,0.08)',
          boxShadow: `0 24px 40px ${palette.softShadow}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 128,
          bottom: 560,
          width: 300,
          height: 24,
          borderRadius: 999,
          backgroundColor: '#f4f4f4',
          boxShadow: `0 10px 18px rgba(0, 0, 0, 0.08)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 212,
          bottom: 584,
          width: 132,
          height: 92,
          borderRadius: '0 0 56px 56px',
          border: '10px solid #f4f4f4',
          borderTop: '0',
          backgroundColor: 'transparent',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 130,
          bottom: 520,
          width: 180,
          height: 120,
          borderRadius: 20,
          backgroundColor: '#ffb16e',
          boxShadow: `0 12px 24px rgba(0, 0, 0, 0.12)`,
        }}
      />
      <div style={{position: 'absolute', right: 200, bottom: 620}}>
        <CartoonCockroach scale={1.15} facing="left" />
      </div>
      <BacteriaCluster accentColor={primaryColor} />
      <AnimatedTextBlock
        title={text.title}
        subtitle={text.subtitle}
        align="left"
        top={240}
        left={80}
        width={760}
        accentColor={primaryColor}
        mode="rise"
      />
    </div>
  );
};

const SceneSolution: React.FC<{
  text: SceneText;
  primaryColor: string;
  phone: string;
  ctaLabel: string;
}> = ({text, primaryColor, phone, ctaLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const clearOpacity = interpolate(frame, [0, 22], [0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sparkle = spring({
    frame: frame - 12,
    fps,
    config: {damping: 11, stiffness: 90},
  });

  return (
    <div style={sceneContainer}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,250,242,0.15) 0%, rgba(255,255,255,0.32) 100%)',
          opacity: wipe,
        }}
      />
      <div style={{position: 'absolute', left: 120, bottom: 560}}>
        <PestControlTechnician primaryColor={primaryColor} scale={1.45} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 160,
          bottom: 610,
          opacity: clearOpacity,
          transform: `scale(${1.1 - clearOpacity * 0.15})`,
        }}
      >
        <CartoonCockroach scale={1.05} facing="left" />
      </div>
      <AnimatedTextBlock
        title={text.title}
        subtitle={text.subtitle}
        cta={text.cta ?? ctaLabel}
        align="center"
        top={210}
        left={110}
        width={860}
        accentColor={primaryColor}
        mode="bounce"
      />
      {[0, 1, 2].map((index) => {
        const offsets = [
          {left: 880, top: 380},
          {left: 780, top: 1120},
          {left: 240, top: 1280},
        ][index];
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: offsets.left,
              top: offsets.top,
              fontSize: 82,
              color: palette.white,
              transform: `scale(${sparkle}) rotate(${sparkle * 20}deg)`,
              textShadow: `0 10px 20px rgba(0, 0, 0, 0.18)`,
            }}
          >
            ✦
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 130,
          bottom: 220,
          padding: '26px 34px',
          borderRadius: 34,
          backgroundColor: 'rgba(255, 250, 242, 0.94)',
          color: palette.black,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: `0 24px 44px ${palette.softShadow}`,
          border: `3px solid ${primaryColor}`,
        }}
      >
        <span style={{fontSize: 28, fontWeight: 700}}>Atención rápida</span>
        <span style={{fontSize: 40, fontWeight: 900}}>{phone}</span>
      </div>
    </div>
  );
};

const AlertPill: React.FC<{text: string; top: number; left: number}> = ({
  text,
  top,
  left,
}) => {
  const frame = useCurrentFrame();
  const floatY = interpolate(frame, [0, 45], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        padding: '14px 22px',
        borderRadius: 999,
        backgroundColor: 'rgba(17,17,17,0.82)',
        color: palette.white,
        fontSize: 28,
        fontWeight: 700,
        transform: `translateY(${floatY}px)`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
