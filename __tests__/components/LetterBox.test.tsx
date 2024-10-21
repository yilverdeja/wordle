import LetterBox from "@/components/LetterBox";
import { LetterMatch } from "@/lib/wordle/types";
import { render, screen } from "@testing-library/react";

describe("LetterBox", () => {
	it("should render a letter box with a HIT state", () => {
		render(<LetterBox letter="a" state={LetterMatch.Hit} />);

		const letterBox = screen.getByTestId(`letter-box-${LetterMatch.Hit}`);

		expect(letterBox).toBeDefined();
		expect(letterBox.innerHTML).toBe("a");
	});

	it("should render a letter box with a PRESENT state", () => {
		render(<LetterBox letter="B" state={LetterMatch.Present} />);

		const letterBox = screen.getByTestId(
			`letter-box-${LetterMatch.Present}`
		);

		expect(letterBox).toBeDefined();
		expect(letterBox.innerHTML).toBe("B");
	});

	it("should render a letter box with a MISS state", () => {
		render(<LetterBox letter="?" state={LetterMatch.Miss} />);

		const letterBox = screen.getByTestId(`letter-box-${LetterMatch.Miss}`);

		expect(letterBox).toBeDefined();
		expect(letterBox.innerHTML).toBe("?");
	});
});
