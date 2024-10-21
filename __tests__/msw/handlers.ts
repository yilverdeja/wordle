import WordleGame from "@/lib/wordle/WordleGame";
import { http, HttpResponse } from "msw";

const session: WordleGame = new WordleGame(10);

export const handlers = [
	http.get("/api/game", () => {
		return HttpResponse.json({
			status: session.status,
			type: session.type,
			results: session.results,
			maxTries: session.maxNumTries,
			tries: session.tries,
			answer: session.answer,
		});
	}),
	http.post("/api/game/start", async ({ request }) => {
		const data = await request.json();
		const gameType = data.gameType;

		if (session.status === "pending") {
			return HttpResponse.json(
				{
					status: session.status,
					type: session.type,
					maxTries: session.maxNumTries,
					tries: session.tries,
					error: "A game is already active",
				},
				{ status: 409 }
			);
		}

		session.status = "pending";
		session.type = gameType;
		if (session.type === "absurdle") {
			session.candidates = "0,1,2,3,4,5";
			session.answer = "";
		} else {
			session.candidates = "";
			session.answer = "right";
		}

		session.tries = 0;
		session.results = [];

		return HttpResponse.json({
			status: session.status,
			type: session.type,
			maxTries: session.maxNumTries,
		});
	}),
	http.post("/api/game/guess", async ({ request }) => {
		const data = await request.json();
		const guess = data.guess;

		// handle a game that hasn't started
		if (session.status !== "pending") {
			return HttpResponse.json(
				{
					status: session.status,
					error: "The game has not started yet",
				},
				{ status: 400 }
			);
		}

		// handle an invalid guess input
		if (guess === "error") {
			return HttpResponse.json(
				{
					status: session.status,
					error: "Invalid guess",
				},
				{ status: 403 }
			);
		}

		// handle guess when game is pending
		session.tries += 1;

		// handle absurdle with no answer chosen
		if (session.type === "absurdle" && session.answer === "") {
			if (session.candidates === "0") {
				session.answer = "right";
				session.candidates = "";
			} else {
				session.candidates = session.candidates
					.split(",")
					.slice(0, -1)
					.join(",");
				session.results.push({ guess, result: "MMMMM" });

				if (session.maxNumTries === session.tries) {
					session.status = "lost";
				}

				return HttpResponse.json({
					status: session.status,
					type: session.type,
					tries: session.tries,
					results: session.results,
					guess,
					answer: null,
				});
			}
		}

		// handle when answer has been chosen
		if (guess === "right") {
			session.status = "win";
			session.results.push({ guess, result: "HHHHH" });

			return HttpResponse.json({
				status: session.status,
				type: session.type,
				tries: session.tries,
				results: session.results,
				guess,
				answer: session.answer,
			});
		}

		if (session.maxNumTries === session.tries) {
			session.status = "lost";
		}

		session.results.push({ guess, result: "HMPMH" });

		return HttpResponse.json({
			status: session.status,
			type: session.type,
			tries: session.tries,
			results: session.results,
			guess,
			answer: session.status === "lost" ? session.answer : null,
		});
	}),
];
