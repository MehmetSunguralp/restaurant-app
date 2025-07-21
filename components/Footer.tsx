import styles from "../styles/components/Footer.module.scss";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<p>&copy; {new Date().getFullYear()} Gourmet Haven. All rights reserved.</p>
		</footer>
	);
}
