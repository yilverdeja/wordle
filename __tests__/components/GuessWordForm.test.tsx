import GuessWordForm from "@/components/GuessWordForm";
import { render, screen, fireEvent } from "@testing-library/react";

const onUpdateGuess = vi.fn((guess) => guess);
const onSubmitGuess = vi.fn();

describe("GuessWordForm", () => {
	it("should render the guess word form element", () => {
		render(
			<GuessWordForm
				guess="guess"
				onUpdateGuess={onUpdateGuess}
				onSubmitGuess={onSubmitGuess}
			/>
		);

		const input = screen.getByTestId("guess-input");
		const button = screen.getByTestId("guess-submit");

		expect(input).toHaveProperty("value", "guess");
		expect(input).toHaveProperty("disabled", false);
		expect(button).toHaveProperty("disabled", false);
	});

	it("should render a disabled element", () => {
		render(
			<GuessWordForm
				guess=""
				onUpdateGuess={onUpdateGuess}
				onSubmitGuess={onSubmitGuess}
				disable={true}
			/>
		);

		const input = screen.getByTestId("guess-input");
		const button = screen.getByTestId("guess-submit");

		expect(input).toHaveProperty("disabled", true);
		expect(button).toHaveProperty("disabled", true);

		fireEvent.click(button);
		expect(onSubmitGuess).toHaveBeenCalledTimes(0);
	});

	it("should only handle valid input changes", () => {
		render(
			<GuessWordForm
				guess=""
				onUpdateGuess={onUpdateGuess}
				onSubmitGuess={onSubmitGuess}
			/>
		);

		const input = screen.getByTestId("guess-input");

		fireEvent.change(input, { target: { value: "a" } }); // valid
		fireEvent.change(input, { target: { value: "abCdE" } }); // valid
		expect(onUpdateGuess).toHaveBeenCalledWith("abCdE");

		fireEvent.change(input, { target: { value: "ZZZZZzzzzz" } }); // valid
		expect(onUpdateGuess).toHaveBeenCalledWith("ZZZZZ"); // clipped at 5 characters

		fireEvent.change(input, { target: { value: "abCdE1" } }); // invalid
		fireEvent.change(input, { target: { value: "3" } }); // invalid
		fireEvent.change(input, { target: { value: "@a#._-B" } }); // invalid

		expect(onUpdateGuess).toBeCalledTimes(3);
	});

	it("should handle submit", () => {
		render(
			<GuessWordForm
				guess=""
				onUpdateGuess={onUpdateGuess}
				onSubmitGuess={onSubmitGuess}
			/>
		);

		const button = screen.getByTestId("guess-submit");

		fireEvent.click(button);
		expect(onSubmitGuess).toBeCalled();
	});
});
