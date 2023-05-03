//
// https://p5js.org/examples/simulate-soft-body.html

let bods = [];
const smallnum = 0.5;
const nodes = 7;
const alph = 120;
let rmax;
let filled = 1;

function setup() {
  createCanvas(600, 400);
  // rmax = sqrt(width * height / PI);
  rmax = height;
  const specs = make_specs();
  specs.forEach((spec) => bods.push(new SoftOne(spec)));
  bods.forEach((one) => one.init());
  noStroke();
  frameRate(30);
}

function draw() {
  //fade background
  if (filled) {
    fill(210, 255);
    rect(0, 0, width, height);
  }
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
    const rad = this.radius;
    this.targetX = random(rad, width - rad);
    this.targetY = random(rad, height - rad);
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

// const cred = color(255, 0, 0, alph);
// const cgreen = color(0, 255, 0, alph);
// const cblue = color(0, 0, 255, alph);
// const specs = [
//   { fill_color: cred, nodes, radius: 20 },
//   { fill_color: cgreen, nodes, radius: 40 },
//   { fill_color: cblue, nodes, radius: 70 },
// ];

function make_specs() {
  const specs = [];
  const total = pie0.ostats_total;
  pie0.slices.map((item) => {
    const fill_color = item.color + 'D0';
    const radius = rmax * (item.y / total);
    specs.push({ fill_color, nodes, radius });
  });
  return specs;
}

// Click top left corner to go full screen
function mousePressed() {
  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

const pie0 = {
  slices: [
    {
      x: 'US',
      y: 1528568,
      label: 'US\n31.2%',
      color: '#FF0000',
    },
    {
      x: 'Russia',
      y: 299941,
      label: 'Russia\n6.1%',
      color: '#006064',
    },
    {
      x: 'Brazil',
      y: 271885,
      label: 'Brazil\n5.6%',
      color: '#00796B',
    },
    {
      x: 'UK',
      y: 250138,
      label: 'UK\n5.1%',
      color: '#8BC34A',
    },
    {
      x: 'Spain',
      y: 232037,
      label: 'Spain\n4.7%',
      color: '#DCE775',
    },
    {
      x: 'Italy',
      y: 226699,
      label: 'Italy\n4.6%',
      color: '#FFF59D',
    },
    {
      x: 'France',
      y: 180933,
      label: 'France\n3.7%',
      color: '#F4511E',
    },
    {
      x: 'Germany',
      y: 177778,
      label: 'Germany\n3.6%',
      color: '#00FF00',
    },
    {
      x: '▼',
      y: 1729513,
      label: '[180] ▼ 35.3%',
      count: 180,
      color: '#202080',
    },
  ],
  stats_total: '4,897,492',
  ostats_total: 4897492,
  yprop: 'Confirmed',
  date: '2020-05-19',
};
