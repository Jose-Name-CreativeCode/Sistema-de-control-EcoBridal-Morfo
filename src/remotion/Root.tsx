import {Composition} from 'remotion';
import {
  CockroachInstagramReel,
  type CockroachInstagramReelProps,
  defaultCockroachReelProps,
} from './compositions/CockroachInstagramReel';

export const RemotionRoot = () => {
  return (
    <Composition
      id="CockroachInstagramReel"
      component={CockroachInstagramReel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={defaultCockroachReelProps.totalFrames}
      defaultProps={defaultCockroachReelProps satisfies CockroachInstagramReelProps}
    />
  );
};
