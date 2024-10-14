export type WordleGameServerStatus = "pending" | "win" | "lost" | "none";
export type WordleGameServerResult = { guess: string; result: string };
export type WordleGameServerType = "normal" | "absurdle";

export default class WordleGameServer {
	maxNumTries: number;
	status: WordleGameServerStatus = "none";
	type: WordleGameServerType = "normal";
	candidates: string = "";
	answer: string = "";
	tries: number = 0;
	results: WordleGameServerResult[] = [];

	constructor(maxNumTries: number) {
		this.maxNumTries = maxNumTries;
	}
}
