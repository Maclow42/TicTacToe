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
    squares[index].innerHTML = toPlay == 0 ? '<p>x</p>' : '<p>o</p>';
    squares[index].querySelector('p').classList.add(toPlay == 0 ? 'x' : 'o');
    squares[index].querySelector('p').classList.add('animate--pop');
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
        if (squares[a].querySelector('p').innerHTML &&
            squares[a].innerHTML == squares[b].innerHTML &&
            squares[a].innerHTML == squares[c].innerHTML) {
            gameState = (squares[a].querySelector('p').innerHTML === 'x' ? -1 : -2);
            break;
        }
    }

    var winnerText = '';

    switch(gameState){
        case -1:
            winnerText = 'X wins!';
            break;
        case -2:
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

    return gameState;
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