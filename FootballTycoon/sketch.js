let currency = 0;let wRatio,hRatio;let defaultTeam = [];let team =[];
let player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11;
let menuScreen,teamScreen,matchScreen,campaignScreen,storeScreen;
let GK = DEF = MID = ATT = allPlayers = x = y = [];
let numOfSwapers = 0;let swaping = [];let opponents = [];let overalls = [];let teamIndex = 0; 
let myOvr = 0;let score = [];let played = false;let BEGINER,B_Matches,B_Pos,B_Ovrs,B_Rewards,B_Order;
let beginerMatches = [];let showPlayCampaign = false;
let toShow;let displayResults = false;let lose = false;let egal = false;let detailMode = false;
let cost = 0;let toSwap  = initialCoo = [];let campaignSelector = 'Beginer';
let doTraining = false;let numPages;let transferuri = [];let storePage = 0;let coins = 20000000;
let SPAIN;let S_Matches = S_Pos = S_Ovrs = S_Rewards = S_Order = spainMatches = [];
let GERMANY;let G_Matches = G_Pos = G_Ovrs = G_Rewards = G_Order = germanyMatches = [];let reserves = [];
let sub = false;let subSwap = subInitCoo = subToSwap = [];
let position = '';let done = false;
//MAIN
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
	    wRatio = width/1366;hRatio =windowHeight/631;
	    rectMode(CENTER);textAlign(CENTER,CENTER);    
		x = [150*wRatio,width/4 - width/8            ,width/4 - width/8 + width/4  ,width*3/4 - width/8          ,width - width/8              ,width/4              ,width/2              ,width*3/4            ,width/4   ,width/2   ,width*3/4 ];
		y = [150*hRatio,150*hRatio + height/3 + height/3.5,150*hRatio + height/3 + height/3.5,150*hRatio + height/3 + height/3.5,150*hRatio + height/3 + height/3.5,150*hRatio + height/3,150*hRatio + height/3,150*hRatio + height/3,150*hRatio,150*hRatio,150*hRatio];
		player1  = new Player('Subasic'  ,75,'GOALKEEPER',0 );defaultTeam.push(player1 );allPlayers.push(player1 );    
		player3  = new Player('Kolarov'  ,76,'DEFENDER'   ,1 );defaultTeam.push(player3 );allPlayers.push(player3 );    
		player4  = new Player('Benatia'  ,74,'DEFENDER'   ,2 );defaultTeam.push(player4 );allPlayers.push(player4 );    
		player5  = new Player('Granqvist',72,'DEFENDER'   ,3 );defaultTeam.push(player5 );allPlayers.push(player5 );    
		player2  = new Player('Meunier'  ,76,'DEFENDER'   ,4 );defaultTeam.push(player2 );allPlayers.push(player2 );    
		player6  = new Player('Casemiro' ,78,'MIDFIELDER',5 );defaultTeam.push(player6 );allPlayers.push(player6 );    
		player7  = new Player('Lingard'  ,79,'MIDFIELDER',6 );defaultTeam.push(player7 );allPlayers.push(player7 );    
		player8  = new Player('Thavuin'  ,77,'MIDFIELDER',7 );defaultTeam.push(player8 );allPlayers.push(player8 );    
		player9  = new Player('Insigne'  ,80,'FORWARD'   ,8 );defaultTeam.push(player9 );allPlayers.push(player9 );    
		player11 = new Player('Batshuayi',79,'FORWARD'   ,9 );defaultTeam.push(player11);allPlayers.push(player11);    
		player10 = new Player('Mertens'  ,82,'FORWARD'   ,10);defaultTeam.push(player10);allPlayers.push(player10);    
	    opponents = ['FC Barcelona','Atletico Madrid','Real Madrid','Juventus','AS Roma','Napoli','AC Milan','Inter Milan','Bayern Munich','BVB 09','Shalke04','Wfb Wolfsburg','PSG','OL Lyon','Chelsea','Man. United','Man. City','Tottenham','Arsenal','Stuttgart','Hamburg SV'];
	    overalls  = [91            ,86               ,90           ,89        ,87       ,88      ,85        ,85           ,89             ,86      ,83        ,82             ,88   ,82       ,87       ,88           ,89         ,87         ,87       ,78         ,75          ];
	    team = defaultTeam;    
	    for(let i=0;i<team.length;i++){
		if(team[i].TOP == 'GOALKEEPER') GK.push(team[i]);        
		if(team[i].TOP == 'DEFENDER') DEF.push(team[i]);
		if(team[i].TOP == 'MIDFIELDER') MID.push(team[i]);        
		if(team[i].TOP == 'FORWARD') ATT.push(team[i]);
		}
		for(p of team) myOvr += p.ovr;
		myOvr = round(myOvr/11);
		menuScreen = true;
		teamScreen = false;
		matchScreen = false;
		matchScreen = false;
		storeScreen = false;
	B_Matches = ['Ingolstadt','Palermo','Sunderland','Deportivo','Bologna','Sassuolo','Celta Vigo','Hamburg','Swansea','Sevilla'];
	G_Matches = ['Hertha','Monchengladbach','Hoffenheim','Eintracht','Leipzig','Stuttgart','Leverkusen','Schalke','Dortmund','Bayern Munich'];
	S_Matches = ['Celta Vigo','Eibar','Getafe','Real Betis','Sevilla','Villarreal','Valencia','Atletico Madrid','Real Madrid','Barcelona'];
	B_Pos = [{x:100*wRatio,y:height/2},{x:400*wRatio,y:height/4},{x:400*wRatio,y:height*3/4},{x:700*wRatio,y:height/8},{x:700*wRatio,y:height*3/8},{x:700*wRatio,y:height*5/8},{x:700*wRatio,y:height*7/8},{x:1000*wRatio,y:height/4},{x:1000*wRatio,y:height*3/4},{x:1300*wRatio,y:height/2}];
	S_Pos = [{x:100*wRatio,y:height / 2},{x:300*wRatio,y:height / 2},{x:500*wRatio,y:height/3},{x:500*wRatio,y:height*2/3},{x:700*wRatio,y:height/4},{x:700*wRatio,y:height/2},{x:700*wRatio,y:height*3/4},{x:900*wRatio,y:height/2},{x:1100*wRatio,y:height/3},{x:1100*wRatio,y:height*2/3}];
	G_Pos = [{x:100*wRatio,y:height/4},{x:100*wRatio,y:height/2},{x:100*wRatio,y:height*3/4},{x:350*wRatio,y:height/2},{x:600*wRatio,y:height/3},{x:600*wRatio,y:height*2/3},{x:850*wRatio,y:height/3},{x:850*wRatio,y:height*2/3},{x:1100*wRatio,y:height/3},{x:1100*wRatio,y:height*2/3}];
	B_Ovrs = [70,71,73,73,74,75,76,78,78,81];
	S_Ovrs = [88,89,90,91,92,94,94,96,98,98];
	G_Ovrs = [91,92,93,94,95,96,97,98,99,100];
	B_Rewards = [1,2,2,3,3,4,4,5,5,8];
	S_Rewards = [3,3,3,4,4,5,5,7,10,10];
	G_Rewards = [4,4,5,5,6,7,7,9,11,12];
	B_Order = [0,1,1,3,3,3,3,7,7,9];
	S_Order = [0,1,2,2,4,4,4,7,8,8];
	G_Order = [0,0,0,3,4,4,6,6,8,8];
	BEGINER = new Campanie(10,B_Matches,B_Pos,B_Ovrs,B_Rewards,B_Order);
	SPAIN = new Campanie(10,S_Matches,S_Pos,S_Ovrs,S_Rewards,S_Order);
	GERMANY = new Campanie(10,G_Matches,G_Pos,G_Ovrs,G_Rewards,G_Order);
	for(let i=0;i<BEGINER.numMatches;i++){
		beginerMatches.push(new Meci(BEGINER.opponents[i],BEGINER.ovrs[i],BEGINER.order[i],B_Pos[i],B_Rewards[i],beginerMatches));
	}
	for(let i=0;i<SPAIN.numMatches;i++){
		spainMatches.push(new Meci(SPAIN.opponents[i],SPAIN.ovrs[i],SPAIN.order[i],S_Pos[i],S_Rewards[i],spainMatches));
	}
	for(let i=0;i<GERMANY.numMatches;i++){
		germanyMatches.push(new Meci(GERMANY.opponents[i],GERMANY.ovrs[i],GERMANY.order[i],G_Pos[i],G_Rewards[i],germanyMatches));
	}
	adaugaJucatori();
	numPages = ceil(transferuri.length/10);}
function draw()  {
	if(menuScreen) showMenu();
	if(teamScreen) Team();     
	if(matchScreen) Match();     
	if(campaignScreen) Campaign();
	if(storeScreen) Store();}
//EVENT LISTENERS
function mousePressed(){
	if(menuScreen){
		if(mouseY >= 0 && mouseY <= height/2){ 
			if(mouseX >= 0 && mouseX <= width/2){setAllScreensFalse(team);teamScreen = true;} 
			else {setAllScreensFalse();matchScreen = true;}
		} else {
			if(mouseX >= 0 && mouseX <= width/2){setAllScreensFalse();campaignScreen = true;} 
			else {setAllScreensFalse();storeScreen = true;}
		}}
	if(!menuScreen && dist(mouseX,mouseY,25,25) <= 16) backToMenu();
	if(teamScreen) {
		for(let i=0;i<team.length;i++){
			if(mouseX >= team[i].x - 75*wRatio && mouseX <= team[i].x + 75*wRatio && mouseY >= team[i].y - 75*hRatio && mouseY <= team[i].y + 75*hRatio && detailMode) { team[i].details = true;} else team[i].details = false;
			if(mouseX >= team[i].x - 75*wRatio && mouseX <= team[i].x + 75*wRatio && mouseY >= team[i].y - 75*hRatio && mouseY <= team[i].y){
				if(detailMode) team[i].toTrain = true;
			}
			if(mouseX >= team[i].x - 75*wRatio && mouseX <= team[i].x + 75*wRatio && mouseY >= team[i].y && mouseY <= team[i].y + 75*hRatio){
				if(detailMode) {team[i].rezerve = true;sub = true;}
			}
			if(mouseX >= width*7/8 - 100*wRatio && mouseX <= width*7/8 + 100*wRatio && mouseY >= height/16 - 25*hRatio && mouseY <= height/16 + 25*hRatio) {detailMode = !detailMode;}
		}
			let trainPlayer;
			for(p of team) if(p.toTrain) {trainPlayer = p;doTraining = true;}
			if(doTraining){
				if(dist(mouseX,mouseY,width*3/4 - 250*wRatio,height/1.8) <= 50) if(cost > 0  ) cost --;
				if(dist(mouseX,mouseY,width*3/4 + 250*wRatio,height/1.8) <= 50) if(cost + trainPlayer.ovr < 100)cost++;
				let p1 = mouseX >= 940*wRatio && mouseX <= 940*wRatio + (1115-940) * wRatio;
				let p2 = mouseY >= 450*hRatio && mouseY <= 450*hRatio + (600-450) * hRatio;
				let p3 = currency >= (cost);
				if(p1 && p2 && p3){
					trainPlayer.ovr += cost;
					currency -= cost;
					let ovr = 0;
					for(p of team) ovr += p.ovr;
					ovr /= 11;
					cost = 0;
					myOvr = round(ovr);
				}
				if(dist(mouseX,mouseY,width - 50*wRatio,50*hRatio) <= 50){
					for(p of team) p.toTrain = false;
					doTraining = false;
				}
			}
		} else doTraining = false;
		if(sub){
			if(dist(mouseX,mouseY,width - 50*wRatio,50*hRatio) <= 50){
				for(p of team) p.rezerve = false;
					sub = false;
					done = false;
			}
		}
	if(matchScreen && !played){
		if(dist(mouseX,mouseY,width  /4 + 50*wRatio,height/2 + 50*hRatio) <= 50){if(teamIndex == 0 ) teamIndex = opponents.length - 1; else teamIndex--;}
		if(dist(mouseX,mouseY,width*3/4 - 50*wRatio,height/2 + 50*hRatio) <= 50){if(teamIndex == opponents.length - 1) teamIndex = 0 ; else teamIndex++;}
		if(mouseX >= width/2-width/4 && mouseX <= width/2+width/4 && mouseY >= height*3/4 - height/16 && mouseY <= height*3/4 + height/16){
			score = simulateMatch(myOvr,overalls[teamIndex]);
			if(score[0] > score[1]) coins += overalls[teamIndex]*(score[0] - score[1]);
			played = true;
		}}
	if(matchScreen && played){
		if(dist(mouseX,mouseY,width/2 + width*7/16 - 25*wRatio,height/2 - height*7/16 + 25*hRatio) <= 23){
			played = false;
		}}
	if(campaignScreen){
		if(mouseX >= 100*wRatio && mouseX <= 200*wRatio && mouseY >= (30-25/2)*hRatio && mouseY <= (30+25/2)*hRatio) campaignSelector = 'Beginer';
		if(mouseX >= 220*wRatio && mouseX <= 320*wRatio && mouseY >= (30-25/2)*hRatio && mouseY <= (30+25/2)*hRatio) campaignSelector = 'Spain';
		if(mouseX >= 340*wRatio && mouseX <= 440*wRatio && mouseY >= (30-25/2)*hRatio && mouseY <= (30+25/2)*hRatio) campaignSelector = 'Germany';
		if(campaignSelector == 'Beginer'){
			for(let i=0;i<beginerMatches.length;i++){
				let l = dist(mouseX,mouseY,beginerMatches[i].coo.x,beginerMatches[i].coo.y);
				if(l <= 50*wRatio){
					if(beginerMatches[i].canBePlayed){
						showPlayCampaign = true;
						toShow = beginerMatches[i];
					} else showPlayCampaign = false;
				}
			}
		}
		if(campaignSelector == 'Spain'){
			for(let i=0;i<spainMatches.length;i++){
				let l = dist(mouseX,mouseY,spainMatches[i].coo.x,spainMatches[i].coo.y);
				if(l <= 50*wRatio){
					if(spainMatches[i].canBePlayed){
						showPlayCampaign = true;
						toShow = spainMatches[i];
					} else showPlayCampaign = false;
				}
			}			
		}
		if(campaignSelector == 'Germany'){
			for(let i=0;i<germanyMatches.length;i++){
				let l = dist(mouseX,mouseY,germanyMatches[i].coo.x,germanyMatches[i].coo.y);
				if(l <= 50*wRatio){
					if(germanyMatches[i].canBePlayed){
						showPlayCampaign = true;
						toShow = germanyMatches[i];
					} else showPlayCampaign = false;
				}
			}			
		}
		if(showPlayCampaign){
			if(campaignSelector == 'Beginer'){
				let s = (mouseX >= toShow.coo.x - 50*wRatio && mouseX<= toShow.coo.x + 50*wRatio && mouseY >= toShow.coo.y + 75*wRatio - 25/2*hRatio && mouseY <= toShow.coo.y + 75*wRatio + 25/2*hRatio);
				if(s) {
					score = simulateMatch(myOvr,toShow.ovr);
					if(score[0] > score[1]){
						showPlayCampaign = false;
						displayResults = true;
						currency += toShow.reward;
						toShow.won = true;
						lose = false;
						egal = false;
						toShow.canBePlayed = false;
						for(m of beginerMatches) m.calc();
					} else if(score[0] < score[1]){
						lose = true;
						egal = false;
						displayResults = true;
						showPlayCampaign = false;
					} else if(score[0] == score[1]){
						lose = false;
						egal = true;
						displayResults = true;
						showPlayCampaign = false;
					}
				}
			}
			if(campaignSelector == 'Spain'){
				let s = (mouseX >= toShow.coo.x - 50*wRatio && mouseX<= toShow.coo.x + 50*wRatio && mouseY >= toShow.coo.y + 75*wRatio - 25/2*hRatio && mouseY <= toShow.coo.y + 75*wRatio + 25/2*hRatio);
				if(s) {
					score = simulateMatch(myOvr,toShow.ovr);
					if(score[0] > score[1]){
						showPlayCampaign = false;
						displayResults = true;
						currency += toShow.reward;
						toShow.won = true;
						lose = false;
						egal = false;
						toShow.canBePlayed = false;
						for(m of spainMatches) m.calc();
					} else if(score[0] < score[1]){
						lose = true;
						egal = false;
						displayResults = true;
						showPlayCampaign = false;
					} else if(score[0] == score[1]){
						lose = false;
						egal = true;
						displayResults = true;
						showPlayCampaign = false;
					}
				}				
			}
			if(campaignSelector == 'Germany'){
				let s = (mouseX >= toShow.coo.x - 50*wRatio && mouseX<= toShow.coo.x + 50*wRatio && mouseY >= toShow.coo.y + 75*wRatio - 25/2*hRatio && mouseY <= toShow.coo.y + 75*wRatio + 25/2*hRatio);
				if(s) {
					score = simulateMatch(myOvr,toShow.ovr);
					if(score[0] > score[1]){
						showPlayCampaign = false;
						displayResults = true;
						currency += toShow.reward;
						toShow.won = true;
						lose = false;
						egal = false;
						toShow.canBePlayed = false;
						for(m of germanyMatches) m.calc();
					} else if(score[0] < score[1]){
						lose = true;
						egal = false;
						displayResults = true;
						showPlayCampaign = false;
					} else if(score[0] == score[1]){
						lose = false;
						egal = true;
						displayResults = true;
						showPlayCampaign = false;
					}
				}				
			}
		}
		if (displayResults) {
			let d = dist(mouseX,mouseY,width - 50*wRatio,50*wRatio);
			if(d <= 50){
				displayResults = false;
				lose = false;
			}
		}}
	if(storeScreen){
		if(dist(mouseX,mouseY,width/4   - 140*wRatio,height*8/9) <= 25) { if(storePage > 0       ) storePage--;}
		if(dist(mouseX,mouseY,width*3/4 + 140*wRatio,height*8/9) <= 25) { if(storePage < numPages) storePage++;}
		let length = transferuri.length;
		if(mouseX >= width*3/4 + 70*wRatio && mouseX <= width*3/4 + 170*wRatio){
			for(let i=storePage*10;i<storePage*10 + 10;i++){
				if(mouseY >= (transferuri[i].index % 10)*50*hRatio + 25*hRatio && mouseY <= (transferuri[i].index % 10)*50*hRatio + 75*hRatio){
					if(coins >= transferuri[i].price && !isInArray(transferuri[i],reserves)){
						reserves.push(transferuri[i]);
						transferuri[i].bought = true;
						coins -= transferuri[i].price;
						for(let j=0;j<length;j++){
							transferuri[j].index = j;
						}
					}
				}
			}
		}
	}}
function mouseDragged(){
	if(teamScreen){
		for(let i=0;i<team.length;i++) 
			if(mouseX >= team[i].x - 75*wRatio && mouseX <= team[i].x + 75*wRatio && mouseY >= team[i].y - 75*hRatio && mouseY <= team[i].y + 75*hRatio && toSwap.length == 0){ 
				toSwap.push(team[i].index);
				initialCoo.push(team[i].x,team[i].y);
				break;
			}
			if(toSwap[0]){
				team[toSwap[0]].x = mouseX;
				team[toSwap[0]].y = mouseY;
			}
	}
	if(teamScreen && sub){
		let possibleSwapers = [];
		for(p of reserves) if(p.TOP == position) possibleSwapers.push(p);
		for(p of possibleSwapers){
			if(mouseX >= p.x - 75*wRatio && mouseX <= p.x + 75*wRatio && 
				mouseY >= p.y - 75*hRatio && mouseY <= p.y + 75*hRatio && subSwap.length == 0){
				subSwap.push(p);
			}
		}
		if(subSwap[0]){
			subSwap[0].x = mouseX;
			subSwap[0].y = mouseY;
		}
	}}
function mouseReleased(){
	for(let i=0;i<team.length;i++){
		if(dist(mouseX,mouseY,team[i].x,team[i].y) <= 75){
			toSwap.push(team[i].index);
		}
	}
	if(toSwap.length ==  2){
		team[toSwap[0]].x = initialCoo[0];
		team[toSwap[0]].y = initialCoo[1];
		toSwap = [];
		initialCoo = [];
	}
	for(let i=0;i<toSwap.length;i++){
		if(toSwap[i] >10) { 
			toSwap.splice(i,1);
			i--;
		}
	}
	if(toSwap.length != 0){
		if(toSwap[0] == toSwap[1]){
			swap(toSwap[0],toSwap[2]);
		} else 	{
			swap(toSwap[0],toSwap[1]);
		}
	}

	toSwap = [];
	initialCoo = [];
	if(sub) subSwap = [];}
//SCREEN SELECTORS
function showMenu(){
	push();
	stroke(0,0,150);
	strokeWeight(wRatio*5);
	fill(255,165,100);
	rect(width/4  ,height/4  ,width/2,height/2);
	fill(100,255,100);
	rect(width/4*3,height/4  ,width/2,height/2);
	fill(205,0,100);
	rect(width/4  ,height/4*3,width/2,height/2);
	fill(0,165,255);
	rect(width/4*3,height/4*3,width/2,height/2);
	textSize(wRatio*128);
	fill(0);
	stroke(255);
	text('MY TEAM',width/4  ,height/4  );
	text('MATCH'  ,width/4*3,height/4  );
	text('CAMPAIGN',width/4 ,height/4*3);
	text('STORE'  ,width/4*3,height/4*3);
	pop();}
function Team(){
	if(!sub) {
		showTeam();
		training();
		for(p of team) {
			if(p.x == undefined) p.x = x[p.index];
			if(p.y == undefined) p.y = y[p.index];
		}
	}
	if(sub){
		for(p of team) if(p.rezerve) showSubstitue(p);
	}}
function Match(){showMatch();if(played) showMatchDetails();}
function Campaign(){showCampaign();}
function Store(){showStore();}
//SHOW
function showTeam(){
	background(50,255,127);
	drawBackButton();
	showPlayers();
	if(detailMode) for(let i=0;i<11;i++) team[i].showDetails();
	push();
	fill(0,0,255);
	rect(width*7/8,height/16,200*wRatio,50*hRatio);
	fill(255);
	textSize(24*wRatio);
	text("DETAIL MODE",width*7/8,height/16);
	pop();}
function showMatch(){
	background(100,100,255);
	drawBackButton();
	push();
	fill(0,255,127);
	textSize(92*wRatio);
	stroke(0);
	strokeWeight(3);
	rect(width  /2,height  /4,width/2,height/4 + height/8);
	rect(width  /2,height*3/4,width/2,height/8           );
	ellipse(width  /4 + 50*wRatio,height/2 + 50*hRatio,100*wRatio,100*hRatio);
	ellipse(width*3/4 - 50*wRatio,height/2 + 50*hRatio,100*wRatio,100*hRatio);
	fill(0);
	noStroke();
	triangle(width/4 + 70*wRatio,height/2 + 5*hRatio,width/4 + 70*wRatio,height/2 + 95*hRatio,width/4,height/2 + 50*hRatio);
	triangle(width*3/4 - 70*wRatio,height/2 + 5*hRatio,width*3/4 - 70*wRatio,height/2 + 95,width*3/4,height/2 + 50*hRatio)
	text(opponents[teamIndex],width/2,height/4 - height/16);
	text(overalls[teamIndex] ,width/2,height/4 + height/16);
	text("PLAY",width/2,height*3/4);
	// text();
	// text();
	pop();}
function showCampaign(){
	background(0,200,50);
	drawBackButton();
	push();
	noStroke();
	fill(160,100,255);
	rect(150*wRatio,30*hRatio,100*wRatio,25*hRatio);
	rect(270*wRatio,30*hRatio,100*wRatio,25*hRatio);
	rect(390*wRatio,30*hRatio,100*wRatio,25*hRatio);
	textSize(20*wRatio);
	fill(0);
	text('Beginer',150*wRatio,30*hRatio);
	text('Spain',270*wRatio,30*hRatio);
	text('Germany',390*wRatio,30*hRatio);
	pop();
	if(campaignSelector == 'Beginer'){
		showBeginerCampaign();
	} else if(campaignSelector == 'Spain'){
		showSpainCampaign();
	} else if(campaignSelector == 'Germany'){
		showGermanCampaign();
	}
	if(displayResults){
		push();
		fill(100,200);
		stroke(0);
		strokeWeight(1);
		rect(width/2,height/2,width,height);
		fill(255);
		ellipse(width - 50*wRatio,50*wRatio,100*wRatio,100*wRatio);
		fill(0);
		noStroke();
		textSize(72*wRatio);
		text("X",width - 50*wRatio,50*wRatio);
		if(toShow.won) text("YOU WON!",width/2,height/4); 
		else if(lose) text("YOU LOSE!",width/2,height/4); 
		else if(draw) text("DRAW",width/2,height/4);
		textSize(36*wRatio);
		text("SCORE: " + score[0] + "-" + score[1],width/2,height*2/3);
		textSize(20*wRatio);
		text("CURRENCY:" + currency,100,100);
		pop();
	}}
function showStore(){
	background(255,255,100);
	push();
	fill(255);
	stroke(0);
	strokeWeight(1);
	ellipse(width/4   - 140*wRatio,height*8/9,50*wRatio);
	ellipse(width*3/4 + 140*wRatio,height*8/9,50*wRatio);
	fill(0);
	beginShape();
	vertex(width/4   - 125*wRatio,height*8/9 - 20*wRatio);
	vertex(width/4   - 125*wRatio,height*8/9 + 20*wRatio);
	vertex(width/4   - 165*wRatio,height*8/9);
	endShape();
	beginShape();
	vertex(width*3/4 + 125*wRatio,height*8/9 - 20*wRatio);
	vertex(width*3/4 + 125*wRatio,height*8/9 + 20*wRatio);
	vertex(width*3/4 + 165*wRatio,height*8/9);
	endShape();
	pop();
	drawBackButton();
	for(let i=storePage*10;(i<(storePage+1) * 10) && (i < transferuri.length);i++) transferuri[i].show();
	if(storePage == numPages){
		push();
		fill(255,100,0);
		rect(width/4,height/4,200*wRatio,200*wRatio);
		rect(width/2,height/4,200*wRatio,200*wRatio);
		rect(width*3/4,height/4,200*wRatio,200*wRatio);
		textSize(32*wRatio);
		fill(0);
		text("PLAYER",width/4,height/4 - 50*wRatio);
		text("PACKS",width/4,height/4 + 50*wRatio);
		text("TRAINING",width/2,height/4 - 50*wRatio);
		text("MIXT",width*3/4,height/4 - 50*wRatio);
		text("PACKS",width/2,height/4 + 50*wRatio);
		text("PACKS",width*3/4,height/4 + 50*wRatio);
		textSize(64*wRatio);
		text("TRAINING POINTS : " + currency,width/2,height/2);
		text("COINS : " + coins,width/2,height*3/4);
		pop();
	}}
//MECHANICS
function training(){for(t of team) if(t.toTrain) drawTrainingScreen(t,t.ovr);}
//HELPERS
function showPlayers(){
	for(let i=0;i<team.length;i++){
		push();
		if(team[i].ovr < 80) fill(200,200,0);
		if(team[i].ovr >= 80 && team[i].ovr < 90) fill(255,0,0);
		if(team[i].ovr >= 90) fill(51);
		rect(team[i].x,team[i].y,150*wRatio,150*hRatio)
		textSize(20*wRatio);
		fill(255);
		stroke(0);
		strokeWeight(2 * wRatio);
		text(team[i].TOP,team[i].x,team[i].y - 50);
		text(team[i].name,team[i].x,team[i].y);
		text(team[i].ovr,team[i].x,team[i].y + 50);
		pop();
	}}
function drawBackButton(){
	push();
	fill(255,0,100,100);
	stroke(0);
	ellipse(25,25,32,32);
	beginShape();
	fill(0);
	vertex(30,10);
	vertex(30,40);
	vertex(12,25);
	endShape();
	pop();}
function drawExitButton(){
	push();
	fill(255);
	strokeWeight(1);
	stroke(0);
	ellipse(width - 50*wRatio,50*hRatio,100*wRatio,100*hRatio);
	textSize(36*wRatio);
	fill(0);
	text("X",width - 50*wRatio,50*hRatio);
	pop();}
function setAllScreensFalse(){
	menuScreen = false;
	teamScreen = false;
	matchScreen = false;
	campaignScreen = false;
	storeScreen = false;}
function backToMenu(){
	menuScreen = true;
	teamScreen = false;
	matchScreen = false;
	campaignScreen = false;
	storeScreen = false;}
function isInArray(element,array){
	let inArray = false;
	for(e of array){
		if(e == element){
			inArray = true;
			break;
		}
	}
	return inArray;}
function simulateMatch(my_ovr,opponents_ovr){
	let dif = my_ovr - opponents_ovr;let score = [];
	if(my_ovr < 80 && opponents_ovr < 80){
		if(dif <  0) score = [0,1];
		if(dif == 0) {goal = round(random(1));score = [goal,goal];}
		if(dif > 0 && dif < 5) score = [floor(random(1,5)),0];
		if(dif > 5) score = [floor(random(5,8)),round(random(1))];
	}
	if(my_ovr < 80 && opponents_ovr >= 80 && opponents_ovr < 90) {
		score = [round(random(3)),floor(random(7,10))];
	}
	if(my_ovr < 80 && opponents_ovr >= 90){
		score = [floor(random(2)),floor(random(8,13))];
	}
	if(my_ovr >= 80 && my_ovr < 90 && opponents_ovr < 80) {
		score = [floor(random(5,9)),floor(random(2))];
	}
	if(my_ovr >= 90 && opponents_ovr < 80) {
		score = [floor(random(8,15)),round(random(1))];
	}
	if(my_ovr >= 80 && my_ovr < 90 && opponents_ovr >= 90) {
		score = [floor(random(1,3)),floor(random(4,8))];
	}
	if(opponents_ovr >= 80 &&  opponents_ovr <  90 && my_ovr >= 90){
		score = [floor(random(4,8)),floor(random(1,3))];
	}
	if((my_ovr >= 80 && my_ovr < 90 && opponents_ovr >= 80 && opponents_ovr < 90)||(my_ovr >= 90 && opponents_ovr >= 90)) {
		if(dif > 0) score = [dif,round(random(1))];else if(dif == 0) score = [round(random(3)),round(random(3))]; else score = [round(random(1)),abs(dif)];
	}
	if(abs(dif) == 1) score = [floor(random(3)),floor(random(3))];
	return score;}
function showMatchDetails(){
	push();
	let posesion = score[0] + score[1];
	let pos1 = score[0]/posesion;let pos2 = score[1]/posesion;
	pos1*=100;pos2*=100;pos1 = round(pos1);pos2 = round(pos2);
	fill(200,100,255);
	stroke(0);strokeWeight(2);
	rect(width/2,height/2,width*7/8,height*7/8);
	fill(255);
	ellipse(width/2 + width*7/16 - 25*wRatio,height/2 - height*7/16 + 25*hRatio,45*wRatio,45*hRatio);
	strokeWeight(1);
	textSize(72*wRatio);
	fill(0,255,0);
	rect(345*wRatio,235*hRatio,width/2.8,height/2.2);	
	fill(255);
	text("YOU",width/4,height/4);
	fill(255,0,0);
	rect(1020*wRatio,235*hRatio,width/2.8,height/2.2);
	fill(255);
	text(opponents[teamIndex],width*3/4,height/4);
	text(score[0],width/4,height/2);
	text(score[1],width*3/4,height/2);
	fill(0);
	textSize(48)
	text("X",width/2 + width*7/16 - 25*wRatio,height/2 - height*7/16 + 25*hRatio);
	fill(255,0,0);
	noStroke();
	rect(width/2,height*3/4,width*5/6,50*hRatio);
	fill(0,255,0);
	noStroke();
	if(score[0] == score[1]){rect((width/2 + width/12)/2,height*3/4,width*5/12,50*hRatio);} else {
		let l = pos1/100 * (width*5/6);
		let x1 = l/2 + width/12;
		rect(x1,height*3/4,l,50*hRatio);
	}
	fill("white");
	textSize(64*wRatio);
	text("COINS : " + coins,width/2,height*5/6);
	pop();}
function showCampaignMatch(argument) {
	push();
	fill(100,0,255);
	noStroke();
	rect(argument.coo.x,argument.coo.y + 75*wRatio,100*wRatio,25*hRatio);
	fill(0);
	textSize(20*wRatio);
	text("PLAY",argument.coo.x,argument.coo.y + 75*wRatio);
	pop();	}
function drawTrainingScreen(player){
	push();
	noStroke();
	fill(0,200,0);
	rect(width/2,height/2,width,height);
	if(player.ovr < 80) fill(255,255,0);
	if(player.ovr >= 80 && player.ovr < 90) fill(255,0,0);
	if(player.ovr >= 90) fill(51);
	stroke(0);
	strokeWeight(1);
	rect(width/6,height/2,400*wRatio,500*hRatio);
	textSize(48*wRatio);
	fill(0);
	text(player.TOP,width/6,height/2 - 150*hRatio);
	text(player.name,width/6,height/2);
	text(player.ovr,width/6,height/2 + 150*hRatio);
	text('Training Points:' + currency,width*3/4,height/8);
	fill(100);
	rect(width*3/4,height/3,600*wRatio,100*hRatio);
	rect(940*wRatio + (1115-940)/2 * wRatio,450*hRatio + (600-450)/2 *hRatio,(1115-940)*wRatio,(600-450)*hRatio);
	ellipse(width*3/4 - 250*wRatio,height/1.8,100*wRatio,100*hRatio);
	ellipse(width*3/4 + 250*wRatio,height/1.8,100*wRatio,100*hRatio);
	fill(255);
	text("-",width*3/4 - 250*wRatio,height/1.8);
	text("+",width*3/4 + 250*wRatio,height/1.8);
	text(player.ovr + cost,width*3/4,height/3);
	text("TRAINING COST:" + cost,width*3/4,height*2/3);
	text("TRAIN",940*wRatio + (1115-940)/2 * wRatio,450*hRatio + (600-450)/2 *hRatio);
	drawExitButton();
	pop();}
function showBeginerCampaign(){
	push();
	strokeWeight(4*wRatio);
	h_line(B_Pos[0],B_Pos[1],beginerMatches,0);
	h_line(B_Pos[0],B_Pos[2],beginerMatches,0);
	h_line(B_Pos[1],B_Pos[3],beginerMatches,1);
	h_line(B_Pos[1],B_Pos[4],beginerMatches,1);
	h_line(B_Pos[1],B_Pos[5],beginerMatches,1);
	h_line(B_Pos[1],B_Pos[6],beginerMatches,1);
	h_line(B_Pos[2],B_Pos[3],beginerMatches,2);
	h_line(B_Pos[2],B_Pos[4],beginerMatches,2);
	h_line(B_Pos[2],B_Pos[5],beginerMatches,2);
	h_line(B_Pos[2],B_Pos[6],beginerMatches,2);
	h_line(B_Pos[3],B_Pos[7],beginerMatches,3);
	h_line(B_Pos[3],B_Pos[8],beginerMatches,3);
	h_line(B_Pos[4],B_Pos[7],beginerMatches,4);
	h_line(B_Pos[4],B_Pos[8],beginerMatches,4);
	h_line(B_Pos[5],B_Pos[7],beginerMatches,5);
	h_line(B_Pos[5],B_Pos[8],beginerMatches,5);
	h_line(B_Pos[6],B_Pos[7],beginerMatches,6);
	h_line(B_Pos[6],B_Pos[8],beginerMatches,6);
	h_line(B_Pos[7],B_Pos[9],beginerMatches,7);
	h_line(B_Pos[8],B_Pos[9],beginerMatches,8);
	pop();
	for(m of beginerMatches) m.show();
	if(showPlayCampaign) showCampaignMatch(toShow);	}
function showSpainCampaign(){
	push();
	strokeWeight(4*wRatio);
	h_line(S_Pos[0],S_Pos[1],spainMatches,0);
	h_line(S_Pos[1],S_Pos[2],spainMatches,1);
	h_line(S_Pos[1],S_Pos[3],spainMatches,1);
	h_line(S_Pos[2],S_Pos[4],spainMatches,2);
	h_line(S_Pos[2],S_Pos[5],spainMatches,2);
	h_line(S_Pos[2],S_Pos[6],spainMatches,2);
	h_line(S_Pos[3],S_Pos[4],spainMatches,3);
	h_line(S_Pos[3],S_Pos[5],spainMatches,3);
	h_line(S_Pos[3],S_Pos[6],spainMatches,3);
	h_line(S_Pos[4],S_Pos[7],spainMatches,4);
	h_line(S_Pos[5],S_Pos[7],spainMatches,5);
	h_line(S_Pos[6],S_Pos[7],spainMatches,6);
	h_line(S_Pos[7],S_Pos[8],spainMatches,7);
	h_line(S_Pos[7],S_Pos[9],spainMatches,7);
	pop();
	for(m of spainMatches) {m.show();m.calc();}
	if(showPlayCampaign) showCampaignMatch(toShow);	}
function showGermanCampaign(){
	push();
	strokeWeight(4*wRatio);
	h_line(G_Pos[0],G_Pos[3],germanyMatches,0);
	h_line(G_Pos[1],G_Pos[3],germanyMatches,1);
	h_line(G_Pos[2],G_Pos[3],germanyMatches,2);
	h_line(G_Pos[3],G_Pos[4],germanyMatches,3);
	h_line(G_Pos[3],G_Pos[5],germanyMatches,3);
	h_line(G_Pos[4],G_Pos[6],germanyMatches,4);
	h_line(G_Pos[4],G_Pos[7],germanyMatches,4);
	h_line(G_Pos[5],G_Pos[6],germanyMatches,5);
	h_line(G_Pos[5],G_Pos[7],germanyMatches,5);
	h_line(G_Pos[6],G_Pos[8],germanyMatches,6);
	h_line(G_Pos[6],G_Pos[9],germanyMatches,6);
	h_line(G_Pos[7],G_Pos[8],germanyMatches,7);
	h_line(G_Pos[7],G_Pos[9],germanyMatches,7);
	pop();
	for(m of germanyMatches) {m.show();m.calc();}
	if(showPlayCampaign) showCampaignMatch(toShow);	}
function h_line(a,b,array,index){
	push();
	if(array[index].won){stroke(0,255,0)} else stroke(255,0,0);
	strokeWeight(4*wRatio);
	line(a.x,a.y,b.x,b.y);
	pop();}
function swap(fisrt,second){
	let a = team[fisrt];
	let b = team[second];

	if(a != undefined && b != undefined){
		team[fisrt].x = b.x;
		team[fisrt].y = b.y;
		team[second].x = initialCoo[0];
		team[second].y = initialCoo[1];
	}}
function showSubstitue(player){
	push();
	background(180,180,255)
	textSize(36*wRatio);
	drawExitButton();
	let pos = p.TOP;
	position = pos;
	let toShow = [];
	for(p of reserves) if(p.TOP == pos) toShow.push(p);
	let x,y;
	y = height*5/6;
	x = 150;
	if(!done){
		for(p of toShow){
			p.x = x;
			p.y = y;
			x += 200*wRatio;
		}
		done = true;
	}
	if(player.ovr < 80) fill(255,255,0);
	if(player.ovr >= 80 && player.ovr < 90) fill(255,0,0);
	if(player.ovr >= 90) fill(151);
	rect(width/4,height/3,width/3,height/2);
	textSize(64*wRatio);
	fill(0);
	text(player.TOP,width/4,height/3 - 100*hRatio);
	text(player.name,width/4,height/3);
	text(player.ovr,width/4,height/3 + 100*hRatio);
	fill(151);
	noStroke();
	rect(width*2/3,height/3,width/3,height/2);
	fill(0);
	textSize(36*wRatio);
	text("DRAG HERE TO SWAP",width*2/3,height/3);
	for(p of toShow){
		textSize(20*wRatio);
		if(p.ovr < 80) fill(255,255,0);
		if(p.ovr >= 80 && p.ovr < 90) fill(255,0,0);
		if(p.ovr >= 90) fill(151);
		rect(p.x,p.y,150*wRatio,150*hRatio);
		fill(0);
		text(p.TOP,p.x,p.y - 50*hRatio);
		text(p.name,p.x,p.y);
		text(p.ovr,p.x,p.y + 50 *hRatio);
	}
	pop();}
