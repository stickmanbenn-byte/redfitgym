import { type FC } from 'react';

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
  className?: string;
  originOffsetX?: number;
  originOffsetY?: number;
}

declare const SideRays: FC<SideRaysProps>;
export default SideRays;
