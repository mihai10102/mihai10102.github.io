let set = [];
let tiles = [];
let ref = [];
let size = 5;
let tracked = null;
let counter = 0;
startingFrame = 0;
let setted = false;
let track = false;
let timerStarted = false;
let button = {
	x:525,
	y:100,
	text:"SCRAMBLE",
	w:150,
	h:35
};
function setup(){
	createCanvas(700,600);
	frameRate(15);
	colorMode(HSB);
	textAlign(CENTER,CENTER);

	for(let i = 0;i<size*size;i++){
		set[i] = i + 1;
		tiles[i] = new Tile(i+1);
		tiles[i].getData();
	}
}
function draw(){
	background(113,46,67,1);
	for(t of tiles)
		t.show();
	if(track)
		if(mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 500){
			move();
		}
	drawButton();
	if(timerStarted)
		counter = round((frameCount - startingFrame)/15);
	push();
	fill(0,0,0,1);
	textSize(32);
	text("TIME : " + counter, 575, 50);
	pop();

	if(timerStarted)
		if(isSolved()){
			timerStarted = false;
		}
}
function mousePressed(){
	if(mouseX >= button.x && mouseX <= button.x + button.w
		&& mouseY >= button.y && mouseY <= button.y + button.h)
		scramble();
	counter = 0;
}
function mouseDragged(){
	if(!setted){
		ref[0] = ((mouseX - mouseX % 100)/100);
		ref[1] = ((mouseY - mouseY % 100)/100);
		track = true;
		for(let i=0;i<25;i++)
			if (tiles[i].pos[0] == ref[0]*100 && tiles[i].pos[1] == ref[1]*100)
		tracked = i;
			console.log(tracked , tiles[tracked]);
		setted = true;
	}
}
function touchEnded(){
	tracked = null;
	track = false;
	setted = false;
}
function move(){
	if(mouseX < tiles[tracked].pos[0]){
		moveLeft(tracked);
		if(!timerStarted){
			timerStarted = true;
			couter = 0;
			startingFrame = frameCount;
		}
		return;
	}
	if(mouseX > tiles[tracked].pos[0] + 100){
		moveRight(tracked);
		if(!timerStarted){
			timerStarted = true;
			couter = 0;
			startingFrame = frameCount;
		}
		return;
	}
	if(mouseY < tiles[tracked].pos[1]){
		moveUp(tracked);
		if(!timerStarted){
			timerStarted = true;
			couter = 0;
			startingFrame = frameCount;
		}
		return;
	}
	if(mouseY > tiles[tracked].pos[1] + 100){
		moveDown(tracked);
		if(!timerStarted){
			timerStarted = true;
			couter = 0;
			startingFrame = frameCount;
		}
		return;
	}
}
function moveLeft(nr){
	let x = tiles[nr].pos[0];
	let y = tiles[nr].pos[1];

	for(let i=0;i<25;i++){
		if(tiles[i].pos[1] == y)
			if(tiles[i].pos[0] == 0)
				tiles[i].pos[0] = 400;
			else
				tiles[i].pos[0] -= 100;
	}
}
function moveRight(nr){
	let x = tiles[nr].pos[0];
	let y = tiles[nr].pos[1];

	for(let i=0;i<25;i++){
		if(tiles[i].pos[1] == y)
			if(tiles[i].pos[0] == 400)
				tiles[i].pos[0] = 0;
			else
				tiles[i].pos[0] += 100;
	}
}
function moveUp(nr){
	let x = tiles[nr].pos[0];
	let y = tiles[nr].pos[1];

	for(let i=0;i<25;i++){
		if(tiles[i].pos[0] == x)
			if(tiles[i].pos[1] == 0)
				tiles[i].pos[1] = 400;
			else
				tiles[i].pos[1] -= 100;
	}
}
function moveDown(nr){
	let x = tiles[nr].pos[0];
	let y = tiles[nr].pos[1];

	for(let i=0;i<25;i++){
		if(tiles[i].pos[0] == x)
			if(tiles[i].pos[1] == 400)
				tiles[i].pos[1] = 0;
			else
				tiles[i].pos[1] += 100;
	}
}
function drawButton(){
	push();
	fill(232,34,75,1);
	rect(button.x,button.y,button.w,button.h);
	fill(0,0,0,1);
	textSize(22);
	text(button.text,button.x + button.w/2 , button.y + button.h/2);
	pop();
}
function scramble(){
	for(let i=0;i<1000;i++){
		let direction = round(random(1,4));
		let piece = round(random(24));

		if(direction == 1)
			moveLeft(piece);
		else if(direction == 2)
			moveRight(piece);
		else if(direction == 3)
			moveUp(piece);
		else if(direction == 4)
			moveDown(piece);
	}
}
function isSolved(){
	let solved = true;
	for(let i=0;i<25;i++){
		let x = y = 0;
		x = tiles[i].pos[0] / 100;
		y = tiles[i].pos[1] / 100;
		let num = x + y*5;
		if (tiles[i].nr != num + 1)
			solved = false;
	}

	return solved;
}