var toPlay = 0;

var gameState = 0; // >= 0: playing, -1: x wins, -2: o wins, 9: draw

const squares = document.getElementsByClassName('square');

for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener('click', () => {
        play(i);
    });
}

function play(index){
    if(gameState < 0)
        return;
    if(squares[index].classList.contains('x') || squares[index].classList.contains('o'))
        return;
    squares[index].innerHTML = toPlay == 0 ? 'x' : 'o';
    squares[index].classList.add(toPlay == 0 ? 'x' : 'o');
    toPlay = toPlay == 0 ? 1 : 0;
    
    checkGameState();
}

function checkGameState(){
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

    gameState++;
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a].innerHTML && squares[a].innerHTML == squares[b].innerHTML && squares[a].innerHTML == squares[c].innerHTML) {
            gameState = (squares[a].innerHTML === 'x' ? -1 : -2);
            break;
        }
    }


    switch(gameState){
        case -1:
            document.getElementsByClassName('gameState')[0].innerHTML = 'X wins!';
            document.getElementsByClassName('gameStateDiv')[0].classList.remove('hidden');
            break;
        case -2:
            document.getElementsByClassName('gameState')[0].innerHTML = 'O wins!';
            document.getElementsByClassName('gameStateDiv')[0].classList.remove('hidden');
            break;
        case 9:
            document.getElementsByClassName('gameState')[0].innerHTML = 'Draw!';
            document.getElementsByClassName('gameStateDiv')[0].classList.remove('hidden');
            break;
    }

    return gameState;
}

function reset(){
    for(let i = 0; i < squares.length; i++){
        squares[i].innerHTML = '';
        squares[i].classList.remove('x');
        squares[i].classList.remove('o');
    }
    document.getElementsByClassName('gameState')[0].innerHTML = '';
    document.getElementsByClassName('gameStateDiv')[0].classList.add('hidden')
    gameState = 0;
    toPlay = 0;
}