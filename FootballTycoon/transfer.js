function transferPlayer(name,ovr,TOP,index){
	this.x = 0;
	this.y = 0;
	this.bought = false;
	this.name = name;
	this.ovr = ovr;
	this.TOP = TOP;
	this.price = round(map(this.ovr,90,100,1000000,10000000));
	this.index = index;

	this.show = function(){
		push();
		fill(100,100,255);
		rect(width/2,(this.index % 10)*50*hRatio + 50*hRatio,width*3/4,50*hRatio);
		textSize(20*wRatio);
		fill(0);
		text(this.name,width/4 - 100*wRatio,(this.index % 10)*50*hRatio + 50*hRatio);
		text("OVR:" + this.ovr ,width/2 - 100*wRatio,(this.index % 10)*50*hRatio + 50*hRatio);
		text("PRICE:" + this.price,width*3/4 - 100*wRatio,(this.index % 10)*50*hRatio + 50*hRatio);
		if(coins >= this.price) fill(0,255,0); else fill(255,0,0);
		this.bought && fill(151);
		rect(width*3/4 + 120*wRatio,(this.index % 10)*50*hRatio + 50*hRatio,100*wRatio,50*hRatio);
		fill(0);
		(!this.bought) && text("BUY",width*3/4 + 120*wRatio,(this.index % 10)*50*hRatio + 50*hRatio);
		this.bought && text("BOUGHT",width*3/4 + 120*wRatio,(this.index % 10)*50*hRatio + 50*hRatio);
		pop();
	}
}