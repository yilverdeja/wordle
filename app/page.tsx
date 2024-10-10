"use client";

import GuessWordForm from "@/components/GuessWordForm";
import LetterGrid from "@/components/LetterGrid";
import { GuessResult, LetterMatch } from "@/lib/wordle/WordleGameSession";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const buttonStyle =
	"bg-slate-200 py-2 px-4 rounded-md disabled:bg-slate-200/50 disabled:text-slate-900/50";

const transformResults = (
	results: { guess: string; result: string }[]
): GuessResult[] => {
	return results.map(({ guess, result }) => ({
		guess,
		result: result.split("").map((letter) => {
			if (letter === "H") return LetterMatch.Hit;
			else if (letter === "P") return LetterMatch.Present;
			else return LetterMatch.Miss;
		}),
	}));
};

export default function Home() {
	const [guess, setGuess] = useState("");
	const [guessError, setGuessError] = useState("");
	const [status, setStatus] = useState<"pending" | "win" | "lost" | null>(
		null
	);
	const [rounds, setRounds] = useState(0);
	const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
	const [answer, setAnswer] = useState<string | null>(null);

	useEffect(() => {
		// Define the function to fetch data
		const fetchData = () => {
			axios
				.get("/api/game")
				.then((res) => {
					const data = res.data;
					console.log(data);
					if (data.error) {
						console.error(data.error);
					} else {
						setStatus(data.status);
						const results = transformResults(data.results);
						setGuessResults(results);
						setRounds(data.tries);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		};

		// Call the fetchData function
		fetchData();
	}, []);

	const handleSubmitGuess = async () => {
		setGuessError("");
		try {
			const data = await axios
				.post("/api/game/guess", { guess })
				.then((res) => res.data);
			const results = transformResults(data.results);
			setGuessResults(results);
			setStatus(data.status);
			if (data.answer) {
				setAnswer(data.answer);
			}
			setGuess("");
		} catch (error) {
			if (error instanceof AxiosError) {
				const errorData = error.response?.data;
				console.error(errorData);
				if (error.status === 403) {
					setGuessError(errorData.error);
				}
			} else console.error("Error submitting guess:", error);
		}
	};

	const handleStartGame = async () => {
		try {
			const data = await axios
				.post("/api/game/start")
				.then((res) => res.data);
			setGuessResults([]);
			setStatus(data.status);
			setRounds(data.maxTries);
			setAnswer(null);
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data);
				setStatus(error.response!.data.status);
				setRounds(error.response!.data.maxTries);
			} else console.error("Error starting the game:", error);
		}
	};

	return (
		<div className="w-full h-screen flex p-10">
			<div className="w-full flex flex-col gap-4">
				<h1 className="text-3xl">Wordle</h1>
				<div>
					<div className="flex flex-col items-center gap-4">
						<LetterGrid guessResults={guessResults} />
					</div>
				</div>
				<div>
					<GuessWordForm
						guess={guess}
						onUpdateGuess={setGuess}
						onSubmitGuess={handleSubmitGuess}
						disable={status !== "pending"}
					/>
					{guessError && (
						<p className="mt-2 text-xs text-red-400">
							* {guessError}
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
				<div>
					<button
						className={buttonStyle}
						onClick={handleStartGame}
						disabled={status === "pending"}
					>
						Start
					</button>
				</div>
			</div>
		</div>
	);
}
