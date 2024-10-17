import { http, HttpResponse } from "msw";
export const handlers = [
	http.get("/api/game", () => {
		return HttpResponse.json({
			status: "none",
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
		return HttpResponse.json({
			status: "pending",
			type: gameType,
			maxTries: 10,
		});
	}),
];
