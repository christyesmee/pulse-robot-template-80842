import { useState, useEffect } from "react";
import CareerSpringNav from "@/components/CareerSpringNav";
import JobMatchCard, { JobMatch } from "@/components/JobMatchCard";
import ApplyModal from "@/components/ApplyModal";
import { Bookmark } from "lucide-react";

const SavedCareers = () => {
  const [savedJobs, setSavedJobs] = useState<JobMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(saved);
  }, []);

  const handleApply = (job: JobMatch) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleRemove = (job: JobMatch) => {
    const updated = savedJobs.filter((j) => j.id !== job.id);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const handleDislike = (job: JobMatch) => {
    handleRemove(job);
    localStorage.setItem(
      "dislikedJobs",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("dislikedJobs") || "[]"),
        job,
      ])
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <CareerSpringNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Saved Careers
            </h1>
            <p className="text-lg text-gray-600">
              {savedJobs.length} {savedJobs.length === 1 ? "opportunity" : "opportunities"} saved for later
            </p>
          </div>
        </div>

        {/* Job Cards Grid */}
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobMatchCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onSave={handleRemove}
                onDislike={handleDislike}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              No saved careers yet
            </p>
            <p className="text-gray-500">
              Save opportunities from your matches to review them later
            </p>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default SavedCareers;