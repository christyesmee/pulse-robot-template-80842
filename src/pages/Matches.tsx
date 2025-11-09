import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobMatchCard, { JobMatch } from "@/components/JobMatchCard";
import ApplyModal from "@/components/ApplyModal";
import { Button } from "@/components/ui/button";
import { User, Bookmark, X, RotateCcw } from "lucide-react";
import { fetchJobMatches, saveJob, dislikeJob } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [savedJobs, setSavedJobs] = useState<JobMatch[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<JobMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleGoToProfile = () => {
    navigate("/profile");
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
    
    // Load saved and disliked jobs from localStorage
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const disliked = JSON.parse(localStorage.getItem("dislikedJobs") || "[]");
    setSavedJobs(saved);
    setDislikedJobs(disliked);
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
      const updated = [...dislikedJobs, job];
      setDislikedJobs(updated);
      localStorage.setItem("dislikedJobs", JSON.stringify(updated));
      
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

  const handleRemoveSaved = (job: JobMatch) => {
    const updated = savedJobs.filter((j) => j.id !== job.id);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const handleDislikeSaved = (job: JobMatch) => {
    handleRemoveSaved(job);
    const updated = [...dislikedJobs, job];
    setDislikedJobs(updated);
    localStorage.setItem("dislikedJobs", JSON.stringify(updated));
  };

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
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Your Job Matches
            </h1>
            <p className="text-foreground/70">
              Browse matches, saved opportunities, and dismissed jobs
            </p>
          </div>
          
          {/* My Profile Button */}
          <Button
            onClick={handleGoToProfile}
            variant="outline"
            size="lg"
            className="rounded-full transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
          >
            <User className="w-4 h-4 mr-2" />
            My Profile
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="w-full md:w-auto mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">
                {jobs.length}
              </span>
              All Matches
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="disliked" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Disliked ({dislikedJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* All Matches Tab */}
          <TabsContent value="matches">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xl text-foreground/70">Loading your perfect matches...</p>
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
                <p className="text-xl text-foreground/70">
                  No more matches for now. Check back later or explore your saved careers!
                </p>
              </div>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            {savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <JobMatchCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    onSave={handleRemoveSaved}
                    onDislike={handleDislikeSaved}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">
                  No saved careers yet
                </p>
                <p className="text-foreground/60">
                  Save opportunities from your matches to review them later
                </p>
              </div>
            )}
          </TabsContent>

          {/* Disliked Tab */}
          <TabsContent value="disliked">
            {dislikedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dislikedJobs.map((job) => (
                  <Card key={job.id} className="bg-white/90 backdrop-blur-sm p-6 opacity-60 hover:opacity-100 transition-all duration-200 hover:shadow-lg relative border border-border rounded-2xl">
                    <Badge
                      className={`absolute top-4 right-4 text-sm font-bold px-3 py-1 ${getMatchColor(
                        job.matchScore
                      )}`}
                    >
                      {job.matchScore}% Match
                    </Badge>

                    {job.company && (
                      <p className="text-sm font-semibold text-foreground/70 mb-2">{job.company}</p>
                    )}

                    {job.salary && (
                      <p className="text-lg font-bold text-primary mb-4 mt-8">{job.salary}</p>
                    )}

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        What you'll actually do:
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button
                        onClick={() => handleRestore(job)}
                        variant="outline"
                        size="lg"
                        className="w-full rounded-full transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
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
                <p className="text-xl text-foreground/70 mb-2">
                  No disliked jobs yet
                </p>
                <p className="text-foreground/60">
                  Jobs you dismiss will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
      
      <AppFooter />
    </div>
  );
};

export default Matches;