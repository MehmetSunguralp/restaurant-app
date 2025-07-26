"use client";
import { useEffect, useState } from "react";

import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import type { Category } from "@/types/product";
import Skeleton from "@/components/Skeleton";

import styles from "../../styles/components/Menu.module.scss";
import { useAuthStore } from "@/store/authStore";

export default function MenuPage() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const role = useAuthStore((state) => state.role);
	console.log("Product Card Role", role);

	useEffect(() => {
		setLoading(true);
		fetch("/api/products?take=100" + (selected ? `&category=${selected}` : ""))
			.then((res) => res.json())
			.then((data) => {
				setProducts(data.products);
				setLoading(false);
			});
		setLoadingCategories(true);
		fetch("/api/categories")
			.then((res) => res.json())
			.then((data) => {
				// Deduplicate by name
				const unique = [];
				const seen = new Set();
				for (const cat of data.categories) {
					if (!seen.has(cat.name)) {
						unique.push(cat);
						seen.add(cat.name);
					}
				}
				setCategories(unique);
				setLoadingCategories(false);
			});
	}, [selected]);

	return (
		<>
			<main className={styles.menu}>
				<div
					style={{
						background: "rgba(255,255,255,0.5)",
						borderRadius: 16,
						boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
						padding: 32,
						margin: "0 auto",
						maxWidth: 1000,
					}}
				>
					<h1>Menü</h1>
					<CategoryTabs categories={categories} selected={selected} onSelect={setSelected} loading={loadingCategories} />
					<div className={styles.products}>
						{loading
							? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={250} style={{ marginBottom: 16 }} />)
							: products.map((product: any) => <ProductCard key={product.id} product={product} role={role}/>)}
					</div>
				</div>
			</main>
		</>
	);
}
