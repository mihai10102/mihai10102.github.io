function Tile(nr){
	this.nr = nr;
	this.pos = [0,0];
	this.color = 0;

	this.getData = function(){
		this.pos[0] = (nr-1)%5 * 100;
		this.pos[1] = floor((nr-1) / 5) * 100;
		this.color = this.nr / 25 * 360;
	}

	this.show = function(){
		strokeWeight(2);
		fill(this.color,100,100,1);
		rect(this.pos[0],this.pos[1],100,100);
		fill(0,0,0,1);
		textSize(32);
		text(this.nr,this.pos[0] + 50,this.pos[1] + 50);
	}
}