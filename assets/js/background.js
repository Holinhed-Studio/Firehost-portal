const Particle = function(x,y,p) {

   this.x = x;
   this.w = p ? random(5,15) : random(30,50);
   this.y = y || -height - this.w;
   this.a = 0;
   this.da = random(PI/200,PI/120) * (random() < 0.5 ? 1 : -1);
   this.c = {r:random(100,255),g:random(100,255),b:random(100,255)};

   this.vx = p ? random(-2,2) : 0;
   this.vy = p ? random(-2,2) : random(5,10);
   this.ax = 0;
   this.ay = p ? 0.25 : 0;

   this.draw = () => {
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

   this.isOutside = () => {
      return (this.y > (height / 2 ) + 30);
   }
}

const particles = [];
let timer;

function setup() {
   createCanvas(window.innerWidth,window.innerHeight, WEBGL);

   timer = setInterval(() => {
      let ns = new Particle(random(-width/2,width/2));
      let t = 0;
      while(!isSpawnable(ns)) {
         if (t > 10) return;
         ns = new Particle(random(-width/2,width/2));
         t++;
      }
      particles.push(ns);
   }, 125);
}

function draw() {
   background(0);

   for (let i = particles.length - 1; i > -1; i--) {
      particles[i].draw();
      if (particles[i].isOutside()) {
         particles.splice(i,1);
      }
   }
}

function mousePressed() {
   for (let i = particles.length - 1; i > -1; i--) {
      if (isOver(particles[i]) && !particles[i].p) {
         for (let j = 0; j < random(10,30); j++)
            particles.push(new Particle(mouseX-(width/2), mouseY-(height/2), true));
         particles.splice(i,1);
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
   for (c of particles) 
      if (s.x < c.x + c.w && s.x + s.w > c.x) return false;
   return true;
}