import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { Button } from "../../components/Button";
import type { Materials } from "../../types/materials";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
	material: Materials | null;
	projectId: string;
};

export default function RecordUsageModal({
	isOpen,
	onClose,
	onSubmit,
	material,
	projectId,
}: Props) {
	const [quantityUsed, setQuantityUsed] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Reset form when modal opens
	useEffect(() => {
		if (!isOpen) return;
		setQuantityUsed("");
		setError(null);
	}, [isOpen]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await apiFetch<{ data: Materials; message: string }>(
				`/materials/${material?.id}/usage`,
				{
					method: "POST",
					body: JSON.stringify({
						quantity_used: Number(quantityUsed),
						project_id: projectId,
					}),
				},
			);

			onSubmit();
			onClose();
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to record usage";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	if (!isOpen || !material) return null;

	return (
		<div className="modal modal-open modal-middle">
			<div className="modal-box max-w-2xl bg-base-100 shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-base-300">
					<h3 className="text-2xl font-bold text-primary">
						Record Usage — {material.name}
					</h3>
					<button
						type="button"
						className="btn btn-sm btn-circle btn-ghost"
						onClick={onClose}
					>
						✕
					</button>
				</div>

				{/* Body */}
				<div className="py-6">
					{error && (
						<div className="alert alert-error mb-6">
							<span>{error}</span>
						</div>
					)}

					<p className="mb-4 text-base-content">
						Available quantity:{" "}
						<span className="font-bold">{material.unit_qty}</span>
					</p>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control w-full">
							<label className="label" htmlFor="quantity-used">
								<span className="label-text text-base font-semibold">
									Quantity Used
								</span>
							</label>
							<input
								id="quantity-used"
								type="number"
								min={1}
								max={material.unit_qty}
								step={1}
								className="input input-bordered input-lg w-full"
								value={quantityUsed}
								onChange={e => setQuantityUsed(e.target.value)}
								required
							/>
						</div>

						{/* Actions */}
						<div className="modal-action pt-4 border-t border-base-300">
							{loading ? (
								<div className="flex justify-center w-full">
									<span className="loading loading-spinner loading-md"></span>
								</div>
							) : (
								<div className="flex justify-center gap-4 w-full">
									<Button label="Cancel" variant="orange" onClick={onClose} />
									<Button
										label="Confirm"
										variant="blue"
										type="submit"
										onClick={() => undefined}
									/>
								</div>
							)}
						</div>
					</form>
				</div>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</div>
	);
}
