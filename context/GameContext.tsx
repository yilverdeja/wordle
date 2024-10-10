// GameContext.tsx
import useWordleGame, { UseWordleGame } from "@/hook/useWordleGame";
import WordleGame from "@/lib/wordle/WordleGame";
import React, { createContext, useContext, ReactNode } from "react";

const GameContext = createContext<UseWordleGame | null>(null);

interface GameProviderProps {
	children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const game = useWordleGame(
		[
			"apple",
			"brown",
			"chair",
			"delta",
			"eagle",
			"frame",
			"ghost",
			"happy",
			"ideal",
			"juice",
		],
		5
	);

	return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGame = (): WordleGame => {
	const context = useContext(GameContext);
	if (context === null) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context.game; // Access the 'game' property of the context
};

export const useGameContext = (): UseWordleGame => {
	const context = useContext(GameContext);
	if (context === null) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context; // Return the entire 'UseWordleGame' object
};
