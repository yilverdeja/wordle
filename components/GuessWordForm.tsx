const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

interface Props {
	guess: string;
	onUpdateGuess: (guess: string) => void;
	onSubmitGuess: () => void;
	disable?: boolean;
}

const GuessWordForm = ({
	guess,
	onUpdateGuess,
	onSubmitGuess,
	disable = false,
}: Props) => {
	const handleInputChange = (newGuess: string) => {
		if (newGuess.match(/^[A-Za-z]+$/) || newGuess === "")
			onUpdateGuess(
				newGuess.length <= 5 ? newGuess : newGuess.substring(0, 5)
			);
	};

	const handleSubmit = () => {
		onSubmitGuess();
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
					disabled={disable}
				/>
				<button
					className={buttonStyle}
					onClick={handleSubmit}
					disabled={disable}
				>
					Guess
				</button>
			</div>
		</div>
	);
};

export default GuessWordForm;
