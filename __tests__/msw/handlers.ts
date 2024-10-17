import { http, HttpResponse } from "msw";

let gameStatus = "none";
let currentGameType = "normal";

export const handlers = [
	http.get("/api/game", () => {
		return HttpResponse.json({
			status: gameStatus,
			type: "normal",
			results: [],
			maxTries: 10,
			tries: 0,
			answer: "",
		});
	}),
	http.post("/api/game/start", async ({ request }) => {
		const data = await request.json();
		const gameType = data.gameType;

		if (gameStatus === "pending") {
			return HttpResponse.json(
				{
					status: gameStatus,
					type: currentGameType,
					maxTries: 10,
					tries: 0,
					error: "A game is already active",
				},
				{ status: 409 }
			);
		}

		gameStatus = "pending";
		currentGameType = gameType;

		return HttpResponse.json({
			status: gameStatus,
			type: currentGameType,
			maxTries: 10,
		});
	}),
];
