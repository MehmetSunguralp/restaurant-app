"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/components/SignUp.module.scss";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const res = await fetch("/api/request-reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.text();

			if (!res.ok) {
				setError(data || "Bir hata oluştu.");
			} else {
				localStorage.setItem("emailToVerify", email);
				router.push("/verify?verify=password_reset_code");
			}
		} catch {
			setError("Sunucu hatası.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Şifremi Unuttum</h1>
			<form onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label className={styles.label}>E-Posta</label>
					<input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				{error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
				{success && <div className={`${styles.message} ${styles.success}`}>{success}</div>}
				<button type="submit" className={styles.button} disabled={loading}>
					{loading ? "Gönderiliyor..." : "Şifre Sıfırlama Maili Gönder"}
				</button>
			</form>
		</div>
	);
}
