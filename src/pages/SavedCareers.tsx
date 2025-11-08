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
    <div className="min-h-screen bg-gray-50">
      <CareerSpringNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
            <Bookmark className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {savedJobs.length} Saved
            </span>
          </div>
          <h1 className="section-title text-3xl md:text-5xl mb-4">
            Saved Careers
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            {savedJobs.length > 0 
              ? "Your bookmarked opportunities are waiting here" 
              : "Start saving jobs you're interested in"}
          </p>
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