
class bgObject {

   constructor(x) {
      this.x = x || width / 2;
      this.w = random(30,50);
      this.y = -height - this.w;
      this.vy = random(5,10);
      this.a = 0;
      this.da = random(PI/200,PI/120) * (random() < 0.5 ? 1 : -1);
      this.c = {r:random(100,255),g:random(100,255),b:random(100,255)};
   }

   draw() { 
      this.y += this.vy;
      this.a += this.da;

      push()
      fill(255,0,0);
      //rect(this.x - (this.w),this.y - (this.w),this.w*2,this.w*2);
      //fill(0,255,0);
      //rect(this.x - (this.w/2),this.y - (this.w/2),this.w,this.w);
      normalMaterial(255);
      noFill();
      stroke(this.c.r,this.c.g,this.c.b);
      translate(this.x,this.y);
      //rotateX(this.a);
      //rotateY(this.a);
      rotateZ(this.a);
      box(this.w);
      pop();
   }

   isOutside() {
      return (this.y > height);
   }

}

class Particle {
   constructor(x,y,c) {
      this.x = x;
      this.y = y;
      this.z = 0;
      this.vx = random(-2,2);
      this.vy = random(-2,2);
      this.ax = 0;
      this.ay = 0.25;
      this.c = c || {r:random(100,255),g:random(100,255),b:random(100,255)};
      this.a = 0;
      this.da = random(PI/200,PI/120) * (random() < 0.5 ? 1 : -1);
      this.w = random(5,15);
   }

   draw() {
      this.vx += this.ax;
      this.vy += this.ay;
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;

      push();
      translate(this.x,this.y);
      normalMaterial(255);
      noFill();
      stroke(this.c.r,this.c.g,this.c.b);
      rotateX(this.a);
      rotateY(this.a);
      rotateZ(this.a);
      box(this.w);
      pop();
   }

   isOutside() {
      return (this.y > (height / 2) + 20);
   }
}

const shapes = [];
const particles = [];
let timer;

function setup() {
   createCanvas(window.innerWidth, window.innerHeight, WEBGL);

   timer = setInterval(() => {
      let ns = new bgObject(random(-width/2,width/2));
      let tries = 0;
      while(!isSpawnable(ns)) {
         if (tries > 10) return;
         ns = new bgObject(random(-width/2,width/2));
         tries += 1;
      }
      shapes.push(ns);
   }, 125);
}


function draw() {
   background(0);

   for(let i = shapes.length - 1; i > -1; i--) {
      shapes[i].draw();
      if (shapes[i].isOutside()) {
         shapes.splice(i, 1);
      }
   }
   for (let i = particles.length - 1; i > -1; i--) {
      particles[i].draw();
      if (particles[i].isOutside()) {
         particles.splice(i, 1);
      }
   }
}

function mousePressed() {
   for (let i = shapes.length - 1; i > -1; i--) {
      if (isOver(shapes[i])) {
         for(let i = 0; i < random(10,30); i++)
            particles.push(new Particle(mouseX-(width/2), mouseY-(height/2), shapes[i].c));
         shapes.splice(i,1);
         break;
      }
   }
} 
function isOver(shape) {
   return (mouseX - (width/2) > shape.x - shape.w &&
           mouseX - (width/2) < shape.x + shape.w &&
           mouseY - (height/2) > shape.y - shape.w &&
           mouseY - (height/2) < shape.y + shape.w); 
}

function isSpawnable(s) {
   for (c of shapes) {
      //      x                 y                w
      //rect(this.x - (this.w),this.y - (this.w),this.w*2);
      // rect1x < rect2x+rect2w && rect1x + rect1w > rect2x   
      if (s.x < c.x + c.w && s.x + s.w > c.x) { 
      //if(s.x - s.w < (c.x - c.w) + (c.w * 2) && (s.x - s.w) + (c.w * 2) > c.w - c.w){
         return false;
      }
   }
   return true;
}