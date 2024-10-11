export enum LetterMatch {
	Hit = "H",
	Present = "P",
	Miss = "M",
}

export type GuessResult = {
	guess: string;
	result: LetterMatch[];
};
