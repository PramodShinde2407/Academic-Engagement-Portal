import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./HomePage.css";
import Footer from "../components/Footer"; // adjust path

export default function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [toast, setToast] = useState(null); // toast message
    const [toastType, setToastType] = useState("success"); // success/error

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        // Fetch clubs from backend (only 3)
        api.get("/clubs")
            .then(res => setClubs(res.data.slice(0, 3))) // only first 3 clubs
            .catch(err => console.error(err));

        // Fetch events from backend (only 3)
        api.get("/events")
            .then(res => setEvents(res.data.slice(0, 3))) // only first 3 events
            .catch(err => console.error(err));
    }, []);

    // function to show toast
    const showToast = (message, type = "success") => {
        setToast(message);
        setToastType(type);
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="home-container">
            {/* Welcome Section */}
            <section className="welcome-section">
                <div className="welcome-card">
                    <h1>Hello {user ? user.name : "PICTian"}!</h1>
                    <p>
                        Welcome to <strong>PICT Portal</strong>! 🎉
                        <br />
                        We know stepping into college can be exciting but also a little overwhelming.
                        You might be wondering: which clubs should I join? Which events/sessions are worth attending?
                        How do I make the most of your college journey? Don’t worry—we’re here to help!
                    </p>

                    <h3>Challenges new engineering students face:</h3>
                    <ul>
                        <li>Figuring out which clubs and societies match your interests</li>
                        <li>Keeping track of academic deadlines and events/sessions</li>
                        <li>Finding your peer group and navigating campus life</li>
                        <li>Choosing workshops, competitions, or seminars that help your career</li>
                    </ul>

                    <h3>How PICT Portal helps:</h3>
                    <ul>
                        <li>Discover and join clubs that match your passion and skills</li>
                        <li>See upcoming events/sessions, both technical and non-technical, and participate</li>
                        <li>Track your activities and manage your account from one place</li>
                        <li>Learn about our college culture and explore opportunities at your own pace</li>
                    </ul>

                    <p>
                        Take your first steps here, explore, join, and grow. Scroll down to find clubs and events/sessions
                        that can make your college life amazing! 🚀
                    </p>
                </div>
            </section>

            {/* Clubs Section */}
            <section className="clubs-section">
                <h2>Our Clubs</h2>

                {/* Club Cards */}
                <div className="cards-container">
                    {clubs.length > 0 ? (
                        clubs.map(club => (
                            <div key={club.club_id} className="card">
                                <h3>{club.name}</h3>
                                <p>{club.description}</p>
                                <button onClick={() => navigate(`/clubs/${club.club_id}`)}>
                                    Visit Club
                                </button>
                                {user ? (
                                    <button
                                        className="join-btn"
                                        onClick={() => navigate(`/clubs/join/${club.club_id}`)}
                                    >
                                        Join Club
                                    </button>
                                ) : (
                                    <button
                                        className="login-required-btn"
                                        onClick={() => {
                                            showToast("Please login or signup to join clubs", "error");
                                            setTimeout(() => navigate("/login"), 1500);
                                        }}
                                    >
                                        Login to Join
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No clubs available currently.</p>
                    )}
                </div>

                {/* Guide for New Users */}
                <div className="clubs-guide">
                    <h3>How to Join a Club as a New User:</h3>
                    <ol>
                        <li>Browse the clubs above and pick the ones that interest you.</li>
                        <li>
                            Click the <strong>"Visit Club"</strong> button to see detailed
                            information about that club.
                        </li>
                        <li>
                            To become a member, click the <strong>"Join Club"</strong> button.
                            You will see a form pop up where you need to fill in basic details:
                        </li>
                        <ul>
                            <li>Full Name</li>
                            <li>Email Address</li>
                            <li>Year & Department</li>
                            <li>Why you want to join this club (optional)</li>
                        </ul>
                        <li>Submit the form — your request will be registered and you will be notified.</li>
                        <li>
                            Once accepted, you can participate in events/sessions, meetings, and activities of the club.
                        </li>
                    </ol>

                    <p>
                        This guide ensures that even if you’re new, you can quickly become part
                        of the right clubs and make the most of your college experience! 🚀
                    </p>
                    {/* Discover More clubs Button */}
                    <div style={{ textAlign: "center", margin: "30px 0" }}>
                        <button
                            className="discover-btn"
                            onClick={() => navigate("/clubs")}
                        >
                            Discover More Clubs
                        </button>
                    </div>
                </div>

            </section>

            {/* Events Section */}
            <section className="events-section">
                <h2>Upcoming Events/Sessions</h2>

                {/* Event Cards */}
                <div className="cards-container">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.event_id} className="card">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <p>
                                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} <br />
                                    <strong>Venue:</strong> {event.venue} <br />
                                    <strong>Status:</strong> {event.status}
                                </p>
                                <button onClick={() => navigate(`/events/${event.event_id}`)}>
                                    View Event/Session
                                </button>
                                {user ? (
                                    <button
                                        className="join-btn"
                                        onClick={() => {
                                            navigate(`/events/${event.event_id}/register`);
                                        }}
                                    >
                                        Join Event/Session
                                    </button>
                                ) : (
                                    <button
                                        className="login-required-btn"
                                        onClick={() => {
                                            showToast("Please login or signup to register for events", "error");
                                            setTimeout(() => navigate("/login"), 1500);
                                        }}
                                    >
                                        Login to Register
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No Events/Sessions scheduled currently.</p>
                    )}
                </div>

                {/* Events Guide for New Users */}
                <div className="events-guide">
                    <h3>How to Participate in Events/Sessions:</h3>
                    <ol>
                        <li>Browse the upcoming events/sessions above to see what interests you.</li>
                        <li>
                            Click <strong>"View Event/Session"</strong> to see full details: venue, timings, and description.
                        </li>
                        <li>
                            If you want to participate, click the <strong>"Join Event/Session"</strong> button.
                            A registration form will appear where you need to provide:
                        </li>
                        <ul>
                            <li>Full Name</li>
                            <li>Email Address</li>
                            <li>Year & Department</li>
                            <li>Any other event/session-specific info (if required)</li>
                        </ul>
                        <li>Submit the form to confirm your participation.</li>
                        <li>
                            You will receive a confirmation and can now attend the event/session. Remember to check your account for updates and reminders.
                        </li>
                    </ol>

                    <p>
                        By following these steps, you’ll never miss an event/session and can make the most of your college life. 🌟
                    </p>

                    {/* Discover More Events Button */}
                    <div style={{ textAlign: "center", margin: "30px 0" }}>
                        <button
                            className="discover-btn"
                            onClick={() => navigate("/events")}
                        >
                            Discover More Events/Sessions
                        </button>
                    </div>
                </div>

            </section>

            <Footer />

            {/* Toast Message */}
            {toast && <div className={`toast ${toastType}`}>{toast}</div>}
        </div>
    );
}
