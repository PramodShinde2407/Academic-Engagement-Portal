import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AdminCreateEvent from "../pages/AdminCreateEvent";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const isEventCreator =
    user && ["Admin", "Faculty", "Club Head"].includes(user.role_name);

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
    <div style={{ padding: "20px" }}>
      <h2>Upcoming Event/Session</h2>

      {/* ✅ Add Event form */}
      {isEventCreator && (
        <div style={{ marginBottom: "30px" }}>
          <AdminCreateEvent onEventCreated={fetchEvents} />
        </div>
      )}

      {events.length === 0 ? (
        <p>No Event/Session available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((e) => (
            <EventCard key={e.event_id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
