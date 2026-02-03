import { useEffect, useState } from "react";
import ClubCard from "../components/ClubCard";
import api from "../api/axios";
import "./Clubs.css";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClubName, setNewClubName] = useState("");
  const [newClubDesc, setNewClubDesc] = useState("");
  const [newClubKey, setNewClubKey] = useState(""); // admin-entered key

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const user = JSON.parse(localStorage.getItem("user")); // { id, role_id, name }

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/clubs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubs(res.data);
    } catch (err) {
      console.error("Failed to fetch clubs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const addClub = async () => {
    if (!newClubName || !newClubDesc || !newClubKey) {
      setToastType("error ⚠️");
      setToast("Enter name, description, and secret key");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/clubs",
        {
          name: newClubName,
          description: newClubDesc,
          secretKey: newClubKey // ✅ MATCH BACKEND
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToastType("success! 🎉");
      setToast("Club created successfully! Share the secret key with Club Head. 🎉");

      setNewClubName("");
      setNewClubDesc("");
      setNewClubKey("");
      fetchClubs();
    } catch (err) {
      setToastType("error");
      setToast(err.response?.data?.message || "Failed to add club ❌");
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (loading) return <p>Loading clubs...</p>;

  return (
    <>
      <div className="clubs-container">
        <h2>All Clubs</h2>

        {/* Admin Add Club Section */}
        {user.role_id === 4 && (
          <div className="add-club-form">
            <h3>Add New Club</h3>

            <input
              className="input-field"
              placeholder="Club Name"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
            />

            <input
              className="input-field"
              placeholder="Description"
              value={newClubDesc}
              onChange={(e) => setNewClubDesc(e.target.value)}
            />

            <input
              className="input-field"
              placeholder="Secret Key (give to Club Head)"
              value={newClubKey}
              onChange={(e) => setNewClubKey(e.target.value)}
            />

            <button className="add-club-btn" onClick={addClub}>
              Add Club
            </button>
          </div>
        )}

        {clubs.length === 0 ? (
          <p>No clubs available</p>
        ) : (
          <div className="clubs-grid">
            {clubs.map((c) => (
              <ClubCard key={c.club_id} club={c} />
            ))}
          </div>
        )}
      </div>

      {toast && <div className={`toast ${toastType}`}>{toast}</div>}
    </>
  );
}
