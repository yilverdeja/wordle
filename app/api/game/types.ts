import WordleGameServer from "@/lib/wordle/WordleGameServer";
import { SessionOptions } from "iron-session";

export const sessionConfig: SessionOptions = {
	password: "ELm5eycNHAZ3bJ4Nru5M47RBAUXNVgjh",
	cookieName: "wordle-game-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
};

export interface SessionData {
	game: WordleGameServer;
}
