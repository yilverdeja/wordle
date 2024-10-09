export type Results = { hit: number[]; present: number[]; miss: number[] };
export type Status = "pending" | "win" | "lost";

export type SessionResults = {
	status: Status;
	results: Results;
};

class WordleGameSession {
	answer: string;
	maxNumRounds: number;
	createdAt: Date;
	numGuesses: number = 0;
	status: Status = "pending";
	guesses: string[] = [];

	constructor(answer: string, maxNumRounds: number) {
		this.answer = answer;
		this.maxNumRounds = maxNumRounds;
		this.createdAt = new Date();
	}

	makeGuess(guess: string): SessionResults {
		this.numGuesses += 1;

		const results: Results = {
			hit: [],
			present: [],
			miss: [],
		};

		if (guess === this.answer) {
			this.status = "win";
		} else if (this.maxNumRounds === this.numGuesses) {
			this.status = "lost";
		} else {
			results.miss.push(1);
		}

		return { status: this.status, results };
	}
}

export default WordleGameSession;
