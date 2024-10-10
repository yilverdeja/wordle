import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import words from "@/data/words";
import { NextRequest } from "next/server";

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

	if (!session.word) {
		// Select a new word if there isn't one already in the session
		session.word = words[Math.floor(Math.random() * words.length)];
		session.tries = 0; // Initialize or reset the number of tries
		await session.save();
	}

	// Return only the maximum number of tries to the client
	return new Response(JSON.stringify({ maxTries: 6 }), {
		headers: { "Content-Type": "application/json" },
	});
}

export async function POST(request: NextRequest) {
	const session = await getIronSession<SessionData>(cookies(), sessionConfig);
	const requestJson = await request.json();
	const guess = requestJson.guess;

	session.tries++; // Increment the number of tries
	let responseJson;

	if (guess === session.word) {
		// Correct guess
		responseJson = { result: "Correct", correctWord: session.word };
		session.word = null; // Reset the word for a new game
		session.tries = 0;
	} else {
		// Incorrect guess, do not reveal the word
		responseJson = { result: "Incorrect", correctWord: null };
	}

	await session.save();

	return new Response(JSON.stringify(responseJson), {
		headers: { "Content-Type": "application/json" },
	});
}
