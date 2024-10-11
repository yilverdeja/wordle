import words from "@/data/words";
import { getSession } from "../utils";

const selectRandomWord = (): string => {
	if (process.env.WORDS !== undefined) {
		const customWords = process.env.WORDS.split(", ");
		return customWords[Math.floor(Math.random() * customWords.length)];
	} else {
		return words[Math.floor(Math.random() * words.length)];
	}
};

export async function POST() {
	const session = await getSession();

	// Initialize the game if not already started or if it finished
	if (session.game.status !== "pending") {
		session.game.status = "pending";
		session.game.tries = 0;
		session.game.results = [];
		session.game.answer = selectRandomWord();
		console.log(session.game.answer);
		await session.save();

		return new Response(
			JSON.stringify({
				status: session.game.status,
				maxTries: session.game.maxNumTries,
			}),
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	// Return error if a new game is being requested while it's ongoing
	return new Response(
		JSON.stringify({
			status: session.game.status,
			maxTries: session.game.maxNumTries,
			tries: session.game.tries,
			error: "A game is already active",
		}),
		{
			status: 409,
			headers: { "Content-Type": "application/json" },
		}
	);
}
