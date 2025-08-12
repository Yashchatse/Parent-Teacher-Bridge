import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parentService } from '../../services/parentService';
import { useParentAuth } from '../../context/ParentAuthContext';

function Attendance() {
  const { parent } = useParentAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const parentId = parent?.parentId || parent?.id || '1';
        const data = await parentService.getAttendance(parentId);
        const normalized = (Array.isArray(data) ? data : []).map((entry) => {
          return {
            date:
              entry?.date ||
              entry?.Date ||
              entry?.attendanceDate ||
              entry?.AttendanceDate ||
              entry?.day ||
              entry?.dateMarked ||
              entry?.DateMarked ||
              '',
            status:
              entry?.status ||
              entry?.Status ||
              entry?.attendanceStatus ||
              entry?.AttendanceStatus ||
              entry?.presentStatus ||
              entry?.PresentStatus ||
              '',
            remark:
              entry?.remark ||
              entry?.Remark ||
              entry?.remarks ||
              entry?.Remarks ||
              entry?.note ||
              entry?.Note ||
              entry?.comment ||
              entry?.Comment ||
              entry?.description ||
              entry?.Description ||
              entry?.reason ||
              entry?.Reason ||
              (() => {
                const keys = Object.keys(entry || {});
                const remarkKey = keys.find(key =>
                  key.toLowerCase().includes('remark') ||
                  key.toLowerCase().includes('note') ||
                  key.toLowerCase().includes('comment')
                );
                return remarkKey ? entry[remarkKey] : '';
              })(),
            markedTime:
              entry?.marked_time ||
              entry?.markedTime ||
              entry?.MarkedTime ||
              entry?.checkInTime ||
              entry?.CheckInTime ||
              entry?.time ||
              entry?.Time ||
              entry?.timeMarked ||
              entry?.TimeMarked ||
              entry?.attendanceTime ||
              entry?.AttendanceTime ||
              (() => {
                const keys = Object.keys(entry || {});
                const timeKey = keys.find(key =>
                  key.toLowerCase().includes('time') ||
                  key.toLowerCase().includes('hour') ||
                  key.toLowerCase().includes('minute')
                );
                return timeKey ? entry[timeKey] : '';
              })(),
          };
        });
        if (!abort.signal.aborted) setAttendanceData(normalized);
      } catch (e) {
        if (!abort.signal.aborted) setAttendanceData([]);
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [parent]);

  const handleDownloadPDF = () => {
    console.log('PDF download started, attendance data:', attendanceData);

    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Student Attendance Report', 14, 22);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

      const tableColumn = ['Date', 'Status', 'Remark', 'Marked Time'];
      const tableRows = attendanceData.map((entry) => [
        String(entry.date || 'N/A'),
        String(entry.status || 'N/A'),
        String(entry.remark || 'No remark'),
        String(entry.markedTime || 'Time not recorded'),
      ]);

      console.log('Table rows for PDF:', tableRows);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
          3: { cellWidth: 40 },
        },
        margin: { top: 20 },
      });

      doc.save(`attendance-report-${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6">
      <div className="bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-8 py-6 flex justify-between items-center relative">
          <h4 className="text-3xl font-bold tracking-wide">📅 Attendance Overview</h4>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-indigo-100 transition-transform hover:scale-105"
          >
            📄 Download PDF
          </button>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading attendance records...</p>
          ) : attendanceData.length === 0 ? (
            <p className="text-center text-gray-500">No attendance records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-base rounded-xl shadow-inner">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left border-b border-gray-300">Date</th>
                    <th className="px-6 py-4 text-left border-b border-gray-300">Status</th>
                    <th className="px-6 py-4 text-left border-b border-gray-300">Remark</th>
                    <th className="px-6 py-4 text-left border-b border-gray-300">Marked Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((entry, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 border-b border-gray-200">{entry.date}</td>
                      <td
                        className={`px-6 py-4 border-b border-gray-200 font-semibold ${
                          entry.status === 'Present'
                            ? 'text-green-600'
                            : entry.status === 'Absent'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                        }`}
                      >
                        {entry.status}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <span className={entry.remark ? 'text-gray-900' : 'text-gray-400 italic'}>
                          {entry.remark || 'No remark available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <span className={entry.markedTime ? 'text-gray-900' : 'text-gray-400 italic'}>
                          {entry.markedTime || 'Time not recorded'}
                        </span>
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

export default Attendance;
