import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newTool, setNewTool] = useState("");

  // Load existing data
  useEffect(() => {
    const storedCvName = localStorage.getItem("cvFileName");
    const storedSkills = JSON.parse(localStorage.getItem("onboarding_skills") || "[]");
    const storedTools = JSON.parse(localStorage.getItem("onboarding_tools") || "[]");
    
    if (storedCvName) setCvFileName(storedCvName);
    setSelectedSkills(storedSkills);
    setTools(storedTools);
  }, []);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setCvFileName(file.name);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    setTools(tools.filter((t) => t !== tool));
  };

  const handleAddTool = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools([...tools, newTool.trim()]);
      setNewTool("");
    }
  };

  const handleSave = () => {
    // Save to localStorage
    if (cvFile) {
      localStorage.setItem("cvFileName", cvFile.name);
    }
    localStorage.setItem("onboarding_skills", JSON.stringify(selectedSkills));
    localStorage.setItem("onboarding_tools", JSON.stringify(tools));

    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully",
    });

    navigate("/matches");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/matches")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            My Profile
          </h1>
          <p className="text-foreground/70">
            Update your CV, skills, and tools to improve your job matches
          </p>
        </div>

        {/* CV Upload Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-display font-bold mb-4">CV / Resume</h2>
          
          {cvFileName ? (
            <div className="bg-secondary/20 border-2 border-secondary rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{cvFileName}</p>
                  <p className="text-sm text-foreground/60">PDF Document</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCvFile(null);
                  setCvFileName("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
              <p className="text-foreground/70 mb-4">No CV uploaded yet</p>
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload CV (PDF)
                </div>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                />
              </Label>
            </div>
          )}
        </Card>

        {/* Skills Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-display font-bold mb-4">Skills</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-sm px-3 py-1.5 flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <Button onClick={handleAddSkill} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Tools Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-display font-bold mb-4">Tools & Technologies</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tools.map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="text-sm px-3 py-1.5 flex items-center gap-2"
              >
                {tool}
                <button
                  onClick={() => handleRemoveTool(tool)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a tool..."
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTool()}
            />
            <Button onClick={handleAddTool} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            className="rounded-full px-8"
          >
            Save Changes
          </Button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Profile;
