/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import GuessWordForm from "@/components/GuessWordForm";
import LetterGrid from "@/components/LetterGrid";
import useWordleGameServer from "@/hook/useWordleGameServer";
import { useEffect, useState } from "react";

const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

export default function Home() {
	const {
		status,
		rounds,
		maxRounds,
		guessResults,
		answer,
		error,
		fetchData,
		submitGuess,
		startGame,
	} = useWordleGameServer();
	const [guess, setGuess] = useState("");

	// fetch data at the start of the session
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-full h-screen flex p-10">
			<div className="w-full flex flex-col items-center gap-4">
				<h1 className="text-3xl">Wordle</h1>
				<div>
					<button
						className={buttonStyle}
						onClick={startGame}
						disabled={status === "pending"}
					>
						Start
					</button>
				</div>
				<div>
					<p>
						Game has started. You have {rounds}/{maxRounds} tries to
						get it right!
					</p>
				</div>
				<div>
					<div className="flex flex-col items-center gap-4">
						<LetterGrid guessResults={guessResults} />
					</div>
				</div>
				<div>
					<GuessWordForm
						guess={guess}
						onUpdateGuess={setGuess}
						onSubmitGuess={() => {
							submitGuess(guess);
							setGuess("");
						}}
						disable={status !== "pending"}
					/>
					{error?.type === "guess" && (
						<p className="mt-2 text-xs text-red-400">
							* {error.message}
						</p>
					)}
				</div>
				{answer && (
					<div className="flex flex-col justify-center items-center">
						<p>
							{status === "win"
								? `Congrats! You Won`
								: `Bohoo, you lost :< Try again`}
						</p>
						<p className="font-bold">Answer: {answer}</p>
					</div>
				)}
			</div>
		</div>
	);
}
