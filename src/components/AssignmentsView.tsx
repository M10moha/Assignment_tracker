import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Grid, 
  List, 
  BookOpen, 
  Flame, 
  ChevronDown,
  Check,
  Calendar,
  Award
} from 'lucide-react';
import { Assignment, Course, FilterOptions, PriorityLevel, AssignmentStatus } from '../types';
import { formatDate, getDaysRemaining } from '../utils/dateUtils';

interface AssignmentsViewProps {
  assignments: Assignment[];
  courses: Course[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onEditAssignment: (asg: Assignment) => void;
  onDeleteAssignment: (id: number) => void;
  onUpdateStatus: (id: number, status: AssignmentStatus) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  courses,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onEditAssignment,
  onDeleteAssignment,
  onUpdateStatus
}) => {
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus | 'all' | 'overdue'>('all');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const courseMap = useMemo(() => new Map(courses.map(c => [c.CourseID, c])), [courses]);

  // Filter & Sort Logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      // Search
      const matchSearch = 
        asg.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (courseMap.get(asg.CourseID)?.CourseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (courseMap.get(asg.CourseID)?.CourseCode || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Course filter
      if (selectedCourse !== 'all' && asg.CourseID !== Number(selectedCourse)) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && asg.Priority !== selectedPriority) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'overdue') {
        const days = getDaysRemaining(asg.DueDate);
        return days < 0 && asg.Status !== 'Submitted' && asg.Status !== 'Graded';
      } else if (selectedStatus !== 'all' && asg.Status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
      } else if (sortBy === 'priority') {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return pMap[b.Priority] - pMap[a.Priority];
      } else {
        return a.Title.localeCompare(b.Title);
      }
    });
  }, [assignments, searchQuery, selectedCourse, selectedStatus, selectedPriority, sortBy, courseMap]);

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assignment Tracker & Repository</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage course deliverables, complete tasks, and track academic submission history.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            id="assignments-add-new-btn"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        
        {/* Top Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by assignment title, requirement keywords, or course name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Course Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map(c => (
                <option key={c.CourseID} value={c.CourseID}>
                  {c.CourseCode} - {c.CourseName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted ✅</option>
              <option value="Graded">Graded 🏆</option>
              <option value="overdue">Overdue Deadlines ⚠️</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority 🔥</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="dueDate">Due Date (Earliest First)</option>
              <option value="priority">Priority (Highest First)</option>
              <option value="title">Title (Alphabetical)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Assignment List / Grid Content */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Assignments Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No assignments match your filter criteria or search query. Try clearing filters or create a new assignment.
          </p>
          <button
            onClick={() => {
              setSelectedCourse('all');
              setSelectedStatus('all');
              setSelectedPriority('all');
              onSearchChange('');
            }}
            className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((asg) => {
            const course = courseMap.get(asg.CourseID);
            const daysLeft = getDaysRemaining(asg.DueDate);
            const isFinished = asg.Status === 'Submitted' || asg.Status === 'Graded';
            const isExpired = !isFinished && daysLeft < 0;

            return (
              <div
                key={asg.AssignmentID}
                className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-lg ${
                  isExpired 
                    ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-slate-900' 
                    : isFinished 
                    ? 'border-slate-800/80 bg-slate-900/60 opacity-90' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {course && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 truncate max-w-[180px]">
                        {course.CourseCode} - {course.CourseName}
                      </span>
                    )}

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${
                      asg.Priority === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      asg.Priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {asg.Priority === 'High' && <Flame className="h-3 w-3" />}
                      {asg.Priority}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">{asg.Title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {asg.Description || 'No detailed instructions provided.'}
                    </p>
                  </div>

                  {/* Score badge if graded */}
                  {asg.Status === 'Graded' && asg.Score !== undefined && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-between text-xs text-emerald-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Award className="h-4 w-4 text-emerald-400" />
                        Graded Score
                      </span>
                      <span className="font-bold text-sm text-emerald-200">{asg.Score} / {asg.MaxScore || 100}</span>
                    </div>
                  )}

                  {/* Date & Countdown */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      Due: {formatDate(asg.DueDate)}
                    </span>

                    <span className={`font-bold text-[11px] ${
                      isFinished ? 'text-emerald-400' :
                      isExpired ? 'text-rose-400' :
                      daysLeft === 0 ? 'text-amber-400' : 'text-indigo-300'
                    }`}>
                      {isFinished ? 'Completed' :
                       isExpired ? `Overdue (${Math.abs(daysLeft)}d)` :
                       daysLeft === 0 ? 'DUE TODAY' : `${daysLeft} days left`}
                    </span>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditAssignment(asg)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAssignment(asg.AssignmentID)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <select
                    value={asg.Status}
                    onChange={(e) => onUpdateStatus(asg.AssignmentID, e.target.value as AssignmentStatus)}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors focus:outline-none ${
                      asg.Status === 'Submitted' || asg.Status === 'Graded'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : asg.Status === 'In Progress'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted ✅</option>
                    <option value="Graded">Graded 🏆</option>
                  </select>
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* Table List View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Assignment & Course</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAssignments.map((asg) => {
                  const course = courseMap.get(asg.CourseID);
                  const daysLeft = getDaysRemaining(asg.DueDate);
                  const isFinished = asg.Status === 'Submitted' || asg.Status === 'Graded';
                  const isExpired = !isFinished && daysLeft < 0;

                  return (
                    <tr key={asg.AssignmentID} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <p className="font-bold text-slate-100 text-sm">{asg.Title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {course && (
                            <span className="text-[11px] text-indigo-400 font-semibold">
                              {course.CourseCode} ({course.Lecturer})
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {asg.Description}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-200">{formatDate(asg.DueDate)}</p>
                        <p className={`text-[10px] font-bold ${
                          isFinished ? 'text-emerald-400' :
                          isExpired ? 'text-rose-400' : 'text-amber-300'
                        }`}>
                          {isFinished ? 'Submitted' :
                           isExpired ? `Overdue (${Math.abs(daysLeft)}d)` : `${daysLeft}d left`}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          asg.Priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                          asg.Priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {asg.Priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={asg.Status}
                          onChange={(e) => onUpdateStatus(asg.AssignmentID, e.target.value as AssignmentStatus)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Submitted">Submitted ✅</option>
                          <option value="Graded">Graded 🏆</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditAssignment(asg)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteAssignment(asg.AssignmentID)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
};
