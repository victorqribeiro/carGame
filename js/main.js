const size = Math.min(innerWidth, innerHeight);
const canvas = document.createElement("canvas");
canvas.width = w = size;
canvas.height = h = size;
const c = canvas.getContext("2d");

c.translate(w/2,h-h/2.5);

document.body.appendChild(canvas);
const car = new Image(), fov = 300;

let points = [], score = 0, p, colide;

function init(){
	
	car.src = 'img/car.png';
	car.onload = ()=>draw();
	
	points = [];
	score = 0;
	
	for(let i = 0; i < 2; i++){
		points.push({
			x: Math.random() > 0.5 ? -40 : 5,
			y: 0,
			z: Math.random()*200,
			w: 30,
			speed: Math.random() + 0.5
		});
	}

	p = {
		x: 0,
		y: 0,
		z: -230,
		lane: 1,
		laneToBe: 1,
		isChangingLane: false,
		collide: function(r){
			return ( (this.x > r.x && this.x < r.x+r.w) ||
							 (this.x+r.w > r.x && this.x+r.w < r.x+r.w) ) &&
						 (r.z > this.z && r.z < this.z+5);
		}
	};


}

const _sort = (a,b)=>{
	if(a.z < b.z){
		return 1;
	}else if(b.z < a.z){
		return -1;
	}else{
		return 0;
	}
}; 

function draw(){
	
	points.sort( _sort );
	
	if( p.lane != p.laneToBe){
		p.isChangingLane = true;
		let x;
		if( p.laneToBe == 0 ){
			x = -1;
		}else{
			x = 1;
		}
		p.x += x;
		if( p.x == -35 ){
			p.lane = 0;
			p.isChangingLane = false;
		}else if( p.x == 4 ){
			p.lane = 1;
			p.isChangingLane = false;
		}
	}
	
	c.clearRect(-w,-h,w*2,h*2);
	colide = false;
	for(let i = 0; i < points.length; i++){
		points[i].z -= points[i].speed;
		let s = fov / (fov+points[i].z);
		c.save();
		c.scale(s,s);
		c.translate(points[i].x,points[i].y);
		c.drawImage(car,0,0,30,30);
		c.restore();
		if(points[i].z < p.z-20){
			points[i].z = 200;
			points[i].x = Math.random() > 0.5 ? -40 : 5;
			score++;
		}
		if(p.collide(points[i])){
			colide = true;
			break;
		}
	}
	c.save();
	let sp = fov / (fov + p.z);
	c.scale(sp,sp);
	c.translate(p.x,p.y);
	c.drawImage(car,0,0,30,30);
	c.restore();
	c.font = "30px Arial";
	c.fillText("Score: "+score, -w/2+10, -h/2 );
	if(!colide)
		requestAnimationFrame(draw);
}

document.body.addEventListener("keydown",function(e){
	if(p.isChangingLane)
		return;
	switch(e.keyCode){
		case 37 :
				p.laneToBe = 0;
			break;
		case 39 :
				p.laneToBe = 1;
			break;
	}
});

canvas.addEventListener("click",function(e){
	if(p.isChangingLane)
		return;
	if(e.offsetX < w/2){
		p.laneToBe = 0;
	}else{
		p.laneToBe = 1;
	}
	if( colide )
		init();
});

init();
