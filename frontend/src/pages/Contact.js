import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="hero-text">
          <h1>Contact Us</h1>
          <p>If you have any questions or suggestions, reach out to us. We are here to help!</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="contact-cards">
        <div className="contact-card">
          <h2>Our Office</h2>
          <p>📍 College Campus, Main Building, Room 101</p>
          <p>✉️ Email: contact@collegeclub.com</p>
          <p>📞 Phone: +91 12345 67890</p>
          <p>We are available Monday to Friday, 9:00 AM to 5:00 PM for any inquiries.</p>
        </div>

        <div className="contact-card">
          <h2>Official Website</h2>
          <p>🌐 <a href="https://www.pict.edu/" target="_blank" rel="noreferrer">https://www.pict.edu/</a></p>
          <p>Visit our official college website for more details about campus, departments, and events.</p>
        </div>

        <div className="contact-card">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="#">📘 Facebook</a>
            <a href="#">🐦 Twitter</a>
            <a href="#">📸 Instagram</a>
            <a href="#">💼 LinkedIn</a>
          </div>
          <p>Follow us on social media to stay updated with club events and announcements.</p>
        </div>
      </section>

      <footer className="contact-footer">
        &copy; 2026 College Club & Event Management. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;
