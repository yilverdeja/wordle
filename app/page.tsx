"use client";
import useWordleGame from "@/hook/useWordleGame";
import { useState } from "react";

export default function Home() {
	const { gameState, play, stop, submitGuess } = useWordleGame(
		["abcde", "qwert", "tyuio"],
		5
	);
	const [guess, setGuess] = useState("");

	return (
		<div className="w-full h-screen flex justify-center items-center gap-10">
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl">Wordle</h1>
				<div className="flex flex-row gap-4 items-center p-4 border-2 border-slate-600 rounded-lg">
					<h2 className="text-xl">Game Controls</h2>
					<div className="flex flex-row gap-4">
						<button
							onClick={() => play()}
							className="bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50"
							disabled={gameState.inSession}
						>
							Start
						</button>
						<button
							onClick={() => stop()}
							className="bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50"
							disabled={!gameState.inSession}
						>
							Stop
						</button>
					</div>
				</div>
				{gameState.inSession && (
					<div className="w-full flex flex-row justify-between items-center gap-2">
						<input
							value={guess}
							onChange={(event) => setGuess(event.target.value)}
							className="flex-grow bg-slate-100 rounded-md h-10 py-2 px-4 border-slate-400 border-2"
							type="text"
							name="guess"
							id="guess"
							placeholder="Make a guess..."
						/>
						<button
							className="bg-slate-200 py-2 px-4 rounded-md"
							onClick={() => {
								submitGuess(guess);
								setGuess("");
							}}
						>
							Guess
						</button>
					</div>
				)}
			</div>
			{gameState.sessionStatus !== "stopped" && (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col justify-center">
						{gameState.results.map((result, index) => (
							<div key={index}>
								<p>{result.guess}</p>
								<p>{result.result.join(" ")}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
