import { GuessResult } from "@/lib/wordle/WordleGameSession";
import LetterBox from "./LetterBox";

interface Props {
	guessResults: GuessResult[];
}

const LetterGrid = ({ guessResults }: Props) => {
	return (
		<div className="flex flex-col justify-center gap-1">
			{guessResults.map(({ result, guess }, index) => (
				<div key={index} className="flex flex-row gap-1">
					{guess.split("").map((letter, pos) => (
						<LetterBox
							key={letter + pos}
							letter={letter}
							state={result[pos]}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default LetterGrid;
