import { NewsItem } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatRelativeTime, getCategoryColor, getSeverityColor, getPlatformIcon } from '../lib/utils';
import { ExternalLink, Clock, Zap } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onClick?: () => void;
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  return (
    <Card
      className="group hover:cyber-glow transition-all duration-300 cursor-pointer border-l-2 border-l-transparent hover:border-l-primary"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {news.isBreaking && (
                <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse font-mono">
                  <Zap className="w-3 h-3 mr-1" />
                  BREAKING
                </Badge>
              )}
              <Badge className={`${getCategoryColor(news.category)} font-mono text-[10px]`}>
                {news.category.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={`${getSeverityColor(news.severity)} font-mono text-[10px]`}>
                {news.severity.toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-base font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {news.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {news.summary}
            </p>
          </div>
          {news.imageUrl && (
            <div className="relative">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-20 h-20 object-cover rounded-lg border border-primary/10"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/10 pt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="text-base">{getPlatformIcon(news.platform)}</span>
              <span className="text-foreground/70">{news.sourceName}</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground/70">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(news.publishedAt)}
            </span>
          </div>
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-mono text-[10px] uppercase tracking-wider"
          >
            <ExternalLink className="w-3 h-3" />
            Source
          </a>
        </div>
        {news.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {news.keywords.slice(0, 5).map((keyword, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-primary/5 border border-primary/10 rounded text-muted-foreground font-mono"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
