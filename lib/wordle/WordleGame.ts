export type WordleGameStatus = "pending" | "win" | "lost" | "none";
export type WordleGameResult = { guess: string; result: string };
export type WordleGameType = "normal" | "absurdle";

export default class WordleGame {
	maxNumTries: number;
	status: WordleGameStatus = "none";
	type: WordleGameType = "normal";
	candidates: string = "";
	answer: string = "";
	tries: number = 0;
	results: WordleGameResult[] = [];

	constructor(maxNumTries: number) {
		this.maxNumTries = maxNumTries;
	}
}
