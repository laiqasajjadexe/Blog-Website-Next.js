import CardList from "@/components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

const BlogPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const { cat } = params;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}` : 'All'} Blog</h1>
      <div className={styles.content}>
        <CardList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
};

export default BlogPage;
