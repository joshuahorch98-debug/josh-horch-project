import { useState, useEffect } from 'react';
import { Bell, Search, Wifi, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../services/api';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: alertStats } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: alertsApi.getStats,
    refetchInterval: 30000,
  });

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-primary/10 bg-card/80 backdrop-blur-md px-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
          <input
            type="search"
            placeholder="Search intelligence database..."
            className="w-full rounded-lg border border-primary/20 bg-background/50 pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span>CONNECTED</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span className="tabular-nums">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary/60">UTC{currentTime.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(currentTime.getTimezoneOffset() / 60)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-primary/10" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Alert Button */}
        <Button variant="ghost" size="icon" className="relative group">
          <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {alertStats && alertStats.unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold animate-pulse">
              {alertStats.unread > 9 ? '9+' : alertStats.unread}
            </span>
          )}
        </Button>

        {/* Threat Level Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-mono font-semibold text-amber-500">ELEVATED</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2">
          <div className="relative">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center cyber-border group-hover:cyber-glow transition-all">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
        </div>
      </div>
    </header>
  );
}
