import { useState } from "react";
import CareerSpringNav from "@/components/CareerSpringNav";
import JobMatchCard, { JobMatch } from "@/components/JobMatchCard";
import ApplyModal from "@/components/ApplyModal";

const MOCK_JOBS: JobMatch[] = [
  {
    id: "1",
    matchScore: 92,
    company: "TechStart Solutions",
    description:
      "You'll be helping customers solve problems with our software, mostly through email and chat. You'll learn our products inside-out and become the friendly face customers count on.",
    location: "Remote",
  },
  {
    id: "2",
    matchScore: 88,
    company: "GrowthCo",
    description:
      "You'll assist the marketing team by creating social media posts, scheduling content, and tracking how well our campaigns perform. No previous experience needed - we'll teach you everything!",
    location: "London, UK",
  },
  {
    id: "3",
    matchScore: 85,
    company: "DataFlow Inc",
    description:
      "You'll help organize and clean up data in spreadsheets, making sure everything is accurate and up-to-date. Perfect for someone detail-oriented who likes working with numbers.",
    location: "Remote",
  },
  {
    id: "4",
    matchScore: 78,
    company: "CreativeHub",
    description:
      "You'll work alongside our design team to create graphics for social media and websites. We'll teach you to use design tools like Canva and Figma - creativity matters more than experience!",
    location: "Manchester, UK",
  },
  {
    id: "5",
    matchScore: 75,
    company: "FutureBuilders",
    description:
      "You'll help test new features on our website and mobile app, reporting any issues you find. Great for someone who loves technology and has an eye for detail.",
    location: "Remote",
  },
  {
    id: "6",
    matchScore: 68,
    company: "PeopleFirst HR",
    description:
      "You'll support the HR team with onboarding new employees, scheduling interviews, and maintaining employee records. Perfect for someone who's organized and enjoys helping people.",
    location: "Birmingham, UK",
  },
];

const Matches = () => {
  const [jobs, setJobs] = useState<JobMatch[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (job: JobMatch) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSave = (job: JobMatch) => {
    // Move to saved (will be implemented in SavedCareers page)
    setJobs(jobs.filter((j) => j.id !== job.id));
    localStorage.setItem(
      "savedJobs",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("savedJobs") || "[]"),
        job,
      ])
    );
  };

  const handleDislike = (job: JobMatch) => {
    // Move to disliked (will be implemented in DislikedJobs page)
    setJobs(jobs.filter((j) => j.id !== job.id));
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Matches
          </h1>
          <p className="text-lg text-gray-600">
            We found {jobs.length} opportunities that match your skills
          </p>
        </div>

        {/* Job Cards Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobMatchCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onSave={handleSave}
                onDislike={handleDislike}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No more matches for now. Check back later or explore your saved careers!
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

export default Matches;