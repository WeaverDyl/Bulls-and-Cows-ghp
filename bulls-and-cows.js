var secret; // The secret number that the user has to guess
var currentAttempt; // The attempts that the user has used (user gets 8 attempts)
var won = false; // True if player has guessed the secret number, else false
var lost = false; // True if player is out of attempts, false otherwise

$(document).ready(function() {
    newGame();

    // Handle guessing
    $('#submit-guess-btn').click(function() {
        // Don't let user continue playing current game if they won already
        if (won === true) {
            $('#result-msg').html(`You already won! Please start a new game by 
            selecting the 'New Game' button!`);
            return;
        }
        if (lost === true) {
            $('#result-msg').html(`You already lost! 
            Please start a new game by selecting the 'New Game' button!`);
            return;
        }

        var guess = $('#user-guess').val();
        if (validGuess(guess)) {
            $('#result-msg').html('');
            var result = checkGuess(secret, guess)
            var bulls = result[0];
            var cows = result[1];

            $('#guess-' + currentAttempt).text($('#user-guess').val()); // Put the user's guess in the table
            $('#result-' + currentAttempt).text(`${bulls} Bulls; ${cows} Cows`); // Put the results in the table
            currentAttempt += 1;
            
            // User wins if bulls is 4 (which means cows is 0)
            if (bulls === 4) {
                won = true;
                $('#result-msg').html(`You win! Please start a new game by 
                    selecting the 'New Game' button!`);
                return;
            }

            //The player used all their attempts and lost!
            if (currentAttempt == 9) {
                lost = true;
                $('#result-msg').html(`You lost! The secret number was ${secret}.`);
                return;
            }
        } else {
            // Guess wasn't valid, so let user know, and don't count as attempt
            $('#result-msg').html('Invalid guess! Please enter a 4 digit number.');
        }
    });

    $('#new-game-btn').click(function() {
        newGame()
    });
});


/**
 * 
 * Thanks to https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
 * @param {*} arrays 
 */
function zip(arrays) {
    return Array.apply(null,Array(arrays[0].length)).map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

/**
 * 
 * @param {*} secret 
 * @param {*} guess 
 */
function checkGuess(secret, guess) {
    var bull = 0;
    var cow = 0;
    var secretDict = {};
    var guessDict = {};

    var secretToArray = secret.toString(10).split("").map(function(t){return parseInt(t)});
    var guessToArray = guess.toString(10).split("").map(function(t){return parseInt(t)});

    var secretGuessZip = secretToArray.map(function(e, i) {
        return [e, guessToArray[i]];
    });
    
    for (var i = 0; i < secretToArray.length; i++) {
        var secretElem = secretGuessZip[i][0];
        var guessElem = secretGuessZip[i][1];

        if (secretElem === guessElem) {
            bull += 1;
        } else {
            secretDict[secretElem] = (secretDict[secretElem] || 0) + 1
            guessDict[guessElem] = (guessDict[guessElem] || 0) + 1
        } 
    }


    for (var key in guessDict) {
        cow += Math.min(guessDict[key], (secretDict[key] || 0))
    }

    return [bull, cow];
}

/**
 * Returns true if the argument is a 4 digit number, false otherwise.
 * @param {*} guess - The user's input for the game
 */
function validGuess(guess) {
    return /^\d{4}$/.test(guess)
}

/**
 * Resets the webpage and all variables to make a new game.
 */
function newGame() {
    clearTable() // Remove all previous elements from the game table.

    // Generate a new number and reset all variables.
    secret = pickRandomNumber();
    currentAttempt = 1;
    won = false;
    lost = false;
}

/**
 * 
 */
function clearTable() {
    var tableLength = $('#bc-table tr').length;

    for (var i = 0; i < tableLength; i++) {
        $('#guess-' + i).text("");
        $('#result-' + i).text("");
    }
}

/**
 * 
 */
function pickRandomNumber() {
    var min = 1000; // The current minimum value for 4-digit b&c
    var max = 9999;// The current maximum value for 4-digit b&c
    return Math.floor(Math.random() * (max - min + 1)) + min; // Random number
}
