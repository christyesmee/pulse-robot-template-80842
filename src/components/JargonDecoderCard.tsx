import { useState } from "react";
import { RefreshCw } from "lucide-react";

const jargonExamples = [
  {
    before: "Manage stakeholders",
    after: "Send email updates to the team"
  },
  {
    before: "Proven multitasking ability",
    after: "You've juggled classes and a part-time job"
  },
  {
    before: "Drive synergy across teams",
    after: "Help different groups work together"
  },
  {
    before: "Fast-paced environment",
    after: "Sometimes it gets busy"
  }
];

export const JargonDecoderCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % jargonExamples.length);
    }, 300);
  };

  const current = jargonExamples[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative h-48 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl flex items-center justify-center p-6 shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-red-600 mb-2">JARGON</div>
              <div className="text-xl font-bold text-foreground">{current.before}</div>
              <div className="text-xs text-muted-foreground mt-4">Click to decode →</div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-primary rounded-2xl flex items-center justify-center p-6 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-primary mb-2">DECODED</div>
              <div className="text-xl font-bold text-foreground">{current.after}</div>
              <div className="text-xs text-muted-foreground mt-4">Click to see jargon ←</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try another example
      </button>
    </div>
  );
};
