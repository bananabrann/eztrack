import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const validateEmail = (value: string) => {
		const normalizedValue = value.trim();
		if (!normalizedValue) return "Email is required.";
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(normalizedValue)
			? ""
			: "Please enter a valid email address.";
	};

	const handleEmailBlur = () => {
		setEmailError(validateEmail(email));
	};

	const validatePassword = (value: string) => {
		if (!value) return "Password is required.";
		if (value.length < 8) return "Password must be at least 8 characters.";
		if (!/[A-Z]/.test(value)) {
			return "Password must include at least one uppercase letter.";
		}
		if (!/[a-z]/.test(value)) {
			return "Password must include at least one lowercase letter.";
		}
		if (!/[0-9]/.test(value)) return "Password must include at least one number.";
		return "";
	};

	const handlePasswordBlur = () => {
		setPasswordError(validatePassword(password));
	};

	// Validate form on submit and show errors

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form className="bg-white p-6 rounded-lg shadow-md w-85 flex flex-col gap-4">

				{/* EZTrack logo */}
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
					value={email}
					onChange={event => {
						setEmail(event.target.value);
						if (emailError) setEmailError(validateEmail(event.target.value));
					}}
					onBlur={handleEmailBlur}
					aria-invalid={Boolean(emailError)}
					aria-describedby={emailError ? "email-error" : undefined}
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{emailError ? (
					<p id="email-error" className="text-sm text-red-600">
						{emailError}
					</p>
				) : null}
				<label htmlFor="password">Password</label>

				{/* Password */}
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={event => {
							setPassword(event.target.value);
							if (passwordError) {
								setPasswordError(validatePassword(event.target.value));
							}
						}}
						onBlur={handlePasswordBlur}
						aria-invalid={Boolean(passwordError)}
						aria-describedby={passwordError ? "password-error" : undefined}
						className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
				{passwordError ? (
					<p id="password-error" className="text-sm text-red-600">
						{passwordError}
					</p>
				) : null}

				{/* Login Button goes here */}
				<p className="pt-4"> [LOGIN BUTTON]</p>
				
			</form>
		</div>
	);
}
