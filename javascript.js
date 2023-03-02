const manipulateDom=(()=>{
    const addToContainer= (obj) => {
        const container=document.querySelector(".container");
        container.appendChild(obj);
    };

    const deleteFromContainer= (obj) => {
        const container=document.querySelector(".container");
        container.removeChild(obj);
    };
    
    const createGrid=()=>{
        const grid=gridFactory("grid");
        for(let i=0;i<9;i++){
            const cell=cellFactory(Math.floor(i/3),i%3);
            grid.addElement(cell.cellElement);
        }
        return grid.board;
    };

    const createEndingdiv=(expression)=>{
        const div=document.createElement("p");
        div.className="ending-expression";
        div.textContent=expression;
        return div;
    };

    const showWinningResult=(winner,loser)=>{
        const grid=document.querySelector(".grid");
        deleteFromContainer(grid);
        addToContainer(createEndingdiv("congrats "+winner +" you are the winner."+" Hard Luck "+loser+" Try again!"));
    };

    const showDrawingResult=()=>{
        const grid=document.querySelector(".grid");
        deleteFromContainer(grid);
        addToContainer(createEndingdiv("It Is A Boring Draw. Try Again!"));
    };

    return {
        addToContainer,
        createGrid,
        showWinningResult,
        showDrawingResult
    };
})();

const gridFactory=(gridClassName)=>{
    const board=document.createElement("div");
    board.className=gridClassName;
    
    const addElement=(addedElement)=>{
        board.appendChild(addedElement);
    };
    return {addElement,board};
}

const cellFactory=(row,col)=>{
    const cellElement=document.createElement("div");
    cellElement.classList.add("cell");

    const _clickCell=()=>{
        if(!cellElement.textContent){
            let char=Game.putChar(row,col);
            cellElement.textContent=char;
            if(Game.isWin()!==""){
                let winningChar=Game.isWin();
                // console.log(Game.isWin());
                // console.log(Game.players);

                if(Game.players[0].char===winningChar){
                    manipulateDom.showWinningResult(Game.players[0].name,Game.players[1].name);
                }
                else{
                    manipulateDom.showWinningResult(Game.players[1].name,Game.players[0].name);
                }
            }
            else if(Game.isDraw()){
                manipulateDom.showDrawingResult();
            }
        }
    };

    cellElement.addEventListener("click",_clickCell);

    return {row,col,cellElement};
};

const Game=(()=>{
    let char="X";
    let board=[];
    let players=[];

    

    const _fillBoard=()=>{
        for(let i=0;i<3;i++){
            board[i]=[];
            for(let j=0;j<3;j++)
                board[i][j]="";
        }
    };

    const _checkRows=()=>{
        if(board[0][0]===board[0][1]&&board[0][0]===board[0][2]&&board[0][0]!=="") return board[0][0];
        if(board[1][0]===board[1][1]&&board[1][0]===board[1][2]&&board[1][0]!=="") return board[1][0];
        if(board[2][0]===board[2][1]&&board[2][0]===board[2][2]&&board[2][0]!=="") return board[2][0];
        return "";
    };

    const _checkcolumns=()=>{
        if(board[0][0]===board[1][0]&&board[0][0]===board[2][0]&&board[0][0]!=="") return board[0][0];
        if(board[0][1]===board[1][1]&&board[0][1]===board[2][1]&&board[0][1]!=="") return board[0][1];
        if(board[0][2]===board[1][2]&&board[0][2]===board[2][2]&&board[0][2]!=="") return board[0][2];
        return "";
    };

    const _checkDiagonals=()=>{
        if(board[0][0]===board[1][1]&&board[0][0]===board[2][2]&&board[0][0]!=="") return board[0][0];
        if(board[2][0]===board[1][1]&&board[2][0]===board[0][2]&&board[2][0]!=="") return board[2][0];
        return "";
    };
    const isWin=()=>{
        if(_checkRows()||_checkcolumns()||_checkDiagonals())
            return _checkRows()||_checkcolumns()||_checkDiagonals();
        return "";
    };

    const isDraw=()=>{
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(!board[i][j]) return false;
            }
        }
        return true;
    }

    const putChar=(row,col)=>{
        // console.log(char);
        board[row][col]=char;
        let temp=char;
        if(char==="X") char="O";
        else char="X";
        
        return temp;
    };

    const main=()=>{
        let playerOneName=prompt("Enter player One Name:");
        let playerTwoName=prompt("Enter player two Name:");
        players.push(playerfactory("X",playerOneName));
        players.push(playerfactory("O",playerTwoName));
        _fillBoard();
        console.log(board);
        const grid=manipulateDom.createGrid();
        manipulateDom.addToContainer(grid);
    };

    return {isWin,putChar,main,isDraw,board,players};
})();


const playerfactory=(char,name)=>{
    return {char,name};
};


Game.main();