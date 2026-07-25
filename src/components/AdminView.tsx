import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  UserPlus, 
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';
import { Student, Course, Assignment, ActivityLog } from '../types';

interface AdminViewProps {
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  activityLogs: ActivityLog[];
  onAddStudent: (newStudent: Omit<Student, 'StudentID'>) => void;
  onDeleteStudent: (id: number) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonData: any) => boolean;
  onResetStorage: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  students,
  courses,
  assignments,
  activityLogs,
  onAddStudent,
  onDeleteStudent,
  onExportBackup,
  onImportBackup,
  onResetStorage
}) => {
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Student' | 'Administrator'>('Student');
  const [courseEnrolled, setCourseEnrolled] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddStudent({
      Name: name.trim(),
      Email: email.trim(),
      Password: 'password123',
      Role: role,
      CourseEnrolled: courseEnrolled.trim() || 'General Studies',
      JoinedDate: new Date().toISOString().split('T')[0],
      Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    setName('');
    setEmail('');
    setCourseEnrolled('');
    setShowAddStudentModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = onImportBackup(json);
        if (success) {
          alert('Database restored successfully from JSON backup!');
        } else {
          alert('Invalid JSON structure. Import failed.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-900/30 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">System Administrator Console</h1>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Manage system users, course catalog, system logs, and institutional database maintenance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportBackup}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export Database JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total System Users</p>
            <p className="text-2xl font-bold text-white mt-1">{students.length}</p>
          </div>
          <Users className="h-6 w-6 text-amber-400" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Active Courses</p>
            <p className="text-2xl font-bold text-white mt-1">{courses.length}</p>
          </div>
          <FileText className="h-6 w-6 text-indigo-400" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Assignments Stored</p>
            <p className="text-2xl font-bold text-white mt-1">{assignments.length}</p>
          </div>
          <Database className="h-6 w-6 text-emerald-400" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Audit Log Records</p>
            <p className="text-2xl font-bold text-white mt-1">{activityLogs.length}</p>
          </div>
          <Activity className="h-6 w-6 text-sky-400" />
        </div>

      </div>

      {/* User Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              User Accounts & Credentials Management
            </h2>
            <p className="text-xs text-slate-400">Manage student profiles, administrators, and system access roles.</p>
          </div>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-bold uppercase">
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Program / Department</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((student) => (
                <tr key={student.StudentID} className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <img
                      src={student.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={student.Name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-100">{student.Name}</p>
                      <p className="text-[10px] text-slate-500">ID: #{student.StudentID}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">{student.Email}</td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.Role === 'Administrator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {student.Role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{student.CourseEnrolled || '-'}</td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteStudent(student.StudentID)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Remove User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Maintenance Tools */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          Institutional Database Maintenance & Backup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Restore Backup */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-400" />
              Restore Database from JSON Backup
            </h3>
            <p className="text-xs text-slate-400">
              Upload a previously exported `.json` database file to restore students, courses, and assignments.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="mt-2 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>

          {/* Reset to Default Seed */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-rose-400" />
              Reset System Data to Default Seed
            </h3>
            <p className="text-xs text-slate-400">
              Reset all courses, students, and assignment records back to initial default university records.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to factory defaults?')) {
                  onResetStorage();
                }
              }}
              className="mt-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Reset All System Data
            </button>
          </div>

        </div>
      </div>

      {/* Add User Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Create New User Credentials</h2>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john.doe@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Student">Student</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Program / Major</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. Computer Science"
                  value={courseEnrolled}
                  onChange={(e) => setCourseEnrolled(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
