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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ toast confirmation

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

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  if (!event || !user) return <p>Loading Events/Sessions...</p>;

  const isCreator = user.id === event.organizer_id;

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
      fetchEvent(); // Refresh details
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

          {isCreator && (
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
