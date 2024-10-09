import WordleGameSession from "./WordleGameSession";

class WordleGame {
	words: string[];
	maxRoundsPerSession: number;
	sessions: WordleGameSession[] = [];
	currentSession: WordleGameSession | null = null;

	constructor(words: string[], maxNumRounds: number) {
		this.words = words;
		this.maxRoundsPerSession = maxNumRounds;
	}

	play() {
		if (this.currentSession) {
			console.error("A session is already in progress.");
			return;
		}
		const randomWordsPosition = Math.floor(
			Math.random() * this.words.length
		);
		const answer = this.words[randomWordsPosition];
		this.currentSession = new WordleGameSession(
			answer,
			this.maxRoundsPerSession
		);
	}

	stop() {
		if (!this.currentSession) {
			console.error("No active session to stop.");
			return;
		}
		this.sessions.push(this.currentSession);
		this.currentSession = null;
	}

	submitGuess(guess: string) {
		if (!this.currentSession) {
			console.error("No active session. Please start a new game.");
			return;
		}
		return this.currentSession.makeGuess(guess);
	}
}

export default WordleGame;
