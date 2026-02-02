import { Alert } from '../types';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatRelativeTime, getSeverityColor, getCategoryColor } from '../lib/utils';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead?: (id: string) => void;
  onClick?: () => void;
}

export function AlertCard({ alert, onMarkAsRead, onClick }: AlertCardProps) {
  return (
    <Card
      className={`group hover:cyber-glow transition-all duration-300 cursor-pointer ${
        !alert.read ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-transparent opacity-70'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Badge className={`${getSeverityColor(alert.severity)} font-mono text-[10px]`}>
                {alert.severity.toUpperCase()}
              </Badge>
              <Badge className={`${getCategoryColor(alert.category)} font-mono text-[10px]`}>
                {alert.category.replace('_', ' ').toUpperCase()}
              </Badge>
              {!alert.read && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors truncate">
              {alert.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {alert.message}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground/70">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{formatRelativeTime(alert.timestamp)}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onMarkAsRead && !alert.read) {
                onMarkAsRead(alert._id);
              }
            }}
            className={`p-2 rounded-lg transition-all ${
              alert.read 
                ? 'text-muted-foreground/50' 
                : 'text-primary hover:bg-primary/10 hover:text-primary'
            }`}
            title={alert.read ? 'Already read' : 'Mark as read'}
          >
            {alert.read ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
