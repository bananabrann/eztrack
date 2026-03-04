import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/Button";

export default function Signup() {
	/** UI State for password visibility toggles */
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	/** Form fields values */
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");

	/** Error validations message for each fields */
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [roleError, setRoleError] = useState("");

	/** Authentication error from the API */
	const [authError, setAuthError] = useState("");

	/** Loading submitting state */
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	/**
	 * Validate name fields, required and at least 2 characters
	 */
	const validateName = (value: string) => {
		const normalizedValue = value.trim();
		if (!normalizedValue) return "Name is required.";
		if (normalizedValue.length < 2)
			return "Name must be at least 2 characters.";
		return "";
	};

	// Validate name when user leaves the field
	const handleNameBlur = () => {
		setNameError(validateName(name));
	};

	/**
	 * Validate email field, required and proper email format
	 */
	const validateEmail = (value: string) => {
		const normalizedValue = value.trim();
		if (!normalizedValue) return "Email is required.";
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(normalizedValue)
			? ""
			: "Please enter a valid email address.";
	};

	// Validate email when user leaves the field
	const handleEmailBlur = () => {
		setEmailError(validateEmail(email));
	};

	/**
	 * Validate password, must be 8+ chars with uppercase, lowercase, and number
	 */
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

	// Validate password when user leaves the field
	const handlePasswordBlur = () => {
		setPasswordError(validatePassword(password));
	};

	/** Validate confirm password, must match the password field */
	const validateConfirmPassword = (value: string) => {
		if (!value) return "Please confirm your password.";
		if (value !== password) return "Passwords do not match.";
		return "";
	};

	/** Validate confirm password when user leaves the field */
	const handleConfirmPasswordBlur = () => {
		setConfirmPasswordError(validateConfirmPassword(confirmPassword));
	};

	/** Validate role when user leaves the field */
	const validateRole = (value: string) => {
		if (!value) return "Please select a role.";
		return "";
	};

	// Validate role when user leaves the field
	const handleRoleBlur = () => {
		setRoleError(validateRole(role));
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Validate all fields before submitting
		const nameErr = validateName(name);
		const emailErr = validateEmail(email);
		const passwordErr = validatePassword(password);
		const confirmPasswordErr = validateConfirmPassword(confirmPassword);
		const roleErr = validateRole(role);

		// Update error states for all fields
		setNameError(nameErr);
		setEmailError(emailErr);
		setPasswordError(passwordErr);
		setConfirmPasswordError(confirmPasswordErr);
		setRoleError(roleErr);
		setAuthError("");

		// Guard for submission if any validation errors exist
		if (nameErr || emailErr || passwordErr || confirmPasswordErr || roleErr)
			return;

		setIsSubmitting(true);

		try {
			// Attempt to create user account
			const { data, error } = await signUp(email, password, name, role);

			if (error) {
				setAuthError(error.message);
				return;
			}

			// Navigate to homepage on successful signup
			navigate("/");
		} catch (error) {
			// Handle unexpected errors
			setAuthError(
				error instanceof Error
					? error.message
					: "Something went wrong while signing up, please try again",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				<form
					onSubmit={handleSubmit}
					className="bg-white p-8 rounded-lg shadow-md"
				>
					{/* EZTrack logo */}
					<div className="mb-6 text-center">
						<img
							src="/eztrack-logo.png"
							alt="eztrack logo"
							className="mx-auto max-w-xs"
						/>
					</div>

					{/* Name and Role */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
						{/* Name */}
						<div className="flex flex-col">
							<label
								htmlFor="name"
								className="text-sm font-medium text-gray-700 mb-1.5"
							>
								Name
							</label>
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
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							{nameError ? (
								<p id="name-error" className="text-xs text-red-600 mt-1.5">
									{nameError}
								</p>
							) : null}
						</div>

						{/* Role */}
						<div className="flex flex-col">
							<label
								htmlFor="role"
								className="text-sm font-medium text-gray-700 mb-1.5"
							>
								Role
							</label>
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
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select a role</option>
								<option value="FOREMAN">Foreman</option>
								<option value="CREW">Crew</option>
							</select>
							{roleError ? (
								<p id="role-error" className="text-xs text-red-600 mt-1.5">
									{roleError}
								</p>
							) : null}
						</div>
					</div>
					{/* Email */}
					<div className="flex flex-col mb-4">
						<label
							htmlFor="email"
							className="text-sm font-medium text-gray-700 mb-1"
						>
							User Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={event => {
								setEmail(event.target.value);
								if (emailError)
									setEmailError(validateEmail(event.target.value));
							}}
							onBlur={handleEmailBlur}
							aria-invalid={emailError ? "true" : undefined}
							aria-describedby={emailError ? "email-error" : undefined}
							className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						{emailError ? (
							<p id="email-error" className="text-xs text-red-600 mt-1">
								{emailError}
							</p>
						) : null}
					</div>

					{/* Password */}
					<div className="flex flex-col mb-4">
						<label
							htmlFor="password"
							className="text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
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
								className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							<p id="password-error" className="text-xs text-red-600 mt-1">
								{passwordError}
							</p>
						) : null}
					</div>

					{/* Confirm Password */}
					<div className="flex flex-col mb-6">
						<label
							htmlFor="confirmPassword"
							className="text-sm font-medium text-gray-700 mb-1"
						>
							Confirm Password
						</label>
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
								className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							<p
								id="confirm-password-error"
								className="text-xs text-red-600 mt-1"
							>
								{confirmPasswordError}
							</p>
						) : null}
					</div>

					{authError ? (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
							<p id="auth-error" className="text-sm text-red-600">
								{authError}
							</p>
						</div>
					) : null}

					{/* Signup Button */}
					<div className="mb-4">
						<Button
							label={isSubmitting ? "Signing up..." : "Sign Up"}
							variant="blue"
							type="submit"
							disabled={isSubmitting}
							onClick={() => {}}
						/>
					</div>

					{/* Link to Login */}
					<div className="text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-blue-600 hover:underline font-medium"
							>
								Login here
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
