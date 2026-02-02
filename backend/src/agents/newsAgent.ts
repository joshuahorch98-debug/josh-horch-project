import axios from 'axios';
import * as cheerio from 'cheerio';
import NewsAPI from 'newsapi';
import { config } from '../config';
import { SourcePlatform } from '../types';
import aiService from '../services/aiService';

const newsapi = new NewsAPI(config.apis.newsApi);

export class NewsAgent {
  private platform = SourcePlatform.NEWS;

  private stripHtmlTags(text: string): string {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  async fetchNews(): Promise<any[]> {
    const results: any[] = [];

    try {
      const newsApiResults = await this.fetchFromNewsAPI();
      results.push(...newsApiResults);
    } catch (error) {
      console.error('NewsAPI error:', error);
    }

    try {
      const googleNewsResults = await this.fetchFromGoogleNews();
      results.push(...googleNewsResults);
    } catch (error) {
      console.error('Google News error:', error);
    }

    try {
      const rssResults = await this.fetchFromRSS();
      results.push(...rssResults);
    } catch (error) {
      console.error('RSS feed error:', error);
    }

    return results;
  }

  private async fetchFromNewsAPI(): Promise<any[]> {
    const response = await newsapi.v2.everything({
      q: 'Venezuela OR Maduro OR Caracas',
      language: 'en,es',
      sortBy: 'publishedAt',
      pageSize: 50,
    });

    return (response.articles || []).map((article: any) => ({
      title: article.title,
      content: article.description || article.content || '',
      sourceUrl: article.url,
      sourceName: article.source.name,
      publishedAt: new Date(article.publishedAt),
      imageUrl: article.urlToImage,
      platform: this.platform,
    }));
  }

  private async fetchFromGoogleNews(): Promise<any[]> {
    const results: any[] = [];
    const queries = [
      'Venezuela crisis',
      'Venezuela economy',
      'Venezuela politics',
      'Venezuela Maduro',
      'Venezuela sanctions',
    ];

    for (const query of queries) {
      try {
        const response = await axios.get('https://news.google.com/rss/search', {
          params: {
            q: query,
            hl: 'en-US',
            gl: 'US',
            ceid: 'US:en',
          },
        });

        const $ = cheerio.load(response.data, { xmlMode: true });
        const items = $('item');
        
        items.each((_, element) => {
          const $item = $(element);
          const title = this.stripHtmlTags($item.find('title').text());
          const link = $item.find('link').text();
          const description = this.stripHtmlTags($item.find('description').text());
          const pubDate = $item.find('pubDate').text();
          
          if (title && link && description && description.length > 20) {
            results.push({
              title: title,
              content: description,
              sourceUrl: link,
              sourceName: 'Google News',
              publishedAt: pubDate ? new Date(pubDate) : new Date(),
              platform: this.platform,
            });
          }
        });
      } catch (error) {
        console.error(`Google News error for query "${query}":`, error);
      }
    }

    return results;
  }

  private async fetchFromRSS(): Promise<any[]> {
    const feeds = [
      { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
      { url: 'https://www.bbc.com/news/world/latin_america/rss.xml', name: 'BBC' },
      { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'New York Times' },
    ];

    const results: any[] = [];

    for (const feed of feeds) {
      try {
        const response = await axios.get(feed.url);
        const $ = cheerio.load(response.data, { xmlMode: true });
        const items = $('item');
        
        items.each((_, element) => {
          const $item = $(element);
          const title = this.stripHtmlTags($item.find('title').text());
          const link = $item.find('link').text();
          const description = this.stripHtmlTags($item.find('description').text());
          const pubDate = $item.find('pubDate').text();
          
          if (title && link && title.toLowerCase().includes('venezuela') && description && description.length > 20) {
            results.push({
              title: title,
              content: description,
              sourceUrl: link,
              sourceName: feed.name,
              publishedAt: pubDate ? new Date(pubDate) : new Date(),
              platform: this.platform,
            });
          }
        });
      } catch (error) {
        console.error(`RSS feed error for ${feed.url}:`, error);
      }
    }

    return results;
  }
}

export default new NewsAgent();
