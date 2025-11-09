import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, X, Bookmark } from "lucide-react";

export interface JobMatch {
  id: string;
  matchScore: number;
  description: string;
  location: string;
  company?: string;
  salary?: string;
  matchReason?: string;
  growthOpportunities?: string;
  companyCulture?: string;
}

interface JobMatchCardProps {
  job: JobMatch;
  onApply: (job: JobMatch) => void;
  onSave: (job: JobMatch) => void;
  onDislike: (job: JobMatch) => void;
}

const JobMatchCard = ({ job, onApply, onSave, onDislike }: JobMatchCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  return (
    <Card className="glass-card p-6 hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 relative group">
      {/* Match Score Badge */}
      <Badge
        className={`absolute top-4 right-4 text-sm font-bold px-3 py-1 ${getMatchColor(
          job.matchScore
        )}`}
      >
        {job.matchScore}% Match
      </Badge>

      {/* Company Name */}
      {job.company && (
        <h2 className="text-xl font-bold text-foreground mb-1">{job.company}</h2>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{job.location}</span>
      </div>

      {/* Salary - Prominent Display */}
      {job.salary && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Salary Range</p>
          <p className="text-2xl font-bold text-primary">{job.salary}</p>
        </div>
      )}

      {/* What You'll Actually Do */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-primary">📋</span> What you'll actually do
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
      </div>

      {/* Growth Opportunities */}
      {job.growthOpportunities && (
        <div className="mb-5">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">📈</span> Growth & Learning
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.growthOpportunities}</p>
        </div>
      )}

      {/* Company Culture */}
      {job.companyCulture && (
        <div className="mb-5">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">🌟</span> Culture & Work-Life Balance
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.companyCulture}</p>
        </div>
      )}

      {/* Match Reason */}
      {job.matchReason && (
        <div className="mb-5 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h4 className="text-sm font-semibold text-primary mb-2">
            Why this fits your profile
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.matchReason}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          onClick={() => onApply(job)}
          className="flex-1"
          size="lg"
        >
          Apply Now
        </Button>
        <Button
          onClick={() => onSave(job)}
          variant="outline"
          size="lg"
          className="px-4"
        >
          <Bookmark className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => onDislike(job)}
          variant="outline"
          size="lg"
          className="px-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default JobMatchCard;