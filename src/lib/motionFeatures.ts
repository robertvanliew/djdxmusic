// Framer Motion (motion) animation features, loaded on demand through
// <LazyMotion features={loadMotionFeatures}> so small animated pieces on the
// homepage don't pull the full library into the first-paint bundle.
import { domAnimation } from 'motion/react';
export default domAnimation;
