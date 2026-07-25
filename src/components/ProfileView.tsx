import React, { useState } from 'react';
import { User, Mail, BookOpen, Key, Download, Upload, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { Student } from '../types';

interface ProfileViewProps {
  currentUser: Student;
  onUpdateProfile: (updated: Partial<Student>) => void;
  onExportBackup: () => void;
  onImportBackup: (json: any) => boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onExportBackup,
  onImportBackup
}) => {
  const [name, setName] = useState(currentUser.Name);
  const [email, setEmail] = useState(currentUser.Email);
  const [courseEnrolled, setCourseEnrolled] = useState(currentUser.CourseEnrolled || '');
  const [avatar, setAvatar] = useState(currentUser.Avatar || '');
  const [password, setPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      Name: name.trim(),
      Email: email.trim(),
      CourseEnrolled: courseEnrolled.trim(),
      Avatar: avatar.trim() || undefined,
      ...(password ? { Password: password } : {})
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Student Profile & System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your student credentials, academic enrollment, and system data backups.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.Name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-500/30"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser.Name}</h2>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                currentUser.Role === 'Administrator' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {currentUser.Role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentUser.Email}</p>
            <p className="text-xs text-indigo-300 font-semibold">{currentUser.CourseEnrolled || 'General Student'}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Academic Program / Grade Level</label>
              <input
                type="text"
                value={courseEnrolled}
                onChange={(e) => setCourseEnrolled(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Update Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Profile details updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              Update Profile Details
            </button>
          </div>

        </form>

      </div>

      {/* Backup & Portability Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          Data Backup & Portability
        </h2>
        <p className="text-xs text-slate-400">
          Your assignment tracking records are saved securely in your browser session. You can download a full backup copy as a JSON file anytime.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onExportBackup}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>Export Backup (.JSON)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
