const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(100,100);

const matrix = [
	[1,1,1],
	[1,1,1],
	[1,1,1],
];

function createMatrix(w,h){
	var boardMatrix = [];
	for (var i=0;i<h;i++){
		boardMatrix.push(new Array(w).fill(0));
	}
	return boardMatrix;
}

const boardMatrix = createMatrix(12,20);
console.table(boardMatrix);

function addPlayerToBoard(board, player){
	player.matrix.forEach(function(row, y){
		row.forEach(function(value, x){
			if(value!==0){
				board[player.pos.y+y][player.pos.x+x]=value;
			}
		});
	});
}

function collide(board, player){
	var pMatrix = player.matrix;
	for(var i=0;i<pMatrix.length;i++){
		for(var j=0;j<pMatrix[i].length;j++){
			//check board if 1 or 0, and check if the row exists using board[i+player.pos.y]!==0
			// if(pMatrix[i][j]!==0 && (board[i+player.pos.y] && board[i+player.pos.y][j+player.pos.x])!==0){
			// 	return true;
			// }
			if(pMatrix[i][j]!==0 && (board[i+player.pos.y] === undefined || board[i+player.pos.y][j+player.pos.x]!==0)){
				return true;
			}
		}
	}
	return false;
}
// for (var i=0;i<matrix.length;i++){
// 	for (var j=0;j<matrix[i].length;j++){
// 		if(matrix[i][j]!==0){
// 			context.fillStyle="red";
// 			context.fillRect(j,i,1,1);
// 		}
// 	}
// }
function drawMatrix(matrix, offset){
	matrix.forEach(function(row,y){
		row.forEach(function(value,x){
			if(value !== 0){
				context.fillStyle = "red";
				context.fillRect(x+offset.x,y+offset.y,1,1);
			}
		});
	});
}

var player = {
	pos: {x: 5, y:0},
	matrix: matrix,
}

window.addEventListener('keydown',function(event){
	//you cant use this in this case, can console.log(this) to see why
	//console.log(event); 
	if(event.keyCode ===37){
		player.pos.x-=1;
		console.log(player.pos.x);
	}	
	else if(event.keyCode ===39){
		player.pos.x+=1;
		console.log(player.pos.x);
	}
	else if(event.keyCode ===40){
		player.pos.y+=1;
		dropCounter=0;	
	}
})

var dropCounter = 0;
var dropInterval = 1000;
var lastTime = 0;
//time is a build in parameter for requestAnimationFrame where it increments time
//set default time = 0 otherwise first value will be NaN and we need to use isNaN() on deltaTime so dropcounter dont add a NaN and kill this operation
function update(time=0){
	var deltaTime = time - lastTime;
	lastTime = time; 

	dropCounter+=deltaTime;
 	if (dropCounter>=dropInterval){
 		player.pos.y+=1;
 		dropCounter=0;
 		if (collide(boardMatrix,player)===true){
 			player.pos.y -=1; //use debugger to see how many rows to deduct, in this case the block has to cross over the grid to detect collision 
 		 	addPlayerToBoard(boardMatrix,player);
 			player.pos.y=0;
 		}
 	}
	//everytime update using requestAnimationFrame, we set canvas back to black
	context.fillStyle = '#000';
	context.fillRect(0,0,canvas.width,canvas.height);
	drawMatrix(player.matrix, player.pos);
	drawMatrix(boardMatrix, {x:0,y:0});
	requestAnimationFrame(update);

	//console.log(player.pos.y)
}

update();