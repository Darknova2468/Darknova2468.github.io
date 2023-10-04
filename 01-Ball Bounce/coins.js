class coin {
  //instantiates all variables
  constructor(_pos, _r) {
    this.pos = _pos;
    this.radius = _r;
  }
  //gets the position of the coin
  getPosition() {
    return this.pos;
  }
  //gets the radius of the coin
  getRadius() {
    return this.radius;
  }
  //checks the collision of the coin and gives it a new position
  checkCollision(_point, _r) {
    if (
      dist(this.pos[0], this.pos[1], _point[0], _point[1]) <
        _r + this.radius
    ) {
      this.pos = [this.radius+random(width-2*this.radius), this.radius+random(height-2*this.radius)];
      return true;
    }
    return false;
  }
  //allows you to reset a defined position
  setPosition(_pos) {
    this.pos = _pos;
  }
}