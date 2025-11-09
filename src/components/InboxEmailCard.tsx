import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, FileText, PenTool } from "lucide-react";

interface InboxEmailCardProps {
  company: string;
  position: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: string;
}

export const InboxEmailCard = ({
  company,
  position,
  subject,
  body,
  receivedAt,
  status,
}: InboxEmailCardProps) => {
  const getStatusConfig = (statusValue: string) => {
    const configs: Record<string, { icon: any; label: string; color: string }> = {
      interview_requested: {
        icon: FileText,
        label: 'Assignment',
        color: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
      },
      interview_scheduled: {
        icon: Calendar,
        label: 'Interview Planning',
        color: 'bg-green-500/10 text-green-700 border-green-500/20'
      },
      offer_received: {
        icon: PenTool,
        label: 'Contract Signing',
        color: 'bg-purple-500/10 text-purple-700 border-purple-500/20'
      },
      rejected: {
        icon: Mail,
        label: 'Not Selected',
        color: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
      },
    };
    return configs[statusValue] || {
      icon: Mail,
      label: 'Response',
      color: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
    };
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <StatusIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{company}</h3>
              <p className="text-sm text-foreground/70 truncate">{position}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <Badge className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
              <span className="text-xs text-foreground/60">
                {new Date(receivedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <h4 className="font-semibold text-sm mb-2 text-foreground/90">{subject}</h4>
          <p className="text-sm text-foreground/70 line-clamp-2 whitespace-pre-line">
            {body}
          </p>
        </div>
      </div>
    </Card>
  );
};
