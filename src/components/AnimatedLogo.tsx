import { useEffect, useState } from "react";

interface AnimatedLogoProps {
  className?: string;
  animate?: boolean;
}

export const AnimatedLogo = ({ className = "", animate = true }: AnimatedLogoProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (animate && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [animate, hasAnimated]);

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Seed/Base */}
      <ellipse
        cx="50"
        cy="85"
        rx="8"
        ry="4"
        fill="hsl(120, 61%, 34%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.3s"
            fill="freeze"
          />
        )}
      </ellipse>

      {/* Main Stem */}
      <path
        d="M 50 85 Q 50 60, 50 40"
        stroke="hsl(120, 61%, 34%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={animate && !hasAnimated ? "45" : "0"}
        strokeDashoffset={animate && !hasAnimated ? "45" : "0"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="stroke-dashoffset"
            from="45"
            to="0"
            dur="0.6s"
            begin="0.3s"
            fill="freeze"
          />
        )}
      </path>

      {/* Left Leaf */}
      <path
        d="M 50 50 Q 30 45, 25 35 Q 30 40, 50 45"
        fill="hsl(120, 61%, 40%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.3s"
            begin="0.7s"
            fill="freeze"
          />
        )}
      </path>

      {/* Right Leaf */}
      <path
        d="M 50 50 Q 70 45, 75 35 Q 70 40, 50 45"
        fill="hsl(120, 61%, 40%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.3s"
            begin="0.9s"
            fill="freeze"
          />
        )}
      </path>

      {/* Top Leaf Cluster (3 small leaves) */}
      <circle
        cx="45"
        cy="35"
        r="5"
        fill="hsl(120, 61%, 45%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.2s"
            begin="1.1s"
            fill="freeze"
          />
        )}
      </circle>
      <circle
        cx="50"
        cy="30"
        r="6"
        fill="hsl(120, 61%, 50%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.2s"
            begin="1.2s"
            fill="freeze"
          />
        )}
      </circle>
      <circle
        cx="55"
        cy="35"
        r="5"
        fill="hsl(120, 61%, 45%)"
        opacity={animate && !hasAnimated ? "0" : "1"}
      >
        {animate && !hasAnimated && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.2s"
            begin="1.3s"
            fill="freeze"
          />
        )}
      </circle>
    </svg>
  );
};
