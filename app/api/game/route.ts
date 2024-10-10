import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";

const sessionConfig: SessionOptions = {
	password: "ELm5eycNHAZ3bJ4Nru5M47RBAUXNVgjh",
	cookieName: "wordle-game-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
};

interface SessionData {
	word: string | null;
	tries: number;
}

export async function GET() {
	const session = await getIronSession<SessionData>(cookies(), sessionConfig);

	// returns the settings and status of the session
	return new Response(JSON.stringify({ maxTries: 6, tries: session.tries }), {
		headers: { "Content-Type": "application/json" },
	});
}
