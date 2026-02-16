import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form className="bg-white p-6 rounded-lg shadow-md w-85 flex flex-col gap-4">
				<img
					src="/eztrack-logo.png"
					alt="eztrack logo"
					className="max-w-sm pt-6 pb-4"
				/>

				{/* Email */}
				<label htmlFor="email">User Email</label>
				<input
					id="email"
					type="email"
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<label htmlFor="password">Password</label>

				{/* Password */}
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>

					<button
						type="button"
						onClick={() => setShowPassword(s => !s)}
						aria-pressed={showPassword}
						aria-label={showPassword ? "Hide password" : "Show password"}
						className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Login Button goes here */}
				<p className="pt-4"> [LOGIN BUTTON]</p>
			</form>
		</div>
	);
}
