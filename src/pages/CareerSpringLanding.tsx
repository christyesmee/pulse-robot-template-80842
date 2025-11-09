import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Target, Zap } from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { JargonDecoderCard } from "@/components/JargonDecoderCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Background3D } from "@/components/Background3D";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

const ScrollSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CareerSpringLanding = () => {
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(false);

  useEffect(() => {
    const hasUploadedCV = localStorage.getItem("cvUploaded") === "true";
    setCvUploaded(hasUploadedCV);
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      <Background3D />
      <AppHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent pt-20 pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <AnimatedLogo className="w-32 h-32 mx-auto" animate={true} />
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight opacity-0 animate-fade-in mb-6 max-w-5xl" 
              style={{ animationDelay: "0.3s" }}
            >
              Stop decoding job descriptions.{" "}
              <span className="text-primary">Start your career.</span>
            </h1>
            
            <p 
              className="text-xl text-foreground/70 mb-12 leading-relaxed opacity-0 animate-fade-in max-w-3xl font-body" 
              style={{ animationDelay: "0.5s" }}
            >
              Our AI agent finds the perfect job matches for your skills and interests, then helps you apply with one click.
            </p>
            
            <div 
              className="opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.7s" }}
            >
              <Button
                onClick={() => navigate(cvUploaded ? "/matches" : "/upload")}
                size="lg"
                className="text-lg px-8 py-6 rounded-full transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
              >
                {cvUploaded ? "Go to My Job Matches" : "Activate Your AI Agent"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-secondary/20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSection>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-8">
              Sound familiar?
            </h2>
          </ScrollSection>
          
          <ScrollSection delay={100}>
            <p className="text-lg text-foreground/80 leading-relaxed mb-8 font-body">
              The "entry-level" job market feels broken. Job posts are filled with intimidating corporate jargon—"manage stakeholders," "drive synergy," "fast-paced environment"—that means nothing to you. Worse, they ask for 3 years of experience for a "first" job.
            </p>
          </ScrollSection>

          <ScrollSection delay={200}>
            <blockquote className="border-l-4 border-primary pl-6 py-4 bg-white/80 backdrop-blur-sm rounded-r-xl shadow-sm">
              <p className="text-xl font-semibold text-foreground font-display">
                It's the <span className="text-primary">Experience Paradox</span>: you can't get a job without experience, and you can't get experience without a job.
              </p>
            </blockquote>
          </ScrollSection>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSection>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-6">
              Career Spring finds the job you're qualified for
            </h2>
            <p className="text-xl text-center text-foreground/70 mb-4 font-body">
              (even if you don't know it yet)
            </p>
          </ScrollSection>

          <ScrollSection delay={100}>
            <p className="text-lg text-center text-foreground/80 max-w-3xl mx-auto mb-20 font-body">
              You have the skills. You just speak a different language than the recruiters. We translate your academic life into a professional resume, find your perfect matches, and let you <strong>apply with one click.</strong>
            </p>
          </ScrollSection>

          {/* Jargon Decoder Spotlight Section */}
          <ScrollSection>
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-4 border-red-200 rounded-3xl p-12 mb-16 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-center">
                    Stop Getting Lost in Translation
                  </h3>
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-lg text-center text-foreground/80 mb-10 max-w-2xl mx-auto font-body">
                  Job descriptions are full of corporate jargon that makes you feel unqualified. 
                  We translate it into plain English so you can see you're already qualified.
                </p>
                <div className="max-w-lg mx-auto">
                  <JargonDecoderCard />
                </div>
                <p className="text-center text-sm text-foreground/60 mt-8 font-body italic">
                  💡 We decode 100+ common phrases so you know exactly what employers really mean
                </p>
              </div>
            </div>
          </ScrollSection>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 2: Skills-First Matcher */}
            <ScrollSection delay={0}>
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  We find your hidden skills
                </h3>
                <p className="text-foreground/70 mb-6 font-body">
                  Our matcher bypasses the "years of experience" requirement. We show you <em>why</em> you're a match by connecting your coursework and projects to real-world skills.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80 font-body">Your final stats project → <strong>Data Analysis</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80 font-body">Your shift at the coffee shop → <strong>Problem-Solving & Collaboration</strong></span>
                  </li>
                </ul>
              </div>
            </ScrollSection>

            {/* Feature 3: Beat the Bots */}
            <ScrollSection delay={100}>
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  Beat the Bots (and apply in one click)
                </h3>
                <p className="text-foreground/70 font-body">
                  Our AI agent <strong>automatically tailors your CV</strong> for each job vacancy, optimizing it with the right keywords to beat the ATS (Applicant Tracking System) filters. Then, you can apply instantly.
                </p>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 via-secondary/30 to-transparent relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollSection>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              Stop the guesswork. Find your fit.
            </h2>
          </ScrollSection>
          
          <ScrollSection delay={100}>
            <p className="text-xl text-foreground/80 mb-10 font-body">
              You're ready. Let's activate your agent and find the job that's waiting for you.
            </p>
          </ScrollSection>

          <ScrollSection delay={200}>
            <Button
              onClick={() => navigate(cvUploaded ? "/matches" : "/upload")}
              size="lg"
              className="text-lg px-10 py-6 rounded-full transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl"
            >
              {cvUploaded ? "View My Dashboard" : "Get Started (It's Free)"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </ScrollSection>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};

export default CareerSpringLanding;
