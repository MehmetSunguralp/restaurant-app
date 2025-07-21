import type { Category } from "@/types/product";

import styles from "../styles/components/CategoryTabs.module.scss";

type Props = {
	categories: Category[];
	selected: string | null;
	onSelect: (category: string | null) => void;
};

export default function CategoryTabs({ categories, selected, onSelect }: Props) {
	return (
		<div className={styles.tabs}>
			<button className={!selected ? styles.active : ""} onClick={() => onSelect(null)}>
				All
			</button>
			{categories.map((cat) => (
				<button key={cat.id} className={selected === cat.name ? styles.active : ""} onClick={() => onSelect(cat.name)}>
					{cat.name}
				</button>
			))}
		</div>
	);
}
