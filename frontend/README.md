# School Admin Dashboard

A modern React TypeScript application for school administration management.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── login.tsx      # Login page component
│   ├── sidebar.tsx    # Navigation sidebar
│   ├── dashboard-content.tsx  # Main dashboard content
│   └── ...           # Other management components
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   └── dashboard.tsx  # Dashboard page
├── services/          # API service layer
├── context/           # React context providers
└── App.tsx           # Main application component
```

## Features

- **Login System**: Email/password authentication
- **Dashboard**: Overview with statistics and quick actions
- **Student Management**: Add, edit, delete students
- **Teacher Management**: Manage teacher profiles
- **Class Management**: Handle class assignments
- **Subject Management**: Manage subjects and courses
- **Timetable Management**: Schedule management


## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```


## Login

For demo purposes, any email and password combination will work. In a production environment, this should be connected to a proper authentication backend.

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Shadcn/ui Components

## Development

The application uses a modern React setup with:
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for state management
