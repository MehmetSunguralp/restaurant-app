import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

import styles from "@/styles/components/Home.module.scss";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className={styles.home}>
        <section className={styles.hero}>
          <h1>Welcome to Gourmet Haven</h1>
          <p>Delicious food, delivered fresh to your door.</p>
          <Link href="/menu" className={styles.menuBtn}>
            View Menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
