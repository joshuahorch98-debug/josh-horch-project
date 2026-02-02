import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { RefreshCw, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AdminControls() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const triggerMonitoring = async () => {
    setIsMonitoring(true);
    try {
      await axios.post(`${API_URL}/api/trigger-monitoring`);
      toast.success('Monitoring cycle started! Data will be collected and processed.', {
        duration: 5000,
        icon: '🔄',
      });
    } catch (error) {
      toast.error('Failed to start monitoring cycle');
      console.error('Monitoring error:', error);
    } finally {
      setTimeout(() => setIsMonitoring(false), 3000);
    }
  };

  const triggerReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await axios.post(`${API_URL}/api/trigger-report`);
      toast.success('Daily report generated successfully!', {
        duration: 5000,
        icon: '📊',
      });
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Report generation error:', error);
    } finally {
      setTimeout(() => setIsGeneratingReport(false), 3000);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <span className="text-primary">⚙️</span> ADMIN CONTROLS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={triggerMonitoring}
          disabled={isMonitoring}
          className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-mono"
        >
          {isMonitoring ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              COLLECTING DATA...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              RUN MONITORING CYCLE
            </>
          )}
        </Button>

        <Button
          onClick={triggerReport}
          disabled={isGeneratingReport}
          className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 font-mono"
        >
          {isGeneratingReport ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              GENERATING...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              GENERATE DAILY REPORT
            </>
          )}
        </Button>

        <div className="pt-2 border-t border-primary/10">
          <p className="text-xs text-muted-foreground font-mono">
            • Monitoring: Collects news from all sources
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            • Report: Generates analysis for today
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
