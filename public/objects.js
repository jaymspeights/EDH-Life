
class Player {

  constructor(x, y, height, width, color, name) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
    this.name = name;
    this.life = 40;
    this.damage = [];
    this.top_margin = 5;
    this.margin = 2;
    this.radius = 25;
    this.full = false;
  }

  inBounds(xp, yp) {
    return xp >= this.x && xp <= this.x+this.width &&
            yp >= this.y && yp <= this.y+this.height;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  fullscreen(width, height) {
    if (players.length > 2)
      if (this.full == false) {
        this.width = width;
        this.height = height;
        this.full = true;
        this.x = 0;
        this.y = 0;
        return this;
      }
      else {
        this.full = false;
        return null;
      }
  }

  click(x, y) {
    if (this.full) {
      //name clicked
      if (y < this.top_line) {
        console.log(this.name);
      } // life clicked
      else if (x < this.center) {
        if (x < this.center/2)
          this.life--;
        else
          this.life++;
      } // c-damage clicked
      else {
        if (this.damage.length == 0) return;
        let i = Math.floor((y-this.top_line)/this.scale - .5);
        if (i < 0) i = 0;
        if (i >= this.damage.length) i = this.damage.length;
        if (x > this.center*1.5)
          this.damage[i].amt++;
        else
          this.damage[i].amt--;
      }
    } else {
      if (players.length==2 && y>this.bottom_line*1.75+this.y) {
        if (x > this.center)
          this.damage[0].amt++;
        else
          this.damage[0].amt--;
      } else {
        if (x > this.center)
          this.life++;
        else
          this.life--;
      }
    }
  }

  render() {
    this.font_size = this.height/16;
    this.top_line = this.top_margin + this.font_size*3;
    if (players.length==1) this.font_size *=1.75;
    this.center = this.width/2;
    fill(this.color);
    rect(this.x + this.margin, this.y + this.margin,
       this.width - 2*this.margin, this.height - 2*this.margin, this.radius);
    textSize(this.font_size*2)
    fill(0)
    textAlign(CENTER, TOP);
    text(this.name, this.x + this.center, this.y + this.top_margin);
    textSize(this.font_size*5)

    if (this.full) {
      textAlign(CENTER, CENTER)
      text(this.life, this.x + this.center/2, this.y + this.height/2);
      line(this.center + this.x, this.y + this.top_line, this.center+this.x, this.y+this.height-this.top_line);
      textSize(this.font_size*2);
      this.scale = (this.height-this.top_line)/(this.damage.length+1);
      push();
      strokeWeight(3);
      stroke(0)
      for (let i = 0; i < this.damage.length; i++) {
        fill(this.damage[i].color);
        text(this.damage[i].amt, this.x+this.center*1.5, this.y+this.top_line+(i+1)*this.scale);
      }
      pop();
    } else {
      this.bottom_line = this.top_margin + this.font_size*6;
      text(this.life, this.x + this.center, this.y + this.top_line);
      var grid = getLayout(this.damage.length);
      var scale_x = this.width/(grid.x+1);
      var scale_y = (this.height - this.bottom_line)/(grid.y+1);
      var index = 0;
      textSize(this.font_size*2)
      push();
      strokeWeight(1);
      stroke(0)
      for (var i = 0; i < grid.x; i++) {
        for (var j = 0; j < grid.y; j++) {
          if (index >= this.damage.length) continue;
          fill(this.damage[index].color)
          text(this.damage[index].amt, this.x + (i+1)*scale_x, this.y + (j+1)*scale_y + this.bottom_line);
          index++;
        }
      }
      pop();
    }
  }
}

function getLayout(num) {
  if (num == 0) return {x:0, y:0};
  if (num == 1) return {x:1, y:1};
  if (num == 2) return {x:2, y:1};
  if (num == 3 || num == 4) return {x:2, y:2};
  if (num == 5 || num == 6) return {x:3, y:2};
  if (num == 7 || num == 8) return {x:4, y:2};
  if (num == 9) return {x:3, y:3};
}

class Menu {
  //(x,y) == top right corner
  constructor(x, y, width, height, img) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.expanded = false;
    this.menu_items = [];
    var addPlayerItem = {'name':'Add Player','action': () => {addPlayer()}};
    this.menu_items.push(addPlayerItem);
  }

  inBounds(xp, yp) {
    return xp <= width+this.x && xp >= width+this.x-this.width &&
            yp >= this.y && yp <= this.y+this.height;
  }

  click(x, y) {
    if (this.expanded) {
      var index = Math.floor(y/this.height);
      this.menu_items[index].action();
    } else {
      this.expand();
    }
  }
  expand() {
    if (this.expanded == false) {
      this.width = this.width*5;
      this.expanded = true;
    }
  }
  collapse() {
    if (this.expanded) {
      this.width = this.width/5;
      this.expanded = false;
    }
  }
  render() {
    if (this.expanded) {
      fill(0, 0, 50);
      rect(width + this.x - this.width, this.y,
            this.width, this.height*this.menu_items.length);
      for (var i = 0; i < this.menu_items.length; i++) {
        fill(0, 0, 70)
        rect(width + this.x - this.width+5, this.y + i*this.height+5,
            this.width-10, this.height-10, 25);
        fill(0)
        textAlign(CENTER, CENTER);
        textSize(this.height/2)
        text(this.menu_items[i].name, width + this.x - this.width, this.y + i*this.height,
            this.width, this.height);
      }
    }
    else {
      image(this.img, width + this.x - this.width, this.y);
    }
  }
}
