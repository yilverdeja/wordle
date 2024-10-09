const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

interface Props {
	guess: string;
	onUpdateGuess: (guess: string) => void;
	onSubmitGuess: () => void;
}

const GuessWordForm = ({ guess, onUpdateGuess, onSubmitGuess }: Props) => {
	const handleInputChange = (newGuess: string) => {
		if (newGuess.match(/^[A-Za-z]+$/))
			onUpdateGuess(
				newGuess.length <= 5 ? newGuess : newGuess.substring(0, 5)
			);
	};

	const handleSubmit = () => {
		if (guess.length === 5) onSubmitGuess();
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="w-full flex flex-row justify-between items-center gap-2">
				<input
					value={guess}
					onChange={(event) => handleInputChange(event.target.value)}
					onKeyUp={(event) => {
						if (event.code === "Enter") handleSubmit();
					}}
					className="flex-grow bg-slate-100 rounded-md h-10 py-2 px-4 border-slate-400 border-2"
					type="text"
					name="guess"
					id="guess"
					placeholder="Make a guess..."
				/>
				<button className={buttonStyle} onClick={handleSubmit}>
					Guess
				</button>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-xs text-slate-600">
					* must be 5 letters long
				</p>
				<p className="text-xs text-slate-600">* must be a valid word</p>
			</div>
		</div>
	);
};

export default GuessWordForm;
