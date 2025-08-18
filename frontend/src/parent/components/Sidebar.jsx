"use client";

import React from 'react';
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
  FaceSmileIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function Sidebar({ activeSection, onSectionChange, sidebarOpen, onCloseSidebar }) {
  const menuItems = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'attendance', name: 'Attendance', icon: CalendarDaysIcon },
    { id: 'performance', name: 'Performance', icon: ChartBarIcon },
    { id: 'timetable', name: 'Timetable', icon: ClockIcon },
    { id: 'events', name: 'Events', icon: CalendarIcon },
    { id: 'behavior', name: 'Behavior', icon: FaceSmileIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
  ];

  const handleItemClick = (sectionId) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onCloseSidebar();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`${
                      isActive
                        ? 'bg-indigo-50 border-r-2 border-indigo-500 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-150`}
                  >
                    <Icon
                      className={`${
                        isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={onCloseSidebar}
        />
        
        {/* Sidebar panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onCloseSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900">Parent Dashboard</h1>
                </div>
              </div>
            </div>
            
            <nav className="mt-5 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`${
                      isActive
                        ? 'bg-indigo-50 border-r-2 border-indigo-500 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left transition-colors duration-150`}
                  >
                    <Icon
                      className={`${
                        isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
