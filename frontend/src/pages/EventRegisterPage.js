import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EventRegisterPage.css";

export default function EventRegisterPage() {
  const { eventId } = useParams();
  const location = useLocation();

  // Use event from state if available
  const [event, setEvent] = useState(location.state?.event || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    rollNo: "",
    tshirt: "",
    notes: ""
  });

  // Fetch event details ONLY if not passed from state
  useEffect(() => {
    if (!event) {
      api.get(`/events/${eventId}`)
        .then(res => setEvent(res.data))
        .catch(() => toast.error("Failed to load event details ❌"));
    }
  }, [eventId, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phone", "department", "year", "rollNo"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill ${field}`);
        return;
      }
    }

    if (!event) {
      toast.error("Event details not loaded ❌");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Send to your backend first
      await api.post(
        "/event-registrations/register",
        { event_id: event.event_id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // 2️⃣ Then send to Web3Forms (optional)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "7c30012f-a14c-4141-b8af-64707af29229",
          subject: `New Event Registration - ${event.title}`,
          event_name: event.title,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          year: formData.year,
          notes: formData.notes
        })
      });

      const result = await response.json();

      if (response.status !== 200) {
        console.warn("Web3Forms failed:", result.message);
      }

      // ✅ Success toast only once
      toast.success(`Registered successfully for ${event.title} 🎉`);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        rollNo: "",
        notes: ""
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to register ❌");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="event-register-container">
      <ToastContainer position="top-right" autoClose={4000} />

      {event ? (
        <form className="event-register-form" onSubmit={handleSubmit}>
          <h2>Register for Event: {event.title}</h2>

          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
          <input name="year" type="number" placeholder="Year (1-4)" value={formData.year} onChange={handleChange} required />
          <input name="rollNo" placeholder="College Roll Number" value={formData.rollNo} onChange={handleChange} required />
          <textarea name="notes" placeholder="Any notes or questions" value={formData.notes} onChange={handleChange}></textarea>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}
