import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JobMatch } from "@/components/JobMatchCard";
import { FileDown, Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobMatch | null;
}

const ApplyModal = ({ isOpen, onClose, job }: ApplyModalProps) => {
  const [showEmail, setShowEmail] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  if (!job) return null;

  const mockEmail = `Dear Hiring Manager,

I am writing to express my interest in the opportunity at ${job.company || "your company"}. 

As a recent graduate with relevant skills in the areas you're looking for, I believe I would be a great fit for this role. My background aligns well with the responsibilities you've outlined, particularly in ${job.description.slice(0, 50)}...

I've attached my tailored CV for your review and would welcome the opportunity to discuss how I can contribute to your team.

Thank you for your consideration.

Best regards`;

  const handleGenerateCV = () => {
    // TODO (Backend): 'Generate Tailored CV' button must call the backend agent,
    // sending the user's ID and this job's details. The agent will return a new,
    // tailored PDF. The frontend should then trigger a download of this file.

    toast({
      title: "Generating CV...",
      description: "Your tailored CV is being created",
    });

    setTimeout(() => {
      toast({
        title: "CV downloaded (mock)!",
        description: "Your tailored CV is ready",
      });
    }, 2000);
  };

  const handleWriteEmail = () => {
    // TODO (Backend): 'Write Application Email' button must call the backend agent
    // to generate an email body. The frontend will display this text.

    setShowEmail(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(mockEmail);
    setIsCopied(true);
    toast({
      title: "Email copied!",
      description: "The email text has been copied to your clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const mailtoLink = `mailto:hiring@company.com?subject=Application for ${
    job.company || "Position"
  }&body=${encodeURIComponent(mockEmail)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Apply to {job.company || "this position"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Job Details */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="text-sm text-gray-700">{job.description}</p>
          </div>

          {!showEmail ? (
            /* Initial View */
            <div className="space-y-4">
              <Button
                onClick={handleGenerateCV}
                size="lg"
                className="w-full"
                variant="outline"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Generate Tailored CV
              </Button>
              <Button
                onClick={handleWriteEmail}
                size="lg"
                className="w-full"
              >
                <Mail className="w-5 h-5 mr-2" />
                Write Application Email
              </Button>
            </div>
          ) : (
            /* Email View */
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {mockEmail}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  size="lg"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Email Text
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleGenerateCV}
                  variant="outline"
                  size="lg"
                >
                  <FileDown className="w-5 h-5 mr-2" />
                  Download Tailored CV
                </Button>
              </div>

              <Button asChild size="lg" className="w-full">
                <a href={mailtoLink}>
                  <Mail className="w-5 h-5 mr-2" />
                  Open in Outlook (with New CV)
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;