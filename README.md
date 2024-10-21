# Wordle

## What is Wordle?

Players have a set amount of attempts (usually 6) to guess a five-letter word, with feedback given for each guess in the form of coloured tiles indicating when letters match or occupy the correct position.

### How it works?

For the different wordle implementations in this repository, these are some things to note:

-   A guess must be a valid 5-letter word
-   A letter in a green box means that the letter is in the right place
-   A letter in the yellow box means that the letter exists, but it's not in the right place
-   A letter in the gray box means that the letter does not exist in the answer
-   The player "wins" if they guess the answer within the max allowed rounds
-   The player "loses" if they failed to guess the answer after the max allowed rounds

## Features

This game was implemented using the NextJS 14 API routes, and with cookies to manage sessions between different clients.

### Basic Gameplay

The basic gameplay of world has been implemented:

-   A user selects the `Start` button to start a game session
-   A user must try to guess the correct word in the allotted maximum tries
-   A user wins if the words match the answer exactly, and a user loses if they reach the maximum number of tries without getting the word correct

### Absurdle

Flows similar to normal wordle, but in the start of the session, the host does not select the answer. Instead it keeps a list of candidates based on the input.

See [absurdle.online](https://absurdle.online/) for a longer description.

## Getting Started

### Application

To start the application, first install the NPM packages

```bash
npm install
```

Start the development site using

```bash
npm run dev
```

To build use

```bash
npm run build
```

To perform testing use

```bash
npm run test
```

### Environment Variables

> Note: This is optional. Not adding it will make the server choose from a list of 5-letter words defined at `@/data/words.ts`

Create a .env.local file in the root directory

```bash
touch .env.local
```

For the server / client game found in the home page `/`, set `WORDS` to a string of words separated by a comma delimiter. Example `.env.local`:

```
WORDS="hello, world, quite, fancy, fresh, panic, crazy, buggy"
```

## Specifications

### Technology Stack

This app was developed with Typescript, NextJS and TailwindCSS.

#### Dependencies

Main dependencies are:

-   **axios**: Used to make api calls. Rather than using fetch, axios has a lot of useful built-in behavior (i.e. auto parsing JSON) which streamlines the process for handling API calls.
-   **iron-session**: It's a lightweight library used for session management using cookies. Helpful to make the server / client game and track the games of different users

## Implementation Details

### Cookie Sessions

To avoid using a database, this app utilizes cookie sessions to track the different game sessions from different users.

Each cookie contains the `WordleGame` class object:

```typescript
// @/lib/wordle/WordleGame.ts
export type WordleGameStatus = "pending" | "win" | "lost" | "none";
export type WordleGameResult = { guess: string; result: string };
export type WordleGameType = "normal" | "absurdle";

export default class WordleGame {
	/* 
    the maximum number of tries per game 
    */
	maxNumTries: number;

	/* 
    the current status of the game

    where "none" is not started, "win" & "lost" are just ended and "pending" is ongoing 
    */
	status: WordleGameStatus = "none";

	/*
    the type of game to play

	where "normal" is the basic gameplay and "absurdle" is the absurd version
    */
	type: WordleGameType = "normal";

	/*
    candidates is used for the absurdle game play
	
    candidates is a string with a "," delimiter that denotes all the positions of possible word candidates
	
    i.e. assuming words = ["a", "b", "c", "d", "e"], then a value of "0,2,3" points at "a", "c" and "d"
    */
	candidates: string = "";

	/*
    the final word of the game that the user should try to guess
    */
	answer: string = "";

	/*
    the number of tries the user has attempted
    */
	tries: number = 0;

	/*
    the results for each guess the user has attempted
	
    result is a 5-letter string that contains either "H" for "Hit", "P" for "Present", and "M" for "Miss"
    */
	results: WordleGameResult[] = [];

	/*
    sets the maximum number of tries on initialization
    */
	constructor(maxNumTries: number) {
		this.maxNumTries = maxNumTries;
	}
}
```

### Cookie Optimizations

Browser cookies have a maximum limit of 4KB, so it's important to make sure the size of the cookie does not exceed that value.

By adding the `Absurdle` game play type, as we cannot work with a single `answer`, we need to track the previous candidates that were generated from previous guesses.

`candidates` is a string of numbers separated by a comma delimiter. The numbers specify the index positions each word candidate found in the word list provided.

As an example, the words provided are: `hello, world, quite, fancy, fresh, panic, crazy, buggy`. If candidates is `0,2,3,6`, then it's pointing at `hello, quite, fancy, crazy`.

## Improvements

### Responsive design

Currently, this application only works on computers and hasn't been designed for mobile usage.

### UI Feedback / Animations

Right now, the UI doesn't have a lot of feedback regarding some user interactions. Here are some places for improvements:

-   Making a incorrect guess: input box shakes, or is outlined in red to show it was invalid

## Next Steps

### Multiplayer

Allow two players to battle against each other in real-time

#### Implementation Ideas

Although NextJS supports WebSockets, Vercel, where the demo is hosted, does not. For local environments, I can use a web socket, but for Vercel I can use an external library like [PartyKit](https://www.partykit.io/)
