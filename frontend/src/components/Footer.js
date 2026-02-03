import React from "react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-about">
                    <h3>About PICT Portal</h3>
                    <p>
                        PICT Portal is your one-stop platform to explore clubs, events, and
                        opportunities in college. Our mission is to connect students with
                        like-minded peers, promote extracurricular activities, and make
                        campus life more engaging and productive.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/clubs">Clubs</a></li>
                        <li><a href="/events">Events</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/permissions">Permissions</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p><strong>Email:</strong> support@pictportal.com</p>
                    <p><strong>Phone:</strong> +91-1234567890</p>
                    <p><strong>Address:</strong> Survey No. 27, Near Bharati Vidyapeeth, Dhankawadi, Pune-Satara Road, Pune, Maharashtra, India, 411043.</p>
                </div>

                <div className="footer-social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">💼 LinkedIn</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 PICT Portal. All rights reserved.</p>
                <p>Designed & Developed with ❤️ by PICT Students</p>
            </div>
        </footer>
    );
}
