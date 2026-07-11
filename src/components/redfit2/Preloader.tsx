import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-init";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let fontsReady = false;
    let framesReady = false;

    const checkDone = () => {
      if (fontsReady && framesReady && !done) {
        // Small delay so first paint is sharp
        setTimeout(() => {
          if (ref.current) {
            gsap.to(ref.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power3.out",
              onComplete: () => setDone(true),
            });
          } else {
            setDone(true);
          }
        }, 200);
      }
    };

    const handleProgress = (e: Event) => {
      const { loaded, total } = (e as CustomEvent).detail;
      const pct = Math.round((loaded / total) * 100);
      setProgress(pct);
      if (loaded >= total) {
        framesReady = true;
        checkDone();
      }
    };

    window.addEventListener("rf-frame-progress", handleProgress);

    // Font readiness
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready
        .then(() => {
          fontsReady = true;
          checkDone();
        })
        .catch(() => {
          fontsReady = true;
          checkDone();
        });
    } else {
      fontsReady = true;
    }

    // Fallback: auto-dismiss after 5s even if frames haven't loaded
    const fallback = setTimeout(() => {
      framesReady = true;
      fontsReady = true;
      checkDone();
    }, 5000);

    return () => {
      window.removeEventListener("rf-frame-progress", handleProgress);
      clearTimeout(fallback);
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={ref} className="rf-preloader">
      <div className="rf-preloader-inner">
        <span className="rf-preloader-brand">
          RED<span>FIT</span>
        </span>
        <div className="rf-preloader-bar">
          <div className="rf-preloader-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="rf-preloader-pct">{progress}%</span>
      </div>
    </div>
  );
}
