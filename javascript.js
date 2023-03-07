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

        const parent=document.createElement("div");
        parent.className="parent";

        const div=document.createElement("p");
        div.className="ending-expression";
        div.textContent=expression;
        
        const player1=document.createElement("div");
        player1.className="ending-player";
        player1.textContent=Game.players[0].name+": "+Game.players[0].points;
        
        const player2=document.createElement("div");
        player2.className="ending-player";
        player2.textContent=Game.players[1].name+": "+Game.players[1].points;

        const players=document.createElement("div");
        players.className="players";
        players.appendChild(player1);
        players.appendChild(player2);

        const button=document.createElement("button");
        button.addEventListener("click",Game.tryAgain);
        button.textContent="Try Again";


        parent.appendChild(div);
        parent.appendChild(players);
        parent.appendChild(button);
        return parent;
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

    const activateSubmission=()=>{
        const form=document.querySelector("form");
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            // console.log(e.currentTarget);
            Game.players.push(playerfactory("X",e.currentTarget.FirstPlayer.value));
            Game.players.push(playerfactory("O",e.currentTarget.SecondPlayer.value));
            deleteFromContainer(form);
            Game.startGame();
        });
    }

    return {
        addToContainer,
        createGrid,
        showWinningResult,
        showDrawingResult,
        activateSubmission,
        deleteFromContainer
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
                    Game.players[0].points++;
                    manipulateDom.showWinningResult(Game.players[0].name,Game.players[1].name);
                }
                else{
                    Game.players[1].points++;
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

    const startGame=()=>{
        _fillBoard();
        char="X";
        manipulateDom.addToContainer(manipulateDom.createGrid());
    }

    const tryAgain=()=>{
        const parent=document.querySelector(".parent");
        manipulateDom.deleteFromContainer(parent);
        startGame();

    }

    const main=()=>{
        manipulateDom.activateSubmission();
    };



    return {isWin,putChar,main,isDraw,startGame,tryAgain,board,players};
})();


const playerfactory=(char,name)=>{
    let points=0;
    return {char,name,points};
};


Game.main();