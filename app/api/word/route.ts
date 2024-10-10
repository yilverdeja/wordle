import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const word = "apple";
	//   const encryptedWord = encryptWord(word);
	return NextResponse.json({ word });
}
