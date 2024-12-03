// MarqueeAlert.jsx
import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../utils/firebase.js";

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export function MarqueeAlert({ onOpenChange }) {
	return (
		<div
			className="relative bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden py-4 cursor-pointer shadow-lg"
			onClick={() => onOpenChange(true)}
		>
			<div className="animate-marquee whitespace-nowrap flex items-center">
				<span className="mx-4 text-white flex items-center text-lg font-medium">
					🤖 NEW: AI Customer Simulations - Watch 1000s of target customers
					interact with your site in real-time
				</span>
				<span className="mx-4 text-white flex items-center text-lg font-medium">
					🎯 Simulate customers from ProductHunt, HackerNews, Reddit, and more
				</span>
				<span className="mx-4 text-white flex items-center text-lg font-medium">
					💡 Understand why visitors leave without buying
				</span>
				<span className="mx-4 text-white flex items-center text-lg font-medium">
					✨ Click here for early access
				</span>
			</div>
			<div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-blue-800 to-transparent" />
			<div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-blue-800 to-transparent" />
		</div>
	);
}

export function FeatureDialog({ open, onOpenChange }) {
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSignIn = async () => {
		setIsSubmitting(true);
		setError("");
		try {
			await signInWithPopup(auth, provider);
			setSuccess(true);
		} catch (err) {
			console.error("Sign in error:", err);
			setError("Failed to sign in. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-neutral-800 border border-neutral-700 rounded-lg max-w-2xl w-full p-6 shadow-xl">
				<div className="space-y-6">
					<h2 className="text-2xl font-bold">
						AI Customer Simulation - See How Real Users Think
					</h2>

					<p className="text-lg text-neutral-300">
						Watch as AI customers from your target demographics explore your
						site, make purchase decisions, and provide detailed feedback.
						Understand exactly what drives conversions - or what prevents them.
					</p>

					<ul className="space-y-3 text-neutral-300">
						<li className="flex items-start">
							<span className="text-blue-400 mr-2">•</span>Simulate specific
							user demographics (startup founders, developers, enterprise
							buyers)
						</li>
						<li className="flex items-start">
							<span className="text-blue-400 mr-2">•</span>Get detailed
							explanations of purchase decisions and drop-off points
						</li>
						<li className="flex items-start">
							<span className="text-blue-400 mr-2">•</span>Understand price
							sensitivity and feature preferences
						</li>
						<li className="flex items-start">
							<span className="text-blue-400 mr-2">•</span>A/B test different
							value propositions and messaging
						</li>
					</ul>

					{!success ? (
						<div className="space-y-4">
							<p className="text-neutral-300">
								Interested? Sign in with Google to get notified when this
								feature launches!
							</p>
							{error && <p className="text-red-400 text-sm">{error}</p>}
							<div className="flex justify-end gap-4">
								<button
									type="button"
									onClick={() => onOpenChange(false)}
									className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
									disabled={isSubmitting}
								>
									Cancel
								</button>
								<button
									onClick={handleSignIn}
									disabled={isSubmitting}
									className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									{isSubmitting ? "Signing in..." : "Sign in"}
								</button>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<p className="text-green-400 font-medium">
								Thanks for your interest! You'll be notified when the feature
								launches.
							</p>
							<div className="flex justify-end">
								<button
									onClick={() => onOpenChange(false)}
									className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
								>
									Close
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
