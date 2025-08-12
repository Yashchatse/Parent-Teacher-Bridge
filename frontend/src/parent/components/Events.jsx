"use client";

import React, { useEffect, useState } from 'react';
import { parentService } from '../../services/parentService';

const getCardStyle = (title) => {
  if (title.toLowerCase().includes('science') || title.toLowerCase().includes('fair')) {
    return 'bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors';
  } else if (title.toLowerCase().includes('independence') || title.toLowerCase().includes('sports')) {
    return 'bg-gradient-to-br from-emerald-500 to-emerald-300 text-white';
  } else if (title.toLowerCase().includes('meeting') || title.toLowerCase().includes('celebration')) {
    return 'bg-gradient-to-br from-yellow-500 to-yellow-300 text-gray-800';
  } else {
    return 'bg-gradient-to-br from-gray-600 to-gray-400 text-white';
  }
};

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      try {
        const data = await parentService.getEvents();
        if (!abort.signal.aborted) setEvents(data || []);
      } catch (e) {
        if (!abort.signal.aborted) setEvents([]);
      }
    };
    run();
    return () => abort.abort();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="rounded-xl shadow-lg mb-8 bg-gradient-to-r from-blue-600 to-purple-500 text-white text-center py-6">
        <h2 className="text-2xl font-bold">🌈 Upcoming Events</h2>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => {
            const cardClass = getCardStyle(event.title);
            return (
              <div key={index} className="transition-transform duration-300 hover:scale-[1.02]">
                <div className={`rounded-xl shadow-lg h-full p-6 ${cardClass}`}>
                  <h4 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <span className="inline-block text-white">📅</span>
                    {event.title}
                  </h4>
                  <p className="mb-4">{event.description}</p>

                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-semibold">📆 Date:</span> {event.eventDate}
                    </li>
                    <li>
                      <span className="font-semibold">👩‍🏫 Teacher:</span> {event.teacher}
                    </li>
                    <li>
                      <span className="font-semibold">🏷️ Type:</span>{' '}
                      <span className="inline-block bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {event.title.includes('Fair')
                          ? 'Academic'
                          : event.title.includes('Celebration')
                          ? 'Cultural'
                          : 'General'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
