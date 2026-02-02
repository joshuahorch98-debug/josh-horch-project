import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi, alertsApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { NewsCard } from '../components/NewsCard';
import { AlertCard } from '../components/AlertCard';
import { AdminControls } from '../components/AdminControls';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, Globe, Activity, Zap, Radio, Eye, Database } from 'lucide-react';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { data: breakingNews, refetch: refetchBreaking } = useQuery({
    queryKey: ['breaking-news'],
    queryFn: () => newsApi.getNews({ breaking: true, limit: 5 }),
  });

  const { data: recentAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => alertsApi.getAlerts({ limit: 5, unreadOnly: true }),
  });

  const { data: alertStats } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: alertsApi.getStats,
    refetchInterval: 30000,
  });

  useEffect(() => {
    socketService.connect();

    socketService.on('breaking-news', (data) => {
      toast.custom(
        () => (
          <div className="bg-red-500/10 border border-red-500/30 text-foreground p-4 rounded-lg shadow-lg max-w-md cyber-glow">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-red-500 font-mono text-sm">⚠ BREAKING ALERT</p>
                <p className="text-sm mt-1">{data.alert.title}</p>
              </div>
            </div>
          </div>
        ),
        { duration: 10000 }
      );
      refetchBreaking();
      refetchAlerts();
    });

    return () => {
      socketService.off('breaking-news');
    };
  }, [refetchBreaking, refetchAlerts]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-border-glow">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Intelligence Dashboard</h1>
                <p className="text-sm text-muted-foreground font-mono">
                  SECTOR: VENEZUELA • CLASSIFICATION: OSINT
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-500">LIVE FEED ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      <AdminControls />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Alerts</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-gradient">{alertStats?.total || 0}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs text-muted-foreground font-mono">
                {alertStats?.unread || 0} UNREAD
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Breaking News</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-gradient">{breakingNews?.length || 0}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs text-muted-foreground font-mono">ACTIVE NOW</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Sources</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-gradient">6</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs text-muted-foreground font-mono">PLATFORMS</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:cyber-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Status</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-mono">
              ● OPERATIONAL
            </Badge>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-primary animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Breaking News</CardTitle>
                  <CardDescription className="font-mono text-xs">PRIORITY INTELLIGENCE</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-red-500">LIVE</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {breakingNews && breakingNews.length > 0 ? (
              breakingNews.map((news, index) => (
                <div key={news._id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  <NewsCard news={news} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-mono">NO BREAKING NEWS</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Monitoring active channels...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Recent Alerts</CardTitle>
                  <CardDescription className="font-mono text-xs">UNREAD NOTIFICATIONS</CardDescription>
                </div>
              </div>
              {recentAlerts && recentAlerts.length > 0 && (
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-500">{recentAlerts.length}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {recentAlerts && recentAlerts.length > 0 ? (
              recentAlerts.map((alert, index) => (
                <div key={alert._id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  <AlertCard
                    alert={alert}
                    onMarkAsRead={async (id) => {
                      await alertsApi.markAsRead(id);
                      refetchAlerts();
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-mono">ALL CLEAR</p>
                <p className="text-xs text-muted-foreground/60 mt-1">No unread alerts at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
