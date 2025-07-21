import styles from "../styles/components/Footer.module.scss";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<p>&copy; {new Date().getFullYear()} Gourmet Haven. Tüm hakları saklıdır.</p>
		</footer>
	);
}
