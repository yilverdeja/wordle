enum LetterMatch {
	Hit = "H",
	Present = "P",
	Miss = "M",
}

export type GuessResult = {
	guess: string;
	result: LetterMatch[];
};

export type Status = "pending" | "win" | "lost";

export type SessionResult = {
	status: Status;
};

class WordleGameSession {
	answer: string;
	maxNumRounds: number;
	createdAt: Date;
	numGuesses: number = 0;
	status: Status = "pending";
	guessResults: GuessResult[] = [];

	constructor(answer: string, maxNumRounds: number) {
		this.answer = answer;
		this.maxNumRounds = maxNumRounds;
		this.createdAt = new Date();
	}

	makeGuess(guess: string): SessionResult & GuessResult {
		this.numGuesses += 1;

		const result = Array<LetterMatch>(guess.length).fill(LetterMatch.Miss);

		if (guess === this.answer) {
			result.fill(LetterMatch.Hit);
			this.status = "win";
			const guessResult: GuessResult = { guess, result };
			this.guessResults.push(guessResult);
			return { status: this.status, ...guessResult };
		}

		if (this.maxNumRounds === this.numGuesses) {
			this.status = "lost";
		}

		const answerCharsTaken = Array<boolean>(this.answer.length).fill(false);

		// check for correct positions
		for (let i = 0; i < guess.length; i++) {
			if (guess[i] === this.answer[i]) {
				result[i] = LetterMatch.Hit;
				answerCharsTaken[i] = true;
			}
		}

		// check for wrong positions but correct letters
		for (let i = 0; i < guess.length; i++) {
			if (result[i] === LetterMatch.Miss) {
				// Only check those not already marked as 'G'
				for (let j = 0; j < this.answer.length; j++) {
					if (!answerCharsTaken[j] && guess[i] === this.answer[j]) {
						result[i] = LetterMatch.Present; // Correct letter, wrong position
						answerCharsTaken[j] = true;
						break; // Stop once a match is found
					}
				}
			}
		}

		const guessResult: GuessResult = { guess, result };
		this.guessResults.push(guessResult);
		return { status: this.status, ...guessResult };
	}
}

export default WordleGameSession;
