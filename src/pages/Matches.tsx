import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CareerSpringNav from "@/components/CareerSpringNav";
import JobMatchCard, { JobMatch } from "@/components/JobMatchCard";
import ApplyModal from "@/components/ApplyModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { fetchJobMatches, saveJob, dislikeJob } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const MOCK_JOBS: JobMatch[] = [
  {
    id: "1",
    matchScore: 92,
    company: "TechStart Solutions",
    salary: "£24,000 - £28,000",
    description:
      "You'll be helping customers solve problems with our software, mostly through email and chat. You'll learn our products inside-out and become the friendly face customers count on.",
    matchReason: "Your communication skills and interest in technology make you perfect for this role. The company offers excellent training and career progression.",
    location: "Remote",
  },
  {
    id: "2",
    matchScore: 88,
    company: "GrowthCo",
    salary: "£22,000 - £26,000",
    description:
      "You'll assist the marketing team by creating social media posts, scheduling content, and tracking how well our campaigns perform. No previous experience needed - we'll teach you everything!",
    matchReason: "Your creativity and social media savviness align perfectly with this role. Great entry point into digital marketing with hands-on learning.",
    location: "London, UK",
  },
  {
    id: "3",
    matchScore: 85,
    company: "DataFlow Inc",
    salary: "£23,000 - £27,000",
    description:
      "You'll help organize and clean up data in spreadsheets, making sure everything is accurate and up-to-date. Perfect for someone detail-oriented who likes working with numbers.",
    matchReason: "Your attention to detail and analytical mindset make you ideal for this position. Excellent foundation for a career in data analysis.",
    location: "Remote",
  },
  {
    id: "4",
    matchScore: 78,
    company: "CreativeHub",
    salary: "£21,000 - £25,000",
    description:
      "You'll work alongside our design team to create graphics for social media and websites. We'll teach you to use design tools like Canva and Figma - creativity matters more than experience!",
    matchReason: "Your creative portfolio shows promise. This role offers mentorship from experienced designers and a chance to build your professional design skills.",
    location: "Manchester, UK",
  },
  {
    id: "5",
    matchScore: 75,
    company: "FutureBuilders",
    salary: "£23,000 - £26,000",
    description:
      "You'll help test new features on our website and mobile app, reporting any issues you find. Great for someone who loves technology and has an eye for detail.",
    matchReason: "Your tech enthusiasm and methodical approach suit QA testing perfectly. Great stepping stone into software development or product management.",
    location: "Remote",
  },
  {
    id: "6",
    matchScore: 68,
    company: "PeopleFirst HR",
    salary: "£22,000 - £25,000",
    description:
      "You'll support the HR team with onboarding new employees, scheduling interviews, and maintaining employee records. Perfect for someone who's organized and enjoys helping people.",
    matchReason: "Your organizational skills and people-focused approach align with HR work. Good entry into a stable career with clear progression paths.",
    location: "Birmingham, UK",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleReplaceCV = () => {
    toast({
      title: "Replace CV",
      description: "Redirecting to upload page...",
    });
    navigate("/upload");
  };

  // Fetch job matches on component mount
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const userId = localStorage.getItem("userId") || "mock-user-123";
        const matches = await fetchJobMatches(userId);
        setJobs(matches);
      } catch (error) {
        console.error("Failed to load job matches:", error);
        toast({
          title: "Error Loading Matches",
          description: "Could not load your job matches. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [toast]);

  const handleApply = (job: JobMatch) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSave = async (job: JobMatch) => {
    try {
      const userId = localStorage.getItem("userId") || "mock-user-123";
      await saveJob(userId, job.id);
      
      // Update local state and localStorage
      setJobs(jobs.filter((j) => j.id !== job.id));
      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      localStorage.setItem("savedJobs", JSON.stringify([...savedJobs, job]));
      
      toast({
        title: "Job Saved! 💚",
        description: "Added to your saved careers",
      });
    } catch (error) {
      console.error("Failed to save job:", error);
      toast({
        title: "Error",
        description: "Could not save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async (job: JobMatch) => {
    try {
      const userId = localStorage.getItem("userId") || "mock-user-123";
      await dislikeJob(userId, job.id);
      
      // Update local state and localStorage
      setJobs(jobs.filter((j) => j.id !== job.id));
      const dislikedJobs = JSON.parse(localStorage.getItem("dislikedJobs") || "[]");
      localStorage.setItem("dislikedJobs", JSON.stringify([...dislikedJobs, job]));
      
      toast({
        title: "Job Dismissed",
        description: "We won't show this job again",
      });
    } catch (error) {
      console.error("Failed to dislike job:", error);
      toast({
        title: "Error",
        description: "Could not dismiss job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CareerSpringNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">
              {jobs.length}
            </span>
            <span className="text-sm font-medium text-gray-700">Matches Found</span>
          </div>
          <h1 className="section-title text-3xl md:text-5xl mb-4">
            Your Perfect Matches
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            We found {jobs.length} opportunities tailored to your skills and experience
          </p>
          
          {/* Replace CV Button */}
          <div className="mt-6">
            <Button
              onClick={handleReplaceCV}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New CV
            </Button>
          </div>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading your perfect matches...</p>
          </div>
        ) : jobs.length > 0 ? (
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