import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyEvents() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [toast, setToast] = useState(null);
    const [toastType, setToastType] = useState("success");
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
        additional_info: "",
        conducted_by: ""
    });

    const showToast = (msg, type = "success") => {
        setToast(msg);
        setToastType(type);
        setTimeout(() => setToast(null), 2500);
    };

    const fetchEvents = () => {
        if (!user?.club_id) { setLoading(false); return; }
        api.get("/events")
            .then(res => {
                const clubEvents = res.data.filter(e => e.club_id === user.club_id);
                setEvents(clubEvents);
            })
            .catch(() => showToast("Failed to load events", "error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.post("/events", {
                ...eventForm,
                club_id: user.club_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Event created successfully! ✅");
            setShowCreateEvent(false);
            setEventForm({ title: "", description: "", date: "", venue: "", additional_info: "", conducted_by: "" });
            fetchEvents();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create event ❌", "error");
        }
    };

    if (loading) return <p style={{ padding: "40px", color: "#ccc" }}>Loading events...</p>;

    return (
        <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h2 style={{ color: "#06b6d4", margin: 0 }}>My Club Events</h2>
                    <p style={{ color: "#9ca3af", margin: "4px 0 0" }}>All events linked to your club</p>
                </div>
                <button
                    onClick={() => setShowCreateEvent(true)}
                    style={{
                        padding: "12px 24px",
                        background: "linear-gradient(135deg, #8e44ad, #6c3483)",
                        border: "none",
                        borderRadius: "10px",
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        boxShadow: "0 0 20px rgba(142, 68, 173, 0.4)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => e.target.style.boxShadow = "0 0 30px rgba(142, 68, 173, 0.7)"}
                    onMouseLeave={e => e.target.style.boxShadow = "0 0 20px rgba(142, 68, 173, 0.4)"}
                >
                    + Create Event
                </button>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "60px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)"
                }}>
                    <p style={{ fontSize: "3rem" }}>📅</p>
                    <p style={{ color: "#9ca3af", marginTop: "16px" }}>No events found for your club yet. Create one!</p>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "24px"
                }}>
                    {events.map(event => (
                        <div key={event.event_id} style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(6,182,212,0.2)",
                            borderRadius: "16px",
                            padding: "24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            transition: "all 0.3s ease"
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(6,182,212,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)"}
                        >
                            <h3 style={{ color: "#f1f5f9", margin: 0, fontSize: "1.1rem" }}>{event.title}</h3>
                            <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>{event.description}</p>
                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                <span style={{ color: "#06b6d4", fontSize: "0.85rem" }}>📅 {new Date(event.date).toLocaleDateString()}</span>
                                <span style={{ color: "#06b6d4", fontSize: "0.85rem" }}>📍 {event.venue}</span>
                            </div>
                            <button
                                onClick={() => navigate(`/events/${event.event_id}`)}
                                style={{
                                    marginTop: "8px", padding: "10px 20px",
                                    background: "transparent", border: "1px solid #06b6d4",
                                    color: "#06b6d4", borderRadius: "8px", cursor: "pointer",
                                    fontWeight: "600", fontSize: "0.9rem", transition: "all 0.2s ease"
                                }}
                                onMouseEnter={e => { e.target.style.background = "#06b6d4"; e.target.style.color = "#000"; }}
                                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#06b6d4"; }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateEvent && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)"
                }}>
                    <div style={{
                        background: "#1e293b", padding: "30px", borderRadius: "20px",
                        width: "90%", maxWidth: "500px",
                        border: "1px solid rgba(6,182,212,0.3)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                        maxHeight: "90vh", overflowY: "auto"
                    }}>
                        <h3 style={{ margin: "0 0 20px", color: "#00ffff", textAlign: "center" }}>Create New Event</h3>
                        <form onSubmit={handleCreateEvent}>
                            {[
                                { label: "Event Title *", key: "title", type: "text", placeholder: "e.g., Tech Workshop", required: true },
                                { label: "Date *", key: "date", type: "date", required: true },
                                { label: "Venue *", key: "venue", type: "text", placeholder: "e.g., Auditorium", required: true },
                                { label: "Conducted By", key: "conducted_by", type: "text", placeholder: "e.g., Guest Speaker Name" },
                            ].map(({ label, key, type, placeholder, required }) => (
                                <div key={key} style={{ marginBottom: "16px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0" }}>{label}</label>
                                    <input
                                        type={type}
                                        required={required}
                                        placeholder={placeholder}
                                        value={eventForm[key]}
                                        onChange={e => setEventForm({ ...eventForm, [key]: e.target.value })}
                                        style={{
                                            width: "100%", padding: "12px 14px", borderRadius: "10px",
                                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#fff", fontSize: "1rem", boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                            ))}

                            {["description", "additional_info"].map((key) => (
                                <div key={key} style={{ marginBottom: "16px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0" }}>
                                        {key === "description" ? "Description *" : "Additional Info"}
                                    </label>
                                    <textarea
                                        required={key === "description"}
                                        rows={key === "description" ? 3 : 2}
                                        placeholder={key === "additional_info" ? "e.g., Bring laptops" : ""}
                                        value={eventForm[key]}
                                        onChange={e => setEventForm({ ...eventForm, [key]: e.target.value })}
                                        style={{
                                            width: "100%", padding: "12px 14px", borderRadius: "10px",
                                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#fff", fontSize: "1rem", boxSizing: "border-box", resize: "vertical"
                                        }}
                                    />
                                </div>
                            ))}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                                <button
                                    type="submit"
                                    style={{
                                        background: "linear-gradient(135deg, #00ffff, #00bfff)",
                                        color: "#000", border: "none", padding: "10px 20px",
                                        borderRadius: "8px", cursor: "pointer", fontWeight: "600"
                                    }}
                                >
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateEvent(false)}
                                    style={{
                                        background: "rgba(255,255,255,0.1)", color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.2)", padding: "10px 20px",
                                        borderRadius: "8px", cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: "24px", right: "24px",
                    background: toastType === "success" ? "#0f172a" : "#1a0a0a",
                    color: "#fff", padding: "14px 20px", borderRadius: "10px",
                    borderLeft: `4px solid ${toastType === "success" ? "#00ff00" : "#ff0055"}`,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 9999, fontSize: "0.9rem"
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
