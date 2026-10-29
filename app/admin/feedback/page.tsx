import { reportRepository } from '@/lib/reports/repository';
import { AdminFeedbackClient } from './AdminFeedbackClient';

export const dynamic = 'force-dynamic';

export default async function AdminFeedback() {
  let allFeedback: any[] = [];

  try {
    allFeedback = await reportRepository.getAllFeedback();
  } catch (error) {
    console.error("Failed to load feedback.", error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-dark">User Feedback</h1>
        <p className="text-muted mt-2 text-lg">View feedback submitted from the landing page and audit reports.</p>
      </div>

      <AdminFeedbackClient initialFeedback={allFeedback} />
    </div>
  );
}
