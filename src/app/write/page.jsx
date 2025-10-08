"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Import ReactQuill dynamically with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.bubble.css";

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const generateUniqueSlug = (title) => {
    const baseSlug = slugify(title);
    // Add a random short string to ensure uniqueness
    const randomId = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomId}`;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title.trim()) {
      alert("Please enter a title for your post");
      return;
    }

    if (!value.trim()) {
      alert("Please write some content for your post");
      return;
    }

    try {
      const uniqueSlug = generateUniqueSlug(title);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc: value,
          img: "", // No image upload - Firebase removed
          slug: uniqueSlug,
          catSlug: catSlug || "style",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Post created successfully:", data);
        // Redirect to the newly created post
        router.push(`/posts/${data.slug}`);
      } else {
        console.error("Error creating post:", data);
        if (data.message.includes("slug already exists")) {
          alert("Failed to create post. Please try again.");
        } else {
          alert(data.message || "Failed to create post");
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select className={styles.select} onChange={(e) => setCatSlug(e.target.value)}>
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
