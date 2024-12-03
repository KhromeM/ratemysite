export default function Navbar({ onNavigate }) {
	return (
		<nav className="bg-neutral-800 p-4 flex justify-between items-center">
			<h1 className="text-2xl font-bold text-white">RateMySite</h1>
			<div className="flex space-x-4">
				<button
					onClick={() => onNavigate("home")}
					className="text-white hover:text-gray-300"
				>
					Home
				</button>
				<button
					onClick={() => onNavigate("scoreboard")}
					className="text-white hover:text-gray-300"
				>
					Scoreboard
				</button>
			</div>
		</nav>
	);
}
