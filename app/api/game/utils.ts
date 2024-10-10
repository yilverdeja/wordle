import { getIronSession } from "iron-session";
import { SessionData, sessionConfig } from "./types";
import { cookies } from "next/headers";
import WordleGameServer from "@/lib/wordle/WordleGameServer";

export const getSession = async () => {
	const session = await getIronSession<SessionData>(cookies(), sessionConfig);

	if (!session.game) {
		session.game = new WordleGameServer(5);
		await session.save();
	}

	return session;
};
