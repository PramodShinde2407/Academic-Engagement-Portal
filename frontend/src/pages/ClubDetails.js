import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubDetails.css";
import api, { BACKEND_URL } from "../api/axios";
import RegistrationModal from "../components/RegistrationModal";

export default function ClubDetails() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [showConfirm, setShowConfirm] = useState(false);

  const [showAddStudent, setShowAddStudent] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentBranch, setStudentBranch] = useState("");
  const [showRemoveStudent, setShowRemoveStudent] = useState(false);

  const [removeEmail, setRemoveEmail] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);




  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
    category: "",
    activities: "",
    club_head_id: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchClub();
  }, [clubId]);

  const showToast = (msg, type = "success") => {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchClub = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClub(res.data);

      // 🔽🔽🔽 ADD THIS BLOCK EXACTLY HERE 🔽🔽🔽
      const membersRes = await api.get(`/clubs/${clubId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClub(prev => ({
        ...prev,
        members: membersRes.data
      }));
      // 🔼🔼🔼 ADD THIS BLOCK EXACTLY HERE 🔼🔼🔼

      if (user && user.id === res.data.club_head_id) {
        setFormData({
          name: res.data.name || "",
          description: res.data.description || "",
          tagline: res.data.tagline || "",
          category: res.data.category || "",
          activities: res.data.activities || "",
          club_head_id: res.data.club_head_id || "",
        });
      }

      // Check application status if user is logged in
      if (user) {
        try {
          const statusRes = await api.get(`/club-registrations/${clubId}/status`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplicationStatus(statusRes.data.status);
        } catch (err) {
          console.error("Failed to fetch application status", err);
        }
      }
    } catch {
      showToast("Failed to fetch club ❌", "error");
    } finally {
      setLoading(false);
    }
  };


  const canManageClub = user && club && (
    club.club_head_id === user.id ||
    club.club_mentor_id === user.id ||
    user.role_name === "Admin" ||
    user.role_id === 4
  );

  const deleteClub = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Club deleted successfully ✅");
      setTimeout(() => navigate("/clubs"), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete club ❌", "error");
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/clubs/${clubId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Club updated successfully ✔️");
      setEditing(false);
      fetchClub();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update club ❌", "error");
    }
  };
  const addStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/clubs/${clubId}/add-student`,
        {
          club_id: clubId,
          name: studentName,
          email: studentEmail,
          roll_no: studentRoll,
          year: studentYear,
          branch: studentBranch
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Student added successfully ✅");

      setShowAddStudent(false);
      setStudentName("");
      setStudentEmail("");
      setStudentRoll("");
      setStudentYear("");
      setStudentBranch("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add student 🚫", "error");
    }
  };

  const removeStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/clubs/${clubId}/remove-student`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { email: removeEmail }
        }
      );

      showToast("Student removed successfully ✅");
      setShowRemoveStudent(false);
      setRemoveEmail("");
      fetchClub(); // refresh members
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove student ❌", "error");
    }
  };

  const handleMarkInterested = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Please login to mark interest", "error");
        navigate("/login");
        return;
      }

      await api.post(`/club-interest/${clubId}/interested`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast("You will be notified when registration opens! 🔔", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to mark interest", "error");
    }
  };




  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    additional_info: "",
    conducted_by: ""
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/events", {
        ...eventForm,
        club_id: clubId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Event created successfully! ✅");
      setShowCreateEvent(false);
      setEventForm({
        title: "",
        description: "",
        date: "",
        venue: "",
        additional_info: "",
        conducted_by: ""
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create event ❌", "error");
    }
  };

  const handleApply = () => {
    // If club requires permission (legacy), use permission form?
    // No, new flow uses /events/:id/register
    // This button handles Club Membership application, not Event Registration.
    // Keeping existing logic for club join.
    setShowRegistrationModal(true);
  };


  if (loading) return <p>Loading club details...</p>;
  if (!club) return <p>Club not found</p>;

  return (
    <>
      <div className="club-details-container">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

        {editing ? (
          <form className="club-edit-form" onSubmit={submitEdit}>
            <h2>Edit Club</h2>

            <label>Club Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <label>Tagline</label>
            <input
              name="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />

            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />

            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <label>Activities</label>
            <textarea
              name="activities"
              rows={3}
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
            />

            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <h1>{club.name}</h1>
            <p><strong>Tagline:</strong> {club.tagline || "N/A"}</p>
            <p><strong>Category:</strong> {club.category || "N/A"}</p>
            <p className="club-description">{club.description}</p>
            <p><strong>Activities:</strong> {club.activities || "N/A"}</p>

            <div className="club-info-section">
              <h3>Club Leadership</h3>
              <div className="leadership-cards">
                {/* Club Head */}
                <div className="leader-card">
                  <div className="leader-avatar">
                    {(club.head_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="leader-info">
                    <span className="leader-role-badge">Club Head</span>
                    <p className="leader-name">{club.head_name || "Not Assigned"}</p>
                    {club.head_email && (
                      <p className="leader-email">✉️ {club.head_email}</p>
                    )}
                  </div>
                </div>
                {/* Club Mentor */}
                <div className="leader-card">
                  <div className="leader-avatar mentor-avatar">
                    {(club.mentor_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="leader-info">
                    <span className="leader-role-badge mentor-badge">Club Mentor</span>
                    <p className="leader-name">{club.mentor_name || "Not Assigned"}</p>
                    {club.mentor_email && (
                      <p className="leader-email">✉️ {club.mentor_email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {club.members && [2, 4, 5].includes(user?.role_id) && (
              <div className="club-info-section">
                <h3>Members ({club.members.length})</h3>
                <ul className="member-list">
                  {club.members.map((m, i) => (
                    <li key={i} className="member-item">
                      {canManageClub ? (
                        <span
                          onClick={() => setSelectedMember(m)}
                          style={{ cursor: "pointer", textDecoration: "underline", color: "#00ffff", fontWeight: "500" }}
                          title="Click to view details"
                        >
                          {m.student_name || m.name}
                        </span>
                      ) : (
                        <span>{m.student_name || m.name}</span>
                      )}

                      {canManageClub && (
                        <button
                          className="remove-btn"
                          onClick={() => {
                            setRemoveEmail(m.email);
                            setShowRemoveStudent(true);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </>
        )}

        {/* Dual-Action Buttons for Non-Club-Head Users */}
        {!canManageClub && user && (
          <div className="club-action-section">
            {/* Check if user is already a member */}
            {club.members && club.members.some(m => m.user_id === user.id || m.email === user.email) ? (
              <button className="is-member-btn" disabled>
                ✅ You are a Member
              </button>
            ) : applicationStatus === 'Pending' ? (
              <button className="is-member-btn pending-btn" disabled style={{ background: '#f59e0b', cursor: 'not-allowed' }}>
                ⏳ Application Pending
              </button>
            ) : (
              <button
                className="register-btn"
                onClick={handleApply}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Apply to Join Club
              </button>
            )}
          </div>
        )}

        {canManageClub && (
          <div className="club-admin-buttons">
            <button onClick={() => setEditing(true)}>Edit Club</button>
            <button className="delete-btn" onClick={() => setShowConfirm(true)}>Delete Club</button>
            {/* Add Student and Create Event hidden for Club Head (2) and Club Mentor (5) — use My Events page */}
            {![2, 4, 5].includes(user?.role_id) && (
              <>
                <button onClick={() => setShowAddStudent(true)}>Add Student</button>
                <button onClick={() => setShowCreateEvent(true)} style={{ backgroundColor: '#8e44ad' }}>Create Event</button>
              </>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-toast">
          <p>Delete this club permanently?</p>
          <div className="confirm-actions">
            <button className="yes-btn" onClick={deleteClub}>Yes</button>
            <button className="no-btn" onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}


      {showAddStudent && (
        <div className="add-student-form">
          <h3>Add Student</h3>

          <input
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />

          <input
            placeholder="Roll Number"
            value={studentRoll}
            onChange={(e) => setStudentRoll(e.target.value)}
          />

          <input
            placeholder="Year"
            value={studentYear}
            onChange={(e) => setStudentYear(e.target.value)}
          />

          <input
            placeholder="Branch"
            value={studentBranch}
            onChange={(e) => setStudentBranch(e.target.value)}
          />

          <button onClick={addStudent}>Save</button>
          <button onClick={() => setShowAddStudent(false)}>Cancel</button>
        </div>
      )}

      {showCreateEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g., Tech Workshop"
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  required
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Venue *</label>
                <input
                  required
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="e.g., Auditorium"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Conducted By</label>
                <input
                  value={eventForm.conducted_by}
                  onChange={(e) => setEventForm({ ...eventForm, conducted_by: e.target.value })}
                  placeholder="e.g., Guest Speaker Name"
                />
              </div>

              <div className="form-group">
                <label>Additional Info</label>
                <textarea
                  value={eventForm.additional_info}
                  onChange={(e) => setEventForm({ ...eventForm, additional_info: e.target.value })}
                  rows="2"
                  placeholder="e.g., Bring laptops"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Create Event</button>
                <button type="button" className="cancel-btn" onClick={() => setShowCreateEvent(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRemoveStudent && (
        <div className="confirm-toast">
          <p>Remove this student?</p>

          <input
            placeholder="Student Email"
            value={removeEmail}
            onChange={(e) => setRemoveEmail(e.target.value)}
          />

          <div className="confirm-actions">
            <button className="yes-btn" onClick={removeStudent}>
              Confirm
            </button>
            <button
              className="no-btn"
              onClick={() => {
                setShowRemoveStudent(false);
                setRemoveEmail("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toastType}`}>{toast}</div>}

      {showRegistrationModal && (
        <RegistrationModal
          clubId={clubId}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            fetchClub(); // Refresh to show pending status
          }}
        />
      )}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "20px" }}>
              {selectedMember.photo_url ? (
                <img
                  src={selectedMember.photo_url.startsWith("http") ? selectedMember.photo_url : `${BACKEND_URL}/${selectedMember.photo_url.replace(/\\/g, "/").replace(/^\/+/, "")}`}
                  alt="Profile"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #00ffff" }}
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : (
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #0cebeb, #20e3b2, #29ffc6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold", color: "#000", border: "2px solid #fff" }}>
                  {(selectedMember.student_name || selectedMember.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
              {/* Fallback for broken image if onError fires (though logic above handles display none, we need the fallback div to be present) */}
              {selectedMember.photo_url && (
                <div className="fallback-avatar" style={{ display: "none", width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #0cebeb, #20e3b2, #29ffc6)", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold", color: "#000", border: "2px solid #fff" }}>
                  {(selectedMember.student_name || selectedMember.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Student Details</h3>
                <p style={{ margin: "4px 0 0", color: "#94a3b8" }}>{selectedMember.student_name || selectedMember.name}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Full Name</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.student_name || selectedMember.name}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>College Email</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.email}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Roll No</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.roll_no}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Phone No</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.phone_no || "N/A"}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Year / Division</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.year} {selectedMember.division ? `/ ${selectedMember.division}` : ""}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Department</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.department || selectedMember.branch || "N/A"}</div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Personal Email</label>
                <div style={{ color: "#fff", fontSize: "1rem" }}>{selectedMember.personal_email || "N/A"}</div>
              </div>
            </div>

            {selectedMember.statement_of_purpose && (
              <div style={{ marginTop: "16px", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "8px" }}>
                <label style={{ color: "#00ffff", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}>Statement of Purpose</label>
                <p style={{ color: "#cbd5e1", lineHeight: "1.6", margin: 0, fontSize: "0.95rem" }}>
                  {selectedMember.statement_of_purpose}
                </p>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: "24px" }}>
              <button className="cancel-btn" onClick={() => setSelectedMember(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
