import { Assignment, Reminder, Course } from '../types';

export function getDaysRemaining(dueDateStr: string): number {
  const due = new Date(dueDateStr);
  const now = new Date();
  // Zero out time for clean day comparison
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isOverdue(assignment: Assignment): boolean {
  if (assignment.Status === 'Submitted' || assignment.Status === 'Graded') {
    return false;
  }
  const days = getDaysRemaining(assignment.DueDate);
  return days < 0;
}

export function generateReminders(assignments: Assignment[], courses: Course[]): Reminder[] {
  const reminders: Reminder[] = [];
  const courseMap = new Map(courses.map(c => [c.CourseID, c.CourseName]));

  assignments.forEach((assignment, index) => {
    if (assignment.Status === 'Submitted' || assignment.Status === 'Graded') {
      return;
    }

    const daysLeft = getDaysRemaining(assignment.DueDate);
    const courseName = courseMap.get(assignment.CourseID) || 'General';

    if (daysLeft < 0) {
      reminders.push({
        ReminderID: index + 100,
        AssignmentID: assignment.AssignmentID,
        Title: assignment.Title,
        DueDate: assignment.DueDate,
        CourseName: courseName,
        DaysLeft: daysLeft,
        IsRead: false,
        Type: 'overdue'
      });
    } else if (daysLeft === 0) {
      reminders.push({
        ReminderID: index + 100,
        AssignmentID: assignment.AssignmentID,
        Title: assignment.Title,
        DueDate: assignment.DueDate,
        CourseName: courseName,
        DaysLeft: 0,
        IsRead: false,
        Type: 'today'
      });
    } else if (daysLeft <= 3) {
      reminders.push({
        ReminderID: index + 100,
        AssignmentID: assignment.AssignmentID,
        Title: assignment.Title,
        DueDate: assignment.DueDate,
        CourseName: courseName,
        DaysLeft: daysLeft,
        IsRead: false,
        Type: 'upcoming'
      });
    }
  });

  return reminders.sort((a, b) => a.DaysLeft - b.DaysLeft);
}
