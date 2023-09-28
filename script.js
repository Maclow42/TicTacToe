// Author : Maclow
'use strict';

// getted elements
const squares = document.getElementsByClassName('square');

// global variables
var toPlay = 0;
var gameState = 0; // >= 0: playing, -1: x wins, -2: o wins, 9: draw

// event listeners

// at start executed code
for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener('click', () => {
        play(i);
    });
}

// functions
class Tree {
    movePlayed;
    score;
    children = [];
    
    constructor(movePlayed, score) {
        this.movePlayed = movePlayed;
        this.score = score;
    }

    addChild(tree) {
        this.children.push(tree);
        return tree;
    }

    display(indent = 0) {
        console.log("-".repeat(indent) + this.movePlayed + " " + this.score);
        for (let child of this.children) {
            child.display(indent + 2);
        }
    }
}

function play(index){
    if(gameState < 0)
        return;
    if(squares[index].innerHTML || squares[index].innerHTML)
        return;

    squares[index].innerHTML = toPlay == 0 ? '<p>x</p>' : '<p>o</p>';
    squares[index].querySelector('p').classList.add(toPlay == 0 ? 'x' : 'o');
    squares[index].querySelector('p').classList.add('animate--pop');
    toPlay = toPlay == 0 ? 1 : 0;
    
    gameState = checkGameState(getBoard());

    var winnerText = '';

    switch(gameState){
        case 10:
            winnerText = 'X wins!';
            break;
        case -10:
            winnerText = 'O wins!';
            break;
        case 9:
            winnerText = 'Draw!';
            break;
    }

    if(winnerText != ''){
        document.getElementsByClassName('gameState')[0].innerHTML = winnerText;
        document.getElementsByClassName('gameStateDiv')[0].classList.remove('hidden');
    }

    if(toPlay == 1){
        // wait .5s before IA play
        setTimeout(function() {
            play(askIAPlay());
        }, 500);
    }
}

function checkGameState(board){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    var state = 0;
    for(let i = 0; i < board.length; i++){
        if(board[i] != '')
            state++;
    }

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] == board[b] && board[a] == board[c]) {
            return  board[a] === 'x' ? 10 : -10;
        }
    }

    return state;
}

function reset(){
    for(let i = 0; i < squares.length; i++){
        squares[i].innerHTML = '';
    }
    document.getElementsByClassName('gameState')[0].innerHTML = '';
    document.getElementsByClassName('gameStateDiv')[0].classList.add('hidden')
    gameState = 0;
    toPlay = 0;
}

function getBoard(){
    var board = [];
    for(let i = 0; i < squares.length; i++){
        if(squares[i].innerHTML)
            board.push(squares[i].querySelector('p').innerHTML);
        else
            board.push('');
    }
    return board;
}

function getPossibleMoves(board){
    var possibleMoves = [];
    for(let i = 0; i < 9; i++){
        if(!board[i])
            possibleMoves.push(i);
    }

    return possibleMoves;
}


function minmax(board, tree, maximizingPlayer){
    var state = checkGameState(board);

    if(state < 0 || state >= 9){
        switch(state){
            case 10:
                tree.score = 10;
                break;
            case -10:
                tree.score = -10;
                break;
            case 9:
                tree.score = maximizingPlayer ? -5 : 5;
                break;
        }
        return;
    }
    
    var bestScore = maximizingPlayer ? -Infinity : Infinity;

    var possibleMoves = getPossibleMoves(board);

    if(maximizingPlayer){
        for(let i = 0; i < possibleMoves.length; i++){
            var child = new Tree(possibleMoves[i]);
            //Do the move
            board[possibleMoves[i]] = 'x';
            //Compute score and push the child to current tree
            minmax(board, child, false);
            tree.addChild(child);
            //Update best score
            bestScore = Math.max(bestScore, child.score);
            //Undo the move
            board[possibleMoves[i]] = '';
        }
    }
    else{
        for(let i = 0; i < possibleMoves.length; i++){
            child = new Tree(possibleMoves[i]);
            //Do the move
            board[possibleMoves[i]] = 'o';
            //Compute score and push the child to current tree
            minmax(board, child, true);
            tree.addChild(child);
            //Update best score
            bestScore = Math.min(bestScore, child.score);
            //Undo the move
            board[possibleMoves[i]] = '';
        }
    }

    tree.score = bestScore;
}

function askIAPlay(){
    // alpha beta algorithm here
    var tree = new Tree(gameState, null, null);

    minmax(getBoard(), tree, toPlay == 0 ? true : false);

    var bestMoves = [];

    for(let i = 0; i < tree.children.length; i++){
        if(tree.children[i].score == tree.score){
            bestMoves.push(tree.children[i].movePlayed);
        }
    }

    //chose a random move in bestMoves
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}