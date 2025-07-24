"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "@/styles/components/SignUp.module.scss";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

type Props = {
	session: any; // or `Session | null` if typed
};

export default function SignInPageClient({ session }: Props) {
	const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
	const params = useSearchParams();
	const signupSuccess = params.get("signupSuccess");
	const router = useRouter();

	useEffect(() => {
		// If session exists on load, update Zustand store
		if (session?.user) {
			setIsLoggedIn(true);
		}

		if (signupSuccess) {
			toast.success("Kayıt başarılı! Lütfen giriş yapın.");
		}
	}, [session, signupSuccess, setIsLoggedIn]);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Geçerli bir email girin").required("Email zorunludur"),
			password: Yup.string()
				.min(6, "Şifre en az 6 karakter olmalı")
				.matches(/[^A-Za-z0-9]/, "Şifre en az bir özel karakter içermeli")
				.required("Şifre zorunludur"),
		}),
		onSubmit: async (values) => {
			const res = await signIn("credentials", {
				redirect: false,
				email: values.email,
				password: values.password,
			});

			if (res?.error) {
				toast.error("Giriş başarısız");
			} else {
				toast.success("Başarıyla giriş yapıldı");
				formik.resetForm();
				setIsLoggedIn(true);
				if (signupSuccess) {
					window.location.href = "/profile";
				} else {
					window.location.href = "/menu";
				}
			}
		},
	});

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.title}>Giriş Yap</h1>
			<form onSubmit={formik.handleSubmit}>
				<div className={styles.formGroup}>
					<label htmlFor="email" className={styles.label}>
						Email
					</label>
					<input
						id="email"
						type="email"
						{...formik.getFieldProps("email")}
						className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.inputError : ""}`}
					/>
					{formik.touched.email && formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="password" className={styles.label}>
						Şifre
					</label>
					<input
						id="password"
						type="password"
						{...formik.getFieldProps("password")}
						className={`${styles.input} ${formik.touched.password && formik.errors.password ? styles.inputError : ""}`}
					/>
					{formik.touched.password && formik.errors.password && <div className={styles.error}>{formik.errors.password}</div>}
				</div>

				<button type="submit" className={styles.button}>
					Giriş Yap
				</button>
			</form>
			<ToastContainer position="top-left" autoClose={3000} />
		</div>
	);
}
