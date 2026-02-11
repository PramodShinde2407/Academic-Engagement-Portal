import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Helper function to check if link is active
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Listen to localStorage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling to catch logout/login in same tab
    const interval = setInterval(() => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(prev => {
        if (
          (prev && !updatedUser) || // user logged out
          (!prev && updatedUser) || // user logged in
          (prev && updatedUser && prev.user_id !== updatedUser.user_id) // different user
        ) {
          return updatedUser;
        }
        return prev;
      });
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      {/* Left side: Profile circle + PICT PORTAL logo */}
      <div className="nav-left">
        {user && (
          <div
            className="profile-circle"
            onClick={() => navigate("/account")}
          >
            {firstLetter}
          </div>
        )}
        <h2 className="portal-title">PICT PORTAL</h2>
      </div>

      {/* Center: Main navigation links */}
      <div className="nav-center">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>

        {/* Hide Events and Clubs for authorities */}
        {!["Estate Manager", "Principal", "Director"].includes(user?.role_name) && (
          <>
            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>Events</Link>
            <Link to="/clubs" className={`nav-link ${isActive('/clubs') ? 'active' : ''}`}>Clubs</Link>
          </>
        )}

        {/* Permission System Links */}
        {user?.role_name === "Club Head" && (
          <Link to="/my-requests" className={`nav-link ${isActive('/my-requests') ? 'active' : ''}`}>My Requests</Link>
        )}

        {["Club Mentor", "Estate Manager", "Principal", "Director"].includes(user?.role_name) && (
          <Link to="/approvals" className={`nav-link ${isActive('/approvals') ? 'active' : ''}`}>Approvals</Link>
        )}
      </div>

      {/* Right side: Notification Bell + Auth buttons */}
      <div className="nav-right">
        {user && (
          <>
            <NotificationBell />
            <button className="auth-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="auth-btn auth-btn-login">Login</Link>
            <Link to="/Signup" className="auth-btn auth-btn-signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
