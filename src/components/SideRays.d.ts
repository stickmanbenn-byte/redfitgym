declare module "@/components/SideRays" {
  import * as React from "react";
  export interface SideRaysProps {
    speed?: number;
    rayColor1?: string;
    rayColor2?: string;
    intensity?: number;
    spread?: number;
    origin?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    tilt?: number;
    saturation?: number;
    blend?: number;
    falloff?: number;
    opacity?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  const SideRays: React.FC<SideRaysProps>;
  export default SideRays;
}
