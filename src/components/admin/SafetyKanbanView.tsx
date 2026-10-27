import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  MessageSquare,
  MapPin,
  ChevronRight,
  FileCheck2
} from 'lucide-react';
import { SafetyReport } from '../../types/fairshift';

export const SafetyKanbanView: React.FC = () => {
  const { safetyReports, updateSafetyReportStatus, currentSector } = useFairShift();

  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  const columns: { status: SafetyReport['status']; title: string; color: string; badgeColor: string }[] = [
    { status: 'Reported', title: 'New Reports', color: 'border-slate-300 bg-slate-50/50', badgeColor: 'bg-slate-200 text-slate-800' },
    { status: 'Acknowledged', title: 'Acknowledged', color: 'border-blue-300 bg-blue-50/30', badgeColor: 'bg-blue-100 text-blue-800' },
    { status: 'In Progress', title: 'Action Underway', color: 'border-amber-300 bg-amber-50/30', badgeColor: 'bg-amber-100 text-amber-900' },
    { status: 'Resolved', title: 'Resolved & Safe', color: 'border-emerald-300 bg-emerald-50/30', badgeColor: 'bg-emerald-100 text-emerald-900' }
  ];

  const getSeverityBadge = (sev: SafetyReport['severity']) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-sm bg-red-600 text-white font-extrabold text-[10px] tracking-wide uppercase">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-sm bg-orange-500 text-white font-bold text-[10px] uppercase">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-sm bg-amber-500 text-white font-bold text-[10px] uppercase">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-sm bg-emerald-600 text-white font-bold text-[10px] uppercase">Low</span>;
    }
  };

  const handleStatusChange = async (reportId: string, nextStatus: SafetyReport['status']) => {
    await updateSafetyReportStatus(reportId, nextStatus, adminNoteInput || undefined);
    setAdminNoteInput('');
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            Multilingual Safety Incident Kanban & Gemini Action Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice hazards reported by workers in Hindi, Tamil, and Telugu are automatically translated and prioritized by Gemini AI.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-600 px-3 py-1.5 bg-slate-100 rounded-xl">
          {currentSector.supervisorTitle}: Operations Active
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colReports = safetyReports.filter(r => r.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-3xl border-2 ${col.color} p-4 flex flex-col min-h-[500px] shadow-xs`}
            >
              
              {/* Column Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${col.badgeColor}`}>
                  {colReports.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colReports.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                    No hazards in this stage
                  </div>
                ) : (
                  colReports.map(report => (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900 line-clamp-1">
                          {report.hazardCategory}
                        </span>
                        {getSeverityBadge(report.severity)}
                      </div>

                      {/* Photo Thumbnail if present */}
                      {report.photoUrl && (
                        <div className="rounded-xl overflow-hidden aspect-video border border-slate-200">
                          <img
                            src={report.photoUrl}
                            alt={report.hazardCategory}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Regional Voice Snippet + English Translation */}
                      <div className="space-y-1 text-xs">
                        <p className="text-[11px] text-slate-400 italic font-serif line-clamp-2">
                          "{report.rawText}"
                        </p>
                        <p className="text-xs font-bold text-slate-800 line-clamp-2">
                          {report.translatedEnglish}
                        </p>
                      </div>

                      {/* Gemini AI Action Pill */}
                      <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-xl text-[10px] space-y-0.5">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Gemini Suggested Action:
                        </span>
                        <p className="text-amber-950 font-medium line-clamp-2">
                          {report.suggestedAction}
                        </p>
                      </div>

                      {/* Meta Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[100px]">{report.locationDescription}</span>
                        </span>
                        <span className="font-mono">
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Quick Next Stage Action */}
                      <div className="pt-1 flex items-center gap-1">
                        {col.status === 'Reported' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(report.id, 'Acknowledged');
                            }}
                            className="w-full py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg"
                          >
                            Acknowledge →
                          </button>
                        )}
                        {col.status === 'Acknowledged' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(report.id, 'In Progress');
                            }}
                            className="w-full py-1 text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg"
                          >
                            Start Work →
                          </button>
                        )}
                        {col.status === 'In Progress' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(report.id, 'Resolved');
                            }}
                            className="w-full py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg"
                          >
                            Mark Safe & Resolved ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Incident Detail & Status Update Drawer / Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Incident ID: {selectedReport.id}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedReport.hazardCategory}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            {selectedReport.photoUrl && (
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200">
                <img
                  src={selectedReport.photoUrl}
                  alt={selectedReport.hazardCategory}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
              <p className="text-[11px] font-bold text-slate-500">
                Frontline Voice Report ({selectedReport.reportedByWorkerTag}):
              </p>
              <p className="italic font-serif text-slate-700">
                "{selectedReport.rawText}"
              </p>
              <p className="text-slate-900 font-bold border-t border-slate-200 pt-1">
                <span className="text-emerald-700">English Translation: </span>
                {selectedReport.translatedEnglish}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Gemini AI Corrective Safety Prescription:
              </p>
              <p className="text-amber-950 font-medium">
                {selectedReport.suggestedAction}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supervisor / Safety Engineer Action Notes:
              </label>
              <input
                type="text"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g. Scaffolding team dispatched; harness safety checked"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Transition Status Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Move Status to:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Reported', 'Acknowledged', 'In Progress', 'Resolved'] as SafetyReport['status'][]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedReport.id, st)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedReport.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
