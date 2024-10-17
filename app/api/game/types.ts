import WordleGame from "@/lib/wordle/WordleGame";
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
	game: WordleGame;
}

export type ValidateGuessResult = {
	guess?: string;
	error?: string;
};

export type Candidate = { word: string; position: number };
