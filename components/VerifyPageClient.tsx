"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import styles from "@/styles/components/SignUp.module.scss";

export default function VerifyPageClient() {
	const [code, setCode] = useState(Array(6).fill(""));
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const email = localStorage.getItem("emailToVerify");
		if (!email) {
			setError("E-posta adresi bulunamadı.");
			return;
		}
		toast.success(`Doğrulama kodu ${email} adresine gönderildi.`);
	}, []);

	const handleChange = (value: string, index: number) => {
		if (!/^\d?$/.test(value)) return;

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);

		// Otomatik bir sonrakine geç
		if (value && index < 5) {
			const next = document.getElementById(`code-${index + 1}`);
			next?.focus();
		}
	};

	const handleSubmit = async () => {
		const email = localStorage.getItem("emailToVerify");
		if (!email) {
			setError("E-posta adresi bulunamadı.");
			return;
		}

		setLoading(true);
		setError(null);

		const codeStr = code.join("");
		try {
			const res = await fetch("/api/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code: codeStr }),
			});
			const data = await res.text();

			if (!res.ok) {
				setError(data || "Doğrulama başarısız oldu.");
			} else {
				localStorage.removeItem("emailToVerify");
				router.push("/signin?signupSuccess=true");
			}
		} catch (err) {
			setError("Sunucu hatası.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>E-Posta Doğrulama</h1>
			<p className={styles.description}>Lütfen e-posta adresinize gönderilen 6 haneli kodu girin.</p>

			<div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0" }}>
				{code.map((digit, index) => (
					<input
						key={index}
						id={`code-${index}`}
						type="text"
						maxLength={1}
						value={digit}
						onChange={(e) => handleChange(e.target.value, index)}
						className={styles.input}
						style={{
							width: 40,
							height: 48,
							textAlign: "center",
							borderRadius: 8,
							fontSize: 20,
							border: "1px solid #ccc",
						}}
					/>
				))}
			</div>

			{error && <div className={styles.fail}>{error}</div>}

			<button onClick={handleSubmit} className={styles.button} disabled={loading || code.includes("")}>
				{loading ? "Kontrol ediliyor..." : "Doğrula"}
			</button>
			<ToastContainer position="top-left" autoClose={3000} />
		</div>
	);
}
