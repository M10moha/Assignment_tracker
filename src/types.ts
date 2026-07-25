export type UserRole = 'Student' | 'Administrator';

export interface Student {
  StudentID: number;
  Name: string;
  Email: string;
  Password?: string;
  Role: UserRole;
  CourseEnrolled?: string;
  JoinedDate?: string;
  Avatar?: string;
}

export interface Course {
  CourseID: number;
  CourseName: string;
  CourseCode: string;
  Lecturer: string;
  Department?: string;
  Color: string; // Tailwind color name like 'indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'
}

export type AssignmentStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Graded';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface Assignment {
  AssignmentID: number;
  Title: string;
  Description: string;
  DueDate: string; // ISO format 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm'
  Status: AssignmentStatus;
  StudentID: number;
  CourseID: number;
  Priority: PriorityLevel;
  CreatedAt: string;
  SubmittedAt?: string;
  Score?: number;
  MaxScore?: number;
  Notes?: string;
  ReminderEnabled: boolean;
}

export interface Reminder {
  ReminderID: number;
  AssignmentID: number;
  Title: string;
  DueDate: string;
  CourseName: string;
  DaysLeft: number;
  IsRead: boolean;
  Type: 'overdue' | 'today' | 'upcoming';
}

export interface ActivityLog {
  LogID: number;
  Timestamp: string;
  ActorName: string;
  Action: string; // e.g., 'Created Assignment', 'Updated Status to Submitted', 'Added New Course'
  Details: string;
}

export interface FilterOptions {
  searchQuery: string;
  courseId: number | 'all';
  status: AssignmentStatus | 'all' | 'overdue';
  priority: PriorityLevel | 'all';
  sortBy: 'dueDate' | 'priority' | 'title' | 'status';
  sortOrder: 'asc' | 'desc';
}
