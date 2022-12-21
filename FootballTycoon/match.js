function Meci(team,ovr,pos,coo,reward,array){
	this.team = team;
	this.ovr = ovr;
	this.pos = pos;
	this.won = false;
	this.coo = coo;
	this.reward = reward;
	this.canBePlayed = false;
	this.counter = 0;
	this.array = array;
	for(m of this.array) if(m.won) this.counter++;
	if(this.counter >= this.pos && !this.won) this.canBePlayed = true; else this.canBePlayed = false;
	
	this.calc = function(){
		this.counter = 0;
		for(m of this.array) if(m.won) this.counter++;
		if(this.counter >= this.pos && !this.won) this.canBePlayed = true; else this.canBePlayed = false;
	}
	this.show = function(){
		push();
		fill(100);
		strokeWeight(1);
		ellipse(this.coo.x,this.coo.y,100*wRatio,100*wRatio);
		textSize(16*wRatio);
		fill(255);
		noStroke();
		text(this.team,this.coo.x,this.coo.y - 15*hRatio);
		text(this.ovr ,this.coo.x,this.coo.y + 15*hRatio);
		pop();
	}
}