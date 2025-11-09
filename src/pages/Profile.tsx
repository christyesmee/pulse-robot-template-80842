import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, ArrowLeft, FileText, Linkedin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const FIELDS = [
  "Marketing",
  "Tech / Software",
  "Finance",
  "Graphic Design",
  "Sales / Business",
  "Healthcare",
  "Writing / Content",
  "Human Resources",
  "I'm not sure yet!",
];

const EXPERIENCE_TYPES = [
  { id: "internship", label: "Internship(s)", placeholder: "What company or field?" },
  { id: "project", label: "Class / Capstone Project", placeholder: "What was the project? (e.g., 'Marketing plan for a local business')" },
  { id: "parttime", label: "Part-Time Job", placeholder: "What was the job? (e.g., 'Shift supervisor at a coffee shop')" },
  { id: "volunteer", label: "Volunteer Work", placeholder: "What did you do?" },
  { id: "personal", label: "Personal Project", placeholder: "What did you build? (e.g., 'built a website, ran a student club')" },
  { id: "freelance", label: "Freelance / Gig Work", placeholder: "What type of work?" },
  { id: "none", label: "None of the above yet! (That's OK!)", placeholder: "" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);
  
  // CV State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  
  // Step 1: Fields & Status
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [showCustomField, setShowCustomField] = useState(false);
  const [customField, setCustomField] = useState("");
  
  // Step 2: Experiences
  const [selectedExperiences, setSelectedExperiences] = useState<Record<string, string>>({});
  
  // Step 3: Skills & Tools
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newTool, setNewTool] = useState("");

  // Check LinkedIn connection status
  useEffect(() => {
    const checkLinkedInConnection = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if user is connected via LinkedIn
        const identities = user.identities || [];
        const linkedInIdentity = identities.find(
          (identity) => identity.provider === 'linkedin_oidc'
        );
        setIsLinkedInConnected(!!linkedInIdentity);
      }
    };
    
    checkLinkedInConnection();
  }, []);

  // Load existing data
  useEffect(() => {
    // First, check if there's CV extracted data to pre-fill
    const cvExtractedData = localStorage.getItem("cvExtractedData");
    if (cvExtractedData) {
      try {
        const extractedData = JSON.parse(cvExtractedData);
        
        // Pre-fill from CV extraction
        if (extractedData.fields) setSelectedFields(extractedData.fields);
        if (extractedData.status) setStatus(extractedData.status);
        if (extractedData.experiences) {
          const experiencesMap: Record<string, string> = {};
          extractedData.experiences.forEach((exp: { type: string; details: string }) => {
            experiencesMap[exp.type] = exp.details;
          });
          setSelectedExperiences(experiencesMap);
        }
        if (extractedData.skills) setSelectedSkills(extractedData.skills);
        if (extractedData.tools) setTools(extractedData.tools);
        
        toast({
          title: "Profile Pre-filled! ✨",
          description: "We've extracted information from your CV. Review and add more details below.",
        });
        
        // Clear the extracted data so it doesn't pre-fill again on next visit
        localStorage.removeItem("cvExtractedData");
      } catch (error) {
        console.error("Error loading CV extracted data:", error);
      }
    }
    
    // Then load any saved profile data (which will override CV data if user saved changes)
    const storedCvName = localStorage.getItem("cvFileName");
    const storedFields = JSON.parse(localStorage.getItem("onboarding_fields") || "[]");
    const storedStatus = localStorage.getItem("onboarding_status") || "";
    const storedExperiences = JSON.parse(localStorage.getItem("onboarding_experiences") || "{}");
    const storedSkills = JSON.parse(localStorage.getItem("onboarding_skills") || "[]");
    const storedTools = JSON.parse(localStorage.getItem("onboarding_tools") || "[]");
    
    // Only load saved data if no CV extracted data was loaded
    if (!cvExtractedData) {
      if (storedCvName) setCvFileName(storedCvName);
      if (storedFields.length > 0) setSelectedFields(storedFields);
      if (storedStatus) setStatus(storedStatus);
      if (Object.keys(storedExperiences).length > 0) setSelectedExperiences(storedExperiences);
      if (storedSkills.length > 0) setSelectedSkills(storedSkills);
      if (storedTools.length > 0) setTools(storedTools);
    } else {
      // Just load CV name if extracted data was present
      if (storedCvName) setCvFileName(storedCvName);
    }
  }, [toast]);

  // CV Upload Handler
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

  // Field Selection Handlers
  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else if (selectedFields.length < 3) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const addCustomField = () => {
    if (customField.trim() && !selectedFields.includes(customField.trim()) && selectedFields.length < 3) {
      setSelectedFields([...selectedFields, customField.trim()]);
      setCustomField("");
      setShowCustomField(false);
    }
  };

  // Experience Handlers
  const toggleExperience = (id: string) => {
    if (id === "none") {
      setSelectedExperiences({ none: "" });
      return;
    }

    if (selectedExperiences[id] !== undefined) {
      const newExp = { ...selectedExperiences };
      delete newExp[id];
      setSelectedExperiences(newExp);
    } else {
      const newExp = { ...selectedExperiences };
      delete newExp.none;
      newExp[id] = "";
      setSelectedExperiences(newExp);
    }
  };

  const updateExperienceDetail = (id: string, detail: string) => {
    setSelectedExperiences({
      ...selectedExperiences,
      [id]: detail,
    });
  };

  // Skills & Tools Handlers
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

  // Save Handler
  const handleSave = () => {
    // Save to localStorage
    if (cvFile) {
      localStorage.setItem("cvFileName", cvFile.name);
    }
    localStorage.setItem("onboarding_fields", JSON.stringify(selectedFields));
    localStorage.setItem("onboarding_status", status);
    localStorage.setItem("onboarding_experiences", JSON.stringify(selectedExperiences));
    localStorage.setItem("onboarding_skills", JSON.stringify(selectedSkills));
    localStorage.setItem("onboarding_tools", JSON.stringify(tools));
    localStorage.setItem("onboarding_completed", "true");

    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully",
    });

    navigate("/matches");
  };

  // LinkedIn Connection Handler
  const handleConnectLinkedIn = async () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to connect LinkedIn",
        variant: "destructive",
      });
      return;
    }

    setIsConnectingLinkedIn(true);
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          scopes: 'openid profile email'
        }
      });

      if (error) {
        toast({
          title: "LinkedIn Connection Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("LinkedIn connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect LinkedIn. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingLinkedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            My Profile
          </h1>
          <p className="text-foreground/70 text-lg">
            Update your information to get better job matches
          </p>
        </div>

        <div className="space-y-8">
          {/* CV Upload Section */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-2">CV / Resume</h2>
            <p className="text-foreground/70 mb-6">
              Upload your CV to auto-fill your profile, or fill in the information manually below.
            </p>
            
            {cvFileName ? (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{cvFileName}</p>
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
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-16 h-16 text-foreground/40 mx-auto mb-4" />
                <p className="text-foreground/70 mb-4 text-lg">No CV uploaded yet</p>
                <Label htmlFor="cv-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-lg">
                    <Upload className="w-5 h-5" />
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

          {/* LinkedIn Connection Section */}
          <Card className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">LinkedIn Profile</h2>
                <p className="text-foreground/70">
                  Connect your LinkedIn to import and sync your professional profile
                </p>
              </div>
              <Linkedin className="w-12 h-12 text-[#0077B5]" />
            </div>

            {isLinkedInConnected ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">LinkedIn Connected</p>
                    <p className="text-sm text-foreground/60">Your profile is synced with LinkedIn</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#0077B5]/30 rounded-xl p-8 text-center hover:border-[#0077B5]/50 transition-colors">
                <Linkedin className="w-16 h-16 text-[#0077B5]/40 mx-auto mb-4" />
                <p className="text-foreground/70 mb-4 text-lg">LinkedIn not connected</p>
                <Button
                  onClick={handleConnectLinkedIn}
                  disabled={isConnectingLinkedIn}
                  size="lg"
                  className="bg-[#0077B5] hover:bg-[#006399] text-white"
                >
                  {isConnectingLinkedIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect LinkedIn
                    </>
                  )}
                </Button>
                <p className="text-sm text-foreground/60 mt-4">
                  We'll import your experience, skills, and education automatically
                </p>
              </div>
            )}
          </Card>

          {/* Fields of Interest Section */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-2">
              What's your main field of interest?
            </h2>
            <p className="text-foreground/70 mb-6">
              This helps us know what kind of jobs to look for. (Pick 1-3)
            </p>

            <div className="flex flex-wrap gap-3">
              {FIELDS.map((field) => (
                <button
                  key={field}
                  onClick={() => toggleField(field)}
                  disabled={!selectedFields.includes(field) && selectedFields.length >= 3}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedFields.includes(field)
                      ? "bg-primary text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {field}
                </button>
              ))}

              {!showCustomField ? (
                <button
                  onClick={() => setShowCustomField(true)}
                  disabled={selectedFields.length >= 3}
                  className="px-6 py-3 rounded-full text-sm font-medium bg-white text-gray-700 border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add another...
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomField()}
                    placeholder="Type your field..."
                    className="px-4 py-2 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />
                  <Button onClick={addCustomField} size="sm" className="rounded-full">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {selectedFields.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Selected {selectedFields.length} of 3 fields
              </p>
            )}
          </Card>

          {/* Current Status Section */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-6">
              What's your current status?
            </h2>

            <div className="space-y-3">
              {[
                { value: "student", label: "Student", subtitle: "Looking for an internship or first job" },
                { value: "graduate", label: "Recent Graduate", subtitle: "Graduated in the last 2 years" },
                { value: "changer", label: "Career Changer", subtitle: "Looking to pivot into a new field" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    status === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.subtitle}</div>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Experience Section */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-2">
              What kinds of experience do you have?
            </h2>
            <p className="text-gray-600 mb-6">
              Check all that apply. We'll ask for details in a second.
            </p>

            <div className="space-y-4">
              {EXPERIENCE_TYPES.map((exp) => (
                <div key={exp.id}>
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedExperiences[exp.id] !== undefined}
                      onChange={() => toggleExperience(exp.id)}
                      className="mt-1 w-5 h-5 text-primary focus:ring-primary rounded"
                    />
                    <span className="ml-3 text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {exp.label}
                    </span>
                  </label>

                  {/* Detail Input - shows when checked and not "none" */}
                  {selectedExperiences[exp.id] !== undefined && exp.id !== "none" && (
                    <div className="ml-8 mt-3 animate-fade-in">
                      <Input
                        type="text"
                        value={selectedExperiences[exp.id] || ""}
                        onChange={(e) => updateExperienceDetail(exp.id, e.target.value)}
                        placeholder={exp.placeholder}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Skills Section */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-6">Skills</h2>
            
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
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-6">Tools & Technologies</h2>
            
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
          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={handleSave}
              className="rounded-full px-10 py-6 text-lg"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Profile;
