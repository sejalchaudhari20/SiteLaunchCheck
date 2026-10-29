import { NextResponse } from 'next/server';
import { reportRepository } from '@/lib/reports/repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Report ID parameter is required' }, { status: 400 });
    }

    const report = await reportRepository.getReport(id);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Report Fetch Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch report.' }, { status: 500 });
  }
}
