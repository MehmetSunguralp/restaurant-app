import type { Category } from "@/types/product";

import styles from "../styles/components/CategoryTabs.module.scss";
import Skeleton from "@/components/Skeleton";

type Props = {
	categories: Category[];
	selected: string | null;
	onSelect: (category: string | null) => void;
	loading?: boolean;
};

export default function CategoryTabs({ categories, selected, onSelect, loading }: Props) {
	return (
		<div className={styles.tabs}>
			{loading ? (
				Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} width="100px" height="36px" style={{ marginRight: 12, borderRadius: 8 }} />
				))
			) : (
				<>
					<button className={!selected ? styles.active : ""} onClick={() => onSelect(null)}>
						Tüm Kategoriler
					</button>
					{categories.map((cat) => (
						<button key={cat.id} className={selected === cat.name ? styles.active : ""} onClick={() => onSelect(cat.name)}>
							{cat.name}
						</button>
					))}
				</>
			)}
		</div>
	);
}
