/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	decodeCandidates,
	encodeCadidates,
	findCandidates,
	getCandidates,
	getRandomWordsSubset,
	getSession,
	getWords,
	makeGuess,
	selectRandomWord,
	validateGuess,
} from "@/app/api/game/utils";
import { expect, it, vi, describe, beforeEach } from "vitest";
import words from "@/data/words";
import { Candidate } from "@/app/api/game/types";
import { getIronSession } from "iron-session";

describe("api utils", () => {
	describe("getWords", () => {
		it("should get all the words in data/words", () => {
			// remove WORDS env
			vi.stubEnv("WORDS", undefined);

			expect(getWords()).toHaveLength(words.length);
		});

		it("should get all the words in the WORDS env variable", () => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));

			expect(getWords()).toHaveLength(wordsList.length);
		});

		it("should get all the words in data/words if invalid WORDS env variable", () => {
			// create faulty WORDS env
			vi.stubEnv("WORDS", "");

			expect(getWords()).toHaveLength(words.length);
		});
	});

	describe("getRandomWordsSubset", () => {
		it("should return no words", () => {
			expect(getRandomWordsSubset(0)).toHaveLength(0);
		});

		it("should return the same words in the subset", () => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));

			// should be set to a maximum of wordsList.length items
			const subset1 = getRandomWordsSubset(wordsList.length);
			expect(subset1).toHaveLength(wordsList.length);

			const subset2 = getRandomWordsSubset(wordsList.length + 1);
			expect(subset2).toHaveLength(wordsList.length);

			// should include the same words
			const wordCounter: Record<string, boolean> = {};
			subset2.forEach((word) => {
				if (wordsList.includes(word) && !(word in wordCounter))
					wordCounter[word] = true;
			});
			expect(Object.keys(wordCounter)).toHaveLength(wordsList.length);
		});

		it("should return a random subset of words", () => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));

			const subsetLength = 3;
			const subset = getRandomWordsSubset(subsetLength);
			expect(subset).toHaveLength(subsetLength);

			// should include N unique words from the list
			const wordCounter: Record<string, boolean> = {};
			subset.forEach((word) => {
				if (wordsList.includes(word) && !(word in wordCounter))
					wordCounter[word] = true;
			});
			expect(Object.keys(wordCounter)).toHaveLength(subsetLength);
		});
	});

	describe("getCandidates", () => {
		it("should return all the words available as candidates", () => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));

			const candidates = getCandidates();
			expect(candidates).toHaveLength(wordsList.length);
			expect(candidates[0]).toHaveProperty("word");
			expect(candidates[0]).toHaveProperty("position");
		});

		it("should return 500 candidates from a long list of words", () => {
			// create WORDS env with 1000 "hello"s
			const wordsList = Array(1000).fill("hello");
			vi.stubEnv("WORDS", wordsList.join(", "));

			const candidates = getCandidates();
			expect(candidates).toHaveLength(500);
			expect(candidates[250]).toHaveProperty("word", "hello");
			expect(candidates[250]).toHaveProperty("position", 250);
		});
	});

	describe("encodeCandidates", () => {
		it("should return an empty string of encoded candidates", () => {
			expect(encodeCadidates([])).toBe("");
		});

		it("should return encoded candidates by position", () => {
			const candidates: Candidate[] = [
				{ word: "hello", position: 1 },
				{ word: "crazy", position: 382 },
				{ word: "world", position: 3 },
				{ word: "panic", position: 45 },
			];

			const encodedCandidates = encodeCadidates(candidates);
			expect(encodedCandidates).toBe("1,382,3,45");
		});

		it("should return a single encoded candidate", () => {
			const candidates: Candidate[] = [{ word: "crazy", position: 382 }];

			const encodedCandidates = encodeCadidates(candidates);
			expect(encodedCandidates).toBe("382");
		});
	});

	describe("decodeCandidates", () => {
		beforeEach(() => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));
		});

		it("should decode encoded candidates", () => {
			const candidatePos1 = "0,1,2,3,4";
			const candidates1 = decodeCandidates(candidatePos1);
			expect(candidates1).toHaveLength(5);

			const candidatePos2 = " 0, 2,4 ";
			const candidates2 = decodeCandidates(candidatePos2);
			expect(candidates2).toHaveLength(3);
			expect(candidates2[1]).toHaveProperty("word", "quite");

			const candidatePos3 = "2";
			const candidates3 = decodeCandidates(candidatePos3);
			expect(candidates3).toHaveLength(1);
			expect(candidates3[0]).toHaveProperty("word", "quite");
		});

		it("should have no candidates", () => {
			expect(decodeCandidates("")).toHaveLength(0);
		});

		it("should throw an error if a candidate is invalid", () => {
			expect(() => decodeCandidates("0,3,5")).toThrowError(/invalid/i);
			expect(() => decodeCandidates("a,3,4")).toThrowError(/invalid/i);
			expect(() => decodeCandidates("-1,3,4")).toThrowError(/invalid/i);
		});
	});

	describe("selectRandomWord", () => {
		it("should select a random word", () => {
			// create WORDS env
			const wordsList = ["hello", "world", "quite", "fancy", "panic"];
			vi.stubEnv("WORDS", wordsList.join(", "));

			const randomWord = selectRandomWord();
			expect(wordsList.includes(randomWord)).toBeTruthy();
		});
	});

	describe("makeGuess", () => {
		it("should return HHHHH", () => {
			expect(makeGuess("hello", "hello")).toBe("HHHHH");
		});

		it("should return PPPPP", () => {
			expect(makeGuess("abcde", "eabcd")).toBe("PPPPP");
		});

		it("should return MMMMM", () => {
			expect(makeGuess("abcde", "fghij")).toBe("MMMMM");
		});

		it("should return a mix of hits, presents and misses", () => {
			expect(makeGuess("hyeto", "hello")).toBe("HMPMH");
			expect(makeGuess("cbfdg", "abcde")).toBe("PHMHM");
		});
	});

	describe("validateGuess", () => {
		it("should return an error for a non-string guess", () => {
			const result = validateGuess({});
			expect(result).toHaveProperty("error");
			expect(result).not.toHaveProperty("guess");
			expect(result.error).toMatch(/must be a string/i);
		});

		it("should return an error for a string that's not 5 characters long", () => {
			const result1 = validateGuess("");
			expect(result1).toHaveProperty("error");
			expect(result1).toHaveProperty("guess");
			expect(result1.guess).toBe("");
			expect(result1.error).toMatch(/5/i);

			const result2 = validateGuess("appl");
			expect(result2.error).toMatch(/5/i);

			const result3 = validateGuess("apples");
			expect(result3.error).toMatch(/5/i);
		});

		it("should return an error for an invalid word", () => {
			const result1 = validateGuess("abcde");
			expect(result1).toHaveProperty("error");
			expect(result1).toHaveProperty("guess");
			expect(result1.guess).toBe("abcde");
			expect(result1.error).toMatch(/valid/i);
		});

		it("should return no error property if it is a valid word", () => {
			const result = validateGuess("hello");
			expect(result).not.toHaveProperty("error");
			expect(result).toHaveProperty("guess");
			expect(result.guess).toBe("hello");
		});
	});

	describe("findCandidates", () => {
		it("should return candidates with no points", () => {
			const candidateWords = [
				"hello",
				"world",
				"quite",
				"fancy",
				"panic",
				"crazy",
				"buggy",
			];
			const guess = "hello";

			const result = findCandidates(
				guess,
				candidateWords.map((c) => ({
					word: c,
					position: 0,
				}))
			);
			const candidates = result.candidates.map((c) => c.word);
			expect(result.points).toBe(0);
			expect(candidates).toEqual(["fancy", "panic", "crazy", "buggy"]);
		});

		it("should return a candidate with the least points", () => {
			const candidateWords = ["panic", "buggy"];
			const guess = "crazy";

			// findCandidates should return PANIC as PANIC has 2 Presents (C&A) and Buggy has 1 Hit (Y) which means PANIC has less points than Buggy
			const result = findCandidates(
				guess,
				candidateWords.map((c) => ({
					word: c,
					position: 0,
				}))
			);
			const candidates = result.candidates.map((c) => c.word);
			expect(result.points).toBe(2);
			expect(candidates).toEqual(["panic"]);
		});

		it("should return candidates with the least points", () => {
			const candidateWords = [
				"hello",
				"world",
				"fresh",
				"panic",
				"scare",
			];
			const guess = "scare";

			// all words have a score greater than 0
			// hello & world have 1 present so it should return those as candidates
			const result = findCandidates(
				guess,
				candidateWords.map((c) => ({
					word: c,
					position: 0,
				}))
			);
			const candidates = result.candidates.map((c) => c.word);
			expect(result.points).toBe(1);
			expect(candidates).toEqual(["hello", "world"]);
		});
	});
});

// Mock `getIronSession` and cookies
vi.mock("iron-session", () => ({
	getIronSession: vi.fn(),
}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

describe("getSession", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates a new game if no game exists in the session", async () => {
		const mockSession = {
			save: vi.fn(async () => {}),
		};
		(getIronSession as any).mockResolvedValue(mockSession);

		const session = await getSession();

		expect(session.game).toBeDefined();
		expect(session.game.maxNumTries).toBe(10);
		expect(mockSession.save).toHaveBeenCalled();
	});

	it("returns existing game if already present in the session", async () => {
		const existingGame = {
			status: "pending",
			maxNumTries: 10,
			tries: 1,
			answer: "hello",
		};
		const mockSession = {
			game: existingGame,
			save: vi.fn(async () => {}),
		};
		(getIronSession as any).mockResolvedValue(mockSession);

		const session = await getSession();

		expect(session.game).toEqual(existingGame);
		expect(mockSession.save).not.toHaveBeenCalled(); // Save should not be called if game already exists
	});
});
