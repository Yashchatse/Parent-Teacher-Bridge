"use client";

import React from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useParentAuth } from '../../context/ParentAuthContext';

function Navigation({ onToggleSidebar, sidebarOpen, onLogout }) {
  const { parent, logout } = useParentAuth();

  const handleLogout = () => {
    logout(); // Clear parent auth context
    if (onLogout) {
      onLogout(); // Call main app logout to reset state and return to role selection
    }
  };

  // Derive display values with robust fallbacks
  const displayName =
    (parent && (
      parent.parentName ||
      parent.name ||
      parent.Name ||
      parent.fullName ||
      parent.FullName
    )) || 'Parent';

  const displayEmail =
    (parent && (
      parent.email ||
      parent.Email ||
      parent.userEmail ||
      parent.username ||
      parent.userName
    )) || 'parent@example.com';

  return (
    <nav className="navbar-gradient shadow-sm border-b border-transparent fixed w-full top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden"
              onClick={onToggleSidebar}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo and title */}
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/20 border border-white/30">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-white">Parent Dashboard</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="relative flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-white" />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">{displayName}</div>
                  <div className="text-xs text-white/80">{displayEmail}</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-3 py-2 border border-white/30 text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onToggleSidebar}
          />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
