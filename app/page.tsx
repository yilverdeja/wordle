"use client";

import GuessWordForm from "@/components/GuessWordForm";
import LetterGrid from "@/components/LetterGrid";
import { GuessResult, LetterMatch } from "@/lib/wordle/WordleGameSession";
import axios from "axios";
import { useState } from "react";

const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

const sampleGuessResults: GuessResult[] = [
	{
		guess: "apple",
		result: [
			LetterMatch.Hit,
			LetterMatch.Miss,
			LetterMatch.Present,
			LetterMatch.Hit,
			LetterMatch.Present,
		],
	},
];

export default function Home() {
	const [guess, setGuess] = useState("");

	const handleSubmitGuess = async () => {
		console.log("submitted...", guess);
		try {
			const response = await axios.post("/api/game/guess", { guess });
			console.log(response.data); // Handling the response data
		} catch (error) {
			console.error("Error submitting guess:", error);
		}
	};

	const handleStartGame = async () => {
		console.log("started...");
		try {
			const response = await axios.post("/api/game/start");
			console.log(response.data); // Handling the response data
		} catch (error) {
			console.error("Error starting the game:", error);
		}
	};

	return (
		<div className="w-full h-screen flex p-10">
			<div className="w-full flex flex-col gap-4">
				<h1 className="text-3xl">Wordle</h1>
				<div>
					<div className="flex flex-col items-center gap-4">
						<LetterGrid guessResults={sampleGuessResults} />
					</div>
				</div>
				<div>
					<GuessWordForm
						guess={guess}
						onUpdateGuess={setGuess}
						onSubmitGuess={handleSubmitGuess}
					/>
				</div>
				<div>Final Result</div>
				<div>
					<button className={buttonStyle} onClick={handleStartGame}>
						Start
					</button>
				</div>
			</div>
		</div>
	);
}
