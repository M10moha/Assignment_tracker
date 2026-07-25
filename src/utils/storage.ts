import { Student, Course, Assignment, ActivityLog } from '../types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_LOGS } from '../data/initialData';

const KEYS = {
  CURRENT_USER: 'ats_current_user',
  STUDENTS: 'ats_students',
  COURSES: 'ats_courses',
  ASSIGNMENTS: 'ats_assignments',
  LOGS: 'ats_logs'
};

// Initialize default data if empty
export function initStorage() {
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
  }
  if (!localStorage.getItem(KEYS.LOGS)) {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENTS[0])); // Alex Mercer default
  }
}

// Getters
export function getCurrentUser(): Student {
  initStorage();
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : INITIAL_STUDENTS[0];
}

export function setCurrentUser(student: Student) {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(student));
}

export function getStudents(): Student[] {
  initStorage();
  const data = localStorage.getItem(KEYS.STUDENTS);
  return data ? JSON.parse(data) : INITIAL_STUDENTS;
}

export function getCourses(): Course[] {
  initStorage();
  const data = localStorage.getItem(KEYS.COURSES);
  return data ? JSON.parse(data) : INITIAL_COURSES;
}

export function getAssignments(): Assignment[] {
  initStorage();
  const data = localStorage.getItem(KEYS.ASSIGNMENTS);
  return data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
}

export function getActivityLogs(): ActivityLog[] {
  initStorage();
  const data = localStorage.getItem(KEYS.LOGS);
  return data ? JSON.parse(data) : INITIAL_LOGS;
}

// Setters & Mutators
export function saveAssignments(assignments: Assignment[]) {
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

export function saveCourses(courses: Course[]) {
  localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
}

export function logActivity(actorName: string, action: string, details: string) {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    LogID: Date.now(),
    Timestamp: new Date().toISOString(),
    ActorName: actorName,
    Action: action,
    Details: details
  };
  const updated = [newLog, ...logs].slice(0, 50); // keep last 50
  localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

// Reset data back to default initial seed
export function resetStorageToDefaults() {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
  localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENTS[0]));
}

// Export database backup as JSON
export function exportDatabaseBackup() {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    students: getStudents(),
    courses: getCourses(),
    assignments: getAssignments(),
    activityLogs: getActivityLogs()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AssignmentTracker_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import database JSON
export function importDatabaseBackup(jsonData: any): boolean {
  try {
    if (jsonData.students && jsonData.courses && jsonData.assignments) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(jsonData.students));
      localStorage.setItem(KEYS.COURSES, JSON.stringify(jsonData.courses));
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(jsonData.assignments));
      if (jsonData.activityLogs) {
        localStorage.setItem(KEYS.LOGS, JSON.stringify(jsonData.activityLogs));
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to import data', err);
    return false;
  }
}
