import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Assignment, Course, PriorityLevel, AssignmentStatus } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Partial<Assignment>) => void;
  courses: Course[];
  initialData?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  initialData
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState<number>(courses[0]?.CourseID || 1);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<AssignmentStatus>('Pending');
  const [score, setScore] = useState<number | ''>('');
  const [maxScore, setMaxScore] = useState<number>(100);
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.Title);
      setDescription(initialData.Description);
      setCourseId(initialData.CourseID);
      setDueDate(initialData.DueDate);
      setPriority(initialData.Priority);
      setStatus(initialData.Status);
      setScore(initialData.Score !== undefined ? initialData.Score : '');
      setMaxScore(initialData.MaxScore || 100);
      setNotes(initialData.Notes || '');
      setReminderEnabled(initialData.ReminderEnabled);
    } else {
      // Default new assignment due tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setTitle('');
      setDescription('');
      setCourseId(courses[0]?.CourseID || 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('Pending');
      setScore('');
      setMaxScore(100);
      setNotes('');
      setReminderEnabled(true);
    }
  }, [initialData, isOpen, courses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSave({
      ...(initialData?.AssignmentID ? { AssignmentID: initialData.AssignmentID } : {}),
      Title: title.trim(),
      Description: description.trim(),
      CourseID: Number(courseId),
      DueDate: dueDate,
      Priority: priority,
      Status: status,
      Score: score !== '' ? Number(score) : undefined,
      MaxScore: Number(maxScore),
      Notes: notes.trim(),
      ReminderEnabled: reminderEnabled,
      CreatedAt: initialData?.CreatedAt || new Date().toISOString().split('T')[0],
      SubmittedAt: status === 'Submitted' || status === 'Graded' ? (initialData?.SubmittedAt || new Date().toISOString().split('T')[0]) : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialData ? 'Update Assignment Details' : 'Record New Assignment'}
              </h2>
              <p className="text-xs text-slate-400">
                {initialData ? 'Edit deadline, status, or course mapping' : 'Add new coursework to your tracking system'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Assignment Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Use Case Diagram & ERD Specification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Course & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Course Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Course <span className="text-rose-400">*</span>
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((course) => (
                  <option key={course.CourseID} value={course.CourseID}>
                    {course.CourseCode} - {course.CourseName} ({course.Lecturer})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Submission Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High font-bold">High Priority 🔥</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted ✅</option>
                <option value="Graded">Graded 🏆</option>
              </select>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description & Requirements</label>
            <textarea
              rows={3}
              placeholder="Enter instructions, questions, or submission guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Optional Scores & Marks (if Graded / Submitted) */}
          {(status === 'Graded' || status === 'Submitted') && (
            <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Obtained Score</label>
                <input
                  type="number"
                  min={0}
                  max={maxScore}
                  placeholder="e.g. 95"
                  value={score}
                  onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Max Total Score</label>
                <input
                  type="number"
                  min={1}
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Notes & Reminders */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reminderEnabled"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="reminderEnabled" className="text-xs text-slate-300 font-medium cursor-pointer">
                Enable automated deadline reminders (3-day countdown & alerts)
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              {initialData ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
