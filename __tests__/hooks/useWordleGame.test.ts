import { renderHook, act, waitFor } from "@testing-library/react";
import useWordleGame from "@/hooks/useWordleGame";
import { LetterMatch } from "@/lib/wordle/types";

describe("useWordleGame", () => {
	it("should get initial game status", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.fetchData();
		});

		await waitFor(() => expect(result.current.status).toEqual("none"));

		expect(result.current.gameType).toBe("normal");
		expect(result.current.maxRounds).toBe(10);
		expect(result.current.guessResults).toHaveLength(0);
		expect(result.current.rounds).toBe(0);
		expect(result.current.answer).toBe(null);
	});

	it("should not allow a guess to be made if the game hasn't started", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.submitGuess("");
		});

		await waitFor(() => expect(result.current.error).not.toBeNull());

		expect(result.current.error?.type).toBe("guess");
	});

	it("should start a normal game", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.startGame("normal");
		});

		await waitFor(() => expect(result.current.status).toEqual("pending"));

		expect(result.current.gameType).toBe("normal");
		expect(result.current.maxRounds).toBe(10);
		expect(result.current.guessResults).toHaveLength(0);
		expect(result.current.rounds).toBe(0);
		expect(result.current.answer).toBe(null);
	});

	it("should not start another game if pending", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.startGame("normal");
		});

		await waitFor(() => expect(result.current.error).not.toBeNull());

		expect(result.current.error?.type).toBe("start");
	});

	it("should handle an invalid guess", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.submitGuess("error");
		});

		await waitFor(() => expect(result.current.error).not.toBeNull());

		expect(result.current.error?.type).toBe("guess");
		expect(result.current.rounds).toBe(0);
	});

	it("should handle an incorrect guess", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.submitGuess("");
		});

		await waitFor(() =>
			expect(result.current.guessResults).toHaveLength(1)
		);

		expect(result.current.guessResults[0]).toHaveProperty("guess", "");
		expect(result.current.guessResults[0]).toHaveProperty("result", [
			LetterMatch.Hit,
			LetterMatch.Miss,
			LetterMatch.Present,
			LetterMatch.Miss,
			LetterMatch.Hit,
		]);
		expect(result.current.rounds).toBe(1);
	});

	it("should win on the right guess", async () => {
		const { result } = renderHook(() => useWordleGame());

		act(() => {
			result.current.submitGuess("right");
		});

		await waitFor(() => expect(result.current.status).toEqual("win"));
	});
});
