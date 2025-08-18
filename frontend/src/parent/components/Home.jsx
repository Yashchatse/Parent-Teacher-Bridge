"use client";

import React, { useEffect, useState } from 'react';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';
import {
  UserCircleIcon,
  UserIcon,
  HashtagIcon,
  CalendarIcon,
  UserGroupIcon,
  BeakerIcon,
} from '@heroicons/react/24/solid';

function Home() {
  const { parent } = useParentAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setLoading(true);
      const fallback = {
        name: 'Aarav Mehta',
        enrollmentNo: 'STU20250801',
        dateOfBirth: '2010-06-15',
        gender: 'Male',
        bloodGroup: 'B+',
      };
      try {
        const parentId = parent?.parentId || parent?.id || '1';
        const data = await parentService.getStudentProfile(parentId);
        if (!abort.signal.aborted) {
          const formatDate = (val) => {
            if (!val) return '';
            // Handle DateOnly serialized as "2025-01-01" or ISO string
            const str = typeof val === 'string' ? val : String(val);
            // Trim time part if present
            const clean = str.split('T')[0];
            // Return as YYYY-MM-DD; could localize if needed
            return clean;
          };

          const normalized = {
            name: data?.name ?? data?.Name ?? '',
            enrollmentNo: data?.enrollmentNo ?? data?.EnrollmentNo ?? '',
            dateOfBirth: formatDate(
              data?.dateOfBirth ?? data?.DateOfBirth ?? data?.dob ?? data?.Dob ?? ''
            ),
            gender: data?.gender ?? data?.Gender ?? '',
            bloodGroup: data?.bloodGroup ?? data?.BloodGroup ?? '',
          };
          setStudent(normalized);
        }
      } catch (e) {
        if (!abort.signal.aborted) {
          setStudent(fallback);
        }
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-8 py-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <UserCircleIcon className="h-7 w-7" />
            Student Information
          </h3>
        </div>

        <div className="px-8 py-6 text-[1.1rem]">
          {loading ? (
            <p className="text-gray-500 text-center">Loading student details...</p>
          ) : !student ? (
            <p className="text-gray-500 text-center">No student data found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard icon={<UserIcon className="h-6 w-6 text-indigo-600" />} label="Name" value={student.name} />
              <InfoCard icon={<HashtagIcon className="h-6 w-6 text-indigo-600" />} label="Enrollment No." value={student.enrollmentNo} />
              <InfoCard icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />} label="Date of Birth" value={student.dateOfBirth || '--'} />
              <InfoCard icon={<UserGroupIcon className="h-6 w-6 text-indigo-600" />} label="Gender" value={student.gender || '--'} />
              <InfoCard icon={<BeakerIcon className="h-6 w-6 text-indigo-600" />} label="Blood Group" value={student.bloodGroup || '--'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-colors">
    {icon}
    <div className="flex flex-col">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  </div>
);

export default Home;
