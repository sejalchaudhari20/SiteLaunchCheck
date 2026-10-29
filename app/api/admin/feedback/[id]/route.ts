import { NextResponse } from 'next/server';
import { reportRepository } from '@/lib/reports/repository';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const { status } = body;

    if (!['new', 'reviewed', 'resolved', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await reportRepository.updateFeedbackStatus(id, status);
    
    if (!updated) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error) {
    console.error('Update Feedback Error:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const deleted = await reportRepository.deleteFeedback(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Feedback Error:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
