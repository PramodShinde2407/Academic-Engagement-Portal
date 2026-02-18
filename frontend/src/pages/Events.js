import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import api from "../api/axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEvents(data);

      // Fetch registered events for the current user
      if (user) {
        try {
          const myRes = await api.get("/event-registrations/my");
          const ids = myRes.data.map(e => String(e.event_id));
          setRegisteredEventIds(ids);
        } catch (e) {
          console.error("Failed to fetch registered events", e);
        }
      }
    } catch (err) {
      console.error("Failed to fetch Event/Session", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <p>Loading Event/Session...</p>;

  return (
    <div style={{
      padding: "40px 32px",
      minHeight: "100vh",
      background: "#111118",
      backgroundImage: "radial-gradient(circle at 20% 30%, rgba(6,182,212,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.05) 0%, transparent 40%)",
    }}>
      <h2 style={{
        color: "#22d3ee",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: "2rem",
        fontWeight: 700,
        marginBottom: "8px",
        marginTop: 0,
      }}>
        Upcoming Events &amp; Sessions
      </h2>
      <p style={{ color: "#9CA3AF", marginBottom: "32px", fontSize: "0.95rem" }}>
        Browse and register for upcoming college events
      </p>

      {events.length === 0 ? (
        <p style={{ color: "#9CA3AF" }}>No events available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {events.map((e) => (
            <EventCard
              key={e.event_id}
              event={e}
              isRegistered={registeredEventIds.includes(String(e.event_id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
