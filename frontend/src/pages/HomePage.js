import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./HomePage.css";
import Footer from "../components/Footer";

export default function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [toast, setToast] = useState(null);
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        // Fetch clubs from backend (only 3)
        api.get("/clubs")
            .then(res => setClubs(res.data.slice(0, 3)))
            .catch(err => console.error(err));

        // Fetch events from backend (only 3)
        api.get("/events")
            .then(res => setEvents(res.data.slice(0, 3)))
            .catch(err => console.error(err));

        // Scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const showToast = (message, type = "success") => {
        setToast(message);
        setToastType(type);
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="home-container">
            {/* HERO SECTION - Split Screen 50/50 */}
            <section className="hero-section">
                <div className="hero-content fade-in-up">
                    <h1 className="hero-headline">
                        Your Campus. Your Community. Connected.
                    </h1>
                    <p className="hero-subheadline">
                        Manage clubs, track events, and unlock your engineering potential in one seamless portal.
                    </p>
                    <div className="cta-buttons">
                        <button
                            className="cta-btn cta-btn-primary"
                            onClick={() => navigate("/events")}
                        >
                            Explore Events
                        </button>
                        <button
                            className="cta-btn cta-btn-secondary"
                            onClick={() => navigate("/clubs")}
                        >
                            View Clubs
                        </button>
                    </div>
                </div>

                <div className="hero-visual fade-in-up">
                    <div className="glowing-orb"></div>
                    <div className="orb-ring orb-ring-1"></div>
                    <div className="orb-ring orb-ring-2"></div>
                    <div className="orb-ring orb-ring-3"></div>
                </div>
            </section>

            {/* PROCESS STEPS SECTION - Horizontal Flow */}
            <section className="process-section fade-in-up">
                <h2 className="section-title">How It Works</h2>
                <div className="process-steps">
                    <div className="process-step">
                        <div className="process-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <h3 className="process-label">Discover</h3>
                        <p className="process-description">Browse clubs and events</p>
                    </div>

                    <div className="process-step">
                        <div className="process-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3 className="process-label">Register</h3>
                        <p className="process-description">Join with one click</p>
                    </div>

                    <div className="process-step">
                        <div className="process-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                        </div>
                        <h3 className="process-label">Participate</h3>
                        <p className="process-description">Engage and grow</p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION - Zig-Zag Layout */}
            <section className="features-section">
                <div className="feature-row fade-in-up">
                    <div className="feature-text">
                        <h3>Find Your Tribe</h3>
                        <p>
                            Connect with like-minded students through clubs that match your passions.
                            From coding to robotics, cultural to sports—discover communities that inspire you.
                        </p>
                    </div>
                    <div className="feature-visual">
                        <div className="feature-icon">👥</div>
                    </div>
                </div>

                <div className="feature-row feature-row-reverse fade-in-up">
                    <div className="feature-visual">
                        <div className="feature-icon">📅</div>
                    </div>
                    <div className="feature-text">
                        <h3>Never Miss a Deadline</h3>
                        <p>
                            Stay on top of every workshop, competition, and seminar. Get real-time updates
                            and manage your academic calendar effortlessly.
                        </p>
                    </div>
                </div>

                <div className="feature-row fade-in-up">
                    <div className="feature-text">
                        <h3>Track Your Journey</h3>
                        <p>
                            Monitor your club memberships, event registrations, and achievements all in one place.
                            Build your college portfolio seamlessly.
                        </p>
                    </div>
                    <div className="feature-visual">
                        <div className="feature-icon">🚀</div>
                    </div>
                </div>
            </section>

            {/* CLUBS SECTION - Enhanced Cards */}
            <section className="clubs-section fade-in-up">
                <h2 className="section-title">Featured Clubs</h2>

                <div className="cards-container">
                    {clubs.length > 0 ? (
                        clubs.map(club => (
                            <div key={club.club_id} className="card">
                                <div className="card-content">
                                    <h3>{club.name}</h3>
                                    <p>{club.description}</p>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="card-btn card-btn-secondary"
                                        onClick={() => navigate(`/clubs/${club.club_id}`)}
                                    >
                                        Visit Club
                                    </button>
                                    {user ? (
                                        <button
                                            className="card-btn card-btn-primary"
                                            onClick={() => navigate(`/clubs/join/${club.club_id}`)}
                                        >
                                            Join Club
                                        </button>
                                    ) : (
                                        <button
                                            className="card-btn card-btn-warning"
                                            onClick={() => {
                                                showToast("Please login or signup to join clubs", "error");
                                                setTimeout(() => navigate("/login"), 1500);
                                            }}
                                        >
                                            Login to Join
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-state">No clubs available currently.</p>
                    )}
                </div>

                <div className="section-cta">
                    <button
                        className="discover-btn"
                        onClick={() => navigate("/clubs")}
                    >
                        Discover All Clubs
                    </button>
                </div>
            </section>

            {/* EVENTS SECTION - Enhanced Cards */}
            <section className="events-section fade-in-up">
                <h2 className="section-title">Upcoming Events</h2>

                <div className="cards-container">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.event_id} className="card">
                                <div className="card-content">
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <div className="event-meta">
                                        <span className="meta-item">
                                            📅 {new Date(event.date).toLocaleDateString()}
                                        </span>
                                        <span className="meta-item">
                                            📍 {event.venue}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="card-btn card-btn-secondary"
                                        onClick={() => navigate(`/events/${event.event_id}`)}
                                    >
                                        View Details
                                    </button>
                                    {user ? (
                                        <button
                                            className="card-btn card-btn-primary"
                                            onClick={() => navigate(`/events/${event.event_id}/register`)}
                                        >
                                            Register Now
                                        </button>
                                    ) : (
                                        <button
                                            className="card-btn card-btn-warning"
                                            onClick={() => {
                                                showToast("Please login or signup to register for events", "error");
                                                setTimeout(() => navigate("/login"), 1500);
                                            }}
                                        >
                                            Login to Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-state">No events scheduled currently.</p>
                    )}
                </div>

                <div className="section-cta">
                    <button
                        className="discover-btn"
                        onClick={() => navigate("/events")}
                    >
                        Discover All Events
                    </button>
                </div>
            </section>

            <Footer />

            {/* Toast Message */}
            {toast && <div className={`toast ${toastType}`}>{toast}</div>}
        </div>
    );
}
