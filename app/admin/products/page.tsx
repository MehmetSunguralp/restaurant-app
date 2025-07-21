"use client";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

import type { Product, Category } from "@/types/product";

import { FaTimes } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { RiSaveLine } from "react-icons/ri";

import "react-toastify/dist/ReactToastify.css";

export default function AdminProductsPage() {
	const [products, setProducts] = useState<(Product | (Partial<Product> & { isNew: boolean }))[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [editing, setEditing] = useState<Record<string, Partial<Product> & { isNew?: boolean }>>({});
	const [loading, setLoading] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [newProductCount, setNewProductCount] = useState(0);

	useEffect(() => {
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
	}, []);

	useEffect(() => {
		let url = `/api/products?take=100`;
		if (category) url += `&category=${category}`;
		fetch(url)
			.then((res) => res.json())
			.then((data) => setProducts(data.products));
	}, [category]);

	const filtered = products.filter((p) => typeof p.name === "string" && p.name.toLowerCase().includes(search.toLowerCase()));

	const handleEdit = (id: string, field: string, value: any) => {
		setEditing((prev) => {
			const prevRow = prev[id] ?? products.find((p) => p.id === id) ?? {};
			return { ...prev, [id]: { ...prevRow, [field]: value } };
		});
	};

	const handleAdd = () => {
		const key = `new-${newProductCount}`;
		setNewProductCount((c) => c + 1);
		const empty: Omit<Product, "id"> & { isNew: boolean } = {
			name: "",
			description: "",
			categoryId: categories[0]?.id || "",
			availability: true,
			imageUrl: "",
			price: 0,
			category: categories[0] || { id: "", name: "" },
			isNew: true,
		};
		setProducts((prev) => [{ ...empty, id: key }, ...prev]);
		setEditing((prev) => ({ ...prev, [key]: empty }));
	};

	const handleSave = async (id: string) => {
		setLoading(true);
		const product = editing[id];
		if (
			!product.name ||
			!product.description ||
			!product.categoryId ||
			!product.imageUrl ||
			typeof product.price !== "number" ||
			isNaN(product.price)
		) {
			toast.error("All fields are required.");
			setLoading(false);
			return;
		}
		let res;
		if (product.isNew) {
			const { isNew, id, ...newProduct } = product; // remove id
			res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProduct),
			});
		} else {
			res = await fetch("/api/products", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(product),
			});
		}
		if (res.ok) {
			setEditing((prev) => {
				const newEditing = { ...prev };
				delete newEditing[id];
				return newEditing;
			});
			let url = `/api/products?take=100`;
			if (category) url += `&category=${category}`;
			fetch(url)
				.then((res) => res.json())
				.then((data) => setProducts(data.products));
			toast.success("Product saved.");
		} else {
			toast.error("Failed to save product.");
		}
		setLoading(false);
	};

	const handleDelete = async (id: string) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete this product?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
		});
		if (!result.isConfirmed) return;
		setLoading(true);
		await fetch(`/api/products?id=${id}`, { method: "DELETE" });
		setProducts((prev) => prev.filter((p) => p.id !== id));
		setLoading(false);
	};

	const handleAddCategory = async () => {
		if (!newCategory.trim()) return;
		const res = await fetch("/api/categories", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newCategory }),
		});
		if (res.ok) {
			setNewCategory("");
			fetch("/api/categories")
				.then((res) => res.json())
				.then((data) => {
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
			toast.success("Category added.");
		} else {
			toast.error("Failed to add category.");
		}
	};

	const handleDeleteCategory = async (catId: string) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete this category?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
		});
		if (!result.isConfirmed) return;
		setLoading(true);
		await fetch(`/api/categories?id=${catId}`, { method: "DELETE" });
		fetch("/api/categories")
			.then((res) => res.json())
			.then((data) => {
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
		setLoading(false);
		toast.success("Category deleted.");
	};

	return (
		<div
			style={{
				padding: 32,
				minHeight: "100vh",
				fontFamily: "Inter, sans-serif",
				background: "rgba(255,255,255,0.92)", // lighter overlay for admin
				borderRadius: 16,
				boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
				margin: 32,
				position: "relative",
				zIndex: 2, // ensure above global overlay
			}}
		>
			<style>{`
				.modern-table-row:hover {
					background: #e6e6f0 !important;
				}
			`}</style>
			<h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Admin: Products</h1>
			<div
				style={{
					marginBottom: 32,
					border: "1px solid #eee",
					padding: 16,
					borderRadius: 12,
					background: "#fafafa",
					fontFamily: "Inter, sans-serif",
				}}
			>
				<h2 style={{ fontWeight: 600, fontSize: 20 }}>Kategoriler</h2>
				<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
					<input
						type="text"
						placeholder="Yeni Kategori Adı"
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
						style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", fontFamily: "Inter, sans-serif", fontSize: 16 }}
					/>
					<Button onClick={handleAddCategory} style={{ fontFamily: "Inter, sans-serif", fontSize: 16 }}>
						Kategori Ekle
					</Button>
				</div>
				<div style={{ marginTop: 8 }}>
					{categories.map((cat) => (
						<span
							key={cat.id}
							style={{
								marginRight: 12,
								background: "#eee",
								padding: "2px 8px",
								borderRadius: 4,
								fontFamily: "Inter, sans-serif",
								fontSize: 15,
								position: "relative",
								display: "inline-block",
							}}
							className="category-tag"
						>
							{cat.name}
							<span
								style={{
									display: "none",
									position: "absolute",
									top: "0",
									right: -8,
									transform: "translateY(-50%)",
									background: "#e63946",
									color: "#fff",
									borderRadius: "50%",
									width: 18,
									height: 18,
									alignItems: "center",
									justifyContent: "center",
									fontSize: 12,
									cursor: "pointer",
									zIndex: 2,
								}}
								className="category-delete"
								onClick={() => handleDeleteCategory(cat.id)}
							>
								<FaTimes />
							</span>
						</span>
					))}
					<style>{`
						.category-tag:hover .category-delete {
							display: flex !important;
						}
					`}</style>
				</div>
			</div>
			<div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
				<Button onClick={handleAdd} style={{ fontFamily: "Inter, sans-serif", fontSize: 16, padding: "8px 20px" }}>
					Ürün Ekle
				</Button>
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", fontFamily: "Inter, sans-serif", fontSize: 16 }}
				/>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", fontFamily: "Inter, sans-serif", fontSize: 16 }}
				>
					<option value="">Tüm Kategoriler</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.name} style={{ fontFamily: "Inter, sans-serif" }}>
							{cat.name}
						</option>
					))}
				</select>
			</div>
			<div style={{ overflowX: "auto", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
				<table
					style={{
						width: "100%",
						background: "#fff",
						borderCollapse: "separate",
						borderSpacing: 0,
						fontFamily: "Inter, sans-serif",
						borderRadius: 16,
						overflow: "hidden",
					}}
				>
					<thead>
						<tr style={{ background: "#222", color: "#fff", fontWeight: 600 }}>
							<th style={{ padding: 14, fontSize: 16 }}>Ürün</th>
							<th style={{ padding: 14, fontSize: 16 }}>Açıklama</th>
							<th style={{ padding: 14, fontSize: 16 }}>Kategori</th>
							<th style={{ padding: 14, fontSize: 16 }}>Stok</th>
							<th style={{ padding: 14, fontSize: 16 }}>Resim Linki</th>
							<th style={{ padding: 14, fontSize: 16 }}>Fiyat</th>
							<th style={{ padding: 14, fontSize: 16 }}>Kaydet/Sil</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((p, idx) => {
							const key = (p as Product).id;
							const row = editing[key] ?? p;
							if (!row) return null;
							return (
								<tr
									key={key}
									className="modern-table-row"
									style={{
										background: idx % 2 === 0 ? "#f7f7fa" : "#fff",
										transition: "background 0.2s",
										borderBottom: "1px solid #eee",
									}}
								>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<input
											value={row.name}
											onChange={(e) => handleEdit(key, "name", e.target.value)}
											style={{
												width: "100%",
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
											}}
										/>
									</td>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<input
											value={row.description}
											onChange={(e) => handleEdit(key, "description", e.target.value)}
											style={{
												width: "100%",
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
											}}
										/>
									</td>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<select
											value={row.categoryId}
											onChange={(e) => handleEdit(key, "categoryId", e.target.value)}
											style={{
												width: "100%",
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
											}}
										>
											{categories.map((cat) => (
												<option key={cat.id} value={cat.id} style={{ fontFamily: "Inter, sans-serif" }}>
													{cat.name}
												</option>
											))}
										</select>
									</td>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<select
											value={row.availability ? "yes" : "no"}
											onChange={(e) => handleEdit(key, "availability", e.target.value === "yes")}
											style={{
												width: "100%",
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
											}}
										>
											<option value="yes">Var</option>
											<option value="no">Yok</option>
										</select>
									</td>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<input
											value={row.imageUrl}
											onChange={(e) => handleEdit(key, "imageUrl", e.target.value)}
											style={{
												width: "100%",
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
											}}
										/>
									</td>
									<td style={{ padding: 10, verticalAlign: "middle" }}>
										<input
											type="number"
											value={row.price}
											onChange={(e) => handleEdit(key, "price", parseFloat(e.target.value))}
											style={{
												marginInline: "auto",
												width: "100%",
												maxWidth: 80,
												padding: 8,
												borderRadius: 6,
												border: "1px solid #ccc",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
												boxSizing: "border-box",
												textAlign: "right",
											}}
										/>
									</td>
									<td
										style={{
											padding: 10,
											display: "flex",
											gap: 8,
											alignItems: "center",
											justifyContent: "center",
											minWidth: 120,
											verticalAlign: "middle",
										}}
									>
										<Button
											onClick={() => handleSave(key)}
											disabled={loading || !editing[key]}
											style={{
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
												padding: "8px 16px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												opacity: loading || !editing[key] ? 0.5 : 1,
												cursor: loading || !editing[key] ? "not-allowed" : "pointer",
											}}
										>
											<RiSaveLine size={20} />
										</Button>

										<Button
											onClick={() => handleDelete(key)}
											disabled={loading}
											style={{
												background: "#e63946",
												fontFamily: "Inter, sans-serif",
												fontSize: 15,
												padding: "8px 16px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<RiDeleteBin7Line size={20} />
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<ToastContainer position="top-right" autoClose={2000} />
		</div>
	);
}
