import React, { useState } from 'react';
import { 
  BookOpen, 
  Bell, 
  Search, 
  User, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Student, Reminder, UserRole } from '../types';

interface NavbarProps {
  currentUser: Student;
  reminders: Reminder[];
  onOpenAuthModal: () => void;
  onOpenAddModal: () => void;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  reminders,
  onOpenAuthModal,
  onOpenAddModal,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSwitchRole
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadReminders = reminders.filter(r => !r.IsRead);
  const overdueCount = reminders.filter(r => r.Type === 'overdue').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Assignment Tracker
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Academic Progress & Deadline System</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments, courses, or lecturers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Add Assignment Button */}
            <button
              onClick={onOpenAddModal}
              id="quick-add-assignment-btn"
              className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Assignment</span>
            </button>

            {/* Role Indicator & Quick Switcher */}
            <div className="hidden lg:flex items-center bg-slate-800/90 border border-slate-700 rounded-lg p-1 text-xs">
              <button
                onClick={() => onSwitchRole('Student')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                  currentUser.Role === 'Student' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="h-3 w-3" />
                Student
              </button>
              <button
                onClick={() => onSwitchRole('Administrator')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                  currentUser.Role === 'Administrator' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                Admin
              </button>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                id="notification-bell-btn"
                className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="View Reminders & Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadReminders.length > 0 && (
                  <span className={`absolute top-1 right-1 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                    overdueCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'
                  }`}>
                    {unreadReminders.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                  <div className="p-3 bg-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-slate-100">Assignment Reminders</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectTab('reminders');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {reminders.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500/80 mb-2" />
                        No pending deadline reminders. All assignments caught up!
                      </div>
                    ) : (
                      reminders.slice(0, 6).map((rem) => (
                        <div 
                          key={rem.ReminderID}
                          onClick={() => {
                            setShowNotifications(false);
                            onSelectTab('assignments');
                          }}
                          className="p-3 hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3"
                        >
                          {rem.Type === 'overdue' ? (
                            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                          ) : rem.Type === 'today' ? (
                            <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{rem.Title}</p>
                            <p className="text-[11px] text-slate-400">{rem.CourseName}</p>
                            <div className="mt-1 flex items-center justify-between text-[10px]">
                              <span className={
                                rem.Type === 'overdue' ? 'text-rose-400 font-bold' :
                                rem.Type === 'today' ? 'text-amber-400 font-bold' : 'text-indigo-300'
                              }>
                                {rem.DaysLeft < 0 
                                  ? `Overdue by ${Math.abs(rem.DaysLeft)} day(s)` 
                                  : rem.DaysLeft === 0 
                                  ? 'DUE TODAY!' 
                                  : `Due in ${rem.DaysLeft} day(s)`}
                              </span>
                              <span className="text-slate-500">{rem.DueDate}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-profile-menu-btn"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              >
                <img
                  src={currentUser.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.Name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[120px]">{currentUser.Name}</p>
                  <p className="text-[10px] text-indigo-400 font-medium leading-tight mt-0.5">{currentUser.Role}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1.5 divide-y divide-slate-800">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-100">{currentUser.Name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.Email}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded ${
                      currentUser.Role === 'Administrator' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {currentUser.Role} Account
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectTab('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Student Profile</span>
                    </button>
                    {currentUser.Role === 'Administrator' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSelectTab('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800/80 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Switch Account / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
