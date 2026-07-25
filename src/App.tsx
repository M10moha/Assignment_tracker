import React, { useState, useEffect, useMemo } from 'react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getStudents, 
  saveStudents, 
  getCourses, 
  saveCourses, 
  getAssignments, 
  saveAssignments, 
  getActivityLogs, 
  logActivity, 
  exportDatabaseBackup, 
  importDatabaseBackup, 
  resetStorageToDefaults 
} from './utils/storage';
import { generateReminders } from './utils/dateUtils';
import { Student, Course, Assignment, ActivityLog, UserRole, AssignmentStatus } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AssignmentsView } from './components/AssignmentsView';
import { AssignmentModal } from './components/AssignmentModal';
import { CoursesView } from './components/CoursesView';
import { RemindersView } from './components/RemindersView';
import { ReportsView } from './components/ReportsView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentUser, setCurrentUserAccount] = useState<Student>(() => getCurrentUser());
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [courses, setCourses] = useState<Course[]>(() => getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(() => getAssignments());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getActivityLogs());

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Reminders computation
  const reminders = useMemo(() => {
    return generateReminders(assignments, courses);
  }, [assignments, courses]);

  // Sync state changes to storage
  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Handlers for Assignment Operations
  const handleSaveAssignment = (asgData: Partial<Assignment>) => {
    if (asgData.AssignmentID) {
      // Edit existing assignment
      const updated = assignments.map(a => 
        a.AssignmentID === asgData.AssignmentID ? { ...a, ...asgData } as Assignment : a
      );
      setAssignments(updated);
      const newLogs = logActivity(
        currentUser.Name, 
        'Updated Assignment', 
        `Updated details for "${asgData.Title}"`
      );
      setActivityLogs(newLogs);
    } else {
      // Create new assignment
      const newAsg: Assignment = {
        AssignmentID: Date.now(),
        Title: asgData.Title || 'New Assignment',
        Description: asgData.Description || '',
        DueDate: asgData.DueDate || new Date().toISOString().split('T')[0],
        Status: asgData.Status || 'Pending',
        StudentID: currentUser.StudentID,
        CourseID: asgData.CourseID || (courses[0]?.CourseID || 1),
        Priority: asgData.Priority || 'Medium',
        CreatedAt: new Date().toISOString().split('T')[0],
        Notes: asgData.Notes || '',
        ReminderEnabled: asgData.ReminderEnabled !== undefined ? asgData.ReminderEnabled : true
      };
      const updated = [newAsg, ...assignments];
      setAssignments(updated);
      const newLogs = logActivity(
        currentUser.Name, 
        'Created Assignment', 
        `Created assignment "${newAsg.Title}"`
      );
      setActivityLogs(newLogs);
    }
  };

  const handleDeleteAssignment = (id: number) => {
    const target = assignments.find(a => a.AssignmentID === id);
    if (!confirm(`Are you sure you want to delete "${target?.Title || 'this assignment'}"?`)) return;

    const updated = assignments.filter(a => a.AssignmentID !== id);
    setAssignments(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Deleted Assignment', 
      `Deleted assignment "${target?.Title || id}"`
    );
    setActivityLogs(newLogs);
  };

  const handleUpdateStatus = (id: number, status: AssignmentStatus) => {
    const updated = assignments.map(a => {
      if (a.AssignmentID === id) {
        return {
          ...a,
          Status: status,
          SubmittedAt: status === 'Submitted' || status === 'Graded' ? new Date().toISOString().split('T')[0] : a.SubmittedAt
        };
      }
      return a;
    });
    setAssignments(updated);

    const target = assignments.find(a => a.AssignmentID === id);
    const newLogs = logActivity(
      currentUser.Name, 
      'Updated Status', 
      `Changed status of "${target?.Title}" to ${status}`
    );
    setActivityLogs(newLogs);
  };

  // Handlers for Course Operations
  const handleAddCourse = (courseData: Omit<Course, 'CourseID'>) => {
    const newCourse: Course = {
      ...courseData,
      CourseID: Date.now()
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Added Course', 
      `Added course "${newCourse.CourseCode} - ${newCourse.CourseName}"`
    );
    setActivityLogs(newLogs);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    const updated = courses.map(c => c.CourseID === updatedCourse.CourseID ? updatedCourse : c);
    setCourses(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Updated Course', 
      `Updated details for course "${updatedCourse.CourseCode}"`
    );
    setActivityLogs(newLogs);
  };

  const handleDeleteCourse = (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? Associated assignments will remain.')) return;
    const updated = courses.filter(c => c.CourseID !== courseId);
    setCourses(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Deleted Course', 
      `Removed course ID #${courseId} from system`
    );
    setActivityLogs(newLogs);
  };

  // Handlers for User / Admin Operations
  const handleAddStudent = (newStudentData: Omit<Student, 'StudentID'>) => {
    const newStudent: Student = {
      ...newStudentData,
      StudentID: Date.now()
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Added User Account', 
      `Created user account for ${newStudent.Name} (${newStudent.Role})`
    );
    setActivityLogs(newLogs);
  };

  const handleDeleteStudent = (id: number) => {
    if (id === currentUser.StudentID) {
      alert('Cannot delete currently logged in account.');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;
    const updated = students.filter(s => s.StudentID !== id);
    setStudents(updated);
    const newLogs = logActivity(
      currentUser.Name, 
      'Deleted User', 
      `Removed user account #${id}`
    );
    setActivityLogs(newLogs);
  };

  const handleSwitchUser = (user: Student) => {
    setCurrentUserAccount(user);
    setCurrentUser(user);
    const newLogs = logActivity(
      user.Name, 
      'User Login', 
      `Signed in as ${user.Role} (${user.Name})`
    );
    setActivityLogs(newLogs);
  };

  const handleSwitchRoleQuick = (role: UserRole) => {
    const match = students.find(s => s.Role === role);
    if (match) {
      handleSwitchUser(match);
    } else {
      const updatedUser = { ...currentUser, Role: role };
      handleSwitchUser(updatedUser);
    }
  };

  const handleResetStorage = () => {
    resetStorageToDefaults();
    setStudents(getStudents());
    setCourses(getCourses());
    setAssignments(getAssignments());
    setActivityLogs(getActivityLogs());
    setCurrentUserAccount(getCurrentUser());
    alert('System state reset to factory default database.');
  };

  const handleImportBackup = (json: any): boolean => {
    const success = importDatabaseBackup(json);
    if (success) {
      setStudents(getStudents());
      setCourses(getCourses());
      setAssignments(getAssignments());
      setActivityLogs(getActivityLogs());
    }
    return success;
  };

  const pendingCount = assignments.filter(a => a.Status === 'Pending' || a.Status === 'In Progress').length;
  const overdueCount = reminders.filter(r => r.Type === 'overdue').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        reminders={reminders}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAddModal={() => {
          setEditingAssignment(null);
          setIsAddModalOpen(true);
        }}
        onSelectTab={(tab) => setActiveTab(tab)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'assignments') {
            setActiveTab('assignments');
          }
        }}
        onSwitchRole={handleSwitchRoleQuick}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          role={currentUser.Role}
          pendingCount={pendingCount}
          overdueCount={overdueCount}
          onOpenAddModal={() => {
            setEditingAssignment(null);
            setIsAddModalOpen(true);
          }}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              assignments={assignments}
              courses={courses}
              reminders={reminders}
              onOpenAddModal={() => {
                setEditingAssignment(null);
                setIsAddModalOpen(true);
              }}
              onSelectTab={(tab) => setActiveTab(tab)}
              onUpdateAssignmentStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              courses={courses}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddModal={() => {
                setEditingAssignment(null);
                setIsAddModalOpen(true);
              }}
              onEditAssignment={(asg) => {
                setEditingAssignment(asg);
                setIsAddModalOpen(true);
              }}
              onDeleteAssignment={handleDeleteAssignment}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              assignments={assignments}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
              onSelectCourseFilter={(courseId) => {
                setActiveTab('assignments');
              }}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              activityLogs={activityLogs}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              assignments={assignments}
              courses={courses}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              students={students}
              courses={courses}
              assignments={assignments}
              activityLogs={activityLogs}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onExportBackup={exportDatabaseBackup}
              onImportBackup={handleImportBackup}
              onResetStorage={handleResetStorage}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onUpdateProfile={(updated) => {
                const newUser = { ...currentUser, ...updated };
                setCurrentUserAccount(newUser);
                setCurrentUser(newUser);
                const newStudents = students.map(s => s.StudentID === newUser.StudentID ? newUser : s);
                setStudents(newStudents);
              }}
              onExportBackup={exportDatabaseBackup}
              onImportBackup={handleImportBackup}
            />
          )}
        </main>

      </div>

      {/* Assignment Create / Edit Modal */}
      <AssignmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAssignment}
        courses={courses}
        initialData={editingAssignment}
      />

      {/* Auth / Switch Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        students={students}
        onSelectUser={handleSwitchUser}
        onRegister={handleAddStudent}
      />

    </div>
  );
}
