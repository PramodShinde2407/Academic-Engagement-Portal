import { useNavigate } from "react-router-dom";
import './Card.css';

export default function ClubCard({ club, onJoin }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (onJoin) {
      onJoin(club);
    }
  };

  const handleDetails = () => {
    navigate(`/clubs/${club.club_id}`, { state: { club } });
  };

  return (
    <div className="card">
      <h3>{club.name}</h3>
      <p>{club.description}</p>

      <div className="club-info">
        <div className="info-row">
          <span className="info-label">👥 Active Members:</span>
          <span className="info-value">{club.active_members || 1}</span>
        </div>

        <div className="info-row">
          <span className="info-label">👨‍🏫 Club Mentor:</span>
          <span className="info-value">
            {club.mentor_name || "Not Assigned"}
            {club.mentor_email && <span className="email"> ({club.mentor_email})</span>}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">👤 Club Head:</span>
          <span className="info-value">
            {club.head_name || "Not Assigned"}
            {club.head_email && <span className="email"> ({club.head_email})</span>}
          </span>
        </div>
      </div>

      <div className="card-buttons">
        <button onClick={handleJoin}>Join</button>
        <button onClick={handleDetails}>Details</button>
      </div>
    </div>
  );
}
