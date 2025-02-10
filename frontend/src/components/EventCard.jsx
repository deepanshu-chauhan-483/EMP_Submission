import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 line-clamp-1">{event.name}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isUpcoming ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      <div className="text-sm text-gray-500 mb-2">📅 {eventDate.toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
      <div className="text-sm text-gray-500 mb-4">📍 {event.location}</div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">⭐ {event.rating || 'N/A'}</p>
        <Link
          to={`/event/${event._id}`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
