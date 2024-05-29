var board=[
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], //Row 1, white pieces
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], 
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], //Row 8, black pieces
], objects=[
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null]
];
const IMAGES=new Map([
    ['K', "White_king"], 
    ['k', "Black_king"], 
    ['Q', "White_queen"], 
    ['q', "Black_queen"], 
    ['R', "White_rook"], 
    ['r', "Black_rook"], 
    ['N', "White_knight"], 
    ['n', "Black_knight"], 
    ['B', "White_bishop"], 
    ['b', "Black_bishop"], 
    ['P', "White_pawn"], 
    ['p', "Black_pawn"]
]);
const EMPTY=0, CAPTURE=1, BLOCKED=2;
function init() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
    for (let c=0; c<8; c++) for (let d=0; d<8; d++) {
        let cell=board[c][d];
        if (cell!=='0') {
            let type=IMAGES.get(cell);
            let image=document.createElement("img");
            image.src="Images/"+type+".png";
            image.setAttribute("alt", type);
            image.style.top=(7-c)*45+"px";
            image.style.left=d*45+"px";
            document.getElementById("board").appendChild(image);
            objects[c][d]=image;
        }
    }
}
var lastRow, lastColumn;
function selectCell(cell) {
    let classes=cell.classList;
    let row= +classes[2].charAt(1)-1, column= +classes[3].charAt(1)-1;
    let piece=board[row][column];
    if (cell.style.background==="yellow") {
        move(lastColumn, lastRow, column-lastColumn, row-lastRow, true);//TODO change
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"burlywood":"saddlebrown";
        }
    } else {
        lastRow=row; lastColumn=column;
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"burlywood":"saddlebrown";
        }
        for (let moveOption of movementOptions(piece, row, column)) {
            for (let element of document.getElementsByClassName("r"+(moveOption[0]+1))) {
                if (element.classList.contains("c"+(moveOption[1]+1))) {
                    element.style.background="yellow";
                    lastRow=row;
                    lastColumn=column;
                }
            }
        }
    }
    cell.style.background="green";
}
function movementOptions(piece, row, column) {
    let cellsToMoveTo=[];
    switch(piece) {
        case 'K': case 'k'://Kings
            if (column<7&&row>0) cellsToMoveTo.push([row-1, column+1]);
            if (column<7) cellsToMoveTo.push([row, column+1]);
            if (column<7&&row<7) cellsToMoveTo.push([row+1, column+1]);
            if (row<7) cellsToMoveTo.push([row+1, column]);
            if (column>0&&row<7) cellsToMoveTo.push([row+1, column-1]);
            if (column>0) cellsToMoveTo.push([row, column-1]);
            if (column>0&&row>0) cellsToMoveTo.push([row-1, column-1]);
            if (row>0) cellsToMoveTo.push([row-1, column]);
            break;
        case 'Q': case 'q'://Queens
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions(piece===piece.toUpperCase()?'R':'r', row, column), 
                                               movementOptions(piece===piece.toUpperCase()?'B':'b', row, column));
            break;
        case 'R': case 'r'://Rooks
            for (let c=row+1; c<=7; c++) {//up
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, board[c][column])===BLOCKED) break;
            }
            for (let c=row-1; c>=0; c++) {//down
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, board[c][column])===BLOCKED) break;
            }
            for (let c=column+1; c<=7; c++) {//right
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, board[row][c])===BLOCKED) break;
            }
            for (let c=column-1; c>=0; c++) {//left
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, board[row][c])===BLOCKED) break;
            }
            break;
        case 'N': case 'n'://Knights
            let moveOptions=[[row+1, column+2], [row+2, column+1], [row-1, column+2], [row-2, column+1], 
                             [row-1, column-2], [row-2, column-1], [row+1, column-2], [row+2, column-1]];
            for (let moveOption of moveOptions) {
                if (moveOption[0]<0||moveOption[0]>7||moveOption[1]<0||moveOption[1]>7) continue;
                else cellsToMoveTo.push([moveOption[0], moveOption[1]]);
            }
            break;
        case 'B': case 'b'://Bishops
            for (let c=1; c<8; c++) {//up right
                if (row+c>7 || column+c>7) break;
                else {
                    cellsToMoveTo.push([row+c, column+c]);
                    if (interaction(piece, board[row+c][column+c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down right
                if (row-c<0 || column+c>7) break;
                else {
                    cellsToMoveTo.push([row-c, column+c]);
                    if (interaction(piece, board[row-c][column+c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down left
                if (row-c<0 || column-c<0) break;
                else {
                    cellsToMoveTo.push([row-c, column-c]);
                    if (interaction(piece, board[row-c][column-c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//up left
                if (row+c>7 || column-c<0) break;
                else {
                    cellsToMoveTo.push([row+c, column-c]);
                    if (interaction(piece, board[row+c][column-c])===BLOCKED) break; 
                }
            }
            break;
        case 'P': case 'p'://Pawns
            let operation=((piece===piece.toUpperCase())?1:-1);
            if (interaction(piece, board[row+operation][column])!=BLOCKED) {
                cellsToMoveTo.push([row+operation, column]);
                if (row===((piece===piece.toUpperCase())?1:6)&&interaction(piece, board[operation*2+row][column])!=BLOCKED) {
                    cellsToMoveTo.push([operation*2+row, column]);
                }
            }
            if (column<7) cellsToMoveTo.push([row+operation, column+1]);
            if (column>0) cellsToMoveTo.push([row+operation, column-1]);
            break;
        case 0:default:break;
    }
    return cellsToMoveTo;
}
function interaction(piece, target) {
    if (target==='0') return EMPTY;
    else if ((piece===piece.toUpperCase()&&target===target.toLowerCase())||(piece===piece.toUpperCase()&&target===target.toLowerCase())) return CAPTURE;
    else return BLOCKED;
}
function move(columnStartWhite, rowStartWhite, columnDistanceWhite, rowDistanceWhite, legalWhite, 
              columnStartBlack, rowStartBlack, columnDistanceBlack, rowDistanceBlack, legalBlack) {
    let imageWhite=objects[rowStartWhite][columnStartWhite], imageBlack=objects[rowStartBlack][columnStartBlack];
    let leftWhite=columnStartWhite*45, topWhite=(7-rowStartWhite)*45, leftBlack=columnStartBlack*45, topBlack=rowStartBlack*45;
    let c=0, idC=setInterval(func, 20); 
    function func() {
        leftWhite+=columnDistanceWhite;
        imageWhite.style.left=leftWhite+"px";
        topWhite-=rowDistanceWhite;
        imageWhite.style.top=topWhite+"px";
        leftBlack+=columnDistanceBlack;
        imageBlack.style.left=leftBlack+"px";
        topBlack-=rowDistanceBlack;
        imageBlack.style.top=topBlack+"px";
        if (Math.abs(imageWhite.style.left-imageBlack.style.left)<5 && 
            Math.abs(imageWhite.style.top-imageBlack.style.top)<5 && 
            legalWhite && legalBlack) {
            let d=1; idD=setInterval(funcTwo, 40);
            function funcTwo() {
                imageWhite.style.left+=(d%4>=2?5:-5);
                imageBlack.style.left+=(d%4>=2?5:-5);
                if (d>8) clearInterval(idD); else d++;
            }
            clearInterval(idC);
        }
        if (c>=45) clearInterval(idC); else c++;
    }
    if (legalWhite) {
        board[rowStartWhite+rowDistanceWhite][columnStartWhite+columnDistanceWhite]=board[rowStartWhite][columnStartWhite];
        board[rowStartWhite][columnStartWhite]='0';
        objects[rowStartWhite+rowDistanceWhite][columnStartWhite+columnDistanceWhite]=objects[rowStartWhite][columnStartWhite];
        objects[rowStartWhite][columnStartWhite]=null;
    } else {
        imageWhite.style.left=columnStartWhite*45;
        imageWhite.style.top=rowStartWhite*45;
    }
    if (legalBlack) {
        board[rowStartBlack+rowDistanceBlack][columnStartBlack+columnDistanceBlack]=board[rowStartBlack][columnStartBlack];
        board[rowStartBlack][columnStartBlack]='0';
        objects[rowStartBlack+rowDistanceBlack][columnStartBlack+columnDistanceBlack]=objects[rowStartBlack][columnStartBlack];
        objects[rowStartBlack][columnStartBlack]=null;
    } else {
        imageBlack.style.left=columnStartBlack*45;
        imageBlack.style.top=rowStartBlack*45;
    }
}