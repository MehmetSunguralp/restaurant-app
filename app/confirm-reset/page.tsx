"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/components/SignUp.module.scss";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ResetPasswordPage() {
	const [error, setError] = useState("");
	const [emailToVerify, setEmailToVerify] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const email = localStorage.getItem("emailToVerify");
		if (!email) {
			setError("E-posta adresi bulunamadı.");
			toast.error(`E-Posta adresi bulunamadı.`);
			return;
		}
		setEmailToVerify(email);
		toast.success(`Doğrulama kodu onaylandı.`);
	}, []);

	const formik = useFormik({
		initialValues: {
			newPassword: "",
			confirm: "",
		},
		validationSchema: Yup.object({
			newPassword: Yup.string()
				.min(6, "Şifre en az 6 karakter olmalı.")
				.matches(/[!@#$%^&*(),.?":{}|<>]/, "Şifre en az bir özel karakter içermelidir.")
				.required("Şifre gereklidir."),
			confirm: Yup.string()
				.oneOf([Yup.ref("newPassword")], "Şifreler eşleşmiyor.")
				.required("Şifre tekrar gereklidir."),
		}),
		onSubmit: async (values) => {
			setError("");
			const email = localStorage.getItem("emailToVerify");
			if (!email) {
				setError("E-posta adresi bulunamadı.");
				return;
			}

			setLoading(true);
			try {
				const res = await fetch("/api/auth/confirm-reset", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, newPassword: values.newPassword }),
				});
				const data = await res.text();
				if (!res.ok) {
					setError(data || "Hata oluştu.");
				} else {
					localStorage.removeItem("emailToVerify");
					router.push("/signin?resetSuccess=true");
				}
			} catch {
				setError("Sunucu hatası.");
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Yeni Şifre Oluştur</h1>
			<form onSubmit={formik.handleSubmit}>
				<div className={styles.formGroup}>
					<label className={styles.label}>E-Posta</label>
					<input type="email" className={styles.input} value={emailToVerify || ""} disabled />
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Yeni Şifre</label>
					<input
						type="password"
						className={styles.input}
						name="newPassword"
						value={formik.values.newPassword}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.newPassword && formik.errors.newPassword && (
						<div className={`${styles.message} ${styles.fail}`}>{formik.errors.newPassword}</div>
					)}
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Şifre Tekrar</label>
					<input
						type="password"
						className={styles.input}
						name="confirm"
						value={formik.values.confirm}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.confirm && formik.errors.confirm && (
						<div className={`${styles.message} ${styles.fail}`}>{formik.errors.confirm}</div>
					)}
				</div>
				{error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
				<button type="submit" className={styles.button} disabled={loading}>
					{loading ? "Kaydediliyor..." : "Şifreyi Değiştir"}
				</button>
			</form>
			<ToastContainer position="top-left" autoClose={3000} />
		</div>
	);
}
