import { NextRequest } from "next/server";
import {
	decodeCandidates,
	encodeCadidates,
	findCandidates,
	getCandidates,
	getSession,
	makeGuess,
	validateGuess,
} from "../utils";

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

			if (
				foundCandidates.points === 0 &&
				foundCandidates.candidates.length > 1
			) {
				// save candidates & save "attempted" failed guess
				session.game.candidates = encodeCadidates(
					foundCandidates.candidates
				);
				session.game.results.push({ guess, result: "MMMMM" });

				// check lost state
				if (session.game.maxNumTries === session.game.tries) {
					session.game.status = "lost";
				}

				await session.save();

				return new Response(
					JSON.stringify({
						status: session.game.status,
						type: session.game.type,
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
					type: session.game.type,
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
				type: session.game.type,
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
