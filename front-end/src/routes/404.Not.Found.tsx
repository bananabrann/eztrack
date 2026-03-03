import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Catchall() {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		if (countdown === 0) {
			navigate("/", { replace: true });
			return;
		}

		const timer = setTimeout(() => {
			setCountdown(c => c - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countdown, navigate]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
			<h1 className="text-6xl font-bold text-primary mb-4">OOPS!</h1>
			<p className="text-2xl mb-8">Page not found.</p>
			<p className="text-gray-600 text-lg">
				Redirecting to home in{" "}
				<span className="font-bold text-black">{countdown}</span>{" "}
				{countdown === 1 ? "second" : "seconds"}...
			</p>
		</main>
	);
}
