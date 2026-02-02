import { startOfDay, endOfDay } from 'date-fns';
import NewsItem from '../models/NewsItem';
import DailyReport from '../models/DailyReport';
import aiService from './aiService';
import { NewsCategory, SourcePlatform, AlertSeverity } from '../types';

export class ReportService {
  async generateDailyReport(date: Date = new Date()): Promise<any> {
    console.log(`Generating daily report for ${date.toDateString()}...`);

    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    // Check if report already exists for this date - delete it to regenerate
    const existingReport = await DailyReport.findOne({ date: startDate });
    if (existingReport) {
      console.log('Existing report found, deleting to regenerate...');
      await DailyReport.deleteOne({ date: startDate });
    }

    const newsItems = await NewsItem.find({
      publishedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ publishedAt: -1 });

    // Also get recent items if today has few items (within last 24 hours)
    let allItems = newsItems;
    if (newsItems.length < 10) {
      const recentItems = await NewsItem.find({
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      }).sort({ createdAt: -1 }).limit(50);
      allItems = recentItems.length > newsItems.length ? recentItems : newsItems;
    }

    if (allItems.length === 0) {
      console.log('No news items found for this date.');
      return null;
    }

    const keyEvents = allItems.filter(
      item => item.category === NewsCategory.KEY_EVENTS
    );
    const politicalUpdates = allItems.filter(
      item => item.category === NewsCategory.POLITICAL
    );
    const economicSituation = allItems.filter(
      item => item.category === NewsCategory.ECONOMIC
    );
    const socialIssues = allItems.filter(
      item => item.category === NewsCategory.SOCIAL
    );

    let analysis;
    try {
      analysis = await aiService.generateDailyAnalysis(
        allItems.slice(0, 50).map(item => ({
          title: item.title,
          summary: item.summary,
          category: item.category,
          severity: item.severity,
        }))
      );
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      // Fallback analysis
      analysis = {
        summary: `Daily intelligence report for ${date.toDateString()}. Collected ${newsItems.length} items from multiple sources including news agencies, social media, and RSS feeds. Key focus areas include political developments, economic indicators, and social movements in Venezuela.`,
        trends: [
          'Ongoing political tensions and government actions',
          'International sanctions and their economic impact',
          'Social movements and civil society activities',
          'Regional and international diplomatic developments',
          'Economic challenges and humanitarian concerns'
        ],
        implications: [
          'Continued political instability affecting business operations',
          'Economic sanctions impacting trade and investment',
          'Humanitarian situation requiring monitoring',
          'Regional security considerations',
          'International relations affecting diplomatic engagement'
        ],
        recommendations: [
          'Monitor political developments closely for operational impacts',
          'Assess economic sanctions compliance requirements',
          'Maintain situational awareness of security conditions'
        ]
      };
    }

    const statistics = this.calculateStatistics(allItems);

    const report = new DailyReport({
      date: startDate,
      summary: analysis.summary,
      keyEvents: keyEvents.slice(0, 10).map(item => item._id),
      politicalUpdates: politicalUpdates.slice(0, 10).map(item => item._id),
      economicSituation: economicSituation.slice(0, 10).map(item => item._id),
      socialIssues: socialIssues.slice(0, 10).map(item => item._id),
      analysis: {
        trends: analysis.trends,
        implications: analysis.implications,
        recommendations: analysis.recommendations,
      },
      statistics,
    });

    await report.save();

    console.log(`Daily report generated with ${allItems.length} items.`);

    return report.populate([
      'keyEvents',
      'politicalUpdates',
      'economicSituation',
      'socialIssues',
    ]);
  }

  private calculateStatistics(newsItems: any[]): any {
    const byPlatform = new Map<SourcePlatform, number>();
    const byCategory = new Map<NewsCategory, number>();
    const bySeverity = new Map<AlertSeverity, number>();

    for (const item of newsItems) {
      byPlatform.set(
        item.platform,
        (byPlatform.get(item.platform) || 0) + 1
      );
      byCategory.set(
        item.category,
        (byCategory.get(item.category) || 0) + 1
      );
      bySeverity.set(
        item.severity,
        (bySeverity.get(item.severity) || 0) + 1
      );
    }

    return {
      totalItems: newsItems.length,
      byPlatform,
      byCategory,
      bySeverity,
    };
  }

  async getReport(date: Date): Promise<any> {
    const startDate = startOfDay(date);
    
    const report = await DailyReport.findOne({ date: startDate }).populate([
      'keyEvents',
      'politicalUpdates',
      'economicSituation',
      'socialIssues',
    ]);

    return report;
  }

  async getRecentReports(limit: number = 7): Promise<any[]> {
    const reports = await DailyReport.find()
      .sort({ date: -1 })
      .limit(limit)
      .populate([
        'keyEvents',
        'politicalUpdates',
        'economicSituation',
        'socialIssues',
      ]);

    return reports;
  }
}

export default new ReportService();
