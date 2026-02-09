import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      {/* Left side: circle + title */}
      <div className="nav-left">
        {user && (
          <div
            className="profile-circle"
            onClick={() => navigate("/account")}
          >
            {firstLetter}
          </div>
        )}
        <h2 className="portal-title">PICT Portal</h2>
      </div>

      {/* Right side links */}
      <div className="nav-right">
        <Link to="/">Home</Link>

        {/* Hide Events and Clubs for authorities */}
        {!["Club Mentor", "Estate Manager", "Principal", "Director"].includes(user?.role_name) && (
          <>
            <Link to="/events">Events</Link>
            <Link to="/clubs">Clubs</Link>
          </>
        )}

        {/* Permission System Links */}
        {user?.role_name === "Club Head" && (
          <Link to="/my-requests">My Requests</Link>
        )}

        {["Club Mentor", "Estate Manager", "Principal", "Director"].includes(user?.role_name) && (
          <Link to="/approvals">Approvals</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/Signup">Signup</Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
