"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, X, Trash2, Edit } from "lucide-react";
import { FeedbackData } from "@/lib/reports/repository";

export function AdminFeedbackClient({ initialFeedback }: { initialFeedback: FeedbackData[] }) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [selectedItem, setSelectedItem] = useState<FeedbackData | null>(null);
  
  // Calculate stats
  const total = feedback.length;
  const newFeedback = feedback.filter(f => f.status === 'new').length;
  
  const landingPageFeedback = feedback.filter(f => f.source === 'landing_page' && f.rating);
  const avgRating = landingPageFeedback.length > 0 
    ? (landingPageFeedback.reduce((acc, f) => acc + (f.rating || 0), 0) / landingPageFeedback.length).toFixed(1)
    : '-';
    
  const reportFeedback = feedback.filter(f => f.source === 'audit_report' && f.helpful !== undefined);
  const helpfulCount = reportFeedback.filter(f => f.helpful).length;
  const helpfulPercent = reportFeedback.length > 0 
    ? Math.round((helpfulCount / reportFeedback.length) * 100) + '%'
    : '-';

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'new' | 'reviewed' | 'resolved' | 'archived') => {
    // Optimistic update
    setFeedback(feedback.map(f => f.id === id ? { ...f, status } : f));
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status });
    }
    
    // Server update
    try {
      await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    setFeedback(feedback.filter(f => f.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    
    try {
      await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Feedback</div>
          <div className="text-3xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Avg Rating</div>
          <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {avgRating} <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Helpful</div>
          <div className="text-3xl font-bold text-gray-900">{helpfulPercent}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">New</div>
          <div className="text-3xl font-bold text-primary">{newFeedback}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Feedback List</h2>
        </div>
        
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No feedback found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 bg-white">
                  <th className="py-3 px-6 font-medium">Source / Rating</th>
                  <th className="py-3 px-6 font-medium">Message</th>
                  <th className="py-3 px-6 font-medium">Type</th>
                  <th className="py-3 px-6 font-medium">Date</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {feedback.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      {item.source === 'landing_page' ? (
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          {item.rating} <Star size={14} className="fill-yellow-500" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-medium">
                          {item.helpful ? (
                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1"><ThumbsUp size={14} /> Yes</span>
                          ) : (
                            <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1"><ThumbsDown size={14} /> No</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-[250px] truncate font-medium text-gray-900" title={item.message}>
                        {item.message || '-'}
                      </div>
                      {item.email && <div className="text-xs text-gray-500 mt-1">{item.email}</div>}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{item.feedbackType || '-'}</td>
                    <td className="py-4 px-6 text-gray-500">{new Date(item.createdAt || item.timestamp).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item.id, e.target.value as any)}
                        className={`text-xs font-bold px-2 py-1 rounded-md border-0 focus:ring-2 cursor-pointer ${
                          item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <option value="new">NEW</option>
                        <option value="reviewed">REVIEWED</option>
                        <option value="resolved">RESOLVED</option>
                        <option value="archived">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="text-primary hover:text-primary-dark font-medium text-sm mr-4"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-500" /> Feedback Details
              </h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Source</div>
                  <div className="font-medium text-gray-900 capitalize">{selectedItem.source.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Rating / Helpful</div>
                  <div className="font-medium text-gray-900">
                    {selectedItem.source === 'landing_page' ? (
                      <span className="flex items-center gap-1 justify-end">{selectedItem.rating} <Star size={16} className="fill-yellow-500 text-yellow-500" /></span>
                    ) : (
                      selectedItem.helpful ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Message</div>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-900 whitespace-pre-wrap border border-gray-100">
                  {selectedItem.message || <span className="text-gray-400 italic">No message provided</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Type</div>
                  <div className="text-gray-900">{selectedItem.feedbackType || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Date</div>
                  <div className="text-gray-900">{new Date((selectedItem as any).createdAt || (selectedItem as any).timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email</div>
                  <div className="text-gray-900">{selectedItem.email || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Device</div>
                  <div className="text-gray-900">{selectedItem.device || '-'}</div>
                </div>
              </div>
              
              {selectedItem.auditUrl && (
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Audit URL</div>
                  <a href={selectedItem.auditUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                    {selectedItem.auditUrl}
                  </a>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={() => handleDelete(selectedItem.id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <select 
                  value={selectedItem.status}
                  onChange={(e) => handleStatusUpdate(selectedItem.id, e.target.value as any)}
                  className="font-medium px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
