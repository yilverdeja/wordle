import LetterGrid from "@/components/LetterGrid";
import { LetterMatch } from "@/lib/wordle/types";
import { render, screen } from "@testing-library/react";

describe("LetterGrid", () => {
	it("should show no letter boxes", () => {
		render(<LetterGrid guessResults={[]} />);

		const letterBoxRow = screen.queryByTestId("letter-box-row");

		expect(letterBoxRow).toBeNull();
	});

	it("should show a single row of letter boxes", () => {
		render(
			<LetterGrid
				guessResults={[
					{
						guess: "abcde",
						result: [
							LetterMatch.Hit,
							LetterMatch.Present,
							LetterMatch.Miss,
							LetterMatch.Present,
							LetterMatch.Hit,
						],
					},
				]}
			/>
		);

		const letterBoxRow = screen.getByTestId("letter-box-row");

		expect(letterBoxRow).toBeDefined();

		const letterBoxes = screen.getAllByTestId("letter-box-H");
		expect(letterBoxes).toHaveLength(2);
	});

	it("should show multiple rows of letter boxes", () => {
		render(
			<LetterGrid
				guessResults={[
					{
						guess: "abcde",
						result: [
							LetterMatch.Hit,
							LetterMatch.Present,
							LetterMatch.Miss,
							LetterMatch.Present,
							LetterMatch.Hit,
						],
					},
					{
						guess: "abcde",
						result: [
							LetterMatch.Hit,
							LetterMatch.Present,
							LetterMatch.Miss,
							LetterMatch.Present,
							LetterMatch.Hit,
						],
					},
					{
						guess: "abcde",
						result: [
							LetterMatch.Hit,
							LetterMatch.Present,
							LetterMatch.Miss,
							LetterMatch.Present,
							LetterMatch.Hit,
						],
					},
				]}
			/>
		);

		const letterBoxRows = screen.getAllByTestId("letter-box-row");

		expect(letterBoxRows).toHaveLength(3);

		const letterBoxes = screen.getAllByTestId("letter-box-H");
		expect(letterBoxes).toHaveLength(2 * 3);
	});
});
