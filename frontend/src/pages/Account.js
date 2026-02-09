import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ClubCard from "../components/ClubCard";
import api from "../api/axios";
import "./Account.css";
import EventCard from "../components/EventCard";


export default function Account() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false); // logout
  const [toast, setToast] = useState(null);

  // 🔽 NEW STATES FOR LEAVE CLUB
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [clubToLeave, setClubToLeave] = useState(null);
  const [events, setEvents] = useState([]);

  // Roles that should only see profile info (no events/clubs)
  const profileOnlyRoles = ["Club Mentor", "Estate Manager", "Principal", "Director"];
  const isProfileOnly = profileOnlyRoles.includes(user?.role_name);

  useEffect(() => {
    // Only fetch clubs and events if user is not a profile-only role
    if (!isProfileOnly) {
      fetchMyClubs();
      fetchMyEvents();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/club-members/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data);
    } catch (err) {
      console.error("Failed to fetch user's clubs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowConfirm(false);
    setToast("Logged out successfully ✔️");
    setTimeout(() => {
      setToast(null);
      navigate("/");
    }, 1200);
  };

  // 🔹 OPEN LEAVE CLUB TOAST
  const askLeaveClub = (club) => {
    setClubToLeave(club);
    setShowLeaveConfirm(true);
  };

  // 🔹 CONFIRM LEAVE CLUB
  const confirmLeaveClub = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/club-members/leave",
        { club_id: clubToLeave.club_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClubs(clubs.filter((c) => c.club_id !== clubToLeave.club_id));
      setToast(`Left ${clubToLeave.name}`);
    } catch (err) {
      setToast("Failed to leave club ❌");
    } finally {
      setShowLeaveConfirm(false);
      setClubToLeave(null);
      setTimeout(() => setToast(null), 2000);
    }
  };
  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/event-registrations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch registered events", err);
    }
  };


  if (loading) return <p>Loading your clubs...</p>;

  return (
    <>
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <h2>My Account</h2>
          <button className="logout-btn" onClick={() => setShowConfirm(true)}>
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="account-card">
          <h3>Personal Details</h3>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Department:</b> {user?.department}</p>
          <p><b>Year:</b> {user?.year}</p>
        </div>

        {/* Events & Sessions - Only show for non-profile-only roles */}
        {!isProfileOnly && (
          <>
            <div>
              <h3>Events & Sessions</h3>
            </div>
            <br />
            {events.length === 0 ? (
              <p>You have not registered for any events yet.</p>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <EventCard key={event.event_id} event={event} />
                ))}
              </div>
            )}
          </>
        )}


        {/* Clubs - Only show for non-profile-only roles */}
        {!isProfileOnly && (
          <div className="account-card">
            <h3>Clubs Membership</h3>
            {clubs.length === 0 ? (
              <p>You are not a member of any clubs yet.</p>
            ) : (
              <div className="clubs-grid">
                {clubs.map((c) => (
                  <div key={c.club_id} className="club-card-wrapper">
                    <ClubCard club={c} />
                    <button
                      className="leave-club-btn"
                      onClick={() => askLeaveClub(c)}
                    >
                      Leave Club
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔴 LOGOUT CONFIRM */}
      {showConfirm && (
        <div className="confirm-toast">
          <p>Do you want to logout?</p>
          <div className="confirm-actions">
            <button className="yes-btn" onClick={confirmLogout}>Yes</button>
            <button className="no-btn" onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}

      {/* 🔴 LEAVE CLUB CONFIRM */}
      {showLeaveConfirm && (
        <div className="confirm-toast">
          <p>Leave <b>{clubToLeave?.name}</b>?</p>
          <div className="confirm-actions">
            <button className="yes-btn" onClick={confirmLeaveClub}>
              Confirm
            </button>
            <button
              className="no-btn"
              onClick={() => {
                setShowLeaveConfirm(false);
                setClubToLeave(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS / ERROR TOAST */}
      {toast && <div className="toast success">{toast}</div>}
    </>
  );
}
