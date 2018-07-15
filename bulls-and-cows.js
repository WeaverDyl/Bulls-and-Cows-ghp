var secret; // The secret number that the user has to guess
var currentAttempt; // The attempts that the user has used (user gets 8 attempts)
var won = false; // True if player has guessed the secret number, else false
var lost = false; // True if player is out of attempts, false otherwise

$(document).ready(function() {
    newGame(); // Automatically start a game on page load.

    // Handle guessing
    $('#submit-guess-btn').click(function() {
        var guess = $('#user-guess').val(); // The user's guess

        // Don't let user continue playing current game if they won already.
        if (won === true) {
            $('#result-msg').html(`You already won! The secret number was ${secret}.</br>
                Please start a new game by selecting the 'New Game' button!`);
            return;
        }
        // Don't let user continue playing current game if they lost already.
        if (lost === true) {
            $('#result-msg').html(`You already lost! The secret number was ${secret}.</br>
                Please start a new game by selecting the 'New Game' button!`);
            return;
        }

        // Check that the user's guess is valid (a 4-digit number).
        if (validGuess(guess)) {
            $('#result-msg').html(''); // Clear any previous result messages.
            var result = checkGuess(secret, guess) // Check the user's guess
            var bulls = result[0];
            var cows = result[1];

            $('#guess-' + currentAttempt).text($('#user-guess').val()); // Put the user's guess in the table
            $('#result-' + currentAttempt).text(`${bulls} Bull(s); ${cows} Cow(s)`); // Put the results in the table
            $('#user-guess').val(""); // Clear the guess field so user don't double submit by mistake
            currentAttempt += 1;
            
            
            // User wins if bulls is 4 (which means cows is 0)
            if (bulls === 4) {
                won = true;
                $('#result-msg').html(`You win! The secret number was ${secret}.</br>
                    Please start a new game by selecting the 'New Game' button!`);
                return;
            }

            //The player used all their attempts and lost!
            if (currentAttempt == 9) {
                lost = true;
                $('#result-msg').html(`You lost! The secret number was ${secret}.`);
                return;
            }
        } else {
            // The guess wasn't valid, so let user know, and don't count as attempt.
            $('#result-msg').html('Invalid guess! Please enter a 4 digit number.');
        }
    });

    // Start a new game if the user clicked the `new game` button.
    $('#new-game-btn').click(function() {
        newGame()
    });
});


/**
 * Zips arrays together so you can compare their corresponding elements.
 * 
 * Thanks to https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
 * @param {...Array} arrays - Any number of arrays to be zipped together 
 * @returns {Array} The zipped together arrays
 */
function zip(arrays) {
    // ZIP ZIP ZIP
    return Array.apply(null,Array(arrays[0].length)).map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

/**
 * Takes in the secret number and a guessed number and returns how many bulls
 * and cows the guess contains.
 * 
 * @param {number} secret - The secret number
 * @param {number} guess - The user's guessed number
 * @returns {Array} returns an array conforming to [# of bulls, # of cows]. 
 */
function checkGuess(secret, guess) {
    var bull = 0;
    var cow = 0;
    var secretDict = {};
    var guessDict = {};

    // Convert the secret/guess numbers to arrays (1234 => [1,2,3,4])
    var secretToArray = secret.toString(10).split("").map(function(t){return parseInt(t)});
    var guessToArray = guess.toString(10).split("").map(function(t){return parseInt(t)});

    // Zip the two arrays ([1,2,3,4], [5,6,7,8] => [[1,5],[2,6],[3,7],[4,8]])
    var secretGuessZip = secretToArray.map(function(e, i) {
        return [e, guessToArray[i]];
    });
    
    // Go through each digit and compare the secret to the guess
    for (var i = 0; i < secretToArray.length; i++) {
        var secretElem = secretGuessZip[i][0];
        var guessElem = secretGuessZip[i][1];

        // If the two digits each, then that's a bull
        if (secretElem === guessElem) {
            bull += 1;
        } else {
            // Otherwise, increment the number of occurences of the digits
            secretDict[secretElem] = (secretDict[secretElem] || 0) + 1
            guessDict[guessElem] = (guessDict[guessElem] || 0) + 1
        } 
    }


    // Calculate the number of cows by taking the minimum count of digit occurences
    // to avoid double counting bulls and cows
    for (var key in guessDict) {
        cow += Math.min(guessDict[key], (secretDict[key] || 0))
    }

    return [bull, cow];
}

/**
 * Checks if the user's guess is a 4-digit number
 * @param {*} guess - The user's input for the game
 * @returns {boolean} true if the argument is a 4 digit number, false otherwise.
 */
function validGuess(guess) {
    return /^\d{4}$/.test(guess)
}

/**
 * Resets the game table and all variables to start a new game.
 */
function newGame() {
    clearTable(); // Remove all previous elements from the game table.
    $('#result-msg').html("");
    $('#user-guess').val("");

    // Generate a new number and reset all variables.
    secret = pickRandomNumber();
    currentAttempt = 1;
    won = false;
    lost = false;
}

/**
 * Clears any previous guesses and results from the game table.
 */
function clearTable() {
    var tableLength = $('#bc-table tr').length;

    // Clear the `guess` and `result` columns of the game table.
    for (var i = 0; i < tableLength; i++) {
        $('#guess-' + i).text("");
        $('#result-' + i).text("");
    }
}

/**
 * Generates a random 4-digit number.
 * @returns {number} The random number that was generated
 */
function pickRandomNumber() {
    var min = 1000; // The current minimum value for 4-digit b&c
    var max = 9999;// The current maximum value for 4-digit b&c
    return Math.floor(Math.random() * (max - min + 1)) + min; // Random number
}
