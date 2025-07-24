"use client";
import { signOut } from "next-auth/react";
import styles from "@/styles/components/Profile.module.scss";

type Props = {
	name?: string;
	surname?: string;
	email?: string;
};

export default function Profile({ name, surname, email }: Props) {
	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Profiliniz</h1>

			<div className={styles.infoGroup}>
				<div className={styles.label}>İsim:</div>
				<div className={styles.value}>{name}</div>
			</div>

			<div className={styles.infoGroup}>
				<div className={styles.label}>Soyisim:</div>
				<div className={styles.value}>{surname}</div>
			</div>

			<div className={styles.infoGroup}>
				<div className={styles.label}>Email:</div>
				<div className={styles.value}>{email}</div>
			</div>

			<button className={styles.button} onClick={() => signOut({ callbackUrl: "/signin" })}>
				Çıkış Yap
			</button>
		</div>
	);
}
