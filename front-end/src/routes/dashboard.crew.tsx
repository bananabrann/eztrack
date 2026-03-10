import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import crew from "../assets/crew.png";
import { getSupabaseClient } from "../lib/supabase";
import { Calendar, Clock } from "lucide-react";

export default function Crew() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("Crew");
	const [currentTime, setCurrentTime] = useState(
		new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date()),
	);
	const currentDate = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date());
	const handleToolsClick = () => navigate("/toolsManagement");

	useEffect(() => {
		const loadFirstName = async () => {
			try {
				const supabase = getSupabaseClient();
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const fullName = session?.user?.user_metadata?.name;
				if (typeof fullName === "string" && fullName.trim()) {
					const [name] = fullName.trim().split(/\s+/);
					if (name) setFirstName(name);
				}
			} catch {
				// Keep fallback heading if session lookup fails.
			}
		};

		loadFirstName();
	}, []);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setCurrentTime(
				new Intl.DateTimeFormat("en-US", {
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit",
				}).format(new Date()),
			);
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<main className="min-h-screen bg-background px-2">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-center gap-6 py-10">

				<div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
					<div className="flex w-full max-w-xl flex-col items-center gap-6 mt-12">
						<div className="card w-96 bg-base-100 card-sm shadow-sm">
							<div className="card-body">
								<h2 className="card-title text-[--tertiary-color] font-bold text-xl md:text-xl lg:text-2xl">Welcome {firstName}</h2>
								<h4 className="text-lg">project information</h4>
								<h4 className="text-lg">tool information</h4>
								<p className="text-sm">
									<Calendar className="inline-block mr-2 text-[--tertiary-color]" />
									{currentDate}
								</p>
								<p className="text-sm">
									<Clock className="inline-block mr-2 text-[--tertiary-color]" />
									{currentTime}
								</p>

							</div>
						</div>
						<div className="card w-96 bg-base-100 card-xs shadow-sm">
							<div className="card-body">
								<h2 className="card-title">Xsmall Card</h2>
								<p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
								<div className="justify-end card-actions">
									<button className="btn btn-primary">Buy Now</button>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full max-w-md">
						<img src={crew} alt="Crew" className="w-full" />
					</div>
				</div>
			</div>
		</main>
	);
}
