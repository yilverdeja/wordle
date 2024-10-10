# Wordle

## Normal Wordle

The game will select a 5-letter word (aka. answer) from a predefined list (configurable), all 5-letter words are expected to consist of English alphabet only and case-insensitive.

### Implementation Idea

-   WordleGameContext: Saves the state of the WordleGame in play
-   WordleGame has startPlay

game = new WordleGame(max_num_rounds, word_list) -- stores max_num_rounds, word_list, sessions_list = []; current_session = null
game.updateNumRounds() // getNumRounds
game.updateWordList() // addToWordList // getWordList
game.play() -- starts the game, sets up answer, and current_num_round to 0 (creates a new session)
game.stop() -- stops the game (stops the current session, saves it to the game sessions list, then clears the session)
game.makeGuess(guess) -- playe makes guess (only allowed if there is a current session in play)

session = WordleGameSession(answer, max_num_rounds) -- sets answer, max_num_rounds, current_round = 0, status = "pending" | "win" | "lose", guesses = []
session.makeGuess(guess) - returns a result with the status of the session after the guess, and an object that contains {hit: [], present: [], miss: []} the arrays of each will be the positions of the letters in the guess. hit means the letter is in the right spot, present is exists but wrong spot, and miss is letter is not part of the answer

-   **Game** selects 5 letter word as **ANSWER** from **predefined list** which is **configurable**
-   Game must have MAX_NUM_ROUNDS and LIST_WORDS
-   Rules: PLAYER wins if answer in MAX_NUM_ROUNDS, lose if not
-   Guess: HIT - letter in correct spot, PRESENT - letter exist but not in spot, MISS - letter not correct

user story:
USER enters APP
USER selects start
GAME starts --
USER enters GUESS
GAME checks GUESS to ANSWER
