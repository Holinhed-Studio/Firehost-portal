const parts = [];
let timer;

const SPAWN_INTERVAL = 125;

function setup() {
   createCanvas(window.innerWidth,window.innerHeight, WEBGL);
   timer = setInterval(() => {
      let ns, t = 0;
      while(t == 0 || !isSpawnable(ns)) {
         if (t > 10) return;
         ns = new P(random(-width/2,width/2), undefined, true);
         t++;
      }
      parts.push(ns);
   }, SPAWN_INTERVAL); 
}

function draw() {
   background(0);
   for (let i = parts.length - 1; i > -1; i--) {
      parts[i].draw();
      if (parts[i].isOutside()) parts.splice(i,1);
   }
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
 }

function mousePressed() {
   for (let i = parts.length - 1; i > -1; i--) 
   if (isOver(parts[i]) && parts[i].e) {
      for (let j = 0; j < random(10,30); j++) parts.push(new P(mouseX-(width/2), mouseY-(height/2), false, true));
      parts.splice(i,1);
      break;
   }
}

function isOver(shape) {
   return (mouseX - (width/2) > shape.x - shape.w && mouseX - (width/2) < shape.x + shape.w &&
           mouseY - (height/2) > shape.y - shape.w && mouseY - (height/2) < shape.y + shape.w);
}

function isSpawnable(s) {
   for (c of parts) if (s.x < c.x + c.w && s.x + s.w > c.x) return false;
   return true;
}

const P = function(x,y,e,p) {
   this.x = x;
   this.w = p ? random(5,15) : random(30,50);
   this.y = y || -(height + this.w);
   this.a = 0;
   this.da = random(-PI/200,PI/120);
   this.c = {r:random(100,255),g:random(100,255),b:random(100,255)};
   this.e = e;
   this.vx = p ? random(-2,2) : 0;
   this.vy = p ? random(-2,2) : random(5,10);
   this.ay = p ? 0.25 : 0;
   this.draw = () => {
      this.vy += this.ay;
      push();
      translate(this.x += this.vx, this.y += this.vy);
      normalMaterial(255);
      noFill();
      stroke(this.c.r,this.c.g,this.c.b);
      rotateX(this.a += this.da);
      box(this.w);
      pop();
   }

   this.isOutside = () => {
      return (this.y > (height / 2 ) + 30);
   }
}