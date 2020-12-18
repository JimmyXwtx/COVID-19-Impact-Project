//
// Adapted from
// https://p5js.org/examples/simulate-soft-body.html
//
class SoftBody {
  constructor(p5, ui, spec) {
    // instance of SoftBodyTab
    this.ui = ui;
    // Color
    this.fill_color = spec.fill_color;
    this.nnodes = spec.nnodes;
    this.radius = spec.radius;
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
    // zero fill arrays
    this.nodeStartX = [];
    this.nodeStartY = [];
    this.nodeX = [];
    this.nodeY = [];
    this.angle = [];
    this.frequency = [];
    // soft-body dynamics
    this.organicConstant = 1.0;
    // initialize arrays to 0
    for (let i = 0; i < this.nnodes; i++) {
      this.nodeStartX[i] = 0;
      this.nodeStartY[i] = 0;
      this.nodeX[i] = 0;
      this.nodeY[i] = 0;
      this.angle[i] = 0;
    }
    this.splitPending = 0;
    this.init(p5);
  }
  init(p5) {
    // Start at random location
    const rt = p5.soft_rect;
    this.centerX = p5.random(rt.left, rt.left + rt.width);
    this.centerY = p5.random(rt.top, rt.top + rt.height);
    // this.centerX = p5.random(p5.width);
    // this.centerY = p5.random(p5.height);
    // initalize frequencies for corner nnodes
    for (let i = 0; i < this.nnodes; i++) {
      this.frequency[i] = p5.random(5, 12);
    }
    this.random_target(p5);
  }
  random_target(p5) {
    const rad = this.radius;
    const rt = p5.soft_rect;
    this.targetX = p5.random(rt.left + rad, rt.left + rt.width - rad);
    this.targetY = p5.random(rt.top + rad, rt.top + rt.height - rad);
    // this.targetX = p5.random(rad, p5.width - rad);
    // this.targetY = p5.random(rad, p5.height - rad);
  }
  drawShape(p5) {
    //  calculate node  starting locations
    for (let i = 0; i < this.nnodes; i++) {
      const rot = p5.radians(this.rotAngle);
      this.nodeStartX[i] = this.centerX + p5.cos(rot) * this.radius;
      this.nodeStartY[i] = this.centerY + p5.sin(rot) * this.radius;
      this.rotAngle += 360.0 / this.nnodes;
    }
    // draw polygon
    p5.curveTightness(this.organicConstant);
    p5.fill(this.fill_color);
    p5.beginShape();
    for (let i = 0; i < this.nnodes; i++) {
      p5.curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    for (let i = 0; i < this.nnodes - 1; i++) {
      p5.curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    p5.endShape(p5.CLOSE);
  }
  moveShape(p5) {
    // move center point
    this.deltaX = this.targetX - this.centerX;
    this.deltaY = this.targetY - this.centerY;
    if (this.isStill(p5)) {
      this.random_target(p5);
      this.splitPending = 1;
    }
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
    const sum = p5.abs(this.accelX) + p5.abs(this.accelY);
    this.organicConstant = 1 - sum * 0.1;
    // move nnodes
    for (let i = 0; i < this.nnodes; i++) {
      const srad = p5.sin(p5.radians(this.angle[i]));
      this.nodeX[i] = this.nodeStartX[i] + srad * (this.accelX * 2);
      this.nodeY[i] = this.nodeStartY[i] + srad * (this.accelY * 2);
      this.angle[i] += this.frequency[i];
    }
  }
  isStill(p5) {
    return (
      p5.abs(this.deltaX) < this.ui.smallnum &&
      p5.abs(this.deltaY) < this.ui.smallnum
    );
  }
  checkSplit(p5, nbods) {
    if (!this.splitPending) return;
    // console.log('checkSplit radius', this.radius);
    let { fill_color, radius, nnodes } = this;
    // radius = radius / 2;
    radius = radius * this.ui.split_ratio;
    const spec = { fill_color, nnodes, radius };
    if (radius > this.ui.min_radius) {
      // this.radius = radius;
      const nbod = new SoftBody(p5, this.ui, spec);
      this.splitPlace(nbod);
      nbods.push(nbod);
    }
    this.splitPending = 0;
  }
  splitPlace(nbod) {
    const { centerX, centerY } = this;
    this.radius = nbod.radius;
    // this.centerX = centerX - this.radius;
    // nbod.centerX = centerX + this.radius;
    nbod.centerX = centerX;
    nbod.centerY = centerY;
    this.targetX = centerX - this.radius * 2;
    this.targetY = centerY;
    nbod.targetX = centerX + this.radius * 2;
    nbod.targetY = centerY;
  }
}

export default SoftBody;
