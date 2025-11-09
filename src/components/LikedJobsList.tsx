import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LikedJob {
  id: string;
  job_id: string;
  position: string;
  company: string;
  location?: string;
  salary?: string;
  match_score?: number;
  source_url?: string;
  created_at: string;
}

interface LikedJobsListProps {
  jobs: LikedJob[];
  onApplySelected: (jobIds: string[]) => void;
  onRemove: (jobId: string) => void;
  isApplying: boolean;
}

export const LikedJobsList = ({ jobs, onApplySelected, onRemove, isApplying }: LikedJobsListProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job.id));
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = () => {
    if (selectedJobs.length > 0) {
      onApplySelected(selectedJobs);
      setSelectedJobs([]);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No liked jobs yet. Start liking jobs to build your queue!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectedJobs.length === jobs.length}
            onCheckedChange={handleSelectAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All ({selectedJobs.length} of {jobs.length} selected)
          </label>
        </div>
        <Button
          onClick={handleApply}
          disabled={selectedJobs.length === 0 || isApplying}
          size="lg"
        >
          {isApplying ? 'Applying...' : `Apply to ${selectedJobs.length || ''} Selected Job${selectedJobs.length !== 1 ? 's' : ''}`}
        </Button>
      </div>

      {/* Jobs Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/30 border-b">
            <tr>
              <th className="w-12 p-3"></th>
              <th className="text-left p-3 text-sm font-semibold">Position</th>
              <th className="text-left p-3 text-sm font-semibold">Company</th>
              <th className="text-left p-3 text-sm font-semibold hidden md:table-cell">Location</th>
              <th className="text-left p-3 text-sm font-semibold hidden lg:table-cell">Salary</th>
              <th className="text-center p-3 text-sm font-semibold hidden sm:table-cell">Match</th>
              <th className="text-center p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr 
                key={job.id} 
                className={`border-b hover:bg-secondary/20 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-secondary/5'}`}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedJobs.includes(job.id)}
                    onCheckedChange={() => handleSelectJob(job.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium text-foreground line-clamp-1">
                    {job.position}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-muted-foreground">
                    {job.company}
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="text-sm text-muted-foreground">
                    {job.location || 'N/A'}
                  </div>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="text-sm text-muted-foreground">
                    {job.salary || 'Not specified'}
                  </div>
                </td>
                <td className="p-3 text-center hidden sm:table-cell">
                  {job.match_score && (
                    <Badge variant="secondary" className="text-xs">
                      {job.match_score}%
                    </Badge>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View Generated CV"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {job.source_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Original Job Post"
                        onClick={() => window.open(job.source_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      title="Remove from Liked Jobs"
                      onClick={() => onRemove(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
