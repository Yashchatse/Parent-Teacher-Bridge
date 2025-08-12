"use client";

import React, { useEffect, useState } from 'react';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/solid';

function ParentProfile() {
  const { parent } = useParentAuth();
  const [parentInfo, setParentInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const parentId = parent?.parentId || parent?.id || '1';
        const data = await parentService.getParentInfo(parentId);
        if (!abort.signal.aborted) {
          setParentInfo(data);
          setEditedInfo(data);
        }
      } catch (e) {
        if (!abort.signal.aborted) {
          setParentInfo(null);
        }
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  const handleToggleEdit = () => {
    if (editMode && hasChanges) {
      (async () => {
        try {
          const parentId = parent?.parentId || parent?.id || '1';
          await parentService.updateParentInfo(parentId, editedInfo);
          setParentInfo(editedInfo);
        } catch (e) {
          // fallback: keep local state
        } finally {
          setHasChanges(false);
          setEditMode(false);
        }
      })();
    } else {
      setEditMode(!editMode);
      setHasChanges(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const fields = parentInfo
    ? [
        { label: 'Name', key: 'name', icon: <UserIcon className="h-6 w-6 text-indigo-500" /> },
        { label: 'Email', key: 'email', icon: <EnvelopeIcon className="h-6 w-6 text-indigo-500" /> },
        { label: 'Phone', key: 'phone', icon: <PhoneIcon className="h-6 w-6 text-indigo-500" /> },
        { label: 'Address', key: 'address', icon: <MapPinIcon className="h-6 w-6 text-indigo-500" /> },
        { label: 'Gender', key: 'gender', icon: <IdentificationIcon className="h-6 w-6 text-indigo-500" /> },
        { label: 'Occupation', key: 'occupation', icon: <BriefcaseIcon className="h-6 w-6 text-indigo-500" /> },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl px-8 py-6 mb-8 shadow-lg relative">
        <h2 className="text-2xl font-bold">Parent Information</h2>
        <p className="text-base text-blue-100 mt-1">Details of registered guardian</p>

        {/* Update Button */}
        <button
          onClick={handleToggleEdit}
          className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 ${
            editMode
              ? hasChanges
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-500 hover:bg-gray-600'
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white border border-white/30`}
        >
          {editMode ? (hasChanges ? 'Save Changes' : 'Cancel Edit') : 'Update Info'}
        </button>
      </div>

      {/* Info Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading parent information...</p>
      ) : parentInfo ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-indigo-50 hover:bg-indigo-100 p-6 rounded-xl transition-all"
            >
              {field.icon}
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-500 mb-1">{field.label}</label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedInfo[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="text-lg font-medium text-gray-800 bg-white border border-indigo-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800">
                    {parentInfo[field.key] || '--'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No parent data found.</p>
      )}
    </div>
  );
}

export default ParentProfile;
