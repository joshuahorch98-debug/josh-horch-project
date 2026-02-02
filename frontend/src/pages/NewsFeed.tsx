import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../services/api';
import { NewsCard } from '../components/NewsCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { NewsCategory, SourcePlatform } from '../types';
import { Newspaper, Filter, Loader2, Globe, Radio } from 'lucide-react';

export function NewsFeed() {
  const [category, setCategory] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', category, platform],
    queryFn: () => newsApi.getNews({ category, platform, limit: 50 }),
  });

  const categories = Object.values(NewsCategory);
  const platforms = Object.values(SourcePlatform);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-border-glow">
            <Newspaper className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligence Feed</h1>
            <p className="text-sm text-muted-foreground font-mono">
              OSINT COLLECTION • MULTI-PLATFORM MONITORING
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-emerald-500">
            {news?.length || 0} ITEMS
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Filters</span>
            <span className="text-xs text-muted-foreground font-mono ml-2">
              {category || platform ? 'ACTIVE' : 'NONE'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={category === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory('')}
                  className={category === '' ? 'bg-primary text-primary-foreground' : 'border-primary/20 hover:border-primary/40 font-mono text-xs'}
                >
                  ALL
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={category === cat ? 'bg-primary text-primary-foreground' : 'border-primary/20 hover:border-primary/40 font-mono text-xs'}
                  >
                    {cat.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                Platform
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={platform === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform('')}
                  className={platform === '' ? 'bg-primary text-primary-foreground' : 'border-primary/20 hover:border-primary/40 font-mono text-xs'}
                >
                  ALL
                </Button>
                {platforms.map((plat) => (
                  <Button
                    key={plat}
                    variant={platform === plat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPlatform(plat)}
                    className={platform === plat ? 'bg-primary text-primary-foreground' : 'border-primary/20 hover:border-primary/40 font-mono text-xs'}
                  >
                    {plat.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium text-muted-foreground font-mono">LOADING INTELLIGENCE...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Fetching data from sources</p>
            </CardContent>
          </Card>
        ) : news && news.length > 0 ? (
          <div className="grid gap-4">
            {news.map((item, index) => (
              <div key={item._id} className="animate-fadeIn" style={{ animationDelay: `${index * 30}ms` }}>
                <NewsCard news={item} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground font-mono">NO DATA FOUND</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
