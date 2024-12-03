import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	Radar,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import ScoreDisplay from "./ScoreDisplay";

export default function AnalysisResult({ data }) {
	console.log(data);
	const mainScore = parseFloat(data.score);

	const criteriaMetrics = [
		{
			name: "Clarity",
			score: data.analysis.clarityScore,
			reason: data.analysis.clarityReason,
		},
		{
			name: "Visual Design",
			score: data.analysis.visualDesignScore,
			reason: data.analysis.visualDesignReason,
		},
		{
			name: "UX",
			score: data.analysis.UXScore,
			reason: data.analysis.UXReason,
		},
		{
			name: "Trust",
			score: data.analysis.trustScore,
			reason: data.analysis.trustReason,
		},
		{
			name: "Value Proposition",
			score: data.analysis.valuePropositionScore,
			reason: data.analysis.valuePropositionReason,
		},
	];

	const audienceMetrics = [
		{
			name: "Consumer",
			score: data.analysis.consumerScore,
			reason: data.analysis.consumerScoreReason,
		},
		{
			name: "Developer",
			score: data.analysis.developerScore,
			reason: data.analysis.developerScoreReason,
		},
		{
			name: "Investor",
			score: data.analysis.investorScore,
			reason: data.analysis.investorScoreReason,
		},
	].filter((metric) => metric.score !== -1);

	const colors = {
		primary: "#4299E1",
		secondary: "#48BB78",
		background: "#1F2937",
		text: "#9CA3AF",
	};

	return (
		<div className="space-y-12">
			{/* Main Score */}
			<div className="flex justify-center">
				<ScoreDisplay score={parseFloat(mainScore)} />
			</div>

			{/* Summary */}
			<div className="text-center max-w-3xl mx-auto">
				<p className="text-xl text-white">{data.analysis.summary}</p>
			</div>

			{/* Website Screenshot */}
			{data.image && (
				<div className="bg-gray-800 rounded-xl p-6">
					<h2 className="text-2xl font-semibold mb-6">Website Preview</h2>
					<div className="relative w-full overflow-hidden rounded-lg shadow-lg">
						<div className="relative pt-[56.25%]">
							{" "}
							{/* 16:9 aspect ratio */}
							<img
								src={data.image}
								alt="Website screenshot"
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</div>
						<div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
					</div>
				</div>
			)}

			{/* Audience Perspective Scores */}
			<div className="bg-gray-800 rounded-xl p-6">
				<h2 className="text-2xl font-semibold mb-6">Audience Perspective</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{audienceMetrics.map((metric) => (
						<div
							key={metric.name}
							className="p-6 rounded-xl bg-gray-700/50 cursor-pointer transition-all"
						>
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-xl font-medium">{metric.name}</h3>
								<span className="text-2xl font-bold text-blue-400">
									{metric.score}
								</span>
							</div>
							<div className="w-full bg-gray-600 rounded-full h-2 mb-4">
								<div
									className="bg-blue-400 h-2 rounded-full"
									style={{ width: `${metric.score}%` }}
								/>
							</div>
							<p className="text-gray-300 mt-4">{metric.reason}</p>
						</div>
					))}
				</div>
			</div>

			{/* Criteria Scores Spider Chart */}
			<div className="bg-gray-800 rounded-xl p-6">
				<h2 className="text-2xl font-semibold mb-6">
					Technical Criteria Scores
				</h2>
				<div className="h-96">
					<ResponsiveContainer>
						<RadarChart data={criteriaMetrics} className="mx-auto">
							<PolarGrid stroke="#FFFFFF" />
							<PolarAngleAxis
								dataKey="name"
								tick={{
									fill: "#FFFFFF",
									fontSize: 16,
									fontWeight: 600,
								}}
							/>
							<Radar
								name="Score"
								dataKey="score"
								stroke={colors.primary}
								fill={colors.primary}
								fillOpacity={0.6}
							/>
							<Tooltip formatter={(value) => value} labelFormatter={() => ""} />
						</RadarChart>
					</ResponsiveContainer>
				</div>
				<div className="flex justify-center">
					<div className="w-full flex">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
							{criteriaMetrics.map((metric) => (
								<div
									key={metric.name}
									className="p-6 rounded-xl bg-gray-700/50"
								>
									<div className="flex flex-col gap-2 mb-2">
										<h3 className="text-xl font-medium">{metric.name}</h3>
										<span className="text-2xl font-bold text-blue-400">
											{metric.score}
										</span>
									</div>
									<div className="w-full bg-gray-600 rounded-full h-2 mb-4">
										<div
											className="bg-blue-400 h-2 rounded-full"
											style={{ width: `${metric.score}%` }}
										/>
									</div>
									<p className="text-gray-300">{metric.reason}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
