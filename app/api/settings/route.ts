import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const settings = {
		maxtries: 3,
	};
	//   const encryptedWord = encryptWord(word);
	return NextResponse.json(settings);
}
