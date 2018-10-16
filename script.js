const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(50,50);
var mySound;
var colSound;
var rowSound;

//setting first instance for player
var rand = Math.floor(Math.random()*7+1);
var matrix = createTetris(rand);

var startEle = document.getElementsByClassName("start")[0];
startEle.innerHTML = "START";
startEle.addEventListener('click', start);


var player = {
	pos: {x: 5, y:0},
	matrix: matrix,
}

function createTetris(rand){
	var matrix = [];
	switch (rand){
		//use different numbers so we can reference them to change colors later on
		case 1:
			matrix = [
				[0,0,0],
				[1,1,1],
				[0,1,0],
			];
			break;
		case 2:
			matrix = [
				[2,2,0],
				[0,2,2],
				[0,0,0]
			];
			break;
		case 3:
			matrix = [
				[3,3],
				[3,3]
			];
			break;
		case 4:
			matrix = [
				[0,4,0,0],
				[0,4,0,0],
				[0,4,4,0],
				[0,0,0,0]
			];
			break;
		case 5:
			matrix = [
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0]
			];
			break;
		case 6:
			matrix = [
				[0,6,0],
				[0,6,6],
				[0,0,6]
			];
			break;
		case 7:
			matrix = [
				[0,0,7,0],
				[0,0,7,0],
				[0,7,7,0],
				[0,0,0,0]
			];
			break;
	};
	return matrix;
}

function createMatrix(w,h){
	var boardMatrix = [];
	for (var i=0;i<h;i++){
		boardMatrix.push(new Array(w).fill(0));
	}
	return boardMatrix;
}

var boardMatrix = createMatrix(12,20);
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
				// context.fillStyle = "#E0FFFF";
				context.fillStyle = colors[value];
				context.fillRect(x+offset.x,y+offset.y,1,1);
			}
		});
	});
}

var colors = [null,randomColor(),randomColor(),randomColor(),randomColor(),randomColor(),randomColor(),randomColor()];
//key pressing function
window.addEventListener('keydown',function(event){
	//you cant use this in this case, can console.log(this) to see why
	if(event.keyCode ===37){
		player.pos.x-=1;
		//console.log(player.pos.x);
	}	
	else if(event.keyCode ===39){
		player.pos.x+=1;
		//console.log(player.pos.x);
	}
	else if(event.keyCode ===40){
		player.pos.y+=1;
		dropCounter=0;	
	}
	else if(event.keyCode ===38){
		rotate(player.matrix);
	}
})

function clearRow(){
	for (var i=0;i<boardMatrix.length;i++){
		//console.table(boardMatrix);
		//*can only check x > or < conditional and not = to
		if(boardMatrix[i].every(x=>x>0)){
			//remove the filled row
			boardMatrix.splice(i,1);
			//add back a row on top such that size of board doesnt change
			boardMatrix.splice(0,0,new Array(12).fill(0));
			colSound.stop();
			rowSound.play();
		}
	}
}

function rotate(matrix){
	var newArray = createMatrix(matrix.length, matrix.length);
	var z = matrix.length-1;
	for (var y=0;y<matrix.length;y++){
		for(var x=0;x<matrix.length;x++){
			newArray[x][z]=matrix[y][x];
		}
		z--;
	}
	//console.log(newArray);
	player.matrix = newArray;
}

function start(){
	boardMatrix = createMatrix(12,20);
	player.pos = {x: 5, y:0};
	timeCounter = 0;
	var scoreClass = document.getElementsByClassName("score")[0]
	while (scoreClass.hasChildNodes()){
		scoreClass.removeChild(scoreClass.lastChild);
	}
	mySound.play();
}

function reset(){
	boardMatrix = createMatrix(12,20);
	score = timeCounter;
	timeCounter = 0;
	var newDiv = document.createElement("div");
	newDiv.innerHTML="SCORE: "+score+"s";
	document.getElementsByClassName("score")[0].appendChild(newDiv);
}

function detectOver(){
	for(var i=0;i<boardMatrix[0].length;i++){
		if (boardMatrix[0][i]>=1) {
			reset();
		}
	}
}

var dropCounter = 0;
var dropInterval = 1000;
var lastTime = 0;
var timeCounter = 0;
var score = 0;

//time is a build in parameter for requestAnimationFrame where it increments time
//set default time = 0 otherwise first value will be NaN and we need to use isNaN() on deltaTime so dropcounter dont add a NaN and kill this operation
function update(time=0){
	mySound = new sound("sound/Braveheart.mp3");
	rowSound = new sound("sound/holyshit.mp3");
	var deltaTime = time - lastTime;
	lastTime = time; 

	dropCounter+=deltaTime;
 	if (dropCounter>=dropInterval){
 		timeCounter+=1;
 		player.pos.y+=1;
 		dropCounter=0;
 		if (collide(boardMatrix,player)===true){
 			player.pos.y -=1; //use debugger to see how many rows to deduct, in this case the block has to cross over the grid to detect collision 
 		 	addPlayerToBoard(boardMatrix,player);
 		 	//remove rows that are filled
 		 	clearRow();
 		 	detectOver();
 			player.pos = {x:5, y:0};
 			rand = Math.floor(Math.random()*7+1);
 			matrix = createTetris(rand)
 			player.matrix = matrix;
 		}
 	}
	//everytime update using requestAnimationFrame, we set canvas back to black
	context.fillStyle = "#000000";
	context.fillRect(0,0,canvas.width,canvas.height);
	drawMatrix(player.matrix, player.pos);
	drawMatrix(boardMatrix, {x:0,y:0});
	document.getElementsByClassName("time")[0].innerHTML="TIMER: "+timeCounter+"s";
	requestAnimationFrame(update);
	//console.log(player.pos.y)
}

update();

function randomColor(){
	var key = "0123456789ABCDEF";
	var color = "#";
	for (var i=0;i<6;i++){
		var rand = Math.floor(Math.random()*16);
		color+=key.charAt(rand);
	}
	return color;
}

function sound(src){
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload","auto");
	this.sound.setAttribute("controls","none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}