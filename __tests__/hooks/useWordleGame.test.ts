import { renderHook, act, waitFor } from "@testing-library/react";
import useWordleGame from "@/hooks/useWordleGame";

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
});
