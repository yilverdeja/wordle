/* eslint-disable react-hooks/exhaustive-deps */
import WordleGame from "@/lib/WordleGame";
import { GuessResult, Status } from "@/lib/WordleGameSession";
import { useCallback, useState } from "react";

const useWordleGame = (initialWords: string[], maxTries: number) => {
	const [game] = useState(() => new WordleGame(initialWords, maxTries));

	const [gameState, setGameState] = useState<{
		inSession: boolean;
		sessionStatus: Status | "stopped";
		results: GuessResult[];
	}>({
		inSession: false,
		sessionStatus: "stopped",
		results: [],
	});

	const play = useCallback(() => {
		game.play();
		setGameState({
			results: [],
			sessionStatus: "pending",
			inSession: true,
		});
	}, [game, gameState]);

	const stop = useCallback(() => {
		game.stop();
		setGameState({
			...gameState,
			sessionStatus: "stopped",
			inSession: false,
		});
	}, [game, gameState]);

	const submitGuess = useCallback(
		(guess: string) => {
			const result = game.submitGuess(guess);

			if (!result) return;

			if (result.status !== "pending") {
				game.stop();
				setGameState({
					...gameState,
					sessionStatus: result.status,
					inSession: false,
				});
			}

			setGameState((prev) => ({
				...prev,
				results: [...prev.results, result],
			}));
		},
		[game, gameState]
	);

	return { game, gameState, play, stop, submitGuess };
};

export default useWordleGame;
