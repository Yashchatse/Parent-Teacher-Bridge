"use client";

import React, { useEffect, useState } from 'react';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';

const severityColors = {
  Low: 'bg-emerald-500',
  Moderate: 'bg-yellow-500',
  Medium: 'bg-yellow-500',
  High: 'bg-red-500',
};

const categoryIcons = {
  Disruptive: '🚫',
  Respect: '🤝',
  Punctuality: '⏰',
};

function Behavior() {
  const { parent } = useParentAuth();
  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const parentId = parent?.parentId || parent?.id || '1';
        const data = await parentService.getBehaviors(parentId);
        if (!abort.signal.aborted) setBehaviors(data || []);
      } catch (e) {
        if (!abort.signal.aborted) setBehaviors([]);
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="rounded-xl shadow-lg mb-10 bg-gradient-to-r from-blue-600 to-purple-500 text-white text-center py-6 relative overflow-hidden">
        <h2 className="text-3xl font-bold tracking-wide">🚦 Behavior Timeline</h2>
        <p className="text-sm text-blue-100 mt-2">Student conduct and incident log</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-10">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>

        {loading ? (
          <p className="text-center text-gray-500">Loading behavior records...</p>
        ) : behaviors.length === 0 ? (
          <p className="text-center text-gray-500">No behavior records found.</p>
        ) : (
          behaviors.map((item, index) => (
            <div key={index} className="mb-10 relative">
              {/* Timeline Dot */}
              <div
                className={`absolute left-2 top-6 w-4 h-4 rounded-full shadow-md ring-2 ring-white ${severityColors[item.severity] || 'bg-gray-400'}`}
              ></div>

              {/* Card */}
              <div className="ml-10 bg-white backdrop-blur-md rounded-xl shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-2xl ${severityColors[item.severity] || 'text-gray-500'}`}>
                      {categoryIcons[item.behaviourCategory] || '⚠️'}
                    </span>
                    <h4 className="text-xl font-bold text-gray-800 tracking-wide">
                      {item.behaviourCategory}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <strong>Date:</strong> {item.incidentDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚩</span>
                      <strong>Severity:</strong>
                      <span
                        className={`ml-2 inline-block px-3 py-1 rounded-full text-white font-semibold text-xs ${severityColors[item.severity] || 'bg-gray-400'}`}
                      >
                        {item.severity}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-800">
                    <span className="mr-2">💬</span>
                    <strong>Description:</strong>
                    <p className="mt-2 text-base leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Behavior;
