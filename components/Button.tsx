import { ButtonHTMLAttributes } from "react";

import styles from "../styles/components/Button.module.scss";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
};

export default function Button({ children, ...props }: Props) {
	return (
		<button className={styles.button} {...props}>
			{children}
		</button>
	);
}
