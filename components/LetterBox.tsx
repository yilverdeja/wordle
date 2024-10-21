import { LetterMatch } from "@/lib/wordle/types";

interface Props {
	letter: string;
	state: LetterMatch;
}

const getBoxStyle = (state: LetterMatch) => {
	switch (state) {
		case LetterMatch.Hit:
			return "bg-green-700";
		case LetterMatch.Present:
			return "bg-yellow-500";
		default:
			return "bg-slate-600";
	}
};

const LetterBox = ({ letter, state }: Props) => {
	return (
		<span
			data-testid={`letter-box-${state}`}
			className={`text-2xl w-10 h-10 flex flex-row justify-center items-center text-white ${getBoxStyle(
				state
			)}`}
		>
			{letter}
		</span>
	);
};

export default LetterBox;
