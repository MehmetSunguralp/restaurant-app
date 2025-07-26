"use client";
import { signOut } from "next-auth/react";
import styles from "@/styles/components/Profile.module.scss";
import { useState } from "react";

type Props = {
	name?: string;
	surname?: string;
	email?: string;
};

type Error = {
	error: string;
};
export default function Profile({ name, surname, email }: Props) {
	const [showDeleteAccountSecton, setShowDeleteAccountSecton] = useState<boolean>(false);
	const [passwordValue, setPasswordValue] = useState<string>("");
	const [error, setError] = useState<Error>({ error: "" });

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordValue(e.target.value);
	};

	const handleSubmitDelete = async () => {
		if (!passwordValue) {
			setError({ error: "Şifre gereklidir." });
			return;
		}

		setError({ error: "" });

		try {
			const res = await fetch("/api/auth/delete-account", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email, password: passwordValue }),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data);
			} else {
				signOut({ callbackUrl: "/signup" });
			}
		} catch (err) {
			setError({ error: "Sunucu hatası." });
		}
	};

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
			<button className={styles.buttonWarning} onClick={() => setShowDeleteAccountSecton(!showDeleteAccountSecton)}>
				Hesabı Sil
			</button>
			{showDeleteAccountSecton && (
				<div className={styles.formGroup}>
					<label htmlFor="password" className={styles.label}>
						Şifre
					</label>
					<input id="password" type="password" value={passwordValue} onChange={handlePasswordChange} className={styles.input} />
					{error.error && <div className={styles.error}>{error.error}</div>}
					<button className={styles.buttonWarning} onClick={handleSubmitDelete}>
						Silme İşlemini Onayla
					</button>
				</div>
			)}
		</div>
	);
}
