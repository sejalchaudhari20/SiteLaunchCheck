import { NextResponse } from 'next/server';
import { analyticsRepo } from '@/lib/analytics/repository';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, properties } = body;

    if (!name) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const event = await analyticsRepo.save({ name, properties: properties || {} });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to save analytics event:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await analyticsRepo.getAll();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch analytics events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
