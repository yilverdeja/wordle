import { getIronSession } from "iron-session";
import { SessionData, sessionConfig } from "./types";
import { cookies } from "next/headers";
import WordleGame from "@/lib/wordle/WordleGame";
import words from "@/data/words";

export const getSession = async () => {
	const session = await getIronSession<SessionData>(cookies(), sessionConfig);

	if (!session.game) {
		session.game = new WordleGame(10);
		await session.save();
	}

	return session;
};

export const getWords = (): string[] => {
	if (process.env.WORDS !== undefined) {
		return process.env.WORDS.split(", ");
	} else {
		return words;
	}
};

export const getRandomWordsSubset = (numWords: number) => {
	const words = getWords();
	const selectedIndices = new Set();
	const subset = [];

	while (subset.length < Math.min(numWords, words.length)) {
		const index = Math.floor(Math.random() * words.length);
		if (!selectedIndices.has(index)) {
			subset.push(words[index]);
			selectedIndices.add(index);
		}
	}

	return subset;
};

export const getCandidates = (): { word: string; position: number }[] => {
	const words = getRandomWordsSubset(1000);
	return words.map((word, index) => ({ word: word, position: index }));
};

export const encodeCadidates = (
	candidates: { word: string; position: number }[]
) => {
	return candidates
		.reduce((acc, curr) => (acc += curr.position + ","), "")
		.slice(0, -1);
};

export const decodeCandidates = (encodedCandidates: string) => {
	const words = getWords();
	return encodedCandidates.split(",").map((position) => ({
		word: words[parseInt(position)],
		position: parseInt(position),
	}));
};
