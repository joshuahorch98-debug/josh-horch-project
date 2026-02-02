import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../services/api';
import { AlertCard } from '../components/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertSeverity } from '../types';
import { Bell, RefreshCw, AlertTriangle, ShieldAlert, Shield, Radio } from 'lucide-react';

export function Alerts() {
  const { data: alerts, refetch, isRefetching } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsApi.getAlerts({ limit: 100 }),
  });

  const { data: stats } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: alertsApi.getStats,
  });

  const handleMarkAsRead = async (id: string) => {
    await alertsApi.markAsRead(id);
    refetch();
  };

  const criticalAlerts = alerts?.filter(a => a.severity === AlertSeverity.CRITICAL) || [];
  const highAlerts = alerts?.filter(a => a.severity === AlertSeverity.HIGH) || [];
  const otherAlerts = alerts?.filter(
    a => a.severity !== AlertSeverity.CRITICAL && a.severity !== AlertSeverity.HIGH
  ) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center cyber-border-glow">
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Alert Center</h1>
            <p className="text-sm text-muted-foreground font-mono">
              REAL-TIME NOTIFICATIONS • THREAT MONITORING
            </p>
          </div>
        </div>
        <Button 
          onClick={() => refetch()}
          className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-mono"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          REFRESH
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Alerts</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-gradient">{stats?.total || 0}</div>
            <div className="flex items-center gap-2 mt-2">
              <Radio className="w-3 h-3 text-primary animate-pulse" />
              <p className="text-xs text-muted-foreground font-mono">MONITORING</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Unread</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">{stats?.unread || 0}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs text-muted-foreground font-mono">PENDING REVIEW</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Critical</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-red-500">{criticalAlerts.length}</div>
            <div className="flex items-center gap-2 mt-2">
              {criticalAlerts.length > 0 && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              <p className="text-xs text-muted-foreground font-mono">
                {criticalAlerts.length > 0 ? 'REQUIRES ATTENTION' : 'ALL CLEAR'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-500">Critical Alerts</h2>
              <p className="text-xs text-muted-foreground font-mono">IMMEDIATE ACTION REQUIRED</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-red-500">{criticalAlerts.length} ACTIVE</span>
            </div>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <div key={alert._id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <AlertCard alert={alert} onMarkAsRead={handleMarkAsRead} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High Priority Alerts Section */}
      {highAlerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-500">High Priority</h2>
              <p className="text-xs text-muted-foreground font-mono">ELEVATED THREAT LEVEL</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-mono text-amber-500">{highAlerts.length} ITEMS</span>
            </div>
          </div>
          <div className="space-y-3">
            {highAlerts.map((alert, index) => (
              <div key={alert._id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <AlertCard alert={alert} onMarkAsRead={handleMarkAsRead} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Alerts Section */}
      {otherAlerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Standard Alerts</h2>
              <p className="text-xs text-muted-foreground font-mono">ROUTINE MONITORING</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded bg-muted border border-primary/10">
              <span className="text-[10px] font-mono text-muted-foreground">{otherAlerts.length} ITEMS</span>
            </div>
          </div>
          <div className="space-y-3">
            {otherAlerts.map((alert, index) => (
              <div key={alert._id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <AlertCard alert={alert} onMarkAsRead={handleMarkAsRead} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {alerts && alerts.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground font-mono">ALL CLEAR</p>
            <p className="text-xs text-muted-foreground/60 mt-1">No active alerts at this time</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
