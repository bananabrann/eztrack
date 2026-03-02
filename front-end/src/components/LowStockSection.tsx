import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import type { Material } from "../types/materials";

export function LowStockSection() {
	const [items, setItems] = useState<Material[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function fetchLowStock() {
		setLoading(true);
		setError(null);
		try {
			const response = await apiFetch<{
				data: Material[];
				message: string;
			}>("/materials/low-stock");

			setItems(response.data);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Something went wrong.");
			}
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchLowStock();
	}, []);

	if (loading) {
		return (
			<div className="flex w-full max-w-md flex-col gap-4">
				<div className="skeleton h-6 w-40"></div>
				<div className="skeleton h-12 w-full"></div>
				<div className="skeleton h-12 w-full"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div role="alert" className="alert alert-error w-full max-w-md">
				<span>{error}</span>
				<button
					type="button"
					className="btn btn-sm btn-ghost"
					onClick={fetchLowStock}
				>
					Retry
				</button>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="alert w-full max-w-md">
				<span className="text-sm">No low stock items.</span>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md">
			<h2 className="text-lg font-semibold text-primary mb-2">Low Stock!</h2>
			<div className="flex flex-col gap-2">
				{items.map(item => (
					<div
						key={item.id}
						className="card bg-base-100 border border-outline shadow-sm"
					>
						<div className="card-body p-4">
							<p className="font-semibold text-primary">{item.name}</p>
							<p className="text-sm">Quantity: {item.unit_qty}</p>
							<p className="text-sm">Threshold: {item.low_stock_threshold}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
