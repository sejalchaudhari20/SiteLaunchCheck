import { NextResponse } from 'next/server';
import { reportRepository } from '@/lib/reports/repository';
import { analyticsRepo } from '@/lib/analytics/repository';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      source, 
      rating, 
      helpful, 
      feedbackType, 
      message, 
      email, 
      auditId 
    } = body;
    
    // Basic source validation
    if (source !== 'landing_page' && source !== 'audit_report') {
      return NextResponse.json({ error: 'Invalid feedback source' }, { status: 400 });
    }
    
    // Source specific validation
    if (source === 'landing_page') {
      if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Valid rating (1-5) is required' }, { status: 400 });
      }
      if (!message || message.trim() === '') {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }
      if (!feedbackType) {
        return NextResponse.json({ error: 'Feedback type is required' }, { status: 400 });
      }
    } else if (source === 'audit_report') {
      if (helpful === undefined || helpful === null) {
        return NextResponse.json({ error: 'Helpful status is required' }, { status: 400 });
      }
      if (!helpful && (!message || message.trim() === '')) {
        return NextResponse.json({ error: 'Message is required when audit is not helpful' }, { status: 400 });
      }
    }
    
    // Extract headers for device info
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
    
    // Get audit URL if auditId is provided
    let auditUrl = null;
    if (auditId) {
      const report = await reportRepository.getReport(auditId);
      if (report) {
        auditUrl = report.url;
      }
    }

    // Save feedback
    const feedback = await reportRepository.addFeedback({
      source,
      auditId: auditId || null,
      auditUrl,
      sessionId: null, // If session tracking is added later, extract it here
      rating: source === 'landing_page' ? rating : undefined,
      helpful: source === 'audit_report' ? helpful : undefined,
      feedbackType,
      message: message || '',
      email,
      device
    });
    
    // Send analytics
    try {
      await analyticsRepo.save({
        name: 'feedback_submitted',
        properties: {
          source,
          rating,
          helpful,
          feedbackType,
          hasEmail: !!email,
          auditId
        }
      });
      
      if (source === 'landing_page') {
        if (rating >= 4) {
          await analyticsRepo.save({ name: 'feedback_positive', properties: { source } });
        } else if (rating <= 2) {
          await analyticsRepo.save({ name: 'feedback_negative', properties: { source } });
        }
      } else if (source === 'audit_report') {
        if (helpful) {
          await analyticsRepo.save({ name: 'feedback_positive', properties: { source } });
        } else {
          await analyticsRepo.save({ name: 'feedback_negative', properties: { source } });
        }
      }
    } catch (analyticsError) {
      console.error('Failed to log feedback analytics', analyticsError);
    }

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Feedback Error:', error);
    
    try {
      await analyticsRepo.save({ name: 'feedback_error', properties: { error: String(error) } });
    } catch (e) {}
    
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
