import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

// TODO this is going to be change later on, this is just a test
export function ApiTestComponent() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Test a simple GET call
		apiFetch<any>("/materials")
			.then(result => {
				setData(result);
				setLoading(false);
			})
			.catch(err => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading</div>;
	if (error) return <div>Error: {error}</div>;
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
