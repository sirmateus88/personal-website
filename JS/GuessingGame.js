function generateWinningNumber(){
    var winningNumber = Math.round(Math.random() * 100);
    if(winningNumber === 0){
        winningNumber = 1;
    }
    return winningNumber;
}

function shuffle(arr){
    //generate positions
    var elementsRemaining = arr.length;
    var indexToSwap;
    var currentElement;

    while(elementsRemaining > 0){
        indexToSwap = Math.round(Math.random() * (elementsRemaining - 1));
        currentElement = arr[elementsRemaining - 1];
        arr[elementsRemaining - 1] = arr[indexToSwap];
        arr[indexToSwap] = currentElement;
        elementsRemaining--;
    }
    return arr;
}

function Game(){
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
    this.numOfHints = 0;
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    var winner = this.winningNumber
    var guess = this.playersGuess;
    if((guess - winner) > 0){
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function(num){
    if(num > 100 || num <= 0 || isNaN(num)){
        return 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    //console.log(this.winningNumber);
    var difference = this.difference();
    var lower = this.isLower();
    if(this.playersGuess === this.winningNumber){
        $('#hint-button, #submit').prop("disabled",true);
        $('#gameplay-subheader').text('Everyone in the city can finally take their earplugs out!');
        $('#result').text('Press the Reset button to play again!');
        $('#result').slideDown();
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').addClass('highlighted');
        return 'You Win!';
    } else if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
        return 'You have already guessed that number.';
    }
    
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    
    if (this.pastGuesses.length >= 5){
        $('#hint-button, #submit').prop("disabled",true);
        $('#gameplay-subheader').text('Everyone\'s thermostat is stuck just a little too cold now!');
        $('#result').text('The winning number was: ' + this.winningNumber + '. Press the Reset button to play again!');
        $('#result').slideDown();
        return 'You Lose.';
    }


    if(lower){
        $('#gameplay-subheader').text('Guess Lower');
    } else {
        $('#gameplay-subheader').text('Guess Higher')
    }
    
    if(difference < 10){
        return 'You\'re burning up!';
    } else if(difference < 25){
        return 'You\'re lukewarm.';
    } else if(difference < 50){
        return 'You\'re a bit chilly.';
    } else {
        return 'You\'re ice cold!'
    }
    
}

function newGame(){
    return new Game;
}

Game.prototype.provideHint = function(){
    var hintArray = [];
    hintArray.push(generateWinningNumber());
    hintArray.push(generateWinningNumber());
    hintArray.push(this.winningNumber);
    shuffle(hintArray);
    this.numOfHints++;
    return hintArray;
}

function makeAGuess(game){
    var guess = +$('#players-input').val();
    $('#players-input').val('');
    return game.playersGuessSubmission(guess);
}

$(document).ready(function() {
    var game = new Game();
    $('#ready').click(function(e){
        $('#intro').fadeOut(400, function(){
            $('#app').fadeIn(400);
        });
    });
    $('#submit').click(function(e){
        $('#gameplay-header').text(makeAGuess(game));
    });
    $('#players-input').keypress(function(e){
        if(e.which == 13 && game.pastGuesses.length < 5){
            $('#gameplay-header').text(makeAGuess(game));
        }
    });
    $('#reset-button').click(function(e){
        game = new Game();
        $('#gameplay-header').text('Guessing Game');
        $('#gameplay-subheader').text('Guess a number between 1 and 100');
        $('#result').text('').slideUp();
        $('#guess-list li').text('-');
        $('#hint-button, #submit').prop("disabled",false);
        $('.guess').removeClass('highlighted');
    });
    $('#hint-button').click(function(e){
        if(game.numOfHints == 0){
            var hints = game.provideHint().join(', ');
            $('#result').text('Hint, the number is one of the following: ' + hints);
            $('#result').slideDown();
        } else {
            alert('You only get one hint!!');
        }        
    });
});