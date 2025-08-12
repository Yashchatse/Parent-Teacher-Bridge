"use client";

import React, { useState } from 'react';
import { UserIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline';

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'School administrators and management',
      icon: UserIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Teaching staff and educators',
      icon: AcademicCapIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'parent',
      name: 'Parent',
      description: 'Parents and guardians',
      icon: UsersIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onRoleSelect(roleId);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to School Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your role to continue
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-indigo-500' : 'bg-gray-400'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${
                      isSelected ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                      {role.name}
                    </h3>
                    <p className={`text-sm ${
                      isSelected ? 'text-indigo-700' : 'text-gray-500'
                    }`}>
                      {role.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Select your role to proceed to the appropriate login or registration page
          </p>
        </div>
      </div>
    </div>
  );
}
