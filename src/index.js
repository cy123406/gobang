import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}
const COUNT = 5; //判断胜利个数
const SIZE = 15; //棋盘大小

class Board extends React.Component {
    renderSquare(x,y) {
        return (<Square value={this.props.squares[x][y]}
            onClick={() => this.props.onClick(x,y)} />);
    }
    render() {

        let list1 = (m,n) => {
            let res = [];
            for (let i = 0; i < n; i++){
                res.push(this.renderSquare(m, i));
            }
            return res;
        }

        let list = (m,n) => {
            let res = [];
            for (let i = 0; i < m; i++){
                res.push(<div className='board-row'>{list1(i, n)}</div>);
            }
            return res;
        }
        return (
            <div>
                {list(SIZE, SIZE)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(SIZE).fill().map(()=>Array(SIZE))
                }
            ],
            stepNumber: 0,
            isNext: true,
            winner: null
        };
    }
    handleClick(x,y) {
        let history = this.state.history.slice(0, this.state.stepNumber + 1);
        let current = history[history.length - 1];
        let squares = [];
        for (let i = 0; i < current.squares.length; i++){
            squares.push([...current.squares[i]]);
        }
        if (this.state.winner||squares[x][y]) { return; }
        squares[x][y] = this.state.isNext ? "x" : "o";
        let winner = calculateWinner(x, y, squares);
        this.setState({
            history: history.concat([{ squares: squares }]),
            stepNumber: history.length,
            isNext: !this.state.isNext,
            winner: winner
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.state.winner;
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (<li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>);
        });

        let status;
        if (winner) {
            status = "winner: " + winner;
        } else {
            status = "Next player: " + (this.state.isNext ? "x" : "o");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(x,y) => this.handleClick(x,y)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(x,y,squares) {
    let count = COUNT, size = SIZE, leftUp = 0, up = 0, rightUp = 0, left = 0, right = 0, leftDown = 0, down = 0, rightDown = 0;
    let leftUpTag = true, upTag = true, rightUpTag = true, leftTag = true, rightTag = true, leftDownTag = true, downTag = true, rightDownTag = true;
    for(let i=1;i<count;i++){
        if(x-i>=0){
            if(y-i>=0 && squares[x][y] == squares[x-i][y-i] && leftUpTag){
                leftUp += 1;
            }else{leftUpTag = false;}
            if(squares[x][y]==squares[x-i][y] && upTag){
                up += 1;
            }else{upTag = false;}
            if(y+i<size && squares[x][y] == squares[x-i][y+i] && rightUpTag){
                rightUp += 1;
            }else{rightUpTag = false;}
        }else{leftUpTag = false;upTag = false;rightUpTag = false;}

        if(x+i<size){
            if(y-i>=0 && squares[x][y] == squares[x+i][y-i] && leftDownTag){
                leftDown += 1;
            }else{leftDownTag = false;}
            if(squares[x][y]==squares[x+i][y] && downTag){
                down += 1;
            }else{downTag = false;}
            if(y+i<size && squares[x][y] ==squares[x+i][y+i] && rightDownTag){
                rightDown += 1;
            }else{rightDownTag = false;}
        }else{leftDownTag = false;downTag = false;rightDownTag = false;}

        if(y-i>=0 && squares[x][y] == squares[x][y-i] && leftTag){
            left += 1;
        }else{leftTag = false;}

        if(y+i<size && squares[x][y] == squares[x][y+i] && rightTag){
            right +=1;
        }else{rightTag = true;}

        if(!(leftUpTag||upTag||rightUpTag||leftTag||rightTag||leftDownTag||downTag||rightDownTag)){
            break;
        }
    }
    if(leftUp+rightDown>=count-1||up+down>=count-1||left+right>=count-1||rightUp+leftDown>=count-1){
        return squares[x][y];
    }
    return null;
}