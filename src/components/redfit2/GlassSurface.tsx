import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./GlassSurface.css";

type Channel = "R" | "G" | "B";

export interface GlassSurfaceProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: Channel;
  yChannel?: Channel;
  mixBlendMode?: string;
  className?: string;
  style?: CSSProperties;
}

const supportsSVGFilters = (filterId: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const ua = navigator.userAgent;
  const isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  if (isWebkit || isFirefox) return false;
  const div = document.createElement("div");
  div.style.backdropFilter = `url(#${filterId})`;
  return div.style.backdropFilter !== "";
};

export default function GlassSurface({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}: GlassSurfaceProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const feImageRef = useRef<SVGFEImageElement | null>(null);
  const redRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const greenRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blueRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width || 400;
    const h = rect?.height || 200;
    const edge = Math.min(w, h) * (borderWidth * 0.5);
    const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})" />
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}" />
      <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const updateMap = () => {
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  };

  useEffect(() => {
    updateMap();
    [
      { ref: redRef, offset: redOffset },
      { ref: greenRef, offset: greenOffset },
      { ref: blueRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute("scale", (distortionScale + offset).toString());
        ref.current.setAttribute("xChannelSelector", xChannel);
        ref.current.setAttribute("yChannelSelector", yChannel);
      }
    });
    blurRef.current?.setAttribute("stdDeviation", displace.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, displace, distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, mixBlendMode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => setTimeout(updateMap, 0));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSvgSupported(supportsSVGFilters(filterId));
  }, [filterId]);

  const containerStyle: CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    ["--glass-frost" as string]: backgroundOpacity,
    ["--glass-saturation" as string]: saturation,
    ["--filter-id" as string]: `url(#${filterId})`,
  };

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${svgSupported ? "glass-surface--svg" : "glass-surface--fallback"} ${className}`}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" result="map" />
            <feDisplacementMap ref={redRef} in="SourceGraphic" in2="map" id="redchannel" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 1 0" result="red" />
            <feDisplacementMap ref={greenRef} in="SourceGraphic" in2="map" id="greenchannel" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0
              0 1 0 0 0
              0 0 0 0 0
              0 0 0 1 0" result="green" />
            <feDisplacementMap ref={blueRef} in="SourceGraphic" in2="map" id="bluechannel" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0
              0 0 0 0 0
              0 0 1 0 0
              0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={blurRef} in="output" stdDeviation={displace} />
          </filter>
        </defs>
      </svg>
      <div className="glass-surface__content">{children}</div>
    </div>
  );
}
