import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareerSpringLanding from "./pages/CareerSpringLanding";
import UploadCV from "./pages/UploadCV";
import Matches from "./pages/Matches";
import SavedCareers from "./pages/SavedCareers";
import DislikedJobs from "./pages/DislikedJobs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CareerSpringLanding />} />
          <Route path="/upload" element={<UploadCV />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/saved" element={<SavedCareers />} />
          <Route path="/disliked" element={<DislikedJobs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
