import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        </Link>
        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        </Link>
        <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        </Link>
        <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <Image src="/youtube.png" alt="youtube" width={24} height={24} />
        </Link>
      </div>
      <div className={styles.logo}>
        <Link href="/">lamablog</Link>
      </div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/" className={styles.link}>Homepage</Link>
        <Link href="/blog" className={styles.link}>Blog</Link>
        <Link href="/about" className={styles.link}>About</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
