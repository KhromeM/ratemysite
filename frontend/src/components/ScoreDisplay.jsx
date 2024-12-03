import { useState, useEffect } from "react";

const ScoreDisplay = ({ score }) => {
	const [animated, setAnimated] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimated(score);
		}, 100);
		return () => clearTimeout(timer);
	}, [score]);

	const circumference = 2 * Math.PI * 80; // radius of 80
	const offset = circumference - (animated / 100) * circumference;

	return (
		<div className="relative w-64 h-64">
			{/* Background circle */}
			<svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
				{/* Outer glow */}
				<defs>
					<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#60A5FA" />
						<stop offset="100%" stopColor="#3B82F6" />
					</linearGradient>
					<filter id="glow">
						<feGaussianBlur stdDeviation="3" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Background track */}
				<circle
					cx="100"
					cy="100"
					r="80"
					className="stroke-gray-700"
					strokeWidth="12"
					fill="none"
				/>

				{/* Animated progress */}
				<circle
					cx="100"
					cy="100"
					r="80"
					stroke="url(#gradient)"
					strokeWidth="12"
					strokeLinecap="round"
					fill="none"
					filter="url(#glow)"
					style={{
						strokeDasharray: circumference,
						strokeDashoffset: offset,
						transition: "stroke-dashoffset 1s ease-in-out",
					}}
				/>
			</svg>

			{/* Score text */}
			<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
				<span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
					{animated.toFixed(1)}
				</span>
				<span className="text-white text-xl mt-2">Overall Score</span>
			</div>
		</div>
	);
};

export default ScoreDisplay;
