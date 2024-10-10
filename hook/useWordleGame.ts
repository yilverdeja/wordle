/* eslint-disable react-hooks/exhaustive-deps */
import WordleGame from "@/lib/WordleGame";
import { GuessResult, Status } from "@/lib/WordleGameSession";
import { useCallback, useState } from "react";

export interface GameState {
	inSession: boolean;
	answer: string | null;
	sessionStatus: Status | "stopped";
	results: GuessResult[];
	maxGuesses: number;
	words: string[];
}

export interface UseWordleGame {
	game: WordleGame; // Assume WordleGame is a class from "@/lib/WordleGame"
	gameState: GameState;
	play: () => void;
	stop: () => void;
	submitGuess: (guess: string) => void;
	updateMaxGuesses: (newMaxTries: number) => void;
	updateWords: (newWords: string[]) => void;
	resetSettings: () => void;
}

const defaultGameState: GameState = {
	inSession: false,
	sessionStatus: "stopped",
	results: [],
	answer: null,
	maxGuesses: 0,
	words: [],
};

const useWordleGame = (
	initialWords: string[],
	initialMaxTries: number
): UseWordleGame => {
	const [game] = useState(
		() => new WordleGame(initialWords, initialMaxTries)
	);

	const [gameState, setGameState] = useState<GameState>({
		...defaultGameState,
		words: initialWords,
		maxGuesses: initialMaxTries,
	});

	const resetSettings = useCallback(() => {
		game.updateWords(game.defaultWords);
		game.updateMaxRounds(game.defaultMaxRoundsPerSession);
		setGameState({
			...gameState,
			words: game.words,
			maxGuesses: game.maxRoundsPerSession,
		});
	}, [game]);

	const updateWords = useCallback(
		(newWords: string[]) => {
			game.updateWords(newWords);
			setGameState((prevState) => ({
				...prevState,
				words: game.words,
			}));
		},
		[game]
	);

	const updateMaxGuesses = useCallback(
		(newMaxTries: number) => {
			game.updateMaxRounds(newMaxTries);
			setGameState((prevState) => ({
				...prevState,
				maxGuesses: game.maxRoundsPerSession,
			}));
		},
		[game]
	);

	const play = useCallback(() => {
		game.play();
		setGameState({
			results: [],
			sessionStatus: "pending",
			inSession: true,
			words: game.words,
			maxGuesses: game.maxRoundsPerSession,
			answer: game.currentSession!.answer,
		});
	}, [game, gameState]);

	const stop = useCallback(() => {
		game.stop();
		setGameState({
			...gameState,
			sessionStatus: "stopped",
			inSession: false,
			answer: null,
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

	return {
		game,
		gameState,
		play,
		stop,
		submitGuess,
		updateMaxGuesses,
		updateWords,
		resetSettings,
	};
};

export default useWordleGame;
