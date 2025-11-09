import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Target, Zap } from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { JargonDecoderCard } from "@/components/JargonDecoderCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <AnimatedLogo className="w-10 h-10" animate={false} />
              <span className="text-2xl font-display font-bold text-primary">Career Spring</span>
            </div>
            
            {cvUploaded && (
              <nav className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/matches")}
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground/70"
                >
                  Your Matches
                </button>
                <button
                  onClick={() => navigate("/saved")}
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground/70"
                >
                  Saved
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <AnimatedLogo className="w-24 h-24 mx-auto" animate={true} />
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
              The entry-level job market is confusing. We built the translator. Career Spring turns your class projects and part-time gigs into the exact skills employers want.
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
                Build My Skills Profile
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-30 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 opacity-30 blur-3xl rounded-full -z-10"></div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-secondary/30">
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
            <blockquote className="border-l-4 border-primary pl-6 py-4 bg-white rounded-r-xl shadow-sm">
              <p className="text-xl font-semibold text-foreground font-display">
                It's the <span className="text-primary">Experience Paradox</span>: you can't get a job without experience, and you can't get experience without a job.
              </p>
            </blockquote>
          </ScrollSection>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
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
              You have the skills. You just speak a different language than the recruiters. We translate your academic life into a professional resume.
            </p>
          </ScrollSection>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Jargon Decoder */}
            <ScrollSection delay={0}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  We translate the jargon
                </h3>
                <div className="mt-6">
                  <JargonDecoderCard />
                </div>
              </div>
            </ScrollSection>

            {/* Feature 2: Skills-First Matcher */}
            <ScrollSection delay={100}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
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
            <ScrollSection delay={200}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  Beat the "Black Hole"
                </h3>
                <p className="text-foreground/70 font-body">
                  Applicant Tracking Systems (ATS) filter out good candidates. We help you build a resume with the right <em>decoded</em> keywords, so you get seen by a human.
                </p>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 via-secondary/50 to-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollSection>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              Stop the guesswork. Find your fit.
            </h2>
          </ScrollSection>
          
          <ScrollSection delay={100}>
            <p className="text-xl text-foreground/80 mb-10 font-body">
              You're ready. Let's build your skills profile and find the job that's waiting for you.
            </p>
          </ScrollSection>

          <ScrollSection delay={200}>
            <Button
              onClick={() => navigate(cvUploaded ? "/matches" : "/upload")}
              size="lg"
              className="text-lg px-10 py-6 rounded-full transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl"
            >
              Get Started (It's Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </ScrollSection>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-foreground/60">
            <AnimatedLogo className="w-6 h-6" animate={false} />
            <span className="text-sm font-body">© 2024 Career Spring. Start your career.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerSpringLanding;
