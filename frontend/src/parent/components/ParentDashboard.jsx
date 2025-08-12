"use client";

import React, { useState } from 'react';
import { useParentAuth } from '../../context/ParentAuthContext';

// Import navigation components
import Navigation from './Navigation';
import Sidebar from './Sidebar';

// Import all parent dashboard components
import Home from './Home';
import Attendance from './Attendance';
import Performance from './Performance';
import Messages from './Messages';
import Timetable from './Timetable';
import Events from './Events';
import Behavior from './Behavior';
import ParentProfile from './ParentProfile';
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  UserIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

// Navigation items configuration
const navigationItems = [
  { id: 'home', component: Home, icon: HomeIcon, label: 'Home' },
  { id: 'attendance', component: Attendance, icon: CalendarDaysIcon, label: 'Attendance' },
  { id: 'performance', component: Performance, icon: ChartBarIcon, label: 'Performance' },
  { id: 'messages', component: Messages, icon: ChatBubbleLeftRightIcon, label: 'Messages' },
  { id: 'timetable', component: Timetable, icon: ClockIcon, label: 'Timetable' },
  { id: 'events', component: Events, icon: CalendarIcon, label: 'Events' },
  { id: 'behavior', component: Behavior, icon: ExclamationTriangleIcon, label: 'Behavior' },
  { id: 'profile', component: ParentProfile, icon: UserIcon, label: 'Profile' },
];

function ParentDashboard({ onLogout }) {
  const { parent } = useParentAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderContent = () => {
    const ActiveComponent = navigationItems.find(item => item.id === activeSection)?.component || Home;
    return <ActiveComponent />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        onLogout={onLogout}
      />
      
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
      />

      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ParentDashboard;
