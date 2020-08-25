//
// https://p5js.org/examples/simulate-soft-body.html

let bods = [];
const smallnum = 0.01;

function setup() {
  const cred = color(255, 0, 0, 100);
  const cgreen = color(0, 255, 0, 100);
  const cblue = color(0, 0, 255, 100);
  const specs = [
    { fill_color: cred, nodes: 12, radius: 20 },
    { fill_color: cgreen, nodes: 12, radius: 40 },
    { fill_color: cblue, nodes: 12, radius: 70 },
  ];
  createCanvas(710, 400);
  specs.forEach((spec) => bods.push(new SoftOne(spec)));
  bods.forEach((one) => one.init());
  noStroke();
  frameRate(30);
}

function draw() {
  //fade background
  fill(0, 100);
  rect(0, 0, width, height);
  bods.forEach((one) => {
    one.drawShape();
    one.moveShape();
  });
}

class SoftOne {
  constructor(opt) {
    // Color
    this.fill_color = opt.fill_color;
    this.nodes = opt.nodes;
    this.radius = opt.radius;
    // center point
    this.centerX = 0.0;
    this.centerY = 0.0;
    // this.radius = 45;
    this.rotAngle = -90;
    this.accelX = 0.0;
    this.accelY = 0.0;
    this.deltaX = 0.0;
    this.deltaY = 0.0;
    this.springing = 0.0009;
    this.damping = 0.98;
    //zero fill arrays
    this.nodeStartX = [];
    this.nodeStartY = [];
    this.nodeX = [];
    this.nodeY = [];
    this.angle = [];
    this.frequency = [];
    // soft-body dynamics
    this.organicConstant = 1.0;
  }
  init() {
    // Start at random location
    this.centerX = random(width);
    this.centerY = random(height);
    //initialize arrays to 0
    for (let i = 0; i < this.nodes; i++) {
      this.nodeStartX[i] = 0;
      this.nodeStartY[i] = 0;
      this.nodeY[i] = 0;
      this.nodeY[i] = 0;
      this.angle[i] = 0;
    }
    // initalize frequencies for corner nodes
    for (let i = 0; i < this.nodes; i++) {
      this.frequency[i] = random(5, 12);
    }
    this.set_target();
  }
  set_target() {
    this.targetX = random(width);
    this.targetY = random(height);
  }
  drawShape() {
    //  calculate node  starting locations
    for (let i = 0; i < this.nodes; i++) {
      const rot = radians(this.rotAngle);
      this.nodeStartX[i] = this.centerX + cos(rot) * this.radius;
      this.nodeStartY[i] = this.centerY + sin(rot) * this.radius;
      this.rotAngle += 360.0 / this.nodes;
    }
    // draw polygon
    curveTightness(this.organicConstant);
    fill(this.fill_color);
    beginShape();
    for (let i = 0; i < this.nodes; i++) {
      curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    for (let i = 0; i < this.nodes - 1; i++) {
      curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    endShape(CLOSE);
  }
  moveShape() {
    //move center point
    this.deltaX = this.targetX - this.centerX;
    this.deltaY = this.targetY - this.centerY;
    if (abs(this.deltaX) < smallnum && abs(this.deltaY) < smallnum)
      this.set_target();
    // create springing effect
    this.deltaX *= this.springing;
    this.deltaY *= this.springing;
    this.accelX += this.deltaX;
    this.accelY += this.deltaY;
    // move predator's center
    this.centerX += this.accelX;
    this.centerY += this.accelY;
    // slow down springing
    this.accelX *= this.damping;
    this.accelY *= this.damping;
    // change curve tightness
    const sum = abs(this.accelX) + abs(this.accelY);
    this.organicConstant = 1 - sum * 0.1;
    //move nodes
    for (let i = 0; i < this.nodes; i++) {
      const srad = sin(radians(this.angle[i]));
      this.nodeX[i] = this.nodeStartX[i] + srad * (this.accelX * 2);
      this.nodeY[i] = this.nodeStartY[i] + srad * (this.accelY * 2);
      this.angle[i] += this.frequency[i];
    }
  }
}
