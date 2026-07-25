import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Bell, 
  BarChart3, 
  ShieldAlert, 
  User, 
  Database,
  Plus
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  role: UserRole;
  pendingCount: number;
  overdueCount: number;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role,
  pendingCount,
  overdueCount,
  onOpenAddModal
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    { id: 'courses', label: 'Course Catalog', icon: BookOpen },
    { 
      id: 'reminders', 
      label: 'Reminders & Logs', 
      icon: Bell,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    ...(role === 'Administrator' ? [
      { id: 'admin', label: 'Admin Console', icon: ShieldAlert, highlight: true }
    ] : []),
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Quick Create Action Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-slate-800 to-violet-900/40 border border-indigo-500/20 rounded-xl p-3.5 shadow-sm">
          <p className="text-xs font-semibold text-slate-200">Track New Task</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Record deadline, description & course.</p>
          <button
            onClick={onOpenAddModal}
            id="sidebar-add-assignment-btn"
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Database Status Footer Card */}
      <div className="pt-4 border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            System DB Status
          </span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
            Connected
          </span>
        </div>
      </div>
    </aside>
  );
};
