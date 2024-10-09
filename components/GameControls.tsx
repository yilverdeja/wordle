const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

interface Props {
	onStart: () => void;
	onStop: () => void;
	inSession: boolean;
}

const GameControls = ({ onStart, onStop, inSession }: Props) => {
	return (
		<div className="flex flex-row gap-4 items-center p-4 border-2 border-slate-600 rounded-lg">
			<h2 className="text-xl">Game Controls</h2>
			<div className="flex flex-row gap-4">
				<button
					onClick={onStart}
					className={buttonStyle}
					disabled={inSession}
				>
					Start
				</button>
				<button
					onClick={onStop}
					className={buttonStyle}
					disabled={!inSession}
				>
					Stop
				</button>
			</div>
		</div>
	);
};

export default GameControls;
