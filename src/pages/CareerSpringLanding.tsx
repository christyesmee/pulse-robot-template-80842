import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sprout } from "lucide-react";

const CareerSpringLanding = () => {
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(false);

  useEffect(() => {
    // Check if CV has been uploaded
    const hasUploadedCV = localStorage.getItem("cvUploaded") === "true";
    setCvUploaded(hasUploadedCV);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <Sprout className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Career Spring</span>
            </div>
            
            {cvUploaded && (
              <nav className="hidden md:flex items-center gap-6">
                <a
                  href="/matches"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/matches");
                  }}
                  className="text-sm font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Your Matches
                </a>
                <a
                  href="/saved"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/saved");
                  }}
                  className="text-sm font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Saved Careers
                </a>
                <a
                  href="/disliked"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/disliked");
                  }}
                  className="text-sm font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Disliked Jobs
                </a>
              </nav>
            )}

            {cvUploaded && (
              <nav className="flex md:hidden gap-4">
                <a
                  href="/matches"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/matches");
                  }}
                  className="text-xs font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Matches
                </a>
                <a
                  href="/saved"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/saved");
                  }}
                  className="text-xs font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Saved
                </a>
                <a
                  href="/disliked"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/disliked");
                  }}
                  className="text-xs font-medium transition-colors hover:text-primary text-gray-600"
                >
                  Disliked
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="overflow-hidden relative bg-cover" 
        style={{
          backgroundImage: 'url("/Header-background.webp")',
          backgroundPosition: 'center 30%', 
          padding: window.innerWidth < 768 ? '100px 12px 80px' : '120px 20px 120px'
        }}
      >
        <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-3xl rounded-full"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div 
              className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6 opacity-0 animate-fade-in shadow-sm" 
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">01</span>
              <span className="text-sm font-medium text-gray-700">Purpose</span>
            </div>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight opacity-0 animate-fade-in mb-6" 
              style={{ animationDelay: "0.3s" }}
            >
              Find Your First 'Real' Job,<br className="hidden sm:inline" />
              <span className="text-primary"> Minus the Jargon</span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed opacity-0 animate-fade-in max-w-3xl"
            >
              Career Spring translates confusing job posts into clear opportunities that match your skills. No experience required.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in mb-16" 
              style={{ animationDelay: "0.7s" }}
            >
              <button
                onClick={() => {
                  if (cvUploaded) {
                    navigate("/matches");
                  } else {
                    navigate("/upload");
                  }
                }}
                className="flex items-center justify-center group text-center"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  borderRadius: '1440px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  lineHeight: '24px',
                  padding: '16px 32px',
                  border: '1px solid white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {cvUploaded ? "View Your Matches" : "Activate Your Agent"}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div 
              className="grid grid-cols-3 gap-8 w-full max-w-3xl opacity-0 animate-fade-in"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="glass-card p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  10,000+
                </div>
                <div className="text-gray-600 text-sm">Graduates Matched</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  500+
                </div>
                <div className="text-gray-600 text-sm">Partner Companies</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  95%
                </div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      </section>
    </div>
  );
};

export default CareerSpringLanding;
