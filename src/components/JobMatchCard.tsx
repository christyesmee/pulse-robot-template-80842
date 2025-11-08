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

      {/* Company Name (if available) */}
      {job.company && (
        <p className="text-sm font-semibold text-muted-foreground mb-2">{job.company}</p>
      )}

      {/* Salary */}
      {job.salary && (
        <p className="text-lg font-bold text-primary mb-4 mt-8">{job.salary}</p>
      )}

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-3">
          What you'll actually do:
        </h3>
        <p className="text-muted-foreground leading-relaxed">{job.description}</p>
      </div>

      {/* Match Reason */}
      {job.matchReason && (
        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h4 className="text-sm font-semibold text-primary mb-2">
            Why this fits your profile:
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.matchReason}</p>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{job.location}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
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
          className="px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default JobMatchCard;