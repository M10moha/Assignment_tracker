import React, { useState } from 'react';
import { BookOpen, User, Plus, Edit2, Trash2, CheckCircle2, FileText, X } from 'lucide-react';
import { Course, Assignment } from '../types';

interface CoursesViewProps {
  courses: Course[];
  assignments: Assignment[];
  onAddCourse: (courseData: Omit<Course, 'CourseID'>) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: number) => void;
  onSelectCourseFilter: (courseId: number) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  assignments,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onSelectCourseFilter
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [department, setDepartment] = useState('');

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setCourseName('');
    setCourseCode('');
    setLecturer('');
    setDepartment('Computer Science');
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setCourseName(c.CourseName);
    setCourseCode(c.CourseCode);
    setLecturer(c.Lecturer);
    setDepartment(c.Department || 'Computer Science');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim() || !lecturer.trim()) return;

    if (editingCourse) {
      onUpdateCourse({
        ...editingCourse,
        CourseName: courseName.trim(),
        CourseCode: courseCode.trim(),
        Lecturer: lecturer.trim(),
        Department: department.trim()
      });
    } else {
      onAddCourse({
        CourseName: courseName.trim(),
        CourseCode: courseCode.trim(),
        Lecturer: lecturer.trim(),
        Department: department.trim(),
        Color: 'indigo'
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Course Catalog & Lecturers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize assignments by enrolled courses, academic modules, and course lecturers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const courseAsgs = assignments.filter(a => a.CourseID === course.CourseID);
          const completedAsgs = courseAsgs.filter(a => a.Status === 'Submitted' || a.Status === 'Graded');
          const completionPct = courseAsgs.length > 0 ? Math.round((completedAsgs.length / courseAsgs.length) * 100) : 0;

          return (
            <div
              key={course.CourseID}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-extrabold tracking-wide">
                    {course.CourseCode}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCourse(course.CourseID)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Course Title & Department */}
                <div>
                  <h3 className="text-base font-bold text-white">{course.CourseName}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    Lecturer: <span className="text-slate-200 font-semibold">{course.Lecturer}</span>
                  </p>
                  {course.Department && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{course.Department}</p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-indigo-400" />
                      Assignments
                    </span>
                    <span className="text-indigo-300">{completedAsgs.length}/{courseAsgs.length} Completed ({completionPct}%)</span>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* View Assignments Link */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onSelectCourseFilter(course.CourseID)}
                  className="w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View Course Assignments ({courseAsgs.length}) →
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course Code <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS301"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course Name <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Systems Analysis & Design"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Lecturer / Instructor <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. David Miller"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Department / Faculty</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
