import React from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Award, 
  Printer, 
  Download,
  BookOpen
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Assignment, Course, Student } from '../types';
import { getDaysRemaining } from '../utils/dateUtils';

interface ReportsViewProps {
  assignments: Assignment[];
  courses: Course[];
  currentUser: Student;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  assignments,
  courses,
  currentUser
}) => {
  const total = assignments.length;
  const submittedCount = assignments.filter(a => a.Status === 'Submitted' || a.Status === 'Graded').length;
  const pendingCount = assignments.filter(a => a.Status === 'Pending' || a.Status === 'In Progress').length;
  
  const overdueCount = assignments.filter(a => {
    if (a.Status === 'Submitted' || a.Status === 'Graded') return false;
    return getDaysRemaining(a.DueDate) < 0;
  }).length;

  const completionRate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

  // Pie chart data
  const statusPieData = [
    { name: 'Submitted / Completed', value: submittedCount, color: '#10b981' },
    { name: 'Pending / In Progress', value: pendingCount, color: '#f59e0b' },
    { name: 'Overdue Deadlines', value: overdueCount, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  // Course Bar Chart Data
  const courseBarData = courses.map(c => {
    const courseAsgs = assignments.filter(a => a.CourseID === c.CourseID);
    const completed = courseAsgs.filter(a => a.Status === 'Submitted' || a.Status === 'Graded').length;
    const pending = courseAsgs.length - completed;

    return {
      name: c.CourseCode,
      fullName: c.CourseName,
      Completed: completed,
      Pending: pending,
      Total: courseAsgs.length
    };
  });

  // Calculate average score for graded assignments
  const gradedAssignments = assignments.filter(a => a.Status === 'Graded' && a.Score !== undefined);
  const avgScore = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((acc, a) => acc + (a.Score || 0), 0) / gradedAssignments.length)
    : 'N/A';

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assignment Performance & Status Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Statistical report on submitted and pending assignments, course completion rates, and marks.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          id="print-academic-report-btn"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export Academic Summary</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completionRate}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{submittedCount} of {total} assignments</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active deliverables</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Overdue Rate</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{overdueCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Expired deadlines</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Grade</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{avgScore}{avgScore !== 'N/A' ? '%' : ''}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{gradedAssignments.length} graded coursework</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Award className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Visual Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Breakdown Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-indigo-400" />
            Assignment Status Distribution
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload by Course Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            Course Workload & Completion Breakdown
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseBarData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Legend />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Printable Report Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 printable-report shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Student Academic Assignment Summary Report</h2>
            <p className="text-xs text-slate-400">Generated for: <span className="font-semibold text-slate-200">{currentUser.Name}</span> ({currentUser.CourseEnrolled})</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Date: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-2.5 px-3">Assignment Title</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assignments.map((asg) => {
                const course = courses.find(c => c.CourseID === asg.CourseID);
                return (
                  <tr key={asg.AssignmentID}>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{asg.Title}</td>
                    <td className="py-2.5 px-3 text-indigo-300">{course?.CourseCode || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-slate-300">{asg.DueDate}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-300">{asg.Priority}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asg.Status === 'Submitted' || asg.Status === 'Graded' ? 'bg-emerald-500/20 text-emerald-300' :
                        asg.Status === 'In Progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {asg.Status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-200">
                      {asg.Score !== undefined ? `${asg.Score} / ${asg.MaxScore || 100}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
