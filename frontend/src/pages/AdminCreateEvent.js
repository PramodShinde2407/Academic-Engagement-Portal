import { useState } from "react";
import api from "../api/axios";
import "./AdminCreateEvent.css";

export default function AdminCreateEvent({ onEventCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
  });
  const [toast, setToast] = useState(null);
  const [type, setType] = useState("success");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", form);

      setType("success");
      setToast("Event/Session created successfully ✅");

      // ✅ Re-fetch full events from backend
      if (onEventCreated) {
        onEventCreated();
      }

      setForm({
        title: "",
        description: "",
        date: "",
        venue: "",
      });

    } catch {
      setType("error");
      setToast("Failed to create Event/Session 🚫");
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };


  return (
    <>
      <form onSubmit={submit}>
        <h2>Create Event/Session</h2>

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Venue"
          value={form.venue}
          onChange={e => setForm({ ...form, venue: e.target.value })}
        />
        <button type="submit">Add Event/Session</button>
      </form>

      {toast && <div className={`toast ${type}`}>{toast}</div>}
    </>
  );
}
