import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadCV } from "@/services/api";

const UploadCV = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    try {
      // Call API to upload and parse CV
      const result = await uploadCV(file);
      
      // Store user ID and CV uploaded status
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("cvUploaded", "true");
      
      toast({
        title: "CV Scanned Successfully! 🌱",
        description: "Finding your perfect matches...",
      });
      
      navigate("/matches");
    } catch (error) {
      console.error("CV upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section 
        className="overflow-hidden relative bg-cover" 
        style={{
          backgroundImage: 'url("/Header-background.webp")',
          backgroundPosition: 'center 30%', 
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-3xl rounded-full"></div>
        
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center space-y-6 mb-12">
            <div 
              className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">02</span>
              <span className="text-sm font-medium text-gray-700">Upload CV</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Upload Your CV to Get Started
            </h1>
            <p className="text-xl text-gray-700 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              Let us analyze your skills and find the perfect opportunities for you
            </p>
          </div>

          {/* Upload Area */}
          <div className="glass-card p-8 md:p-12 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="space-y-6">
            {/* File Input Area */}
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                {file ? (
                  <FileText className="w-12 h-12 text-primary" />
                ) : (
                  <Upload className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="text-center">
                {file ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your CV here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only (max 10MB)
                    </p>
                  </>
                )}
              </div>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Upload Button */}
            <div className="pt-6">
              <Button
                size="lg"
                onClick={handleUpload}
                disabled={!file || isScanning}
                className="w-full text-lg py-6 rounded-xl"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Scanning your CV...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload & Scan
                  </>
                )}
              </Button>
            </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default UploadCV;