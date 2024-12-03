import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoadingIndicator from "./components/LoadingIndicator";
import AnalysisResult from "./components/AnalysisResult";
import Scoreboard from "./components/Scoreboard";
import { firebaseApp } from "./utils/firebase.js";
import { MarqueeAlert, FeatureDialog } from "./components/MarqueeAlert.jsx";

import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
export default function App() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [analysisData, setAnalysisData] = useState(null);
	const [view, setView] = useState("home");
	const [scoreboardData, setScoreboardData] = useState([]);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);
	const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
	const [loadingScoreboard, setLoadingScoreboard] = useState(false);

	const handleNavigate = (page) => {
		setView(page);
		if (page === "scoreboard") {
			fetchScoreboard();
		}
	};

	const handleLogin = () => {
		if (user) {
			signOut(auth).then(() => {
				setUser(null);
			});
		} else {
			signInWithPopup(auth, provider)
				.then((result) => {
					setUser(result.user);
				})
				.catch((error) => {
					console.error("Login error:", error);
				});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!url) {
			setError("Please enter a website URL");
			return;
		}

		let processedUrl = url.replace(/^https?:\/\//i, "");

		// Basic validation
		if (!processedUrl.includes(".")) {
			setError("Please enter a valid domain");
			return;
		}

		setLoading(true);
		setError(null);
		setAnalysisData(null);

		try {
			const res = await fetch("https://ratemysite.fly.dev/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: "https://" + processedUrl }),
			});

			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setAnalysisData(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchScoreboard = async () => {
		setLoadingScoreboard(true);
		try {
			const res = await fetch("https://ratemysite.fly.dev/scores");
			const data = await res.json();
			const sitesArray = Object.entries(data).map(([url, score]) => {
				return { url, score };
			});
			sitesArray.sort((a, b) => b.score - a.score);
			setScoreboardData(sitesArray);
		} catch (err) {
			console.error("Failed to fetch scoreboard data:", err);
		} finally {
			setLoadingScoreboard(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
			<Navbar onNavigate={handleNavigate} onLogin={handleLogin} user={user} />
			<MarqueeAlert onOpenChange={setFeatureDialogOpen} />
			<FeatureDialog
				open={featureDialogOpen}
				onOpenChange={setFeatureDialogOpen}
			/>

			<div className="flex-1 p-6 sm:p-12">
				{view === "home" && (
					<div className="space-y-12">
						{/* Header */}
						<div className="space-y-6">
							<h1 className="text-7xl font-bold tracking-tight text-center">
								Rate My Site
							</h1>
							<p className="text-2xl text-neutral-400 text-center">
								Analyze your website's design with AI
							</p>
						</div>

						{/* URL Input */}
						<div className="space-y-8">
							<form
								onSubmit={handleSubmit}
								className="flex flex-col md:flex-row gap-4 items-center justify-center"
							>
								<input
									type="text"
									placeholder="Enter website (e.g., www.example.com)"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									className="w-full md:w-2/3 bg-neutral-800 rounded-lg px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									disabled={loading}
									className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{loading ? "Analyzing..." : "Analyze"}
								</button>
							</form>

							{error && (
								<div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg px-6 py-4 text-lg">
									{error}
								</div>
							)}
						</div>

						{/* Loading Message and Indicator */}
						{loading && (
							<div className="space-y-6">
								<LoadingIndicator />
								<div className="max-w-2xl mx-auto text-center">
									<p className="text-lg text-neutral-400">
										Your website is being analyzed via various techniques. This
										process takes about 30-45 seconds as we thoroughly evaluate
										design, usability, and other key factors. Check out the
										leaderboard in the meantime!
									</p>
								</div>
							</div>
						)}

						{/* Analysis Result */}
						{analysisData && <AnalysisResult data={analysisData} />}
					</div>
				)}

				{view === "scoreboard" && (
					<>
						{loadingScoreboard ? (
							<div className="flex flex-col items-center justify-center space-y-4">
								<LoadingIndicator />
								<p className="text-lg text-neutral-400">
									Loading latest ratings...
								</p>
							</div>
						) : (
							<Scoreboard sites={scoreboardData} />
						)}
					</>
				)}
			</div>

			{/* Footer */}
			<footer className="bg-neutral-800 p-4 text-center text-neutral-500">
				&copy; {new Date().getFullYear()} AstralisAI Inc
			</footer>
		</div>
	);
}
