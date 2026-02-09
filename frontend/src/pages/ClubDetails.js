import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubDetails.css";
import api from "../api/axios";

export default function ClubDetails() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

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
    } catch {
      showToast("Failed to fetch club ❌", "error");
    } finally {
      setLoading(false);
    }
  };


  const isClubHead = user && club && club.club_head_id === user.id;

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




  if (loading) return <p>Loading club details...</p>;
  if (!club) return <p>Club not found</p>;

  return (
    <>
      <div className="club-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

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
              <p><strong>President:</strong> {club.club_head_name || "N/A"}</p>
            </div>

            {club.members && (
              <div className="club-info-section">
                <h3>Members ({club.members.length})</h3>
                <ul className="member-list">
                  {club.members.map((m, i) => (
                    <ul key={i} className="member-item">
                      {m.student_name || m.name}

                      {isClubHead && (
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
                    </ul>
                  ))}
                </ul>
              </div>
            )}

          </>
        )}

        {isClubHead && (
          <div className="club-admin-buttons">
            <button onClick={() => setEditing(true)}>Edit Club</button>
            <button className="delete-btn" onClick={() => setShowConfirm(true)}>Delete Club</button>
            <button onClick={() => setShowAddStudent(true)}>
              Add Student
            </button>

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
    </>
  );
}
