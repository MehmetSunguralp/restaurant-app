"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import styles from "@/styles/components/SignUp.module.scss";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/authStore";

type Props = {
	session: any; // or Session | null if you prefer typing
};

export default function SignupPageClient({ session }: Props) {
	const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			setIsLoggedIn(true);
			router.push("/menu");
		}
	}, [session, setIsLoggedIn]);

	const formik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("İsim zorunludur"),
			surname: Yup.string().required("Soyisim zorunludur"),
			email: Yup.string().email("Geçersiz e-posta").required("E-posta zorunludur"),
			password: Yup.string()
				.min(6, "Şifre en az 6 karakter olmalı")
				.matches(/[^A-Za-z0-9]/, "Şifre en az bir özel karakter içermeli")
				.required("Şifre zorunludur"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("password")], "Şifreler uyuşmuyor")
				.required("Şifre tekrarı zorunludur"),
		}),
		onSubmit: async (values) => {
			setMessage(null);
			setError(null);

			try {
				const res = await fetch("/api/auth/user", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: values.name.toLowerCase(),
						surname: values.surname.toLowerCase(),
						email: values.email.toLowerCase(),
						password: values.password,
					}),
				});
				localStorage.setItem("emailToVerify", values.email);

				const data = await res.json();
				if (!res.ok) {
					toast.error(data.error || "Bir hata oluştu.");
				} else {
					router.push("/verify");
					formik.resetForm();
				}
			} catch (err) {
				setError("Sunucu hatası");
			}
		},
	});

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Kayıt Ol</h1>
			<form onSubmit={formik.handleSubmit}>
				{["name", "surname", "email", "password", "confirmPassword"].map((field) => {
					const isPassword = field.toLowerCase().includes("password");
					const hasError =
						formik.touched[field as keyof typeof formik.touched] && !!formik.errors[field as keyof typeof formik.errors];

					return (
						<div key={field} className={styles.formGroup}>
							<label htmlFor={field} className={styles.label}>
								{field === "confirmPassword" ? "Şifre (Tekrar)" : field.charAt(0).toUpperCase() + field.slice(1)}
							</label>
							<input
								id={field}
								name={field}
								type={isPassword ? "password" : "text"}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values[field as keyof typeof formik.values]}
								className={`${styles.input} ${hasError ? styles.inputError : ""}`}
							/>
							{hasError && <div className={styles.error}>{formik.errors[field as keyof typeof formik.errors]}</div>}
						</div>
					);
				})}

				<button type="submit" className={styles.button}>
					Kayıt Ol
				</button>

				<div className={styles.forgotPassword} onClick={() => router.push("/signin")}>
					Zaten Üyeyim?
				</div>

				{message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}
				{error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
			</form>
			<ToastContainer position="top-left" autoClose={3000} />
		</div>
	);
}
