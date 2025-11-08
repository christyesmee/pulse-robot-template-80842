import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sprout, Sparkles, Search } from "lucide-react";

const CareerSpringLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Career Spring</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center space-y-8">
          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-200/50 animate-pulse-slow flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-200/50 animate-pulse-slow [animation-delay:200ms] flex items-center justify-center">
              <Search className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="w-12 h-12 rounded-full bg-teal-200/50 animate-pulse-slow [animation-delay:400ms] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-teal-600" />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
            Find Your First{" "}
            <span className="text-primary">'Real'</span> Job,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Minus the Jargon
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Career Spring translates confusing job posts into clear opportunities 
            that match your skills. <span className="font-semibold text-primary">No experience required.</span>
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/upload")}
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sprout className="w-5 h-5 mr-2" />
              Activate Your Agent
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-gray-600">Graduates Matched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">92%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-gray-500 text-sm">
        <p>© 2025 Career Spring. Making job hunting simple for graduates.</p>
      </footer>
    </div>
  );
};

export default CareerSpringLanding;