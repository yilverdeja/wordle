import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionConfig } from "./start/route";

export async function GET() {
	const session = await getIronSession<SessionData>(cookies(), sessionConfig);

	if (!session.game) {
		return new Response(
			JSON.stringify({
				error: "The session has not started yet",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	// returns the settings and status of the session
	return new Response(
		JSON.stringify({
			status: session.game.status,
			results: session.game.results,
			maxTries: session.game.maxNumTries,
			tries: session.game.tries,
		}),
		{
			headers: { "Content-Type": "application/json" },
		}
	);
}
