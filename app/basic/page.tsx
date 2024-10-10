"use client";
import GameControls from "@/components/basic/GameControls";
import GameSettings from "@/components/basic/GameSettings";
import GuessWordForm from "@/components/GuessWordForm";
import LetterGrid from "@/components/LetterGrid";
import { useGameContext } from "@/context/GameContext";
import { useState } from "react";

export default function BasicGame() {
	const { gameState, submitGuess } = useGameContext();
	const [guess, setGuess] = useState("");

	return (
		<div className="w-full h-screen flex p-10">
			<div className="w-full flex flex-col gap-4">
				<h1 className="text-3xl">Wordle</h1>
				<div className="grid grid-cols-3 gap-10">
					<div>
						<GameSettings />
					</div>
					<div className="flex flex-col gap-4">
						<GameControls />
						{gameState.inSession && (
							<GuessWordForm
								guess={guess}
								onUpdateGuess={setGuess}
								onSubmitGuess={() => {
									submitGuess(guess.toLowerCase());
									setGuess("");
								}}
							/>
						)}
					</div>
					<div>
						{gameState.sessionStatus !== "stopped" && (
							<div className="flex flex-col items-center gap-4">
								<LetterGrid guessResults={gameState.results} />
								{gameState.sessionStatus !== "pending" && (
									<div className="flex flex-col justify-center items-center">
										<p>
											{gameState.sessionStatus === "win"
												? `Congrats! You Won`
												: `Bohoo, you lost :< Try again`}
										</p>
										<p className="font-bold">
											Answer: {gameState.answer}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
