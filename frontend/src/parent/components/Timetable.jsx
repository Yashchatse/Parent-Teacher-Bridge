"use client";

import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';

const getSubjectStyle = (subject) => {
  const subjectColors = {
    Mathematics: 'bg-red-600 text-white',
    Physics: 'bg-orange-500 text-white',
    Chemistry: 'bg-gray-500 text-white',
    Biology: 'bg-green-600 text-white',
    English: 'bg-blue-600 text-white',
    History: 'bg-yellow-400 text-black',
    Geography: 'bg-cyan-400 text-black',
    Science: 'bg-teal-500 text-white',
  };
  return subjectColors[subject] || 'bg-gray-500 text-white';
};

// Fallback maps if the API returns only IDs
const subjectIdToName = {
  201: 'Mathematics',
  202: 'Physics',
  203: 'Chemistry',
  204: 'Biology',
  205: 'English',
  206: 'History',
  207: 'Geography',
  208: 'Science',
};

const teacherIdToName = {
  101: 'Mr. Sharma',
  102: 'Ms. Rao',
  103: 'Dr. Mehta',
};

const Timetable = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [timetableData, setTimetableData] = useState([]);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      try {
        const data = await parentService.getTimetable();
        const normalized = (Array.isArray(data) ? data : []).map((e) => ({
          class:
            e?.class ?? e?.Class ?? e?.grade ?? e?.Grade ?? e?.className ?? e?.ClassName ?? String(e?.class_id ?? e?.classId ?? ''),
          weekday:
            e?.weekday ?? e?.Weekday ?? e?.day ?? e?.Day ?? e?.dayOfWeek ?? e?.DayOfWeek ?? '',
          startTime:
            e?.startTime ?? e?.StartTime ?? e?.start_time ?? e?.start ?? '',
          endTime:
            e?.endTime ?? e?.EndTime ?? e?.end_time ?? e?.end ?? '',
          subject: e?.subject ?? e?.Subject ?? '',
          teacher: e?.teacher ?? e?.Teacher ?? e?.teacherName ?? e?.TeacherName ?? '',
          subjectId: e?.subject_id ?? e?.subjectId ?? null,
          teacherId: e?.teacher_id ?? e?.teacherId ?? null,
        }));
        if (!abort.signal.aborted) setTimetableData(normalized);
      } catch (e) {
        if (!abort.signal.aborted) setTimetableData([]);
      }
    };
    run();
    return () => abort.abort();
  }, []);

  const timeSlots = [
    ...new Set(
      timetableData
        .filter((e) => e.startTime && e.endTime)
        .map((e) => `${e.startTime} - ${e.endTime}`)
    ),
  ];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value);
  };

  const filteredTimetable = selectedGrade
    ? timetableData.filter((entry) => {
        const cls = String(entry.class || '').toLowerCase();
        return (
          cls === `grade ${String(selectedGrade)}`.toLowerCase() ||
          cls === String(selectedGrade).toLowerCase()
        );
      })
    : timetableData;

  const buildGridData = () => {
    return timeSlots.map((slot) =>
      weekdays.map((day) => {
        const entry = filteredTimetable.find(
          (e) => `${e.startTime} - ${e.endTime}` === slot && e.weekday === day
        );
        return entry
          ? `${entry.subject} (${entry.teacher})`
          : '—';
      })
    );
  };

  const gridData = buildGridData();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 text-center">
          <h2 className="text-2xl font-bold">📅 Weekly Timetable</h2>
        </div>
        <div className="bg-white text-gray-800 px-6 py-6 rounded-b-xl">
          <div className="mb-6 text-center">
            <select
              value={selectedGrade}
              onChange={handleGradeChange}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Grades</option>
              {[
                ...new Set(
                  timetableData
                    .map((e) => {
                      const cls = String(e.class || '');
                      return cls.toLowerCase().startsWith('grade')
                        ? cls.replace(/grade\s*/i, '').trim()
                        : cls.trim();
                    })
                    .filter(Boolean)
                ),
              ].map((grade) => (
                <option key={grade} value={grade}>{`Grade ${grade}`}</option>
              ))}
            </select>
          </div>

          {filteredTimetable.length === 0 ? (
            <p className="text-center text-gray-500">No timetable entries available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center text-sm md:text-base">
                <thead className="bg-blue-100 text-gray-900">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-300">Time Slot</th>
                    {weekdays.map((day) => (
                      <th key={day} className="px-4 py-3 border-b border-gray-300">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gridData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3 border-b border-gray-200 font-semibold text-indigo-600">
                        {timeSlots[rowIndex]}
                      </td>
                      {weekdays.map((day, cellIndex) => {
                        const entry = filteredTimetable.find(
                          (e) => `${e.startTime} - ${e.endTime}` === timeSlots[rowIndex] && e.weekday === day
                        );
                        let display = 'Free';
                        let subjectKey = null;
                        if (entry) {
                          const subjectLabel =
                            entry.subject ||
                            (entry.subjectId != null ? subjectIdToName[Number(entry.subjectId)] || `Subject ${entry.subjectId}` : '');
                          const teacherLabel =
                            entry.teacher ||
                            (entry.teacherId != null ? teacherIdToName[Number(entry.teacherId)] || `T${entry.teacherId}` : '');
                          display = subjectLabel && teacherLabel
                            ? `${subjectLabel} (${teacherLabel})`
                            : subjectLabel || (teacherLabel ? `(${teacherLabel})` : 'Free');
                          subjectKey = subjectLabel && !String(subjectLabel).startsWith('Subject ')
                            ? subjectLabel
                            : null;
                        }
                        const styleClass = subjectKey ? getSubjectStyle(subjectKey) : 'bg-gray-100 text-gray-700';

                        return (
                          <td key={cellIndex} className={`px-4 py-3 border-b border-gray-200 rounded ${styleClass}`}>
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
