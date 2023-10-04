//defining density of air, coeficent of drag, gravity in cm/s, and the friction of surfaces
const rho = 1.204;
const Cdrag = 0.5;
const gravity = -981;
const friction = 0.8;

class ball {
  //instantiates all the variables of the ball
  constructor(_pos, _velocity, _radius) {
    this.pos = _pos;
    this.velocity = [_velocity[0] * 100, _velocity[1] * 100];
    this.radius = _radius;
    this.area = PI * this.radius ** 2;
    this.boundaries = [[]];
  }
  //adds a new boundary to the array
  addBoundary(bound) {
    this.boundaries.push(bound);
  }
  //updates the balls position
  updatePos(t) {
    if (Math.abs(this.velocity[0]) + Math.abs(this.velocity[1]) !== 0) {
      //applys air resistance
      let sine = 0;
      let cosine = 0;
      const theta = Math.atan(this.velocity[0] / this.velocity[1]);
      const magn = Math.sqrt(this.velocity[0] ** 2 + this.velocity[1] ** 2);
      const drag = -0.5 * rho * magn ** 2 * Cdrag * this.area;
      this.velocity[0] += Math.sin(theta) * Cdrag * t;
      this.velocity[1] += Math.cos(theta) * Cdrag * t;
      for (let i = 0; i < 2; i++) {
        this.pos[i] += this.velocity[i] * t;
      }
      //applies a normals force friction force and or a reflection
      for (let i = 0; i < this.boundaries.length; i++) {
        if (intersect(this.boundaries[i], this.pos, this.radius)) {
          this.velocity = reflect(this.velocity, this.boundaries[i]);
          let slope =
            (this.boundaries[i][2] - this.boundaries[i][0]) /
            (this.boundaries[i][3] - this.boundaries[i][1]);
          sine = Math.sin(slope);
          cosine = Math.cos(slope);
          if (isNaN(sine)) {
            sine = 1;
          }
          if (isNaN(cosine)) {
            cosine = 1;
          }
        }
      }
      //applies all forces to the velocity variable
      this.velocity[0] -= this.velocity[0] * sine * friction * t;
      this.velocity[1] += gravity * t - gravity * sine * t;
      this.velocity[1] -= this.velocity[1] * cosine * friction * t;
    }
    //keeps the ball in the bounds of the screen
    if(this.pos[0]<this.radius) {
      this.pos[0] = this.radius;
    }
    if(this.pos[0]>width-this.radius) {
      this.pos[0] = width-this.radius;
    }
    if(this.pos[1]<this.radius) {
      this.pos[1] = this.radius;
    }
    if(this.pos[1]>height-this.radius) {
      this.pos[1] = height-this.radius;
    }
    return this.pos;
  }
  //gets the radius of the ball
  getRadius() {
    return this.radius;
  }
  //gets the velocity of the ball
  getVelocity() {
    return this.velocity;
  }
  //updates the velocity of the ball
  updateVelocity(velocity) {
    for (let i = 0; i < this.velocity.length; i++) {
      this.velocity[i] = velocity[i]*100;
    }
  }
  //redefines the position of the ball
  setPosition(_pos){
    this.pos = _pos;
    this.velocity = [0, 0];
  }
}

//checks if the ball collided with a line segment
function intersect(boundary, center, radius) {
  const d = [boundary[2] - boundary[0], boundary[3] - boundary[1]];
  const f = [boundary[0] - center[0], boundary[1] - center[1]];
  const a = dot(d, d);
  const b = 2 * dot(f, d);
  const c = dot(f, f) - radius ** 2;
  let discriminant = b ** 2 - 4 * a * c;
  return discriminant >= 0;
}

//finds the dot product of two vectors
function dot(v1, v2) {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

//reflects a vector along a line segment
function reflect(velocity, boundary) {
  let n = [boundary[2] - boundary[0], boundary[3] - boundary[1]];
  const magnitude = Math.sqrt(n[0] ** 2 + n[1] ** 2);
  n = [n[1] / magnitude, n[0] / magnitude];
  const scalar = friction * 2 * dot(velocity, n);
  return [velocity[0] - scalar * n[0], velocity[1] - scalar * n[1]];
}