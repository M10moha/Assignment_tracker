import React, { useState } from 'react';
import { X, ShieldCheck, User, LogIn, UserPlus, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { Student } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectUser: (user: Student) => void;
  onRegister: (newUser: Omit<Student, 'StudentID'>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelectUser,
  onRegister
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Administrator'>('Student');
  const [courseEnrolled, setCourseEnrolled] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onRegister({
      Name: name.trim(),
      Email: email.trim(),
      Password: password || 'password123',
      Role: role,
      CourseEnrolled: courseEnrolled.trim() || 'B.Sc. Computer Science',
      JoinedDate: new Date().toISOString().split('T')[0],
      Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">System Authentication & Accounts</h2>
              <p className="text-xs text-slate-400">Sign in or register for Assignment Tracker System</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              tab === 'login'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Select / Switch Existing User</span>
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              tab === 'register'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register New Account</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {tab === 'login' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-medium">
                Select an account to sign in immediately:
              </p>

              <div className="space-y-2.5">
                {students.map((user) => (
                  <div
                    key={user.StudentID}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={user.Name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {user.Name}
                          </p>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            user.Role === 'Administrator' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            {user.Role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{user.Email}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Sign In →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
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
                  placeholder="e.g. maria.santos@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role</label>
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">Program</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={courseEnrolled}
                    onChange={(e) => setCourseEnrolled(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-md shadow-indigo-600/20"
              >
                Complete Registration & Sign In
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
