import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";

const getData = async () => {
  try {
    // For server-side fetching, we need an absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/posts?page=1`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      return { posts: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts for featured:", error);
    return { posts: [] };
  }
};

const Featured = async () => {
  const { posts } = await getData();
  // Filter out posts with empty slugs or titles
  const validPosts = posts?.filter(post => post.slug && post.title) || [];
  const latestPost = validPosts.length > 0 ? validPosts[0] : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Welcome to Our Blog!</b> Discover amazing stories and creative ideas.
      </h1>
      {latestPost ? (
        <div className={styles.post}>
          {latestPost.img && (
            <div className={styles.imgContainer}>
              <Image src={latestPost.img} alt={latestPost.title} fill className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <span className={styles.category}>{latestPost.catSlug}</span>
            <Link href={`/posts/${latestPost.slug}`}>
              <h1 className={styles.postTitle}>{latestPost.title}</h1>
            </Link>
            <div
              className={styles.postDesc}
              dangerouslySetInnerHTML={{
                __html: latestPost.desc?.length > 200
                  ? latestPost.desc.substring(0, 200) + '...'
                  : latestPost.desc || ''
              }}
            />
            <Link href={`/posts/${latestPost.slug}`}>
              <button className={styles.button}>Read More</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.post}>
          <div className={styles.textContainer}>
            <h1 className={styles.postTitle}>No posts yet</h1>
            <p className={styles.postDesc}>
              Be the first to create a post! Click on &quot;Write&quot; to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
