# Academic Assignment & Course Tracker

A comprehensive web application for managing academic coursework, tracking assignment deadlines, monitoring course completion rates, and visualizing academic performance analytics.

## Features

- **Dashboard Overview**: Immediate visibility into active tasks, pending submissions, upcoming deadlines, and overall completion rate.
- **Assignment Management**: Filterable and searchable table view of all assignments with status tracking (`Pending`, `In Progress`, `Submitted`, `Graded`), priority levels, and custom notes.
- **Course Catalog**: Organize coursework by code, instructor, schedule, location, and credit hours with visual color coding.
- **Reminder & Notification Engine**: Automated deadline alerts categorizing tasks as overdue, due today, or due soon.
- **Performance Analytics & Reports**: Visual charts depicting assignment status distributions, course workload breakdowns, and completion trends over time using Recharts.
- **Multi-Role Access**: Toggle between Student, Lecturer, and Administrator roles with administrative user management capabilities.
- **Data Persistence & Backups**: Client-side storage engine supporting JSON export and import for seamless state backup and restoration.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <repository-folder-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to `http://localhost:3000` (or the port specified in your terminal output).

### Production Build

To bundle the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
├── src/
│   ├── components/      # React components (Dashboard, Assignments, Courses, Analytics, Admin)
│   ├── data/            # Default initialization datasets
│   ├── utils/           # Storage engine and date utility helpers
│   ├── App.tsx          # Main application router and state manager
│   ├── main.tsx         # Application entry point
│   ├── types.ts         # TypeScript interfaces and data models
│   └── index.css        # Global CSS imports and Tailwind directive
├── index.html           # Document HTML template
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite bundler configuration
```

## License

This project is open source and available under the [MIT License](LICENSE).
