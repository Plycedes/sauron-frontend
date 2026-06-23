"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
	const { register } = useAuth();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			await register({ fullName, email, userId, password, confirmPassword });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
			setSubmitting(false);
		}
	};

	return (
		<div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow">
			<h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">Create account</h1>

			<form
				onSubmit={onSubmit}
				className="space-y-4"
			>
				<div>
					<label
						htmlFor="fullName"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Full name
					</label>
					<Input
						id="fullName"
						type="text"
						required
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<Input
						id="email"
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div>
					<label
						htmlFor="userId"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						User ID
					</label>
					<Input
						id="userId"
						type="text"
						required
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<Input
						id="password"
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						Confirm Password
					</label>
					<Input
						id="password"
						type="password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<Button
					type="submit"
					className="w-full"
					disabled={submitting}
				>
					{submitting ? "Creating account..." : "Create account"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-gray-600">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-blue-600 hover:underline"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
