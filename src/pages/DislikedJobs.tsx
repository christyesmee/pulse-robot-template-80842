import { useState, useEffect } from "react";
import CareerSpringNav from "@/components/CareerSpringNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobMatch } from "@/components/JobMatchCard";
import { X, RotateCcw, MapPin } from "lucide-react";

const DislikedJobs = () => {
  const [dislikedJobs, setDislikedJobs] = useState<JobMatch[]>([]);

  useEffect(() => {
    const disliked = JSON.parse(localStorage.getItem("dislikedJobs") || "[]");
    setDislikedJobs(disliked);
  }, []);

  const handleRestore = (job: JobMatch) => {
    const updated = dislikedJobs.filter((j) => j.id !== job.id);
    setDislikedJobs(updated);
    localStorage.setItem("dislikedJobs", JSON.stringify(updated));
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CareerSpringNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
            <X className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {dislikedJobs.length} Dismissed
            </span>
          </div>
          <h1 className="section-title text-3xl md:text-5xl mb-4">
            Disliked Jobs
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            {dislikedJobs.length > 0 
              ? "You can always restore these if you change your mind" 
              : "Jobs you dismiss will appear here"}
          </p>
        </div>

        {/* Job Cards Grid */}
        {dislikedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dislikedJobs.map((job) => (
              <Card key={job.id} className="glass-card p-6 opacity-60 hover:opacity-100 transition-opacity relative">
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

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>

                {/* Restore Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleRestore(job)}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Restore to Matches
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              No disliked jobs yet
            </p>
            <p className="text-gray-500">
              Jobs you dismiss will appear here
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DislikedJobs;