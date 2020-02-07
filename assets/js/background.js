class Rock {

   constructor(x, y, r, vx, vy, cd) {
      this.x = x || 0;
      this.y = y || 0;
      this.cd = cd || 0;

      this.vx = vx || random(-1,1);
      this.vy = vy || random(-1,1);

      this.r = r || random(60,120);

      this.angle = 0;
      this.angleMod = (random(PI / 250, PI / 295)) *  (random() > 0.5 ? -1 : 1);

      const radMod = log(this.r/2) * 2.75;

      this.radii = [];
      
      for (let i = 0; i < 20; i++) {
         const r = random((this.r) - radMod, (this.r) + radMod);

         this.radii.push(r);
      }

   }

   draw() {

      if (this.cd > 0) this.cd -= 1;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x + (this.r / 2) > width) {
         this.x -= (this.x + (this.r / 2)) - width;
         this.vx *= -1;
      }

      if (this.y + (this.r / 2) > height) {
         this.y -= (this.y + (this.r / 2)) - height;
         this.vy *= -1;
      }

      if (this.x - (this.r / 2) < 0) {
         this.x += (this.x - (this.r / 2)) * -1; 
         this.vx *= -1;
      }

      if (this.y - (this.r / 2) < 0) {
         this.y += (this.y - (this.r / 2)) * -1; 
         this.vy *= -1;
      }

      rocks.forEach(rock => {

         if (this == rock) return;

         if (this.isColliding(rock) && this.cd == 0) {
            this.vx *= -1;
            this.vy *= -1;
            this.cd = 5;
         }
      });

      stroke(220);
      noFill();
      //ellipse(this.x,this.y,this.r);

      push();
      translate(this.x,this.y)
      rotate(this.angle);

      beginShape();

      let currR = 0;

      for(let a = 0; a < TWO_PI; a += TWO_PI/25) {

         const nr = this.radii[currR];

         const x = ((nr/2) * cos(a));
         const y = ((nr/2) * sin(a));

         vertex(x,y);

         currR = currR < this.radii.length ? currR + 1 : 0;
      }

      endShape(CLOSE);

      pop();

      this.angle += this.angleMod;
   }

   split() {
      if (this.r > 30) {
         const r1 = new Rock(this.x,this.y - this.r/4,this.r/2,this.vx * 1.1,this.vy * 1.1, 60);
         const r2 = new Rock(this.x - this.r/4,this.y,this.r/2,-this.vx * 1.1,this.vy * 1.1, 60);
         const r3 = new Rock(this.x,this.y + this.r/4,this.r/2,this.vx * 1.1 ,-this.vy * 1.1, 60);

         rocks.push(r1,r2,r3);
      }
      rocks.splice(rocks.indexOf(this), 1);
   }

   isColliding(rock) {
      const d = {x: abs(rock.x - this.x), y: abs(rock.y - this.y)};
      const dist = sqrt((d.x * d.x) + (d.y * d.y));
      return dist < (rock.r / 2) + (this.r / 2);
   }

   nonSpawnable() {
      if (rocks.length == 0) return false;
      for (let rock of rocks) {
         if (this.isColliding(rock)) {
            return rock;
         }
      }
      return false;
   }

}

class Particle {

   constructor(x,y,vx,vy,ax,ay) {

      this.pos = {x, y};
      this.v = {x:vx, y:vy};
      this.a = {x:ax, y:ay};
      this.size = random(2,5);
      this.color = 255;

   }

   draw() {
      this.a.y += 0.0075;

      this.v.x += this.a.x;
      this.v.y += this.a.y;

      this.pos.x += this.v.x;
      this.pos.y += this.v.y;

      fill(this.color);
      stroke(this.color);
      this.color -= 3;
      ellipse(this.pos.x,this.pos.y,this.size);
   }
}

function mousePressed() {
   const m = new Rock(mouseX,mouseY,2);
   const r = m.nonSpawnable();
   if (r) {
      for (let i = 0; i < random(40,80); i++)
         particles.push(new Particle(mouseX,mouseY,0,0,random(-.14,.14),random(-.14,.14)));
         r.split();
   }
}

const rocks = [];
const particles = [];
const ROCK_AMOUNT = 50;

function setup() {
   createCanvas(window.innerWidth, window.innerHeight);

   for (let i = 0; i < ROCK_AMOUNT; i++) {
      let newRock = new Rock(random(width),random(height));

      while (newRock.nonSpawnable()) {
         newRock = new Rock(random(width),random(height));
      }

      rocks.push(newRock);
   }
}

function draw() {
   background(0);

   fill(255);
   noStroke();
   text("Particles: " + particles.length, 20, 20);
   text("Entities: " + (particles.length + rocks.length), 20, 40);
   text(`FPS: ${frameRate().toFixed(0)}`, 20, 60);
   rocks.forEach(r => r.draw());

   for(let i = 0; i < particles.length; i++) {
      if (particles[i].pos.x > width || particles[i].pos.x < 0 ||
         particles[i].pos.y > height || particles[i].pos.y < 0) {
         particles.splice(i, 1);
         continue;
      }
      particles[i].draw();
   }
}

