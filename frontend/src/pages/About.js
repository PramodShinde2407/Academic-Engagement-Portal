import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-text">
          <h1>About College Club & Event Management</h1>
          <p>Connecting students, managing events, and creating unforgettable college experiences.</p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="about-cards">
        <div className="info-card">
          <h2>Who We Are</h2>
          <p>We are a student-led initiative organizing and promoting college clubs and events. We aim to make campus life more engaging and inclusive.</p>
        </div>

        <div className="info-card">
          <h2>Our Mission</h2>
          <p>To empower students to explore interests, develop leadership skills, and participate in activities that foster creativity and collaboration.</p>
        </div>

        <div className="info-card">
          <h2>Our Vision</h2>
          <p>We envision a campus where every student has access to meaningful events, social interactions, and opportunities to shine.</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member"/>
            <h3>Shrihari Pise</h3>
            <p>President</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member"/>
            <h3>Sakhi Sharma</h3>
            <p>Event Head</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Team Member"/>
            <h3>Rohit Verma</h3>
            <p>Tech Lead</p>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        &copy; 2026 College Club & Event Management . All rights reserved.
      </footer>
    </div>
  );
};

export default About;
