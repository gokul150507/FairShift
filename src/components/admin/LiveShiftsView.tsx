import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Clock,
  QrCode,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Zap,
  UserCheck
} from 'lucide-react';
import { ShiftRecord } from '../../types/fairshift';

export const LiveShiftsView: React.FC = () => {
  const { shifts, currentSector, workers } = useFairShift();
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const overtimeMultiplier = currentSector.overtimeRules.overtimeMultiplier || 2.0;
  const standardLimit = currentSector.overtimeRules.standardHoursPerDay || 8;

  // Filtered shifts
  const filteredShifts = shifts.filter(s => {
    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
    const matchesSearch = s.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const activeCount = shifts.filter(s => s.status === 'active').length;
  const totalOvertimeHours = shifts.reduce((acc, s) => acc + (s.overtimeHours || 0), 0);
  const totalOvertimePayout = shifts.reduce((acc, s) => acc + (s.overtimePay || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active On-Site Staff</p>
            <p className="text-xl font-black text-slate-900">{activeCount} Workers</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Overtime Accrued</p>
            <p className="text-xl font-black text-amber-600">{totalOvertimeHours.toFixed(1)} hrs ({overtimeMultiplier}x rate)</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Overtime Ledger Total</p>
            <p className="text-xl font-black text-slate-900">₹{totalOvertimePayout.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-hidden"
          >
            <option value="all">All {currentSector.departmentTerm}s</option>
            {currentSector.departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shift Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Live Shifts & Automated Overtime Audit Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredShifts.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Worker & Role</th>
                <th className="py-3 px-4">{currentSector.departmentTerm}</th>
                <th className="py-3 px-4">Check-In / Out</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Standard (8h)</th>
                <th className="py-3 px-4">Overtime ({overtimeMultiplier}x)</th>
                <th className="py-3 px-4">Net Wage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No shifts matching criteria.
                  </td>
                </tr>
              ) : (
                filteredShifts.map(shift => {
                  const worker = workers.find(w => w.id === shift.workerId);
                  const isShiftActive = shift.status === 'active';

                  return (
                    <tr key={shift.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {worker ? (
                            <img
                              src={worker.avatarUrl}
                              alt={shift.workerName}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                              {shift.workerName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{shift.workerName}</p>
                            <p className="text-[10px] text-slate-500">{worker?.role || 'Staff'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {shift.department}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div>
                          In: {new Date(shift.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {shift.checkOutTime ? (
                          <div className="text-slate-400">
                            Out: {new Date(shift.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <span className="text-emerald-600 font-bold">On Shift Now</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {shift.checkInMethod === 'geo' ? (
                            <>
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              GPS Geofence
                            </>
                          ) : (
                            <>
                              <QrCode className="w-3 h-3 text-blue-600" />
                              Gate QR
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800">
                        {shift.regularHours} hrs
                      </td>

                      <td className="py-3 px-4">
                        {shift.overtimeHours > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                            <Zap className="w-3 h-3 text-amber-600" />
                            +{shift.overtimeHours} hrs (₹{shift.overtimePay})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">0.0 hrs</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-black text-slate-900">
                        {isShiftActive ? (
                          <span className="text-emerald-600 italic">Accruing live...</span>
                        ) : (
                          `₹${shift.netPay}`
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isShiftActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] animate-pulse">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
