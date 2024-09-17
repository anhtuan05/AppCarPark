import React from 'react';
import './style.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Address</h3>
                    <p>123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                </div>
                <div className="footer-section">
                    <h3>Phone Number</h3>
                    <p>+84 123 456 789</p>
                </div>
                <div className="footer-section">
                    <h3>Email</h3>
                    <p><a href="mailto:mycarpark020924@gmail.com">mycarpark020924@gmail.com</a></p>
                </div>
            </div>
            <p>&copy;Copyright 2024</p>
        </footer>
    );
};

export default Footer;
