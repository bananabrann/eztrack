import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/Button";

export default function Signup() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [roleError, setRoleError] = useState("");
	const [authError, setAuthError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	const validateName = (value: string) => {
		const normalizedValue = value.trim();
		if (!normalizedValue) return "Name is required.";
		if (normalizedValue.length < 2)
			return "Name must be at least 2 characters.";
		return "";
	};

	const handleNameBlur = () => {
		setNameError(validateName(name));
	};

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
		if (!/[0-9]/.test(value))
			return "Password must include at least one number.";
		return "";
	};

	const handlePasswordBlur = () => {
		setPasswordError(validatePassword(password));
	};

	const validateConfirmPassword = (value: string) => {
		if (!value) return "Please confirm your password.";
		if (value !== password) return "Passwords do not match.";
		return "";
	};

	const handleConfirmPasswordBlur = () => {
		setConfirmPasswordError(validateConfirmPassword(confirmPassword));
	};

	const validateRole = (value: string) => {
		if (!value) return "Please select a role.";
		return "";
	};

	const handleRoleBlur = () => {
		setRoleError(validateRole(role));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nameErr = validateName(name);
		const emailErr = validateEmail(email);
		const passwordErr = validatePassword(password);
		const confirmPasswordErr = validateConfirmPassword(confirmPassword);
		const roleErr = validateRole(role);

		setNameError(nameErr);
		setEmailError(emailErr);
		setPasswordError(passwordErr);
		setConfirmPasswordError(confirmPasswordErr);
		setRoleError(roleErr);
		setAuthError("");

		if (nameErr || emailErr || passwordErr || confirmPasswordErr || roleErr)
			return;

		setIsSubmitting(true);

		try {
			const { data, error } = await signUp(email, password, name, role);

			if (error) {
				setAuthError(error.message);
				return;
			}

			// Navigate to login or show success message
			navigate("/login");
		} catch (err) {
			setAuthError(
				err instanceof Error
					? err.message
					: "Something went wrong while signing up, please try again",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-lg shadow-md w-85 flex flex-col gap-4"
			>
				{/* EZTrack logo */}
				<img
					src="/eztrack-logo.png"
					alt="eztrack logo"
					className="max-w-sm pt-6 pb-4"
				/>

				{/* Name */}
				<label htmlFor="name">Name</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={event => {
						setName(event.target.value);
						if (nameError) setNameError(validateName(event.target.value));
					}}
					onBlur={handleNameBlur}
					aria-invalid={nameError ? "true" : undefined}
					aria-describedby={nameError ? "name-error" : undefined}
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{nameError ? (
					<p id="name-error" className="text-sm text-red-600">
						{nameError}
					</p>
				) : null}

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
					aria-invalid={emailError ? "true" : undefined}
					aria-describedby={emailError ? "email-error" : undefined}
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{emailError ? (
					<p id="email-error" className="text-sm text-red-600">
						{emailError}
					</p>
				) : null}

				{/* Role */}
				<label htmlFor="role">Role</label>
				<select
					id="role"
					value={role}
					onChange={event => {
						setRole(event.target.value);
						if (roleError) setRoleError(validateRole(event.target.value));
					}}
					onBlur={handleRoleBlur}
					aria-invalid={!!roleError}
					aria-describedby={roleError ? "role-error" : undefined}
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select a role</option>
					<option value="FOREMAN">Foreman</option>
					<option value="CREW">Crew</option>
				</select>
				{roleError ? (
					<p id="role-error" className="text-sm text-red-600">
						{roleError}
					</p>
				) : null}

				{/* Password */}
				<label htmlFor="password">Password</label>
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
						aria-invalid={passwordError ? "true" : undefined}
						aria-describedby={passwordError ? "password-error" : undefined}
						className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(s => !s)}
						aria-pressed={showPassword ? "true" : "false"}
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

				{/* Confirm Password */}
				<label htmlFor="confirmPassword">Confirm Password</label>
				<div className="relative">
					<input
						id="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={event => {
							setConfirmPassword(event.target.value);
							if (confirmPasswordError) {
								setConfirmPasswordError(
									validateConfirmPassword(event.target.value),
								);
							}
						}}
						onBlur={handleConfirmPasswordBlur}
						aria-invalid={confirmPasswordError ? "true" : undefined}
						aria-describedby={
							confirmPasswordError ? "confirm-password-error" : undefined
						}
						className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(s => !s)}
						aria-pressed={showConfirmPassword ? "true" : "false"}
						aria-label={
							showConfirmPassword
								? "Hide confirm password"
								: "Show confirm password"
						}
						className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
					>
						{showConfirmPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
				{confirmPasswordError ? (
					<p id="confirm-password-error" className="text-sm text-red-600">
						{confirmPasswordError}
					</p>
				) : null}

				{authError ? (
					<p id="auth-error" className="text-sm text-red-600">
						{authError}
					</p>
				) : null}

				{/* Signup Button */}
				<div className="mt-8">
					<Button
						label={isSubmitting ? "Signing up..." : "Sign Up"}
						variant="blue"
						type="submit"
						disabled={isSubmitting}
						onClick={() => {}}
					/>
				</div>

				{/* Link to Login */}
				<div className="text-center mt-4">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="text-blue-600 hover:underline">
							Login here
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
