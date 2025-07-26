"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/components/SignUp.module.scss";
import cardInputStyles from "@/styles/components/CardInput.module.scss";
import { useCartStore } from "@/store/cart";

export default function PaymentPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const items = useCartStore((state) => state.items);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const formik = useFormik({
		initialValues: {
			cardHolderName: "",
			cardNumber: "",
			expireMonth: "",
			expireYear: "",
			cvc: "",
		},
		validationSchema: Yup.object({
			cardHolderName: Yup.string().required("Kart sahibi adı zorunludur"),
			cardNumber: Yup.string()
				.matches(/^(\d{4} \d{4} \d{4} \d{4})$/, "Geçersiz kart numarası")
				.required("Kart numarası zorunludur"),
			expireMonth: Yup.string()
				.matches(/^(0[1-9]|1[0-2])$/, "Ay 01 ile 12 arasında olmalı")
				.required("Ay zorunludur"),
			expireYear: Yup.string()
				.matches(/^20[2-9][0-9]$/, "Geçerli bir yıl giriniz")
				.required("Yıl zorunludur"),
			cvc: Yup.string()
				.matches(/^\d{3,4}$/, "Geçersiz CVC")
				.required("CVC zorunludur"),
		}),
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const res = await fetch("http://localhost:4000/api/payment", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(values),
				});

				const data = await res.json();
				if (data.result.status === "success") {
					alert("Ödeme başarılı!");
					//router.push("/tesekkurler");
				} else {
					alert("Ödeme başarısız: " + data.error?.errorMessage || "Hata oluştu");
				}
			} catch (error) {
				alert("Beklenmedik bir hata oluştu.");
			}
			setLoading(false);
		},
	});

	function getCardType(cardNumber: string) {
		const number = cardNumber.replace(/\s+/g, "");

		if (/^4/.test(number)) return "visa";
		if (/^5[1-5]/.test(number)) return "mastercard";
		if (/^3[47]/.test(number)) return "amex";
		if (/^6(?:011|5)/.test(number)) return "discover";
		if (/^35(2[89]|[3-8][0-9])/.test(number)) return "jcb";
		if (/^9792/.test(number)) return "troy";

		return "unknown";
	}

	return (
		<main className={styles.main}>
			<div className={styles.formContainer}>
				<h2>Ödeme Bilgileri</h2>
				<form onSubmit={formik.handleSubmit}>
					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="cardHolderName">
							Kart Sahibi Adı
						</label>
						<input
							id="cardHolderName"
							name="cardHolderName"
							type="text"
							className={styles.input}
							onChange={formik.handleChange}
							value={formik.values.cardHolderName.toLocaleUpperCase("TR")}
						/>
						{formik.touched.cardHolderName && formik.errors.cardHolderName && (
							<div className={styles.error}>{formik.errors.cardHolderName}</div>
						)}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="cardNumber">
							Kart Numarası
						</label>
						<CardInput
							getCardType={getCardType}
							handleChange={(formattedCardNumber) => formik.setFieldValue("cardNumber", formattedCardNumber)}
							value={formik.values.cardNumber}
						/>
						{formik.touched.cardNumber && formik.errors.cardNumber && (
							<div className={styles.error}>{formik.errors.cardNumber}</div>
						)}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="expireMonth">
							Ay
						</label>
						<select
							id="expireMonth"
							name="expireMonth"
							className={styles.input}
							onChange={formik.handleChange}
							value={formik.values.expireMonth}
						>
							<option value="">Ay Seçin</option>
							{Array.from({ length: 12 }, (_, i) => {
								const month = String(i + 1).padStart(2, "0");
								return (
									<option key={month} value={month}>
										{month}
									</option>
								);
							})}
						</select>
						{formik.touched.expireMonth && formik.errors.expireMonth && (
							<div className={styles.error}>{formik.errors.expireMonth}</div>
						)}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="expireYear">
							Yıl
						</label>
						<select
							id="expireYear"
							name="expireYear"
							className={styles.input}
							onChange={formik.handleChange}
							value={formik.values.expireYear}
						>
							<option value="">Yıl Seçin</option>
							{Array.from({ length: 12 }, (_, i) => {
								const year = new Date().getFullYear() + i;
								return (
									<option key={year} value={year}>
										{year}
									</option>
								);
							})}
						</select>
						{formik.touched.expireYear && formik.errors.expireYear && (
							<div className={styles.error}>{formik.errors.expireYear}</div>
						)}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="cvc">
							CVC
						</label>
						<input
							id="cvc"
							name="cvc"
							type="text"
							inputMode="numeric"
							pattern="\d*"
							maxLength={4}
							className={styles.input}
							onChange={(e) => {
								const digitsOnly = e.target.value.replace(/\D/g, "");
								formik.setFieldValue("cvc", digitsOnly);
							}}
							value={formik.values.cvc}
						/>
						{formik.touched.cvc && formik.errors.cvc && <div className={styles.error}>{formik.errors.cvc}</div>}
						<h3>Toplam Ödenecek Tutar: &#x20BA;{total.toFixed(2)} </h3>
						<button type="submit" className={styles.button} disabled={loading}>
							{loading ? "Gönderiliyor..." : "Ödemeyi Tamamla"}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
function CardInput({
	getCardType,
	handleChange,
	value,
}: {
	getCardType: (cardNumber: string) => string;
	handleChange: (cardNumber: string) => void;
	value: string;
}) {
	// const [cardNumber, setCardNumber] = useState("");

	const formatCardNumber = (value: string) => {
		const cleaned = value.replace(/\D+/g, "").slice(0, 16); // Allow only digits, max 16
		const groups = cleaned.match(/.{1,4}/g);
		return groups ? groups.join(" ") : "";
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatCardNumber(e.target.value);
		handleChange(formatted);
	};

	const cardType = getCardType(value.replace(/\s+/g, ""));

	return (
		<div className={cardInputStyles.cardInputContainer}>
			<input
				name="cardNumber"
				type="text"
				value={value}
				onChange={handleInputChange}
				className={cardInputStyles.cardInput}
				inputMode="numeric"
			/>
			{cardType !== "unknown" && (
				<img src={`/assets/card-logos/${cardType}.svg`} alt={cardType} className={cardInputStyles.cardLogo} />
			)}
		</div>
	);
}
