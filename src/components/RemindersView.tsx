import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, History, CheckCircle2, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Reminder, ActivityLog } from '../types';
import { formatDateTime } from '../utils/dateUtils';

interface RemindersViewProps {
  reminders: Reminder[];
  activityLogs: ActivityLog[];
  onTriggerTestReminder?: () => void;
  onSelectAssignment?: (id: number) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  activityLogs,
  onTriggerTestReminder,
  onSelectAssignment
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'reminders' | 'logs'>('reminders');

  const overdueList = reminders.filter(r => r.Type === 'overdue');
  const todayList = reminders.filter(r => r.Type === 'today');
  const upcomingList = reminders.filter(r => r.Type === 'upcoming');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assignment Reminders & Activity History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Expirations countdown alerts, deadline warnings, and complete audit history logs.
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('reminders')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'reminders'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Active Reminders ({reminders.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Audit History Logs</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'reminders' ? (
        
        /* Active Reminders View */
        <div className="space-y-6">
          
          {/* Summary Alert Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-rose-300 font-semibold">Overdue Expirations</p>
                <p className="text-xl font-bold text-rose-100">{overdueList.length}</p>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-semibold">Due Today</p>
                <p className="text-xl font-bold text-amber-100">{todayList.length}</p>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-indigo-300 font-semibold">Due in Next 3 Days</p>
                <p className="text-xl font-bold text-indigo-100">{upcomingList.length}</p>
              </div>
            </div>

          </div>

          {/* Detailed Reminders Timeline */}
          {reminders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-slate-200">No Pending Expirations</p>
              <p className="text-xs text-slate-400 mt-1">All assignment submission deadlines are current or completed!</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-400" />
                Automated Expiration Alert Queue
              </h2>

              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div
                    key={rem.ReminderID}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      rem.Type === 'overdue' 
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
                        : rem.Type === 'today'
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/60 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        rem.Type === 'overdue' ? 'bg-rose-500/20 text-rose-400' :
                        rem.Type === 'today' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {rem.Type === 'overdue' ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{rem.Title}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                            {rem.CourseName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Deadline: <span className="font-semibold text-slate-200">{rem.DueDate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        rem.Type === 'overdue' ? 'bg-rose-500/30 text-rose-200' :
                        rem.Type === 'today' ? 'bg-amber-500/30 text-amber-200' : 'bg-indigo-500/30 text-indigo-200'
                      }`}>
                        {rem.DaysLeft < 0 
                          ? `EXPIRED (${Math.abs(rem.DaysLeft)}d ago)` 
                          : rem.DaysLeft === 0 
                          ? 'DUE TODAY!' 
                          : `In ${rem.DaysLeft} days`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      ) : (

        /* Audit History Logs View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-400" />
              System Activity & Audit Log
            </h2>
            <span className="text-xs text-slate-400">Total Entries: {activityLogs.length}</span>
          </div>

          <div className="divide-y divide-slate-800">
            {activityLogs.map((log) => (
              <div key={log.LogID} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300">{log.ActorName}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                      {log.Action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{log.Details}</p>
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  {formatDateTime(log.Timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

      )}

    </div>
  );
};
