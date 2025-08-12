"use client";

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';

const tableColumn = [
  'Exam Type',
  'Marks Obtained',
  'Max Marks',
  'Percentage',
  'Grade',
  'Exam Date',
  'Remarks',
];

function Performance() {
  const { parent } = useParentAuth();
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const parentId = parent?.parentId || parent?.id || '1';
        const data = await parentService.getPerformance(parentId);
        if (!abort.signal.aborted) setPerformanceData(data || []);
      } catch (e) {
        if (!abort.signal.aborted) setPerformanceData([]);
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Student Performance Report', 14, 22);

    const tableRows = performanceData.map((exam) => [
      exam.examType || '--',
      exam.marksObtained ?? '--',
      exam.maxMarks ?? '--',
      `${exam.percentage ?? '--'}%`,
      exam.grade || '--',
      exam.examDate || '--',
      exam.remarks || '--',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save('performance-report.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="rounded-xl shadow-lg overflow-hidden">
        {/* Header with Download Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white py-6 px-6 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold">📊 Exam Performance</h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
          >
            Download PDF
          </button>
        </div>

        {/* Table */}
        <div className="bg-white text-gray-800 px-6 py-6 rounded-b-xl">
          {loading ? (
            <p className="text-center text-gray-500">Loading performance records...</p>
          ) : performanceData.length === 0 ? (
            <p className="text-center text-gray-500">No performance records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-blue-100 text-gray-900 text-base">
                  <tr>
                    {tableColumn.map((heading, index) => (
                      <th
                        key={index}
                        className={`py-3 px-4 border-b border-gray-300 ${
                          heading === 'Remarks' ? 'text-left' : 'text-center'
                        } whitespace-nowrap`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((exam, index) => (
                    <tr key={index} className="bg-gray-50 hover:bg-gray-100 text-sm">
                      <td className="py-3 px-4 border-b border-gray-200 text-center font-semibold text-indigo-600 whitespace-nowrap">
                        {exam.examType}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center whitespace-nowrap">
                        {exam.marksObtained}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center whitespace-nowrap">
                        {exam.maxMarks}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center whitespace-nowrap">
                        <span className="inline-block bg-cyan-200 text-cyan-900 px-3 py-1 rounded-full text-sm font-medium">
                          {exam.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            exam.grade === 'A+'
                              ? 'bg-green-500 text-white'
                              : exam.grade === 'A'
                              ? 'bg-indigo-500 text-white'
                              : exam.grade === 'B+'
                              ? 'bg-yellow-400 text-gray-900'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {exam.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-center whitespace-nowrap">
                        {exam.examDate}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-left whitespace-nowrap">
                        {exam.remarks}
                      </td>
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
}

export default Performance;
