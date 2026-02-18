import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EventDetails.css";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [showAttendees, setShowAttendees] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
      setForm({
        title: res.data.title,
        description: res.data.description,
        date: res.data.date,
        venue: res.data.venue,
        additional_info: res.data.additional_info || "",
        conducted_by: res.data.conducted_by || "",
      });
    } catch (err) {
      console.error("Failed to fetch Event/Session", err);
    }
  };

  const fetchAttendees = async () => {
    try {
      const res = await api.get(`/event-registrations/${eventId}/attendees`);
      setAttendees(res.data);
    } catch (err) {
      // User likely not authorized, ignore
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (user && event) {
      fetchAttendees();
    }
  }, [user, event]);

  if (!event || !user) return <p>Loading Events/Sessions...</p>;

  const canManageEvent =
    user.id === event.organizer_id ||
    user.id === event.club_head_id ||
    user.id === event.club_mentor_id ||
    user.role_name === "Admin" ||
    user.role_id === 4;

  // Handle input changes in edit form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save edited event
  const handleSave = async () => {
    try {
      const payload = { ...form, date: form.date.split("T")[0] };
      await api.put(`/events/${event.event_id}`, payload);
      setToast({ message: "Event/Session updated successfully! 🎉", type: "success" });
      setEditMode(false);
      fetchEvent();
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update Event/Session ❌", type: "error" });
      setTimeout(() => setToast(null), 2500);
    }
  };

  // Delete event
  const handleDelete = async () => {
    try {
      await api.delete(`/events/${event.event_id}`);
      setToast({ message: "Event/Session deleted successfully! 🎉", type: "success" });
      setTimeout(() => {
        setToast(null);
        navigate("/events");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete Event/Session ❌", type: "error" });
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="event-details-container">
      {/* ================== Toast Message ================== */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {!editMode ? (
        <>
          <h1>{event.title}</h1>
          <p><b>Description:</b> {event.description}</p>
          <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
          <p><b>Venue:</b> {event.venue}</p>
          <p><b>Status:</b> {event.status}</p>
          <p><b>Additional Info:</b> {event.additional_info || "N/A"}</p>
          <p><b>Conducted By:</b> {event.conducted_by || "N/A"}</p>

          {/* ====== ENROLLED COUNT (visible to managers) ====== */}
          {canManageEvent && (
            <div className="enrolled-count-badge">
              <span className="enrolled-icon">👥</span>
              <span className="enrolled-text">
                Total Enrolled: <strong>{attendees.length}</strong> student{attendees.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {canManageEvent && (
            <div className="event-buttons">
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Event/Session Details</button>
              <button
                className="delete-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Event/Session
              </button>
            </div>
          )}

          {/* ====== SEE ENROLLED STUDENTS BUTTON ====== */}
          {canManageEvent && attendees.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <button
                className="see-enrolled-btn"
                onClick={() => setShowAttendees(!showAttendees)}
              >
                {showAttendees ? "▲ Hide Enrolled Students" : `▼ See Enrolled Students (${attendees.length})`}
              </button>
            </div>
          )}

          {/* ====== ENROLLED STUDENTS LIST ====== */}
          {canManageEvent && showAttendees && attendees.length > 0 && (
            <div className="attendees-section">
              <h2>Enrolled Students ({attendees.length})</h2>
              <div className="attendees-list">
                {attendees.map((att, index) => (
                  <div
                    key={att.registration_id}
                    className="student-card"
                    onClick={() => setSelectedStudent(att)}
                  >
                    <div className="student-card-avatar">
                      {(att.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="student-card-info">
                      <span className="student-card-name">{att.full_name || "Unknown"}</span>
                      <span className="student-card-meta">{att.department} · Year {att.year}</span>
                    </div>
                    <span className="student-card-arrow">›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== STUDENT DETAIL MODAL ====== */}
          {selectedStudent && (
            <div className="student-modal-overlay" onClick={() => setSelectedStudent(null)}>
              <div className="student-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
                <div className="modal-avatar">
                  {(selectedStudent.full_name || "?").charAt(0).toUpperCase()}
                </div>
                <h2 className="modal-name">{selectedStudent.full_name}</h2>
                <div className="modal-details">
                  <div className="modal-detail-row">
                    <span className="modal-label">📧 Email</span>
                    <span className="modal-value">{selectedStudent.email || "N/A"}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-label">📞 Phone</span>
                    <span className="modal-value">{selectedStudent.phone || "N/A"}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-label">🏫 Department</span>
                    <span className="modal-value">{selectedStudent.department || "N/A"}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-label">📅 Year</span>
                    <span className="modal-value">{selectedStudent.year || "N/A"}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-label">🎫 Roll No</span>
                    <span className="modal-value">{selectedStudent.roll_no || "N/A"}</span>
                  </div>
                  {selectedStudent.notes && (
                    <div className="modal-detail-row">
                      <span className="modal-label">📝 Notes</span>
                      <span className="modal-value">{selectedStudent.notes}</span>
                    </div>
                  )}
                  <div className="modal-detail-row">
                    <span className="modal-label">🕐 Registered At</span>
                    <span className="modal-value">
                      {selectedStudent.registered_at
                        ? new Date(selectedStudent.registered_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Toast */}
          {showDeleteConfirm && (
            <div className="delete-confirm-toast">
              <p>Are you sure you want to delete this Event/Session?</p>
              <div className="delete-confirm-buttons">
                <button onClick={handleDelete} className="confirm-btn">Yes</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">No</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="edit-form">
          <h2>Edit Event/Session</h2>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="date"
            name="date"
            value={form.date.split("T")[0]}
            onChange={handleChange}
          />
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue"
          />
          <textarea
            name="additional_info"
            value={form.additional_info}
            onChange={handleChange}
            placeholder="Additional Information"
          />
          <input
            type="text"
            name="conducted_by"
            value={form.conducted_by}
            onChange={handleChange}
            placeholder="Conducted By"
          />
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
            <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
