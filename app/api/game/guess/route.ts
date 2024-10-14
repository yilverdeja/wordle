import words from "@/data/words";
import { NextRequest } from "next/server";
import { getSession } from "../utils";
import { LetterMatch } from "@/lib/wordle/types";

const getWords = (): string[] => {
	if (process.env.WORDS !== undefined) {
		return process.env.WORDS.split(", ");
	} else {
		return words;
	}
};

function getRandomWordsSubset(numWords: number) {
	const words = getWords();
	const selectedIndices = new Set();
	const subset = [];

	while (subset.length < numWords) {
		const index = Math.floor(Math.random() * words.length);
		if (!selectedIndices.has(index)) {
			subset.push(words[index]);
			selectedIndices.add(index);
		}
	}

	return subset;
}

const getCandidates = (): { word: string; position: number }[] => {
	const words = getRandomWordsSubset(1000);
	return words.map((word, index) => ({ word: word, position: index }));
};

const findCandidates = (
	guess: string,
	candidates: { word: string; position: number }[]
) => {
	let selectedCandidates: { word: string; position: number }[] = [];
	let minPoints = 50; // set to maximum points - H = 10, P = 1, M = 0

	// if minPoints is updated, then clear candidates, and add the new item that made minPoints change
	candidates.forEach((candidate) => {
		const result = makeGuess(guess, candidate.word);
		let points = 0;
		for (let i = 0; i <= result.length; i++) {
			const letter = result[i];
			if (letter === "H") points += 10;
			else if (letter === "P") points += 1;
		}
		if (points === minPoints) {
			selectedCandidates.push(candidate);
		} else if (points < minPoints) {
			selectedCandidates = [candidate];
			minPoints = points;
		}
	});

	return { candidates: selectedCandidates, points: minPoints };
};

const encodeCadidates = (candidates: { word: string; position: number }[]) => {
	return candidates
		.reduce((acc, curr) => (acc += curr.position + ","), "")
		.slice(0, -1);
};

const decodeCandidates = (encodedCandidates: string) => {
	const words = getWords();
	return encodedCandidates.split(",").map((position) => ({
		word: words[parseInt(position)],
		position: parseInt(position),
	}));
};

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
			// Only check those not already marked as 'H'
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
		// increment tries on both normal and absurdle types
		session.game.tries += 1;

		// if gametype is absurdle, and answer not chosen, then determine a candidate
		if (session.game.type === "absurdle" && session.game.answer === "") {
			const foundCandidates =
				session.game.candidates === ""
					? findCandidates(guess, getCandidates())
					: findCandidates(
							guess,
							decodeCandidates(session.game.candidates)
					  );

			console.log(foundCandidates);

			if (foundCandidates.points === 0) {
				session.game.candidates = encodeCadidates(
					foundCandidates.candidates
				);
				session.game.results.push({ guess, result: "MMMMM" });
				await session.save();

				return new Response(
					JSON.stringify({
						status: session.game.status,
						tries: session.game.tries,
						results: session.game.results,
						guess,
						answer: null,
					}),
					{
						headers: { "Content-Type": "application/json" },
					}
				);
			} else {
				// select a random candidate and continue with the game as if it's a normal game
				const randomCandidate =
					foundCandidates.candidates.length === 1
						? foundCandidates.candidates[0]
						: foundCandidates.candidates[
								Math.floor(
									Math.random() *
										foundCandidates.candidates.length
								)
						  ];
				session.game.answer = randomCandidate.word;
				session.game.candidates = "";
				await session.save();
			}
		}

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
