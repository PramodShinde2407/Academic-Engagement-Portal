import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./EventCard.css";

export default function EventCard({ event, isRegistered }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isOrganizer = user && event.organizer_id === user.id;

  // Club Heads (role 2) and Club Mentors (role 5) should NOT see Register
  // button ONLY for events that belong to THEIR club
  const isClubManager = user && (user.role_id === 2 || user.role_id === 5);
  const isTheirClubEvent = isClubManager && event.club_id && event.club_id === user.club_id;
  const isAdmin = user && user.role_id === 4;

  // Hide register button if: organizer, OR managing their own club's event, OR Admin, OR already registered
  const hideRegister = isOrganizer || isTheirClubEvent || isAdmin || isRegistered;



  const handleRegisterClick = () => {
    navigate(`/events/${event.event_id}/register`, {
      state: { event } // optional, useful later
    });
  };

  const handleViewDetails = () => {
    navigate(`/events/${event.event_id}`);
  };

  return (
    <>
      <div className="event-card">
        <h3>{event.title}</h3>
        {isOrganizer && <span className="organizer-badge">Admin/Organized</span>}
        <p>{event.description}</p>

        <div className="event-info">
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
          <span>📍 {event.venue}</span>

        </div>

        <div className="event-buttons">
          {!hideRegister && (
            <button className="register-btn" onClick={handleRegisterClick}>
              Register
            </button>
          )}
          <button className="details-btn" onClick={handleViewDetails}>
            View Details
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
