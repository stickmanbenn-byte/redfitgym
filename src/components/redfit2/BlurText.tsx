import { motion } from "motion/react";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Direction = "top" | "bottom";

export interface BlurTextProps {
  /** Plain text. If omitted, `children` is walked and inline elements (e.g. accent spans) are preserved. */
  text?: string;
  children?: ReactNode;
  /** Element tag to render. Defaults to `p`. */
  as?: React.ElementType;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: Direction;
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  className?: string;
  style?: CSSProperties;
  onAnimationComplete?: () => void;
}

const DEFAULT_TO = (dir: Direction) => [
  { filter: "blur(5px)", opacity: 0.5, y: dir === "top" ? 5 : -5 },
  { filter: "blur(0px)", opacity: 1, y: 0 },
];

const DEFAULT_FROM = (dir: Direction) =>
  dir === "top"
    ? { filter: "blur(10px)", opacity: 0, y: -24 }
    : { filter: "blur(10px)", opacity: 0, y: 24 };

/**
 * BlurText — blur/fade reveal on scroll into view.
 *
 * Supports either a `text` string (like React Bits' original) or JSX `children`
 * with inline styling preserved (e.g. `<span className="rf-accent">accent</span>`).
 */
export default function BlurText({
  text,
  children,
  as: Tag = "p",
  delay = 80,
  animateBy = "words",
  direction = "top",
  threshold = 0.15,
  rootMargin = "0px",
  stepDuration = 0.35,
  className = "",
  style,
  onAnimationComplete,
}: BlurTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const from = useMemo(() => DEFAULT_FROM(direction), [direction]);
  const to = useMemo(() => DEFAULT_TO(direction), [direction]);
  const stepCount = to.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = useMemo(
    () => Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1))),
    [stepCount],
  );

  // Build tokens up-front so we know the total count for onAnimationComplete.
  const tokens = useMemo(() => tokenize(text ?? children, animateBy), [text, children, animateBy]);
  const totalTokens = countTokens(tokens);

  let running = 0;
  const consume = () => running++;

  const renderTokens = (nodes: TokenNode[]): ReactNode =>
    nodes.map((node, i) => {
      if (node.kind === "word") {
        const myIdx = consume();
        const isLast = myIdx === totalTokens - 1;
        return (
          <motion.span
            key={`w-${myIdx}`}
            style={{ display: "inline-block", willChange: "transform,filter,opacity" }}
            initial={from}
            animate={
              inView
                ? {
                    filter: [from.filter, to[0].filter, to[1].filter],
                    opacity: [from.opacity, to[0].opacity, to[1].opacity],
                    y: [from.y, to[0].y, to[1].y],
                  }
                : from
            }
            transition={{ duration: totalDuration, times, delay: (myIdx * delay) / 1000 }}
            onAnimationComplete={isLast ? onAnimationComplete : undefined}
          >
            {node.value}
          </motion.span>
        );
      }
      if (node.kind === "space") {
        return <Fragment key={`s-${i}`}>{"\u00A0"}</Fragment>;
      }
      // wrapper element — clone with rendered children
      return cloneElement(node.element, { key: `e-${i}` }, renderTokens(node.children));
    });

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={style}
    >
      {renderTokens(tokens)}
    </Component>
  );
}

/* -------- token model -------- */

type TokenNode =
  | { kind: "word"; value: string }
  | { kind: "space" }
  | { kind: "element"; element: React.ReactElement; children: TokenNode[] };

function tokenize(node: ReactNode, animateBy: "words" | "letters"): TokenNode[] {
  const out: TokenNode[] = [];
  const push = (n: ReactNode) => {
    if (n == null || n === false || n === true) return;
    if (typeof n === "string" || typeof n === "number") {
      const str = String(n);
      const parts = str.split(/(\s+)/);
      for (const p of parts) {
        if (p === "") continue;
        if (/^\s+$/.test(p)) {
          out.push({ kind: "space" });
          continue;
        }
        if (animateBy === "letters") {
          for (const ch of Array.from(p)) out.push({ kind: "word", value: ch });
        } else {
          out.push({ kind: "word", value: p });
        }
      }
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(push);
      return;
    }
    if (isValidElement(n)) {
      const kids = tokenize((n.props as { children?: ReactNode }).children, animateBy);
      out.push({ kind: "element", element: n, children: kids });
    }
  };
  Children.forEach(node, push);
  return out;
}

function countTokens(nodes: TokenNode[]): number {
  let n = 0;
  for (const node of nodes) {
    if (node.kind === "word") n++;
    else if (node.kind === "element") n += countTokens(node.children);
  }
  return n;
}
