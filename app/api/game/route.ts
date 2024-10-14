import { getSession } from "./utils";

export async function GET() {
	const session = await getSession();

	// get answer if the game exists and it's over
	let answer = undefined;
	if (session.game.status === "win" || session.game.status === "lost") {
		answer = session.game.answer;
	}

	// returns the current status of the game session
	return new Response(
		JSON.stringify({
			status: session.game.status,
			type: session.game.type,
			results: session.game.results,
			maxTries: session.game.maxNumTries,
			tries: session.game.tries,
			answer,
		}),
		{
			headers: { "Content-Type": "application/json" },
		}
	);
}
