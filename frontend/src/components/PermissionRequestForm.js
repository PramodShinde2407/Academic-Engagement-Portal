import { useState, useEffect } from "react";
import api from "../api/axios";
import "./PermissionForm.css";

export default function PermissionRequestForm() {
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        location: "",
        event_date: "",
        start_time: "",
        end_time: "",
        club_id: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(""); // success | error
    const [clubs, setClubs] = useState([]);
    const [loadingClubs, setLoadingClubs] = useState(true);

    // Fetch clubs where the user is club head
    useEffect(() => {
        const fetchMyClubs = async () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user"));

                // Fetch all clubs and filter where user is club head
                const response = await api.get("/clubs", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Filter clubs where this user is the club head
                const myClubs = response.data.filter(club => club.club_head_id === user.id);
                setClubs(myClubs);

                // Auto-select if only one club
                if (myClubs.length === 1) {
                    setFormData(prev => ({ ...prev, club_id: myClubs[0].club_id }));
                }
            } catch (err) {
                console.error("Failed to fetch clubs:", err);
                setType("error");
                setMessage("Failed to load your clubs. Please refresh the page.");
            } finally {
                setLoadingClubs(false);
            }
        };

        fetchMyClubs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validation
        if (!formData.subject || !formData.description || !formData.location ||
            !formData.event_date || !formData.start_time || !formData.end_time || !formData.club_id) {
            setType("error");
            setMessage("All fields are required");
            setLoading(false);
            return;
        }

        // Validate time range
        if (formData.start_time >= formData.end_time) {
            setType("error");
            setMessage("End time must be after start time");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/permissions/create", formData);

            setType("success");
            setMessage("Permission request submitted successfully! It will be reviewed by authorities.");

            // Reset form
            setFormData({
                subject: "",
                description: "",
                location: "",
                event_date: "",
                start_time: "",
                end_time: "",
                club_id: clubs.length === 1 ? clubs[0].club_id : ""
            });

            // Redirect to my requests after 2 seconds
            setTimeout(() => {
                window.location.href = "/my-requests";
            }, 2000);

        } catch (err) {
            setType("error");
            setMessage(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="permission-form-container">
            <div className="permission-form-card">
                <h2>Create Permission Request</h2>
                <p className="form-subtitle">Submit a request for event approval</p>

                {message && (
                    <div className={`message ${type}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="permission-form">
                    <div className="form-group">
                        <label htmlFor="club_id">Select Club *</label>
                        <select
                            id="club_id"
                            name="club_id"
                            value={formData.club_id}
                            onChange={handleChange}
                            disabled={loadingClubs || clubs.length === 0}
                        >
                            <option value="">-- Select a Club --</option>
                            {clubs.map(club => (
                                <option key={club.club_id} value={club.club_id}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                        {!loadingClubs && clubs.length === 0 && (
                            <small style={{ color: '#e74c3c', marginTop: '5px', display: 'block' }}>
                                You are not a club head of any club. Only club heads can create permission requests.
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject *</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="e.g., Tech Fest 2024"
                            maxLength="200"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide detailed description of the event..."
                            rows="5"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="location">Location *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Main Auditorium"
                                maxLength="150"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="event_date">Event Date *</label>
                            <input
                                type="date"
                                id="event_date"
                                name="event_date"
                                value={formData.event_date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_time">Start Time *</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time">End Time *</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || loadingClubs || clubs.length === 0}
                        >
                            {loading ? "Submitting..." : loadingClubs ? "Loading..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
