import words from "@/data/words";
import { NextRequest } from "next/server";
import { getSession } from "../utils";
import { LetterMatch } from "@/lib/wordle/types";

const makeGuess = (guess: string, answer: string) => {
	const result = Array<LetterMatch>(guess.length).fill(LetterMatch.Miss);
	const answerCharsTaken = Array<boolean>(answer.length).fill(false);

	// check for correct positions
	for (let i = 0; i < guess.length; i++) {
		if (guess[i] === answer[i]) {
			result[i] = LetterMatch.Hit;
			answerCharsTaken[i] = true;
		}
	}

	// check for wrong positions but correct letters
	for (let i = 0; i < guess.length; i++) {
		if (result[i] === LetterMatch.Miss) {
			// Only check those not already marked as 'G'
			for (let j = 0; j < answer.length; j++) {
				if (!answerCharsTaken[j] && guess[i] === answer[j]) {
					result[i] = LetterMatch.Present; // Correct letter, wrong position
					answerCharsTaken[j] = true;
					break; // Stop once a match is found
				}
			}
		}
	}

	return result.join("");
};

type ValidateGuessResult = {
	guess?: string;
	error?: string;
};

const validateGuess = (guess: unknown): ValidateGuessResult => {
	if (typeof guess !== "string") return { error: "guess must be a string" };

	if (guess.length !== 5)
		return { guess, error: "guess must be 5 characters long" };

	const normalizedGuess = guess.toLowerCase();
	if (!words.includes(normalizedGuess))
		return { guess, error: "guess must be a valid word" };

	return { guess: normalizedGuess };
};

export async function POST(request: NextRequest) {
	const session = await getSession();

	if (session.game.status !== "pending") {
		return new Response(
			JSON.stringify({
				status: session.game.status,
				error: "The game has not started yet",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	const data = await request.json();
	const { guess, error } = validateGuess(data.guess);

	if (error) {
		return new Response(
			JSON.stringify({
				status: session.game.status,
				error: error,
			}),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	if (session.game && session.game.status === "pending" && guess) {
		session.game.tries += 1;

		// check win state
		if (session.game.answer === guess) {
			session.game.status = "win";
			session.game.results.push({ guess, result: "HHHHH" });
			await session.save();
			return new Response(
				JSON.stringify({
					status: session.game.status,
					tries: session.game.tries,
					results: session.game.results,
					guess,
					answer: session.game.answer,
				}),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// check lost state
		if (session.game.maxNumTries === session.game.tries) {
			session.game.status = "lost";
		}

		// check guess results
		const result = makeGuess(guess, session.game.answer!);
		session.game.results.push({ guess, result });

		// save the updated game state
		await session.save();

		// send response back to client
		return new Response(
			JSON.stringify({
				status: session.game.status,
				tries: session.game.tries,
				results: session.game.results,
				guess,
				answer:
					session.game.status === "lost" ? session.game.answer : null,
			}),
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new Response(
			JSON.stringify({
				status: session.game.status,
				error: "No active game or invalid guess.",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
