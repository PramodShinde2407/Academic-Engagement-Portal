import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./ClubJoinPage.css";

export default function ClubJoinPage() {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const [club, setClub] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        rollNo: "",
        whyJoin: "",
        interests: "",
        extraNotes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // IMMEDIATE authentication check on mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, [navigate]);

    // Fetch club details only if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            api.get(`/clubs/${clubId}`)
                .then(res => setClub(res.data))
                .catch(err => console.error("Failed to fetch club details", err));
        }
    }, [clubId, isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        const requiredFields = ["name", "email", "phone", "department", "year", "rollNo", "whyJoin", "interests"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`Please fill ${field}`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: "7c30012f-a14c-4141-b8af-64707af29229", // YOUR WEB3FORMS KEY
                    subject: `New Club Join Application - ${club.name}`,
                    email: formData.email, // student's email
                    name: formData.name,
                    phone: formData.phone,
                    department: formData.department,
                    year: formData.year,
                    roll_no: formData.rollNo,
                    why_join: formData.whyJoin,
                    interests: formData.interests,
                    extra_notes: formData.extraNotes,
                    club_name: club.name
                })
            });

            const result = await response.json();
            if (response.status === 200) {
                toast.success(`Application sent successfully for ${club.name}! ✅`);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    department: "",
                    year: "",
                    rollNo: "",
                    whyJoin: "",
                    interests: "",
                    extraNotes: ""
                });
            } else {
                toast.error(result.message || "Something went wrong! 🚫");
            }
        } catch (err) {
            toast.error("Something went wrong! ❌");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render anything until authentication is verified
    if (isChecking || !isAuthenticated) {
        return null;
    }

    return (
        <div className="club-join-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="club-info">
                <h2>{club.name}</h2>
                <p>{club.description}</p>
            </div>

            <form className="club-join-form" onSubmit={handleSubmit}>
                <h2>Join {club.name}</h2>

                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
                <input type="number" name="year" placeholder="Year (1,2,3,4)" value={formData.year} onChange={handleChange} min={1} max={4} required />
                <input type="text" name="rollNo" placeholder="College Roll Number" value={formData.rollNo} onChange={handleChange} required />

                <textarea name="whyJoin" placeholder="Why do you want to join this club?" value={formData.whyJoin} onChange={handleChange} required></textarea>
                <textarea name="interests" placeholder="Your interests / skills relevant to the club" value={formData.interests} onChange={handleChange} required></textarea>
                <textarea name="extraNotes" placeholder="Any extra notes or questions" value={formData.extraNotes} onChange={handleChange}></textarea>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
}
