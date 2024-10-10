"use client";

import { GameProvider } from "@/context/GameContext";

export default function Providers({ children }: { children: React.ReactNode }) {
	return <GameProvider>{children}</GameProvider>;
}
