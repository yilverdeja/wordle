import { getSession } from "./utils";

export async function GET() {
	const session = await getSession();
	let answer = undefined;
	if (session.game.status === "win" || session.game.status === "lost") {
		answer = session.game.answer;
	}

	// returns the settings and status of the session
	return new Response(
		JSON.stringify({
			status: session.game.status,
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
