import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Briefcase, CheckCircle, Loader2, XCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationsSummary } from "@/components/ApplicationsSummary";
import { JobCard } from "@/components/JobCard";

interface ScrapedJob {
  id: string;
  job_id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  match_score: number;
  source_url: string;
  scraped_at: string;
}

interface JobApplication {
  id: string;
  job_id: string;
  position: string;
  company: string;
  status: string;
  created_at: string;
  application_sent_at?: string;
  last_status_update?: string;
  status_details?: any;
}

const Matches = () => {
  const navigate = useNavigate();
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([]);
  const [cartJobs, setCartJobs] = useState<JobApplication[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [rejectedApplications, setRejectedApplications] = useState<JobApplication[]>([]);
  const [interviewApplications, setInterviewApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Use a valid UUID for demo user (without authentication)
    const demoUserId = '00000000-0000-0000-0000-000000000001';
    setUserId(demoUserId);
    loadData(demoUserId);
  }, []);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      // Load scraped jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('match_score', { ascending: false });

      if (jobsError) throw jobsError;
      setScrapedJobs(jobs || []);

      // Load cart items
      const { data: cart, error: cartError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'cart')
        .order('created_at', { ascending: false });

      if (cartError) throw cartError;
      setCartJobs(cart || []);

      // Load active applications (not cart or rejected)
      const { data: apps, error: appsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', uid)
        .not('status', 'in', '(cart,rejected)')
        .in('status', ['applied', 'pending'])
        .order('last_status_update', { ascending: false });

      if (appsError) throw appsError;
      setApplications(apps || []);

      // Load rejected applications
      const { data: rejected, error: rejectedError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'rejected')
        .order('last_status_update', { ascending: false });

      if (rejectedError) throw rejectedError;
      setRejectedApplications(rejected || []);

      // Load interview/next steps applications
      const { data: interviews, error: interviewsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', uid)
        .in('status', ['interview_requested', 'interview_scheduled', 'offer_received'])
        .order('last_status_update', { ascending: false });

      if (interviewsError) throw interviewsError;
      setInterviewApplications(interviews || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (job: ScrapedJob) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: userId,
          job_id: job.job_id,
          position: job.title,
          company: job.company,
          status: 'cart',
        });

      if (error) throw error;

      toast({
        title: "Added to Cart! 🛒",
        description: `${job.company} - ${job.title}`,
      });

      loadData(userId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add job to cart",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCart = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Removed from Cart",
        description: "Job removed from your cart",
      });

      if (userId) loadData(userId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove job from cart",
        variant: "destructive",
      });
    }
  };

  const handleApplyToAll = async () => {
    if (!userId || cartJobs.length === 0) return;

    setIsApplying(true);
    try {
      // Update all cart items to "applied" status
      const applicationIds = cartJobs.map(job => job.id);
      
      const { error } = await supabase
        .from('job_applications')
        .update({
          status: 'applied',
          application_sent_at: new Date().toISOString(),
          last_status_update: new Date().toISOString(),
        })
        .in('id', applicationIds);

      if (error) throw error;

      toast({
        title: "Applications Submitted! 🎉",
        description: `Moved ${cartJobs.length} jobs to Applications`,
      });

      loadData(userId);
    } catch (error) {
      console.error('Error applying to jobs:', error);
      toast({
        title: "Error",
        description: "Failed to process applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Calculate summary statistics
  const totalApplications = applications.length + rejectedApplications.length + interviewApplications.length;
  const pendingResponses = applications.filter(app => app.status === 'applied' || app.status === 'pending').length;
  const interviewsScheduled = interviewApplications.filter(app => app.status === 'interview_scheduled').length;
  const successRate = totalApplications > 0 
    ? Math.round((interviewApplications.length / totalApplications) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              AI Job Hunter
            </h1>
            <p className="text-foreground/70">
              Your AI agent finds jobs daily. Add to cart and apply automatically.
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <User className="w-4 h-4 mr-2" />
            My Profile
          </Button>
        </div>

        <Tabs defaultValue="new-jobs" className="w-full">
          <TabsList className="w-full md:w-auto mb-8 grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="new-jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              New Jobs ({scrapedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartJobs.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interviews ({interviewApplications.length})
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Learning ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          {/* New Jobs Tab */}
          <TabsContent value="new-jobs">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-xl text-foreground/70">Loading new jobs...</p>
              </div>
            ) : scrapedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scrapedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    description={job.description}
                    matchScore={job.match_score}
                    sourceUrl={job.source_url}
                    onAction={() => handleAddToCart(job)}
                    actionLabel={cartJobs.some(c => c.job_id === job.job_id) ? "✓ In Cart" : "Add to Cart"}
                    actionDisabled={cartJobs.some(c => c.job_id === job.job_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">No new jobs yet</p>
                <p className="text-foreground/60">Your AI agent searches daily for new opportunities</p>
              </div>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            {cartJobs.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center bg-primary/10 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold">{cartJobs.length} jobs in cart</p>
                    <p className="text-sm text-foreground/70">Ready to apply automatically</p>
                  </div>
                  <Button 
                    onClick={handleApplyToAll}
                    disabled={isApplying}
                    size="lg"
                  >
                    {isApplying ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Applying...</>
                    ) : (
                      <>Apply to All {cartJobs.length} Jobs</>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cartJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.position}
                      company={job.company}
                      status="cart"
                      onAction={() => handleRemoveFromCart(job.id)}
                      actionLabel="Remove from Cart"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">Your cart is empty</p>
                <p className="text-foreground/60">Add jobs from the New Jobs tab to apply automatically</p>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationsSummary
              totalApplications={totalApplications}
              pendingResponses={pendingResponses}
              interviewsScheduled={interviewsScheduled}
              successRate={successRate}
            />
            
            {applications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <JobCard
                    key={app.id}
                    title={app.position}
                    company={app.company}
                    status={app.status}
                    applicationSentAt={app.application_sent_at}
                    lastStatusUpdate={app.last_status_update}
                    statusDetails={app.status_details}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">No active applications</p>
                <p className="text-foreground/60">Apply to jobs from your cart to track them here</p>
              </div>
            )}
          </TabsContent>

          {/* Interviews & Next Steps Tab */}
          <TabsContent value="interviews">
            {interviewApplications.length > 0 ? (
              <>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-1">🎉 Great Progress!</h3>
                  <p className="text-sm text-green-700">
                    You have {interviewApplications.length} opportunities moving forward. Keep up the momentum!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {interviewApplications.map((app) => (
                    <JobCard
                      key={app.id}
                      title={app.position}
                      company={app.company}
                      status={app.status}
                      applicationSentAt={app.application_sent_at}
                      lastStatusUpdate={app.last_status_update}
                      statusDetails={app.status_details}
                      showEmails={true}
                      emailCount={0}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">No interviews scheduled yet</p>
                <p className="text-foreground/60">When companies respond positively, they'll appear here</p>
              </div>
            )}
          </TabsContent>

          {/* Learning Opportunities (Rejected) Tab */}
          <TabsContent value="learning">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-1">💡 Learning & Growth</h3>
              <p className="text-sm text-blue-700">
                Every "not selected" is a step closer to the right opportunity. These experiences help refine your approach for future applications.
              </p>
            </div>

            {rejectedApplications.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-foreground/60 mb-1">Total Reviewed</p>
                    <p className="text-2xl font-bold">{rejectedApplications.length}</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-foreground/60 mb-1">Keep Applying</p>
                    <p className="text-2xl font-bold">{scrapedJobs.length}</p>
                    <p className="text-xs text-foreground/60">new matches available</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-foreground/60 mb-1">Success Rate</p>
                    <p className="text-2xl font-bold">{successRate}%</p>
                    <p className="text-xs text-foreground/60">interviews secured</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rejectedApplications.map((app) => (
                    <JobCard
                      key={app.id}
                      title={app.position}
                      company={app.company}
                      status={app.status}
                      applicationSentAt={app.application_sent_at}
                      lastStatusUpdate={app.last_status_update}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">No learning opportunities yet</p>
                <p className="text-foreground/60">Keep applying - every application is valuable experience</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Matches;