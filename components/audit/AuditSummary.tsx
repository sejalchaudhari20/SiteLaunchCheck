import { CheckCircle2, AlertTriangle, XCircle, ListChecks } from 'lucide-react';

interface AuditSummaryProps {
  passed: number;
  warnings: number;
  critical: number;
  total: number;
}

export default function AuditSummary({ passed, warnings, critical, total }: AuditSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {/* Total Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 font-medium text-sm">Total Checks</p>
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
            <ListChecks size={16} />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900">{total}</div>
      </div>

      {/* Critical Card */}
      <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 font-medium text-sm">Critical Issues</p>
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle size={16} />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900">{critical}</div>
      </div>

      {/* Warnings Card */}
      <div className="bg-white p-5 rounded-2xl border border-yellow-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 font-medium text-sm">Warnings</p>
          <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900">{warnings}</div>
      </div>

      {/* Passed Card */}
      <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 font-medium text-sm">Passed</p>
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900">{passed}</div>
      </div>
    </div>
  );
}
