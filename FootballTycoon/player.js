function Player(name,ovr,TOP,index){
	this.rezerve = false;
	this.toTrain = false;
	this.toSwap = false;
	this.index = index;
	this.name = name;
	this.details = false;
	this.ovr = ovr;
	this.x = x[this.index];
	this.y = y[this.index];
	this.TOP = TOP; // STANDS FOR TYPE OF POSITION(DEFENDER,MIDFIELDER,FORWARD,GK)
	this.selected = false;
	this.details = false;
	
	this.showDetails = function(){
		this.details = true;
		push();
		fill(150,100);
		stroke(0);
		strokeWeight(2);
		textSize(30*wRatio);
		rect(this.x,this.y - 75/2 * hRatio,150*wRatio,75*hRatio);
		rect(this.x,this.y + 75/2 * hRatio,150*wRatio,75*hRatio);
		fill(0);
		noStroke();
		text("TRAIN",this.x,this.y - 75/2 *hRatio);
		text("SWAP" ,this.x,this.y + 75/2 *hRatio)
		pop();
	}
}