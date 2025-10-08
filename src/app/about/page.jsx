import React from "react";
import styles from "./about.module.css";

const About = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>About Lama Blog</h1>
                <p className={styles.description}>
                    Welcome to Lama Blog, your destination for insightful articles on travel,
                    culture, food, fashion, coding, and lifestyle. We&apos;re passionate about
                    sharing stories that inspire and inform our readers.
                </p>
                <div className={styles.section}>
                    <h2>Our Mission</h2>
                    <p>
                        To create a community where writers and readers come together to share
                        experiences, knowledge, and perspectives on topics that matter.
                    </p>
                </div>
                <div className={styles.section}>
                    <h2>What We Cover</h2>
                    <ul className={styles.list}>
                        <li>✈️ Travel Adventures</li>
                        <li>🎭 Cultural Insights</li>
                        <li>🍳 Food & Recipes</li>
                        <li>👗 Fashion Trends</li>
                        <li>💻 Coding Tutorials</li>
                        <li>✨ Lifestyle Tips</li>
                    </ul>
                </div>
                <div className={styles.section}>
                    <h2>Join Our Community</h2>
                    <p>
                        Whether you&apos;re here to read, write, or connect with like-minded individuals,
                        we&apos;re glad you&apos;re here. Feel free to explore our blog posts, leave comments,
                        and even contribute your own stories!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
