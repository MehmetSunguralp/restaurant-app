import styles from "../../styles/components/About.module.scss";

export default function AboutPage() {
	return (
		<>
			<main className={styles.about}>
				<div className={styles.aboutContainer}>
					<h1>About Gourmet Haven</h1>
					<p>
						Gourmet Haven is a family-owned restaurant dedicated to serving delicious, fresh, and high-quality meals. Our chefs
						use only the finest ingredients to craft a menu that delights every palate.
					</p>
					<p>Whether you dine in or order online, we promise a memorable culinary experience. Thank you for choosing us!</p>
				</div>
			</main>
		</>
	);
}
