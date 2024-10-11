# Wordle

## How it works

Players have a set amount of attempts (usually 6) to guess a five-letter word, with feedback given for each guess in the form of coloured tiles indicating when letters match or occupy the correct position.

### Basic Understanding

For the different wordle implementations in this repository, these are some things to note:

-   A guess must be a valid 5-letter word
-   A letter in a green box means that the letter is in the right place
-   A letter in the yellow box means that the letter exists, but it's not in the right place
-   A letter in the gray box means that the letter does not exist in the answer
-   The player "wins" if they guess the answer within the max allowed rounds
-   The player "loses" if they failed to guess the answer after the max allowed rounds

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

## Implementations

### Basic (Client Only)

This version is only on the client side, and allows the user to update the game configuration like the maximum number of rounds, and a list of 5-letter words.

#### Features

-   Users can directly update the game settings and the available words to use
-   When the game starts, a random word is chosen from the preconfigured list
-   After the user guesses, they receive feedback on their guess

#### Main Improvements

-   Don't allow the user to update the game settings on the game page. Use the `WORDS` environment variable, or the predefined list of words in `@/data/words.ts`

### Server / Client

This feature was implemented using the NextJS API routes, and with cookies to manage sessions between different clients.

#### Features

-   Client can only start the game and make guesses
-   Client will get the answer when the game is finished either by winning or losing
-   On game start, Server will select a random word from a preconfigured list, or from an array of all valid 5-letter words
-   On game run, Server will process all guesses and track the game state from a clients cookies

## Improvements

### Responsive design

Currently, this application only works on computers and hasn't been designed for mobile usage.

### UI Feedback / Animations

Right now, the UI doesn't have a lot of feedback regarding some user interactions. Here are some places for improvements:

-   Making a incorrect guess: input box shakes, or is outlined in red to show it was invalid

### Refactor

Rather than having two different types of implementations, it would be more ideal to have a single application.

## Next Steps

### Absurdle

Create something similar to the [absurdle](https://absurdle.online/)

#### Implementation Ideas

Use the existing WordleGameServer session cookie to handle a game type of `absurdle` vs `normal`.

Scoring of `normal` game play is a bit different, so will need to modify implementation to handle both the `normal` game play and `absurdle` game play without adding too much data on the cookie session as it's limited to a maximum of 4kb.

### Multiplayer

Allow two players to battle against each other in real-time

#### Implementation Ideas

Although NextJS supports WebSockets, Vercel, where the demo is hosted, does not. For local environments, I can use a web socket, but for Vercel I can use an external library like [PartyKit](https://www.partykit.io/)
