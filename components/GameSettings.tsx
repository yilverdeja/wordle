import { useGameContext } from "@/context/GameContext";
import { useEffect, useState } from "react";

const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

const GameSettings = () => {
	const { gameState, updateMaxGuesses, updateWords, resetSettings } =
		useGameContext();
	const [numGuesses, setNumGuesses] = useState(gameState.maxGuesses);
	const [words, setWords] = useState(gameState.words.join(", "));
	const [invalidWords, setInvalidWords] = useState("");

	useEffect(() => {
		setNumGuesses(gameState.maxGuesses);
		setWords(gameState.words.join(", "));
	}, [gameState, gameState.maxGuesses, gameState.words]);

	const handleDefaultSettings = () => {
		setInvalidWords("");
		resetSettings();
	};

	const handleUpdateSettings = () => {
		const wordList = words.split(",").map((word) => word.trim());
		const uniqueWordsSet = new Set(wordList);
		const uniqueWords = Array.from(uniqueWordsSet);

		// Checks for non 5-letter words
		const nonFiveLetterWords = uniqueWords.filter(
			(word) => word.length !== 5
		);
		if (nonFiveLetterWords.length > 0) {
			setInvalidWords(nonFiveLetterWords.join(", "));
			return;
		}

		setInvalidWords(""); // all words are valid

		// update settings
		updateMaxGuesses(numGuesses);
		updateWords(uniqueWords); // Update context with validated words
	};

	return (
		<div className="flex flex-col gap-4 p-4 border-2 border-slate-600 rounded-lg">
			<h2 className="text-xl">Game Settings</h2>
			<p>Current Max Guesses: {gameState.maxGuesses}</p>
			<p>Current Number of Words: {gameState.words.length}</p>
			<div className="flex flex-col gap-4">
				<div>
					<label htmlFor="guesses" className="block mb-2">
						Max Guesses
					</label>
					<input
						value={numGuesses}
						onChange={(e) =>
							setNumGuesses(parseInt(e.target.value))
						}
						type="number"
						id="guesses"
						className="w-full bg-slate-100 rounded-md h-10 py-2 px-4 border-slate-400 border-2"
					/>
				</div>
				<div>
					<label htmlFor="words" className="block mb-2">
						Words (comma-separated)
					</label>
					<textarea
						value={words}
						onChange={(e) => setWords(e.target.value)}
						id="words"
						className="w-full bg-slate-100 rounded-md h-10 py-2 px-4 border-slate-400 border-2"
						rows={4}
					></textarea>
				</div>
				<button onClick={handleDefaultSettings} className={buttonStyle}>
					Default Settings
				</button>
				<button onClick={handleUpdateSettings} className={buttonStyle}>
					Update Settings
				</button>
				{invalidWords && (
					<div className="flex flex-col gap-2">
						<p className="text-red-500">
							Some words are not exactly 5 letters long.
						</p>
						<textarea
							value={invalidWords}
							className="w-full bg-gray-100 rounded-md h-10 py-2 px-4 border-slate-400 border-2"
							disabled
							rows={2}
						></textarea>
					</div>
				)}
			</div>
		</div>
	);
};

export default GameSettings;
