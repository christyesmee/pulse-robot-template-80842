import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    // TODO (Backend): The selected PDF file needs to be sent to a backend endpoint for parsing.
    // The backend will store it and return metadata for matching.

    // Mock scanning process
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "CV Scanned Successfully! 🌱",
        description: "Finding your perfect matches...",
      });
      navigate("/matches");
    }, 3000);
  };

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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Upload Your CV to Get Started
          </h1>
          <p className="text-xl text-gray-600">
            Let us analyze your skills and find the perfect opportunities for you
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors">
          <div className="space-y-6">
            {/* File Input Area */}
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
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
    </div>
  );
};

export default UploadCV;