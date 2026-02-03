import { useNavigate } from "react-router-dom";
import './Card.css';

export default function ClubCard({ club }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/clubs/join/${club.club_id}`, { state: { clubName: club.name } });
  };

  const handleDetails = () => {
    navigate(`/clubs/${club.club_id}`, { state: { club } });
  };

  return (
    <div className="card">
      <h3>{club.name}</h3>
      <p>{club.description}</p>
      <div className="card-buttons">
        <button onClick={handleJoin}>Join</button>
        <button className="details-btn" onClick={handleDetails}>Details</button>
      </div>
    </div>
  );
}
