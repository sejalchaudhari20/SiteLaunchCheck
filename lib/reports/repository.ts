import { ReportData } from '@/types/audit';
import { randomUUID } from 'crypto';
import { prisma } from '../prisma';

export interface FeedbackData {
  id: string;
  auditId?: string | null;
  auditUrl?: string | null;
  sessionId?: string | null;
  rating?: number; // 1-5
  helpful?: boolean;
  feedbackType?: string;
  message: string;
  email?: string;
  device?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved' | 'archived';
  source: 'landing_page' | 'audit_report';
}

export interface ReportRepository {
  createReport(data: Omit<ReportData, 'reportId'>): Promise<ReportData>;
  getReport(reportId: string): Promise<ReportData | null>;
  deleteReport(reportId: string): Promise<boolean>;
  getAllReports(): Promise<ReportData[]>;
  addFeedback(data: Omit<FeedbackData, 'id' | 'createdAt' | 'status'>): Promise<FeedbackData>;
  getAllFeedback(): Promise<FeedbackData[]>;
  updateFeedbackStatus(id: string, status: FeedbackData['status']): Promise<FeedbackData | null>;
  deleteFeedback(id: string): Promise<boolean>;
}

export class PrismaReportRepository implements ReportRepository {
  async createReport(data: Omit<ReportData, 'reportId'>): Promise<ReportData> {
    const reportId = `rpt_${randomUUID().replace(/-/g, '')}`;
    
    await prisma.report.create({
      data: {
        reportId,
        url: data.url,
        timestamp: data.timestamp,
        overallScore: data.overallScore,
        launchStatus: data.launchStatus,
        summary: JSON.stringify(data.summary),
        categoryScores: JSON.stringify(data.categoryScores),
        results: JSON.stringify(data.results),
      }
    });

    return {
      ...data,
      reportId,
    };
  }

  async getReport(reportId: string): Promise<ReportData | null> {
    const report = await prisma.report.findUnique({
      where: { reportId }
    });
    
    if (!report) return null;

    return {
      reportId: report.reportId,
      url: report.url,
      timestamp: report.timestamp,
      overallScore: report.overallScore,
      launchStatus: report.launchStatus as any,
      summary: JSON.parse(report.summary),
      categoryScores: JSON.parse(report.categoryScores),
      results: JSON.parse(report.results),
    };
  }

  async deleteReport(reportId: string): Promise<boolean> {
    try {
      await prisma.report.delete({
        where: { reportId }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAllReports(): Promise<ReportData[]> {
    const reports = await prisma.report.findMany({
      orderBy: { timestamp: 'desc' }
    });
    
    return reports.map(report => ({
      reportId: report.reportId,
      url: report.url,
      timestamp: report.timestamp,
      overallScore: report.overallScore,
      launchStatus: report.launchStatus as any,
      summary: JSON.parse(report.summary),
      categoryScores: JSON.parse(report.categoryScores),
      results: JSON.parse(report.results),
    }));
  }

  // Feedback methods
  async addFeedback(data: Omit<FeedbackData, 'id' | 'createdAt' | 'status'>): Promise<FeedbackData> {
    const id = `fb_${randomUUID().replace(/-/g, '')}`;
    const createdAt = new Date().toISOString();
    
    const feedback = await prisma.feedback.create({
      data: {
        id,
        status: 'new',
        createdAt,
        auditId: data.auditId || null,
        auditUrl: data.auditUrl || null,
        sessionId: data.sessionId || null,
        rating: data.rating || null,
        helpful: data.helpful,
        feedbackType: data.feedbackType || null,
        message: data.message,
        email: data.email || null,
        device: data.device || null,
        source: data.source,
      }
    });

    return feedback as FeedbackData;
  }

  async getAllFeedback(): Promise<FeedbackData[]> {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return feedback as FeedbackData[];
  }
  
  async updateFeedbackStatus(id: string, status: FeedbackData['status']): Promise<FeedbackData | null> {
    try {
      const feedback = await prisma.feedback.update({
        where: { id },
        data: { status }
      });
      return feedback as FeedbackData;
    } catch (e) {
      return null;
    }
  }
  
  async deleteFeedback(id: string): Promise<boolean> {
    try {
      await prisma.feedback.delete({
        where: { id }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Export a singleton instance
export const reportRepository = new PrismaReportRepository();
