import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  Plus, 
  Sparkles,
  TrendingUp,
  FileText,
  Calendar,
  Check
} from 'lucide-react';
import { Assignment, Course, Student, Reminder } from '../types';
import { formatDate, getDaysRemaining } from '../utils/dateUtils';

interface DashboardViewProps {
  currentUser: Student;
  assignments: Assignment[];
  courses: Course[];
  reminders: Reminder[];
  onOpenAddModal: () => void;
  onSelectTab: (tab: string) => void;
  onUpdateAssignmentStatus: (id: number, status: Assignment['Status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  assignments,
  courses,
  reminders,
  onOpenAddModal,
  onSelectTab,
  onUpdateAssignmentStatus
}) => {
  const total = assignments.length;
  const submittedCount = assignments.filter(a => a.Status === 'Submitted' || a.Status === 'Graded').length;
  const pendingCount = assignments.filter(a => a.Status === 'Pending' || a.Status === 'In Progress').length;
  
  const overdueAssignments = assignments.filter(a => {
    if (a.Status === 'Submitted' || a.Status === 'Graded') return false;
    return getDaysRemaining(a.DueDate) < 0;
  });

  const dueSoonAssignments = assignments
    .filter(a => a.Status !== 'Submitted' && a.Status !== 'Graded')
    .sort((a, b) => getDaysRemaining(a.DueDate) - getDaysRemaining(b.DueDate));

  const courseMap = new Map<number, Course>(courses.map(c => [c.CourseID, c]));

  // Calculate completion percentage
  const completionRate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Academic Dashboard
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.Name}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              You have <span className="font-bold text-amber-300">{pendingCount} pending</span> assignment{pendingCount === 1 ? '' : 's'} and{' '}
              <span className="font-bold text-rose-400">{overdueAssignments.length} overdue</span>. Keep track of your deadlines to stay ahead!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Assignment</span>
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Overdue Alert Banner (if any overdue) */}
      {overdueAssignments.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-rose-100">Attention Required: Overdue Assignments!</p>
              <p className="text-xs text-rose-300/80 mt-0.5">
                You have {overdueAssignments.length} assignment{overdueAssignments.length === 1 ? '' : 's'} past the due date. Update status or complete them immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('assignments')}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg shrink-0 transition-colors"
          >
            Resolve Now
          </button>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Assignments</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{total}</p>
            <p className="text-[11px] text-slate-400 mt-1">Across {courses.length} courses</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Submitted & Graded</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{submittedCount}</p>
            <p className="text-[11px] text-emerald-300/80 mt-1">{completionRate}% completion rate</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Pending / In Progress</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-amber-300/80 mt-1">Active workload</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Overdue Tasks</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{overdueAssignments.length}</p>
            <p className="text-[11px] text-rose-300/80 mt-1">Needs urgent attention</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Upcoming Deadlines & Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                Upcoming Assignment Deadlines
              </h2>
              <p className="text-xs text-slate-400">Prioritized by closest due date</p>
            </div>
            <button
              onClick={() => onSelectTab('assignments')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View All Assignments
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {dueSoonAssignments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-200 text-sm">All Caught Up!</p>
                <p className="text-xs text-slate-400 mt-1">You have no active pending assignments. Click below to add one.</p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Add Assignment
                </button>
              </div>
            ) : (
              dueSoonAssignments.slice(0, 5).map((asg) => {
                const daysLeft = getDaysRemaining(asg.DueDate);
                const course = courseMap.get(asg.CourseID);

                return (
                  <div
                    key={asg.AssignmentID}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {course && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {course.CourseCode} - {course.CourseName}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          asg.Priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                          asg.Priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {asg.Priority} Priority
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          asg.Status === 'In Progress' ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {asg.Status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-100 truncate">{asg.Title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{asg.Description}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-semibold text-slate-300">Due: {formatDate(asg.DueDate)}</p>
                        <p className={`text-[11px] font-bold ${
                          daysLeft < 0 ? 'text-rose-400' :
                          daysLeft === 0 ? 'text-amber-400' :
                          daysLeft <= 2 ? 'text-amber-300' : 'text-indigo-300'
                        }`}>
                          {daysLeft < 0 
                            ? `Overdue by ${Math.abs(daysLeft)}d` 
                            : daysLeft === 0 
                            ? 'DUE TODAY' 
                            : `${daysLeft} days remaining`}
                        </p>
                      </div>

                      <button
                        onClick={() => onUpdateAssignmentStatus(asg.AssignmentID, 'Submitted')}
                        className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                        title="Mark assignment as submitted"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Course Workload & Completion */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Course Progress & Workload
            </h2>
            <p className="text-xs text-slate-400">Completion stats by enrolled subject</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
            {courses.map((course) => {
              const courseAsgs = assignments.filter(a => a.CourseID === course.CourseID);
              const courseCompleted = courseAsgs.filter(a => a.Status === 'Submitted' || a.Status === 'Graded').length;
              const coursePct = courseAsgs.length > 0 ? Math.round((courseCompleted / courseAsgs.length) * 100) : 0;

              return (
                <div key={course.CourseID} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-200">{course.CourseCode}</span>
                      <span className="text-slate-400 ml-1.5 truncate text-[11px]">{course.Lecturer}</span>
                    </div>
                    <span className="font-bold text-indigo-300 shrink-0">{courseCompleted}/{courseAsgs.length} ({coursePct}%)</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${coursePct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => onSelectTab('courses')}
              className="w-full mt-2 text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1 transition-colors"
            >
              Manage Course Catalog →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
