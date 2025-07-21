import Link from "next/link";

import styles from "@/styles/components/Home.module.scss";

export default function HomePage() {
	return (
		<>
			<main className={styles.home}>
				<section className={styles.hero}>
					<h1>Restoranımıza Hoşgeldiniz!</h1>
					<p>Özenle hazırlanan mutfağımızdan, kapınıza kadar teslim ediyoruz.</p>
					<Link href="/menu" className={styles.menuBtn}>
						Menüye Git
					</Link>
				</section>
			</main>
		</>
	);
}
