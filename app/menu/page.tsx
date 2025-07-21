"use client";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import type { Category } from "@/types/product";

import styles from "../../styles/components/Menu.module.scss";

export default function MenuPage() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selected, setSelected] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/products?take=100" + (selected ? `&category=${selected}` : ""))
			.then((res) => res.json())
			.then((data) => setProducts(data.products));
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
			});
	}, [selected]);

	return (
		<>
			<Navbar />
			<main className={styles.menu}>
				<h1>Menu</h1>
				<CategoryTabs categories={categories} selected={selected} onSelect={setSelected} />
				<div className={styles.products}>
					{products.map((product: any) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</main>
			<Footer />
		</>
	);
}
