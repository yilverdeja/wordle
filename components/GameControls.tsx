import { useGameContext } from "@/context/GameContext";

const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

const GameControls = () => {
	const { play, stop, gameState } = useGameContext();
	return (
		<div className="flex flex-row gap-4 items-center p-4 border-2 border-slate-600 rounded-lg">
			<h2 className="text-xl">Game Controls</h2>
			<div className="flex flex-row gap-4">
				<button
					onClick={play}
					className={buttonStyle}
					disabled={gameState.inSession}
				>
					Start
				</button>
				<button
					onClick={stop}
					className={buttonStyle}
					disabled={!gameState.inSession}
				>
					Stop
				</button>
			</div>
		</div>
	);
};

export default GameControls;
