export default class WordleGameServer {
	maxNumTries: number;
	status: "pending" | "win" | "lost" = "pending";
	answer: string = "";
	tries: number = 0;
	results: { guess: string; result: string }[] = [];

	constructor(maxNumTries: number) {
		this.maxNumTries = maxNumTries;
	}
}
