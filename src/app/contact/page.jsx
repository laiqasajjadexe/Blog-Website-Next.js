import React from "react";
import styles from "./contact.module.css";

const Contact = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Get In Touch</h1>
                <p className={styles.description}>
                    Have questions, suggestions, or just want to say hello?
                    We&apos;d love to hear from you!
                </p>

                <div className={styles.contactInfo}>
                    <div className={styles.infoCard}>
                        <h3>📧 Email</h3>
                        <p>contact@lamablog.com</p>
                    </div>

                    <div className={styles.infoCard}>
                        <h3>🌐 Social Media</h3>
                        <p>Follow us on Facebook, Instagram, TikTok, and YouTube</p>
                    </div>

                    <div className={styles.infoCard}>
                        <h3>💼 Collaborate</h3>
                        <p>Interested in writing for us? Send us your pitch!</p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h2>Send us a message</h2>
                    <form className={styles.form}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className={styles.input}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className={styles.input}
                            required
                        />
                        <textarea
                            placeholder="Your Message"
                            rows="6"
                            className={styles.textarea}
                            required
                        ></textarea>
                        <button type="submit" className={styles.button}>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
