import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../services/api';
import { NewsCategory } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { Search, TrendingUp, Globe, ArrowRight, Mail } from 'lucide-react';

export function PublicPortal() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: news, isLoading } = useQuery({
    queryKey: ['public-news', selectedCategory],
    queryFn: () => newsApi.getNews({ category: selectedCategory, limit: 20 }),
  });

  const featuredNews = news?.slice(0, 1)[0];
  const topStories = news?.slice(1, 5);
  const otherNews = news?.slice(5);

  const categories = [
    { id: '', label: 'All News', icon: '📰' },
    { id: NewsCategory.KEY_EVENTS, label: 'Breaking', icon: '⚡' },
    { id: NewsCategory.POLITICAL, label: 'Politics', icon: '🏛️' },
    { id: NewsCategory.ECONOMIC, label: 'Economy', icon: '💰' },
    { id: NewsCategory.SOCIAL, label: 'Society', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Venezuela Today
                </h1>
                <p className="text-xs text-slate-500">Independent News Coverage</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Latest</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Analysis</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">About</a>
            </nav>

            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Live Coverage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Latest News from Venezuela
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Stay informed with real-time updates, in-depth analysis, and comprehensive coverage
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-600">Loading latest news...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Story */}
            <div className="lg:col-span-2 space-y-8">
              {featuredNews && (
                <article className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  {featuredNews.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={featuredNews.imageUrl}
                        alt={featuredNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                        Featured
                      </span>
                      <span className="text-sm text-slate-500">
                        {formatRelativeTime(featuredNews.publishedAt)}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredNews.title}
                    </h2>
                    <p className="text-lg text-slate-600 mb-6 line-clamp-3">
                      {featuredNews.summary}
                    </p>
                    <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                      Read Full Story
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              )}

              {/* Top Stories Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {topStories?.map((item) => (
                  <article
                    key={item._id}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {item.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-500">
                          {formatRelativeTime(item.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Other News List */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">More Stories</h3>
                {otherNews?.map((item) => (
                  <article
                    key={item._id}
                    className="group flex gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 mb-2">
                        {formatRelativeTime(item.publishedAt)}
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className="text-blue-100 mb-6">
                  Get daily briefings delivered to your inbox
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg text-slate-900 placeholder:text-slate-400 mb-3 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                  Subscribe Now
                </button>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  {['Political Crisis', 'Economic Sanctions', 'Humanitarian Aid', 'Oil Production', 'Migration'].map((topic, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{topic}</span>
                        <span className="text-xs text-slate-500">#{idx + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Today's Coverage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Articles Published</span>
                    <span className="text-2xl font-bold text-blue-600">{news?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Breaking News</span>
                    <span className="text-2xl font-bold text-red-600">
                      {news?.filter(n => n.isBreaking).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Last Updated</span>
                    <span className="text-sm font-medium text-slate-900">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-lg">Venezuela Today</span>
              </div>
              <p className="text-slate-400 text-sm">
                Independent news coverage providing real-time updates and in-depth analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sections</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Politics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Economy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Society</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analysis</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-slate-400 mb-4">
                Follow us for the latest updates
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  𝕏
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  f
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                  in
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2026 Venezuela Today. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
