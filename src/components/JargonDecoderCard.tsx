import { useState } from "react";
import { RefreshCw } from "lucide-react";

const jargonExamples = [
  {
    before: "Fast-paced, dynamic environment",
    after: "You will be busy. Priorities change quickly, sometimes multiple times a day. Not a quiet desk job."
  },
  {
    before: "Manage key stakeholders",
    after: "Keep other people updated via emails and meetings. Get their approval for your work."
  },
  {
    before: "We're looking for a self-starter",
    after: "You won't be micromanaged. Your boss gives you a goal, you figure out how to do it."
  },
  {
    before: "Must be willing to wear many hats",
    after: "Your job description is a suggestion. You'll do tasks outside your core role. Great for learning, but can be chaotic."
  },
  {
    before: "Ability to hit the ground running",
    after: "Very little training. You're expected to have the skills and be productive from week one."
  },
  {
    before: "Strong communication skills",
    after: "Write clear emails. Explain complex ideas simply. Ask for help when stuck. Listen in meetings."
  },
  {
    before: "Comfortable with ambiguity",
    after: "Instructions will be vague. You'll need to ask smart questions to get clarity and figure things out."
  },
  {
    before: "Results-driven",
    after: "Your success is measured by numbers, not effort. You'll track metrics like '10% more clicks' or '15 tickets per day.'"
  },
  {
    before: "Work cross-functionally",
    after: "You'll work with people from completely different departments like Engineering, Sales, or Design."
  },
  {
    before: "Significant growth opportunities",
    after: "Could mean real promotions OR just more work without raises. Ask: 'What does a career path look like here?'"
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
        className="relative h-56 cursor-pointer group"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-3 border-red-300 rounded-2xl flex items-center justify-center p-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center">
              <div className="text-xs font-bold tracking-wider text-red-600 mb-3 uppercase">❌ Corporate Jargon</div>
              <div className="text-xl font-bold text-foreground leading-tight px-2">{current.before}</div>
              <div className="text-xs text-muted-foreground mt-5 font-medium animate-pulse">👆 Click to decode →</div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-3 border-primary rounded-2xl flex items-center justify-center p-6 shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="text-center">
              <div className="text-xs font-bold tracking-wider text-primary mb-3 uppercase">✅ What It Actually Means</div>
              <div className="text-base font-semibold text-foreground leading-relaxed px-2">{current.after}</div>
              <div className="text-xs text-muted-foreground mt-5 font-medium">👆 Click to see jargon ←</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-200 hover:scale-105"
      >
        <RefreshCw className="w-4 h-4" />
        Try another example ({currentIndex + 1}/{jargonExamples.length})
      </button>
    </div>
  );
};
