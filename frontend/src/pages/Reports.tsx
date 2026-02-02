import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate, getCategoryColor } from '../lib/utils';
import { FileText, Download, TrendingUp, AlertCircle, Calendar, Loader2, ClipboardList, Target, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

export function Reports() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const { data: reports } = useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => reportsApi.getRecentReports(7),
  });

  const { data: currentReport, isLoading } = useQuery({
    queryKey: ['daily-report', selectedDate],
    queryFn: () => reportsApi.getDailyReport(selectedDate),
    enabled: !!selectedDate,
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-border-glow">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligence Reports</h1>
            <p className="text-sm text-muted-foreground font-mono">
              DAILY ANALYSIS • STRATEGIC ASSESSMENT
            </p>
          </div>
        </div>
        <Button className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-mono">
          <Download className="w-4 h-4 mr-2" />
          EXPORT PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Report Selector */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="border-b border-primary/10 bg-primary/5 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">Report Archive</CardTitle>
            </div>
            <CardDescription className="text-xs font-mono">SELECT DATE</CardDescription>
          </CardHeader>
          <CardContent className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
            {reports?.map((report, index) => {
              const isSelected = format(new Date(report.date), 'yyyy-MM-dd') === selectedDate;
              return (
                <button
                  key={report._id}
                  onClick={() => setSelectedDate(format(new Date(report.date), 'yyyy-MM-dd'))}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 animate-fadeIn ${
                    isSelected
                      ? 'bg-primary/10 border-primary/30 cyber-glow'
                      : 'border-primary/10 hover:border-primary/20 hover:bg-primary/5'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className={`font-medium text-sm ${isSelected ? 'text-primary' : ''}`}>
                      {formatDate(report.date)}
                    </div>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {report.statistics.totalItems} ITEMS ANALYZED
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Report Content */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-muted-foreground font-mono">LOADING REPORT...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Retrieving analysis data</p>
              </CardContent>
            </Card>
          ) : currentReport ? (
            <>
              {/* Executive Summary */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-primary/10 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Executive Summary</CardTitle>
                        <CardDescription className="text-xs font-mono">
                          {formatDate(currentReport.date)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-mono">
                      {currentReport.statistics.totalItems} ITEMS
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {currentReport.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Trends & Implications */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b border-primary/10 bg-primary/5 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <CardTitle className="text-sm">Key Trends</CardTitle>
                    </div>
                    <CardDescription className="text-xs font-mono">PATTERN ANALYSIS</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {currentReport.analysis.trends.map((trend, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-mono text-primary">{idx + 1}</span>
                          </div>
                          <span className="text-muted-foreground">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="border-b border-primary/10 bg-amber-500/5 pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <CardTitle className="text-sm">Implications</CardTitle>
                    </div>
                    <CardDescription className="text-xs font-mono">RISK ASSESSMENT</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {currentReport.analysis.implications.map((implication, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Target className="w-3 h-3 text-amber-500" />
                          </div>
                          <span className="text-muted-foreground">{implication}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-primary/10 bg-emerald-500/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-500" />
                    <CardTitle className="text-sm">Strategic Recommendations</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-mono">ACTIONABLE INTELLIGENCE</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    {currentReport.analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold font-mono text-emerald-500">{idx + 1}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm">{rec}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="text-muted-foreground font-mono">CATEGORY BREAKDOWN</span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(currentReport.statistics.byCategory).map(([category, count], index) => (
                    <Card key={category} className="group hover:cyber-glow transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardContent className="p-4">
                        <Badge className={`${getCategoryColor(category)} font-mono text-[10px]`}>
                          {category.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="text-3xl font-bold font-mono mt-3 text-gradient">{count}</div>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">items collected</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground font-mono">NO REPORT AVAILABLE</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Select a different date from the archive</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
