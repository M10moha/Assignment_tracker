import { Student, Course, Assignment, ActivityLog } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    StudentID: 101,
    Name: 'Alex Mercer',
    Email: 'alex.mercer@university.edu',
    Password: 'password123',
    Role: 'Student',
    CourseEnrolled: 'B.Sc. Computer Science - Year 3',
    JoinedDate: '2024-09-01',
    Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    StudentID: 102,
    Name: 'Sarah Jenkins',
    Email: 'sarah.j@university.edu',
    Password: 'password123',
    Role: 'Student',
    CourseEnrolled: 'B.Sc. Information Technology - Year 2',
    JoinedDate: '2025-01-15',
    Avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    StudentID: 999,
    Name: 'Dr. Robert Vance (Admin)',
    Email: 'admin@university.edu',
    Password: 'adminpassword',
    Role: 'Administrator',
    CourseEnrolled: 'Faculty of Science & Computing',
    JoinedDate: '2023-01-01',
    Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    CourseID: 1,
    CourseName: 'Systems Analysis & Design',
    CourseCode: 'CS301',
    Lecturer: 'Prof. David Miller',
    Department: 'Computer Science',
    Color: 'indigo'
  },
  {
    CourseID: 2,
    CourseName: 'Database Management Systems',
    CourseCode: 'CS302',
    Lecturer: 'Dr. Sarah Connor',
    Department: 'Computer Science',
    Color: 'emerald'
  },
  {
    CourseID: 3,
    CourseName: 'Software Engineering',
    CourseCode: 'CS304',
    Lecturer: 'Prof. James Smith',
    Department: 'Software Engineering',
    Color: 'amber'
  },
  {
    CourseID: 4,
    CourseName: 'Calculus & Linear Algebra',
    CourseCode: 'MATH201',
    Lecturer: 'Dr. Alan Turing',
    Department: 'Mathematics',
    Color: 'sky'
  },
  {
    CourseID: 5,
    CourseName: 'Web Development & APIs',
    CourseCode: 'CS205',
    Lecturer: 'Prof. Elena Rostova',
    Department: 'Computer Science',
    Color: 'violet'
  }
];

// Helper to get relative date ISO strings
const today = new Date();
const formatDateOffset = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    AssignmentID: 1,
    Title: 'Use Case Diagram & ERD Specification',
    Description: 'Draw a complete Use Case Diagram and Entity Relationship Diagram (ERD) for the Assignment Tracker System database.',
    DueDate: formatDateOffset(-2), // Overdue by 2 days if pending, but let's make this Submitted
    Status: 'Submitted',
    StudentID: 101,
    CourseID: 1,
    Priority: 'High',
    CreatedAt: formatDateOffset(-10),
    SubmittedAt: formatDateOffset(-3),
    Score: 92,
    MaxScore: 100,
    Notes: 'Submitted via student portal PDF upload.',
    ReminderEnabled: true
  },
  {
    AssignmentID: 2,
    Title: 'SQL Relational Database Schema Creation',
    Description: 'Write DDL statements for Student, Course, and Assignment tables including primary keys, foreign keys, and indexes.',
    DueDate: formatDateOffset(1), // Due tomorrow!
    Status: 'In Progress',
    StudentID: 101,
    CourseID: 2,
    Priority: 'High',
    CreatedAt: formatDateOffset(-5),
    Notes: 'Need to review foreign key CASCADE rules.',
    ReminderEnabled: true
  },
  {
    AssignmentID: 3,
    Title: 'Agile vs Waterfall Methodology Essay',
    Description: 'Write a 1500-word comparative analysis on Agile Scrum versus traditional Waterfall SDLC models with real case studies.',
    DueDate: formatDateOffset(3), // Due in 3 days
    Status: 'Pending',
    StudentID: 101,
    CourseID: 3,
    Priority: 'Medium',
    CreatedAt: formatDateOffset(-4),
    ReminderEnabled: true
  },
  {
    AssignmentID: 4,
    Title: 'Linear Algebra Matrix Transformations Lab',
    Description: 'Complete exercises 4.1 through 4.8 on Eigenvalues, Eigenvectors, and Matrix Diagonalization.',
    DueDate: formatDateOffset(-1), // Overdue!
    Status: 'Pending',
    StudentID: 101,
    CourseID: 4,
    Priority: 'High',
    CreatedAt: formatDateOffset(-7),
    Notes: 'Urgent: Request extension or complete immediately!',
    ReminderEnabled: true
  },
  {
    AssignmentID: 5,
    Title: 'RESTful API Integration Project',
    Description: 'Build an Express API endpoint to handle CRUD operations for course records with JSON validation.',
    DueDate: formatDateOffset(7), // Due next week
    Status: 'Pending',
    StudentID: 101,
    CourseID: 5,
    Priority: 'Medium',
    CreatedAt: formatDateOffset(-2),
    ReminderEnabled: true
  },
  {
    AssignmentID: 6,
    Title: 'Feasibility Study & Requirements Document',
    Description: 'Document Technical, Economic, Operational, and Schedule Feasibility for the departmental software system.',
    DueDate: formatDateOffset(-8),
    Status: 'Graded',
    StudentID: 101,
    CourseID: 1,
    Priority: 'Low',
    CreatedAt: formatDateOffset(-15),
    SubmittedAt: formatDateOffset(-9),
    Score: 95,
    MaxScore: 100,
    Notes: 'Excellent work on operational feasibility analysis.',
    ReminderEnabled: false
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    LogID: 1,
    Timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    ActorName: 'Alex Mercer',
    Action: 'Submitted Assignment',
    Details: 'Submitted Use Case Diagram & ERD Specification for CS301'
  },
  {
    LogID: 2,
    Timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    ActorName: 'Alex Mercer',
    Action: 'Updated Status',
    Details: 'Changed SQL Relational Database Schema Creation status to In Progress'
  },
  {
    LogID: 3,
    Timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    ActorName: 'Dr. Robert Vance (Admin)',
    Action: 'Added Course',
    Details: 'Added CS205 Web Development & APIs to the system course catalog'
  }
];
