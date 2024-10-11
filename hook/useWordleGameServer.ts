import { GuessResult, LetterMatch } from "@/lib/wordle/types";
import {
	WordleGameServerResult,
	WordleGameServerStatus,
} from "@/lib/wordle/WordleGameServer";
import axios from "axios";
import { useState, useCallback } from "react";

interface WordleGameServerResponse {
	status: WordleGameServerStatus;
	results?: WordleGameServerResult[];
	guess?: string;
	answer?: string;
	maxTries?: number;
	tries?: number;
	error?: string;
}

const transformResults = (
	results: { guess: string; result: string }[]
): GuessResult[] =>
	results.map(({ guess, result }) => ({
		guess,
		result: result.split("").map((letter) => {
			if (letter === "H") return LetterMatch.Hit;
			else if (letter === "P") return LetterMatch.Present;
			else return LetterMatch.Miss;
		}),
	}));

const useWordleGameServer = () => {
	const [status, setStatus] = useState<WordleGameServerStatus | null>(null);
	const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
	const [rounds, setRounds] = useState(0);
	const [maxRounds, setMaxRounds] = useState(0);
	const [answer, setAnswer] = useState<string | null>(null);
	const [error, setError] = useState<{
		type: "start" | "guess" | "fetch";
		message: string;
	} | null>(null);

	const fetchData = useCallback(async () => {
		try {
			const response = await axios.get<WordleGameServerResponse>(
				"/api/game"
			);
			const data = response.data;
			setStatus(data.status);
			setGuessResults(transformResults(data.results!));
			setRounds(data.tries!);
			setMaxRounds(data.maxTries!);
			setAnswer(data.answer!);
		} catch (error) {
			console.error("Fetch data failed:", error);
			setError({ type: "fetch", message: "Failed to fetch game data" });
		}
	}, []);

	const submitGuess = useCallback(async (guess: string) => {
		setError(null);
		try {
			const response = await axios.post<WordleGameServerResponse>(
				"/api/game/guess",
				{ guess }
			);
			const data = response.data;
			setGuessResults(transformResults(data.results!));
			setRounds(data.tries!);
			setStatus(data.status);
			setAnswer(data.answer!);
		} catch (error) {
			console.error("Error submitting guess:", error);
			setError({ type: "fetch", message: "Failed to submit guess" });
		}
	}, []);

	const startGame = useCallback(async () => {
		setError(null);
		try {
			const response = await axios.post<WordleGameServerResponse>(
				"/api/game/start"
			);
			const data = response.data;
			setGuessResults([]);
			setStatus(data.status);
			setRounds(0);
			setMaxRounds(data.maxTries!);
			setAnswer(null);
		} catch (error) {
			console.error("Error starting the game:", error);
			setError({ type: "fetch", message: "Failed to start the game" });
		}
	}, []);

	return {
		status,
		guessResults,
		rounds,
		maxRounds,
		answer,
		error,
		fetchData,
		submitGuess,
		startGame,
	};
};

export default useWordleGameServer;
