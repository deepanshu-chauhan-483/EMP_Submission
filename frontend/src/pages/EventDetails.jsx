import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

// Use environment variables for API and WebSocket URLs
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/events/${id}`);
        setEvent(data);
        socket.emit("joinEvent", id);
      } catch (error) {
        console.error("Error fetching event details", error.response?.data || error);
        setError("Event not found.");
      }
    };
    fetchEvent();

    socket.on("updateAttendees", (updatedAttendees) => {
      setEvent((prevEvent) => ({
        ...prevEvent,
        attendees: updatedAttendees,
      }));
    });

    return () => {
      socket.off("updateAttendees");
    };
  }, [id]);

  const attendEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/events/${id}/attend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("attendEvent", id, data.attendees);
      setIsAttending(true);
    } catch (error) {
      console.error("Error attending event", error);
      alert("Already attending!");
    }
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700">{event.name}</h2>
        <p className="text-gray-600 mt-2">{event.description}</p>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">
            Category: <span className="text-blue-600">{event.category}</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            Location: <span className="text-blue-600">{event.location}</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            Date:{" "}
            <span className="text-blue-600">
              {event.date &&
                new Date(event.date).toLocaleString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </p>
        </div>

        <button
          onClick={attendEvent}
          disabled={isAttending}
          className={`mt-6 w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isAttending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isAttending ? "Attending" : "Attend Event"}
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendees</h3>
          {event.attendees && event.attendees.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {event.attendees.map((attendee) => (
                <li key={attendee._id} className="text-sm">{attendee.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No attendees yet. Be the first to attend!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
