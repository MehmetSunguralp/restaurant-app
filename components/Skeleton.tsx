import React from "react";

export default function Skeleton({
	width = "100%",
	height = 20,
	style = {},
}: {
	width?: string | number;
	height?: string | number;
	style?: React.CSSProperties;
}) {
	return (
		<div
			style={{
				background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
				backgroundSize: "200% 100%",
				animation: "skeleton-loading 1.2s infinite linear",
				borderRadius: 8,
				width,
				height,
				margin: "0.5rem 0",
				...style,
			}}
		/>
	);
}
