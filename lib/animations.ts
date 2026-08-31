const defaultDuration = 0.5;
const defaultIntensity = 1;
const defaultDelay = 0.15;
const defaultEasing = 'easeIn';

export const fadeUp = (speed = defaultDuration, intensity = defaultIntensity) => ({
  initial: {
    opacity: 0,
    y: 16 * intensity,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: speed,
    delay: defaultDelay,
    ease: defaultEasing,
  }
});

export const fadeDown = (speed = defaultDuration, intensity = defaultIntensity) => ({
  initial: {
    opacity: 0,
    y: 16 * intensity * -1,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: speed,
    delay: defaultDelay,
    ease: defaultEasing,
  }
});

export const fadeLeft = (speed = defaultDuration, intensity = defaultIntensity) => ({
  initial: {
    opacity: 0,
    x: 16 * intensity * -1,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  transition: {
    duration: speed,
    delay: defaultDelay,
    ease: defaultEasing,
  }
});

export const stagger = (delay: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

export const fadeIn = ({ y = 0, scale = 1 }: { y?: number; scale?: number } = {}) => ({
  hidden: { opacity: 0, y, scale },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
});
