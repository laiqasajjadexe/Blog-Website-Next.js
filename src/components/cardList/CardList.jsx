import React from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Image from "next/image";
import Card from "../card/Card";

const getData = async (page, cat) => {
  // For server-side fetching, we need an absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = cat
    ? `${baseUrl}/api/posts?page=${page}&cat=${cat}`
    : `${baseUrl}/api/posts?page=${page}`;

  try {
    const res = await fetch(url, {
      cache: "no-store"
    });

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      return { posts: [], count: 0 };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], count: 0 };
  }
};

const CardList = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  const POST_PER_PAGE = 2;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  // Filter out posts with empty slugs or titles
  const validPosts = posts?.filter(post => post.slug && post.title) || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {validPosts.length > 0 ? (
          validPosts.map((item) => (
            <Card key={item.id} item={item} />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--softTextColor)', padding: '40px' }}>
            No posts found. {cat && `Try a different category or `}
            <a href="/write" style={{ color: 'var(--accent)' }}>write your first post</a>!
          </p>
        )}
      </div>
      {validPosts.length > 0 && (
        <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
      )}
    </div>
  );
};

export default CardList;
