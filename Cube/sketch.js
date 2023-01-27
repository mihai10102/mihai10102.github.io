const pieceSize = 33.33333;const delay = 50;let textarea = null;let texarea2 = null;let button = null;
let crossSolution = [];let f2lSolution = [];let ollSolution = [];let pllSolution = [];let allSol = [];
let cube = 
	[
		[1,1,1,1,1,1,1,1,1],
		[2,2,2,2,2,2,2,2,2],
		[3,3,3,3,3,3,3,3,3],
		[4,4,4,4,4,4,4,4,4],
		[5,5,5,5,5,5,5,5,5],
		[6,6,6,6,6,6,6,6,6]
	];
let pieceCoordinates = 
	[
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}],
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}],
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}],
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}],
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}],
		[{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2},{x:-2,y:-2}]
	]
let corners = [
	[{x:0,y:0},{x:3,y:6},{x:4,y:2}],
	[{x:0,y:2},{x:3,y:8},{x:2,y:0}],
	[{x:0,y:8},{x:1,y:2},{x:2,y:6}],
	[{x:0,y:6},{x:1,y:0},{x:4,y:8}],
	[{x:5,y:0},{x:1,y:6},{x:4,y:6}],
	[{x:5,y:2},{x:1,y:8},{x:2,y:8}],
	[{x:5,y:8},{x:3,y:2},{x:2,y:2}],
	[{x:5,y:6},{x:3,y:0},{x:4,y:0}]];
let edges = [
	[{x:0,y:1},{x:3,y:7}],
	[{x:0,y:5},{x:2,y:3}],
	[{x:0,y:7},{x:1,y:1}],
	[{x:0,y:3},{x:4,y:5}],
	[{x:5,y:1},{x:1,y:7}],
	[{x:5,y:5},{x:2,y:5}],
	[{x:5,y:7},{x:3,y:1}],
	[{x:5,y:3},{x:4,y:3}],
	[{x:1,y:3},{x:4,y:7}],
	[{x:3,y:3},{x:4,y:1}],
	[{x:3,y:5},{x:2,y:1}],
	[{x:1,y:5},{x:2,y:7}]];

function setup(){
	createCanvas(1080,628);
	strokeWeight(1);
	frameRate(10);
	textAlign(CENTER,CENTER);
	
    textarea = document.getElementById('moveInput');
    textarea.className = 'info';
    //document.body.appendChild(textarea);
    //textarea.setAttribute("id", "moveInput");
    textarea.style.cssText = `margin: none; padding: none; resize: none; position: relative;`;
   	textarea.rows = 2;
    textarea.cols = 20;
    /*textarea.style.top = -10 + 'px';
    textarea.style.left = -1080 + 'px';
    */
	button = document.getElementById('makeMove');
    button.className = 'btnclass';
    //document.body.appendChild(button);
    button.style.cssText = `margin: 0px 0px 0px 0px; padding: 0; resize: none; position: relative;`;
    button.innerHTML = "MAKE MOVE";
    button.style.height = "40px";
    button.style.top = -17.5 + 'px';
    button.style.left = -5 + 'px';
    button.addEventListener("click", makeMove); 
   
	let br = createP();
    textarea2 = document.getElementById('solution');
    textarea2.className = 'sol';
    //document.body.appendChild(textarea2);
    textarea2.setAttribute("id", "solution");
    textarea2.style.cssText = `margin: 0px 0px 0px 0px; padding: 0; resize: none; position: absolute;`;
    textarea2.rows = 2;
    textarea2.cols = 100;
    //textarea2.style.top = -25 + 'px';
}
function draw(){
	background(151);
	coloring();}

//RENDERING THE CUBE
function coloring(){
	drawCube();
	let x = width*3/4;
	fill(0,255,255);
	rect(x-150,66*7.5, 660/20 + 300, 66);
	rect(x-150,66*8.5, 660/20 + 300, 66);
	fill(0);
	textSize(48);
	text("SOLVE",x-150 + 333/2, 660 / 10*7.5 + 33)
	text("SCRAMBLE",x-150 + 333/2, 660 / 10*8.5 + 33);
	textSize(32);text("Manual scramble:",width/8,height/8);
	push();
	textAlign(LEFT,TOP);
	textSize(22);text("Write down individual moves, or",width/100,height*2/11);
	textSize(22);text("multiple ones, separated by comas.",width/100,height*3/11);
	textSize(22);text("Then, press the 'MAKE MOVE' button",width/100,height*4/11);
	textSize(22);text("Valid moves: U,U2,U3,R,R2,R3,",width/100,height*5/11);
	textSize(22);text("F,F2,F3,L,L2,L3,D,D2,D3,B,B2,B3",width/100,height*6/11);
	textSize(22);text("(not case sensitive)",width/100,height*7/11);
	textSize(22);text("(alternatively,try the auto-scrambler",width/100,height*8/11);
	textSize(22);text("on the right side)",width/100,height*9/11);
	pop()}
function drawCube(){
	let numbers = [[775,100],[775,200],[875,100],[775,0],[675,100],[775,300]];
	for(let i=0;i<6;i++) drawCubeFace(numbers[i][0],height/10+numbers[i][1],i);}
function drawCubeFace(x,y,faceNumber){
	let colors = 
	[
		[220,220,0],
		[0,0,255],
		[255,0,0],
		[0,255,0],
		[220,123,0],
		[255,255,255]
	]
	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
			fill(colors[cube[faceNumber][i*3+j]-1]);
			pieceCoordinates[faceNumber][i*3+j].x = x+pieceSize*j;
			pieceCoordinates[faceNumber][i*3+j].y = y+pieceSize*i;
			rect(x+pieceSize*j,y+pieceSize*i,pieceSize,pieceSize);
			fill(0);
		}
	}}
///////////////////////////

//EVENT LISTENER
function mousePressed(){
	if(mouseX >= width*3/4 - 150 && mouseX <= width*3/4 - 150 + height/20 + 300){
		if(mouseY >= height / 10*7.5 && mouseY <= height / 10*7.5 + height/10){
			solveCube();
		}
		if(mouseY >= height / 10*8.5 && mouseY <= height / 10*8.5 + height/10){
			scramble();
		}
	}}
////////////////////////////

//MAKING MOVES
function sleep() { return new Promise(resolve => setTimeout(resolve, delay)); }
async function betterEval(move){eval(move)();await sleep();}
async function scramble(){
	let moves = ["U","U2","U3","R","R2","R3","F","F2","F3","L","L2","L3","D","D2","D3","B","B2","B3"];
	for(let i=0;i<20;i++) await betterEval(random(moves));}
function makeMove(){
	move = textarea.value;
	if(move == "") return;
	if(move.includes(',')){
		var moves = move.split(",");
		moves.forEach(mov => {
			mov = mov[0].toUpperCase() + mov.substr(1, mov.length-1);
			(mov.length > 3) ? alert("INVALID MOVE!") : betterEval(mov);
		});
	} else {
		move = move[0].toUpperCase() + move.substr(1, move.length-1);
		(move.length > 2) ? alert("INVALID MOVE!") : betterEval(move);
	}}
///////////////

//SOLVING THE CUBE
async function solveCube(){
	crossSolution = [];
	f2lSolution = [];
	ollSolution = [];
	pllSolution = [];

	let solved = true;
	for(let i=0;i<6;i++){
		for(let j=0;j<9;j++){
			if(cube[i][j] != i+1)
				solved = false;
		}
	}

	if(!solved){
		await solveCross();
		await solveF2L();
		await OLL();
		await PLL();

		allSol = crossSolution.concat(f2lSolution.concat(ollSolution.concat(pllSolution)));
		console.log(allSol);
		for(let i = 0; i < allSol.length - 1; i++){
			if(allSol[i].length == 1 && allSol[i][0] == allSol[i + 1][0] && allSol[i + 1][1] == "3"){
				allSol.splice(i, 2);
			}else if(allSol[i + 1].length == 1 && allSol[i][0] == allSol[i + 1][0] && allSol[i][1] == "3"){
				allSol.splice(i, 2);
			}else if(allSol[i].length == 1 && allSol[i][0] == allSol[i + 1][0] && allSol[i + 1][1] == "2"){
				allSol[i] = allSol[i][0] + "3";
				allSol.splice(i + 1, 1);
			}else if(allSol[i + 1].length == 1 && allSol[i + 1][0] == allSol[i][0] && allSol[i][1] == "2"){
				allSol[i] = allSol[i][0] + "3";
				allSol.splice(i + 1, 1);
			}else if(allSol[i][0] == allSol[i + 1][0] && allSol[i][1] == "2" && allSol[i + 1][1] == "2"){
				allSol.splice(i, 2);
			}else if(allSol[i][0] == allSol[i + 1][0] && allSol[i][1] == "2" && allSol[i + 1][1] == "3"){
				allSol[i] = allSol[i][0];
				allSol.splice(i + 1, 1);
			}else if(allSol[i][0] == allSol[i + 1][0] && allSol[i][1] == "3" && allSol[i + 1][1] == "2"){
				allSol.splice(i, 2);
			}else if(allSol[i].length == 1 && allSol[i] == allSol[i + 1]){
				allSol[i] = allSol[i] + "2";
				allSol.splice(i + 1, 1);
			}
		}
		textarea2.value = allSol.toString() + " ";
	}}
async function solveCross(){
	let pieces = [[6,2],[6,3],[6,5],[6,4]];
	let positions = [[5,1,1,7],[5,5,2,5],[5,7,3,1],[5,3,4,3],[1,3,4,7],[1,5,2,7],
					[3,5,2,1],[3,3,4,1],[0,7,1,1],[0,5,2,3],[0,1,3,7],[0,3,4,5]];
	let algs = [["F2"],["R2","U"],["B2","U2"],["L2","U3"],["L3","U3","L"],["R","U","R3"],
				["R3","U","R"],["L","U3","L3"],[""],["U"],["U2"],["U3"]];
	let orientationAlg = ["U3","R3","F","R"];

	for(let p=2;p<6;p++){
		for(let i=0;i<positions.length;i++){
			if(cube[positions[i][0]][positions[i][1]] == 6 && 
				cube[positions[i][2]][positions[i][3]] == p){
				if(i!=0){
					for(let j=0;j<algs[i].length;j++){
						if(algs[i][j] != "") {await betterEval(algs[i][j]);
						crossSolution.push(algs[i][j]);}
					}
					F2();
					crossSolution.push("F2");
				}
			} else if(cube[positions[i][0]][positions[i][1]] == p &&
						 cube[positions[i][2]][positions[i][3]] == 6){
				for(let j=0;j<algs[i].length;j++){
					if(algs[i][j] != ""){await betterEval(algs[i][j]);
					crossSolution.push(algs[i][j]);}
				}
				for(let j=0;j<orientationAlg.length;j++){
					if(algs[i][j] != ""){await betterEval(orientationAlg[j]);
					crossSolution.push(orientationAlg[j]);}
				}
			}
		}
		Y();
		crossSolution.push("Y");
	}}
async function solveF2L(){
	//corners
	//let colors = [[2,3],[3,4],[4,5],[5,2]]
	let cornerPositions = [[5,0,1,6,4,6],[5,2,1,8,2,8],[5,8,3,2,2,2],[5,6,3,0,4,0,],[0,0,3,6,4,2],[0,2,3,8,2,0],[0,6,1,0,4,8],[0,8,1,2,2,6]];
	let cornerPlacementAlgs = [["L3","U3","L"],["R","U","R3"],["R3","U2","R","U3"],["L","U2","L3"],["U2"],["U"],["U3"]];
	let cornerInsertAlgs = [["R","U2","R3","U3","R","U","R3"],["R","U","R3"],["U","R","U3","R3"]];
	let nrs = [[6, 2, 3],[6, 4, 3],[6, 4, 5],[6, 5, 2]]

	for(let i=0;i<4;i++)
	{
		for(let j=0;j<cornerPositions.length;j++){
			let colors = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
			colors[cube[cornerPositions[j][0]][cornerPositions[j][1]]] = 1;
			colors[cube[cornerPositions[j][2]][cornerPositions[j][3]]] = 1;
			colors[cube[cornerPositions[j][4]][cornerPositions[j][5]]] = 1;

			if(colors[nrs[i][0]] == 1 && colors[nrs[i][1]] == 1 && colors[nrs[i][2]] == 1){
				if(j<cornerPositions.length-1){
					if(j==1 && cube[5][2]==6){} else 
					for(let k=0;k<cornerPlacementAlgs[j].length;k++){
						await betterEval(cornerPlacementAlgs[j][k]);
						f2lSolution.push(cornerPlacementAlgs[j][k]);
					}
				} else {
					if(cube[0][8] == 6){
						for(let k=0;k<cornerInsertAlgs[0].length;k++){
							await betterEval(cornerInsertAlgs[0][k]);
							f2lSolution.push(cornerInsertAlgs[0][k]);
						}
					} else if(cube[1][2] == 6){
						for(let k=0;k<cornerInsertAlgs[2].length;k++){
							await betterEval(cornerInsertAlgs[2][k]);
							f2lSolution.push(cornerInsertAlgs[2][k]);
						}
					} else if(cube[2][6] == 6){
						for(let k=0;k<cornerInsertAlgs[1].length;k++){
							await betterEval(cornerInsertAlgs[1][k]);
							f2lSolution.push(cornerInsertAlgs[1][k]);
						}
					}
				}
			}
		}
		Y();
		f2lSolution.push("Y");
	}
	
	//edges
	let edgePositions = [[1,5,2,7],[1,3,4,7],[3,5,2,1],[3,3,4,1],[0,5,2,3],[0,1,3,7],[0,3,4,5],[0,7,1,1]];
	let edgePlacementAlgs = [["R3","F","R","F3","R","U3","R3","U","R","U3","R3","U2","R","U3","R3"],["L3","U3","L","U","F","U","F3"],
	["R3","U","R","U","B","U3","B3"],["L","U3","L3","U3","B3","U","B"],["U"],["U2"],["U3"]];
	let edgeInsertAlgs = [["U","R","U3","R3","U3","F3","U","F"],["U2","F3","U","F","U","R","U3","R3"]];
	let nrs2 = [[2, 3],[2, 5],[4, 3],[4, 5]];
	let nrs3 = [[2, 3],[5, 2],[3, 4],[4, 5]]
	let s = ["Y3", "Y2", "Y", "Y2"];

	for(let f=0; f<4; f++)
	{
		for(let i=0; i<edgePositions.length; i++){
			if((cube[edgePositions[i][0]][edgePositions[i][1]] == nrs2[f][0] && cube[edgePositions[i][2]][edgePositions[i][3]] == nrs2[f][1]) ||
			(cube[edgePositions[i][0]][edgePositions[i][1]] == nrs2[f][1] && cube[edgePositions[i][2]][edgePositions[i][3]] == nrs2[f][0])){
				if(i==0){
					if(cube[1][5] == nrs3[f][1]){
						for(let k=0;k<edgePlacementAlgs[0].length;k++){
							f2lSolution.push(edgePlacementAlgs[0][k]);
							await betterEval(edgePlacementAlgs[0][k]);
						}
					}
				} else if(i<edgePositions.length-1){
					for(let k=0;k<edgePlacementAlgs[i].length;k++){
						f2lSolution.push(edgePlacementAlgs[i][k]);
						await betterEval(edgePlacementAlgs[i][k]);
					}
				} else if(i==edgePositions.length-1){
					if(cube[1][1] == nrs3[f][0]){
						for(let k=0;k<edgeInsertAlgs[0].length;k++){
							f2lSolution.push(edgeInsertAlgs[0][k]);
							await betterEval(edgeInsertAlgs[0][k]);
						}
					} else {
						for(let k=0;k<edgeInsertAlgs[1].length;k++){
							f2lSolution.push(edgeInsertAlgs[1][k]);
							await betterEval(edgeInsertAlgs[1][k]);
						}
					}
				}
			}
		}

		await betterEval(s[f]);
		f2lSolution.push(s[f]);
	}}
async function OLL(){
	//STEP 1: Orient edges
	let algs = [["F","R","U","R3","U3","F3","U2","F","U","R","U3","R3","F3"],["F","R","U","R3","U3","F3"],["F","U","R","U3","R3","F3"]];

	if(cube[0][1] != 1 && cube[0][3] != 1 && cube[0][5] != 1 && cube[0][7] != 1){
		for(let k=0;k<algs[0].length;k++){
			ollSolution.push(algs[0][k]);
			await betterEval(algs[0][k]);
		}
	} else if(cube[0][1] != 1 && cube[0][3] == 1 && cube[0][5] == 1 && cube[0][7] != 1){
		for(let k=0;k<algs[1].length;k++){
			ollSolution.push(algs[1][k]);
			await betterEval(algs[1][k]);
		}
	} else if(cube[0][1] == 1 && cube[0][3] != 1 && cube[0][5] != 1 && cube[0][7] == 1){
		ollSolution.push("U");
		U();
		for(let k=0;k<algs[1].length;k++){
			ollSolution.push(algs[1][k]);
			await betterEval(algs[1][k]);
		}
	} else if(cube[0][1] == 1 && cube[0][3] == 1 && cube[0][5] != 1 && cube[0][7] != 1){
		for(let k=0;k<algs[2].length;k++){
			ollSolution.push(algs[2][k]);
			await betterEval(algs[2][k]);
		}
	} else if(cube[0][1] == 1 && cube[0][3] != 1 && cube[0][5] == 1 && cube[0][7] != 1){
		ollSolution.push("U3");
		U3();
		for(let k=0;k<algs[2].length;k++){
			ollSolution.push(algs[2][k]);
			await betterEval(algs[2][k]);
		}
	} else if(cube[0][1] != 1 && cube[0][3] != 1 && cube[0][5] == 1 && cube[0][7] == 1){
		ollSolution.push("U2");
		U2();
		for(let k=0;k<algs[2].length;k++){
			ollSolution.push(algs[2][k]);
			await betterEval(algs[2][k]);
		}
	} else if(cube[0][1] != 1 && cube[0][3] == 1 && cube[0][5] != 1 && cube[0][7] == 1){
		ollSolution.push("U");
		U();
		for(let k=0;k<algs[2].length;k++){
			ollSolution.push(algs[2][k]);
			await betterEval(algs[2][k]);
		}
	}

	//////////////////////////////////

	//STEP 2: Orient corners
	let solved = false;
	for(let i=0;i<4 && !solved;i++){
		if(cube[1][2] == 1 && cube[4][2] == 1 && cube[0][6] == 1 && cube[0][2] == 1){
			let alg = ["F3","Rw","U","R3","U3","Rw3","F","R"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} else if(cube[1][2] == 1 && cube[2][0] == 1 && cube[3][6] == 1 && cube[0][6] == 1){//sune
			let alg = ["R","U","R3","U","R","U2","R3"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} else if(cube[4][2] == 1 && cube[1][0] == 1 && cube[2][6] == 1 && cube[0][2] == 1){//anti-sune
			let alg = ["R","U2","R3","U3","R","U3","R3"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} else if(cube[1][0] == 1 && cube[1][2] == 1 && cube[3][8] == 1 && cube[3][6] == 1){//f-3x rur3u3 - f3
			let alg = ["F","R","U","R3","U3","R","U","R3","U3","R","U","R3","U3","F3",];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} else if(cube[4][2] == 1 && cube[4][8] == 1 && cube[1][2] == 1 && cube[3][8] == 1){//four twisted v2
			let alg = ["R","U2","R2","U3","R2","U3","R2","U2","R"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} else if(cube[0][0] == 1 && cube[0][2] == 1 && cube[1][0] == 1 && cube[1][2] == 1){//R-U-D case
			let alg = ["R2","D","R3","U2","R","D3","R3","U2","R3"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			} 
		} else if(cube[1][0] == 1 && cube[3][6] == 1 && cube[0][2] == 1 && cube[0][8] == 1){//R-U-D copy
			let alg = ["Rw","U","R3","U3","Rw3","F","R","F3"];
			for(let k=0;k<alg.length;k++){
				ollSolution.push(alg[k]);
				await betterEval(alg[k]);
				solved = true;
			}
		} 
		if(!solved){U();ollSolution.push("U");}
	}}
async function PLL(){
	let cornerAlgs = [["R","U","R3","F3","R","U","R3","U3","R3","F","R2","U3","R3"],
				["F","R","U3","R3","U3","R","U","R3","F3","R","U","R3","U3","R3","F","R","F3"]];
	
	//step 1: corners
	if(cube[4][2] == cube[4][8] && cube[2][0] == cube[2][6]){}
	else{
		if(cube[4][2] == cube[4][8]){
			for(let k=0;k<cornerAlgs[0].length;k++){
				pllSolution.push(cornerAlgs[0][k]);
				await betterEval(cornerAlgs[0][k]);
			}
		} else if(cube[1][0] == cube[1][2]){
			U();
			pllSolution.push("U");
			for(let k=0;k<cornerAlgs[0].length;k++){
				pllSolution.push(cornerAlgs[0][k]);
				await betterEval(cornerAlgs[0][k]);
			}
		} else if(cube[2][0] == cube[2][6]){
			U2();
			pllSolution.push("U2");
			for(let k=0;k<cornerAlgs[0].length;k++){
				pllSolution.push(cornerAlgs[0][k]);
				await betterEval(cornerAlgs[0][k]);
			}
		} else if(cube[3][6] == cube[3][8]){
			U3();
			pllSolution.push("U3");
			for(let k=0;k<cornerAlgs[0].length;k++){
				pllSolution.push(cornerAlgs[0][k]);
				await betterEval(cornerAlgs[0][k]);
			}
		} else {
			for(let k=0;k<cornerAlgs[1].length;k++){
				pllSolution.push(cornerAlgs[1][k]);
				await betterEval(cornerAlgs[1][k]);
			}
		}
	}

	//step 2: edges

	let edgeAlgs = [["R2","U","R","U","R3","U3","R3","U3","R3","U","R3"],["R","U3","R","U","R","U","R","U3","R3","U3","R2"],
					["M2","U","M2","U","M3","U2","M2","U2","M3"],["M2","U","M2","U2","M2","U","M2"]];
	
	//H and Z
	if((abs(cube[1][1] - cube[1][0]) == 2) && (abs(cube[3][6] - cube[3][7]) == 2)){
		console.log("H");
		for(let k=0;k<edgeAlgs[3].length;k++){
			pllSolution.push(edgeAlgs[3][k]);
			await betterEval(edgeAlgs[3][k]);
		}
	}else if(cube[1][1] == cube[2][0] && cube[1][0] == cube[2][3]){
		for(let k=0;k<edgeAlgs[2].length;k++){
			pllSolution.push(edgeAlgs[2][k]);
			await betterEval(edgeAlgs[2][k]);
		}
	}else if(cube[1][1] == cube[4][2] && cube[1][0] == cube[4][5]){
		U();
		pllSolution.push("U");
		for(let k=0;k<edgeAlgs[2].length;k++){
			pllSolution.push(edgeAlgs[2][k]);
			await betterEval(edgeAlgs[2][k]);
		}
	}
	//Ua and Ub
	if(cube[1][1] == cube[1][0] && cube[3][6] == cube[3][7]){} else{
		if(cube[4][5] == cube[4][8]){
			pllSolution.push("U");
			U();
		} else if(cube[1][0] == cube[1][1]){
			pllSolution.push("U2");
			U2();
		} else if(cube[2][0] == cube[2][3]){
			pllSolution.push("U3");
			U3();
		}
		if(abs(cube[2][3] - cube[2][0]) == 2){
			for(let k=0;k<edgeAlgs[1].length;k++){
				pllSolution.push(edgeAlgs[1][k]);
				await betterEval(edgeAlgs[1][k]);
			}
		} else if(abs(cube[4][5] - cube[4][2]) == 2){
			for(let k=0;k<edgeAlgs[0].length;k++){
				pllSolution.push(edgeAlgs[0][k]);
				await betterEval(edgeAlgs[0][k]);
			}
		}
	}

	//step 3: AUF

	if(cube[1][0] == 3){
		pllSolution.push("U3");
		U3();
	} else if(cube[1][0] == 4){
		pllSolution.push("U2");
		U2();
	} else if(cube[1][0] == 5){
		pllSolution.push("U");
		U();
	}}
//////////////////////

//MAKING THE ACTUAL MOVES
function U(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//top face
	newCube[0][0] = cube[0][6];
	newCube[0][1] = cube[0][3];
	newCube[0][2] = cube[0][0];
	newCube[0][3] = cube[0][7];
	newCube[0][5] = cube[0][1];
	newCube[0][6] = cube[0][8];
	newCube[0][7] = cube[0][5];
	newCube[0][8] = cube[0][2];

	//rest of the faces
	newCube[1][0] = cube[2][6];
	newCube[1][1] = cube[2][3];
	newCube[1][2] = cube[2][0];

	newCube[2][0] = cube[3][6];
	newCube[2][3] = cube[3][7];
	newCube[2][6] = cube[3][8];

	newCube[3][6] = cube[4][8];
	newCube[3][7] = cube[4][5];
	newCube[3][8] = cube[4][2];

	newCube[4][2] = cube[1][0];
	newCube[4][5] = cube[1][1];
	newCube[4][8] = cube[1][2];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function U2(){U();U();}
function U3(){U();U();U();}

function R(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//right face
	newCube[2][0] = cube[2][6];
	newCube[2][1] = cube[2][3];
	newCube[2][2] = cube[2][0];
	newCube[2][3] = cube[2][7];
	newCube[2][5] = cube[2][1];
	newCube[2][6] = cube[2][8];
	newCube[2][7] = cube[2][5];
	newCube[2][8] = cube[2][2];

	//rest of the faces
	newCube[0][2] = cube[1][2];
	newCube[0][5] = cube[1][5];
	newCube[0][8] = cube[1][8];

	newCube[1][2] = cube[5][2];
	newCube[1][5] = cube[5][5];
	newCube[1][8] = cube[5][8];

	newCube[5][2] = cube[3][2];
	newCube[5][5] = cube[3][5];
	newCube[5][8] = cube[3][8];

	newCube[3][2] = cube[0][2];
	newCube[3][5] = cube[0][5];
	newCube[3][8] = cube[0][8];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function R2(){R();R();}
function R3(){R();R();R();}

function F(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//front face
	newCube[1][0] = cube[1][6];
	newCube[1][1] = cube[1][3];
	newCube[1][2] = cube[1][0];
	newCube[1][3] = cube[1][7];
	newCube[1][5] = cube[1][1];
	newCube[1][6] = cube[1][8];
	newCube[1][7] = cube[1][5];
	newCube[1][8] = cube[1][2];

	//rest of the faces
	newCube[0][6] = cube[4][6];
	newCube[0][7] = cube[4][7];
	newCube[0][8] = cube[4][8];

	newCube[2][6] = cube[0][6];
	newCube[2][7] = cube[0][7];
	newCube[2][8] = cube[0][8];

	newCube[5][0] = cube[2][8];
	newCube[5][1] = cube[2][7];
	newCube[5][2] = cube[2][6];

	newCube[4][6] = cube[5][2];
	newCube[4][7] = cube[5][1];
	newCube[4][8] = cube[5][0];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function F2(){F();F();}
function F3(){F();F();F();}

function L(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//left face
	newCube[4][0] = cube[4][6];
	newCube[4][1] = cube[4][3];
	newCube[4][2] = cube[4][0];
	newCube[4][3] = cube[4][7];
	newCube[4][5] = cube[4][1];
	newCube[4][6] = cube[4][8];
	newCube[4][7] = cube[4][5];
	newCube[4][8] = cube[4][2];

	//rest of the faces
	newCube[1][0] = cube[0][0];
	newCube[1][3] = cube[0][3];
	newCube[1][6] = cube[0][6];

	newCube[0][0] = cube[3][0];
	newCube[0][3] = cube[3][3];
	newCube[0][6] = cube[3][6];

	newCube[5][0] = cube[1][0];
	newCube[5][3] = cube[1][3];
	newCube[5][6] = cube[1][6];

	newCube[3][0] = cube[5][0];
	newCube[3][3] = cube[5][3];
	newCube[3][6] = cube[5][6];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function L2(){L();L();}
function L3(){L2();L();}

function D(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//down face
	newCube[5][0] = cube[5][6];
	newCube[5][1] = cube[5][3];
	newCube[5][2] = cube[5][0];
	newCube[5][3] = cube[5][7];
	newCube[5][5] = cube[5][1];
	newCube[5][6] = cube[5][8];
	newCube[5][7] = cube[5][5];
	newCube[5][8] = cube[5][2];

	//rest of the faces
	newCube[1][6] = cube[4][0];
	newCube[1][7] = cube[4][3];
	newCube[1][8] = cube[4][6];

	newCube[3][0] = cube[2][2];
	newCube[3][1] = cube[2][5];
	newCube[3][2] = cube[2][8];

	newCube[4][0] = cube[3][2];
	newCube[4][3] = cube[3][1];
	newCube[4][6] = cube[3][0];

	newCube[2][2] = cube[1][8];
	newCube[2][5] = cube[1][7];
	newCube[2][8] = cube[1][6];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function D2(){D();D();}
function D3(){D2();D();}

function B(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	//back face
	newCube[3][0] = cube[3][6];
	newCube[3][1] = cube[3][3];
	newCube[3][2] = cube[3][0];
	newCube[3][3] = cube[3][7];
	newCube[3][5] = cube[3][1];
	newCube[3][6] = cube[3][8];
	newCube[3][7] = cube[3][5];
	newCube[3][8] = cube[3][2];

	//rest of the faces
	newCube[0][2] = cube[2][2];
	newCube[0][1] = cube[2][1];
	newCube[0][0] = cube[2][0];

	newCube[2][2] = cube[5][6];
	newCube[2][1] = cube[5][7];
	newCube[2][0] = cube[5][8];

	newCube[5][6] = cube[4][2];
	newCube[5][7] = cube[4][1];
	newCube[5][8] = cube[4][0];

	newCube[4][2] = cube[0][2];
	newCube[4][1] = cube[0][1];
	newCube[4][0] = cube[0][0];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function B2(){B();B();}
function B3(){B2();B();}
/////////////////////////////////

//NON-CANONIC MOVES(rotations,slices and wide moves)
function M(){
	let newCube = 
		[
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			newCube[i][j]=cube[i][j];
	
	newCube[0][1] = cube[3][1];
	newCube[0][4] = cube[3][4];
	newCube[0][7] = cube[3][7];
	
	newCube[1][1] = cube[0][1];
	newCube[1][4] = cube[0][4];
	newCube[1][7] = cube[0][7];
	
	newCube[5][1] = cube[1][1];
	newCube[5][4] = cube[1][4];
	newCube[5][7] = cube[1][7];
	
	newCube[3][1] = cube[5][1];
	newCube[3][4] = cube[5][4];
	newCube[3][7] = cube[5][7];

	for(let i=0;i<6;i++)
		for(let j=0;j<9;j++)
			cube[i][j]=newCube[i][j];}
function M2(){M();M();}
function M3(){M2();M();}

function E(){
    let newCube =
        [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
    for(let i=0;i<6;i++)
        for(let j=0;j<9;j++)
            newCube[i][j]=cube[i][j];
   
    newCube[1][3] = cube[4][1];
    newCube[1][4] = cube[4][4];
    newCube[1][5] = cube[4][7];
   
    newCube[4][1] = cube[3][5];
    newCube[4][4] = cube[3][4];
    newCube[4][7] = cube[3][3];
   
    newCube[3][3] = cube[2][1];
    newCube[3][4] = cube[2][4];
    newCube[3][5] = cube[2][7];
   
    newCube[2][1] = cube[1][5];
    newCube[2][4] = cube[1][4];
    newCube[2][7] = cube[1][3];
 
    for(let i=0;i<6;i++)
        for(let j=0;j<9;j++)
            cube[i][j]=newCube[i][j];}
function E3(){E();E();E();}

function Uw(){U();E3();}

function Rw(){R();M3();}
function Rw2(){Rw();Rw();}
function Rw3(){Rw();Rw();Rw();}

function Y(){Uw();D3();}
function Y2(){Y();Y();}
function Y3(){Y();Y();Y();}
///////////////////////////