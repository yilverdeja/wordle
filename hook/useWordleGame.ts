/* eslint-disable react-hooks/exhaustive-deps */
import WordleGame from "@/lib/WordleGame";
import { SessionResults } from "@/lib/WordleGameSession";
import { useCallback, useState } from "react";

const useWordleGame = (initialWords: string[], maxTries: number) => {
	const [game] = useState(() => new WordleGame(initialWords, maxTries));

	const [gameState, setGameState] = useState<{
		inSession: boolean;
		results: SessionResults[];
	}>({
		inSession: false,
		results: [],
	});

	const play = useCallback(() => {
		game.play();
		setGameState({ ...gameState, inSession: true });
	}, [game, gameState]);

	const stop = useCallback(() => {
		game.stop();
		setGameState({ ...gameState, inSession: false });
	}, [game, gameState]);

	const submitGuess = useCallback(
		(guess: string) => {
			const result = game.submitGuess(guess);

			if (!result) return;

			console.log(guess, result);

			if (result.status !== "pending") {
				game.stop();
				setGameState({ ...gameState, inSession: false });
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
