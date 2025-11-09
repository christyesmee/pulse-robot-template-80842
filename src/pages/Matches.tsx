import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Briefcase, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
}

const Matches = () => {
  const navigate = useNavigate();
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([]);
  const [cartJobs, setCartJobs] = useState<JobApplication[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUserId(user.id);
      loadData(user.id);
    };
    checkAuth();
  }, [navigate]);

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

      // Load applications
      const { data: apps, error: appsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', uid)
        .neq('status', 'cart')
        .order('last_status_update', { ascending: false });

      if (appsError) throw appsError;
      setApplications(apps || []);
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
      const applicationIds = cartJobs.map(job => job.id);
      
      const { error } = await supabase.functions.invoke('apply-to-jobs', {
        body: { applicationIds, userId }
      });

      if (error) throw error;

      toast({
        title: "Applications Submitted! 🎉",
        description: `Successfully applied to ${cartJobs.length} jobs`,
      });

      loadData(userId);
    } catch (error) {
      console.error('Error applying to jobs:', error);
      toast({
        title: "Error",
        description: "Failed to submit applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-700 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-orange-500/10 text-orange-700 border-orange-500/20";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      cart: { label: 'In Cart', className: 'bg-blue-500/10 text-blue-700' },
      applied: { label: 'Applied', className: 'bg-purple-500/10 text-purple-700' },
      pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-700' },
      interview_requested: { label: 'Interview Requested', className: 'bg-green-500/10 text-green-700' },
      interview_scheduled: { label: 'Interview Scheduled', className: 'bg-green-600/10 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-700' },
      offer_received: { label: 'Offer Received', className: 'bg-emerald-500/10 text-emerald-700' },
    };
    return statusConfig[status] || { label: status, className: 'bg-gray-500/10 text-gray-700' };
  };

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
          <TabsList className="w-full md:w-auto mb-8">
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
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-200 border-2">
                    <Badge className={`mb-4 ${getMatchColor(job.match_score)}`}>
                      {job.match_score}% Match
                    </Badge>
                    
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <p className="text-lg font-semibold text-primary mb-1">{job.company}</p>
                    <p className="text-sm text-foreground/70 mb-2">{job.location}</p>
                    <p className="text-lg font-bold text-green-600 mb-4">{job.salary}</p>
                    
                    <p className="text-foreground/80 mb-4 line-clamp-3">{job.description}</p>
                    
                    <Button 
                      onClick={() => handleAddToCart(job)}
                      className="w-full"
                      disabled={cartJobs.some(c => c.job_id === job.job_id)}
                    >
                      {cartJobs.some(c => c.job_id === job.job_id) ? (
                        <>✓ In Cart</>
                      ) : (
                        <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>
                      )}
                    </Button>
                  </Card>
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
                    <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-blue-500/10 text-blue-700">In Cart</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveFromCart(job.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{job.position}</h3>
                      <p className="text-lg font-semibold text-primary mb-4">{job.company}</p>
                    </Card>
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
            {applications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => {
                  const statusInfo = getStatusBadge(app.status);
                  return (
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-all duration-200">
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                      
                      <h3 className="text-xl font-bold mt-4 mb-2">{app.position}</h3>
                      <p className="text-lg font-semibold text-primary mb-2">{app.company}</p>
                      
                      <div className="text-sm text-foreground/70 space-y-1">
                        <p>Applied: {app.application_sent_at ? new Date(app.application_sent_at).toLocaleDateString() : 'Pending'}</p>
                        {app.last_status_update && (
                          <p>Last update: {new Date(app.last_status_update).toLocaleDateString()}</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-foreground/70 mb-2">No applications yet</p>
                <p className="text-foreground/60">Apply to jobs from your cart to track them here</p>
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