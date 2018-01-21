
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
    this.setFontSize(5);
    this.top_margin = 5;
    this.margin = 2;
    this.radius = 25;
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
    this.fw = width;
    this.fh = height;
    this.fullscreen = true;
    this.center = this.fw/2
  }

  setFontSize(size) {
    this.font_size = size;
    this.top_line = this.top_margin + this.font_size*3;
    this.bottom_line = this.top_margin + this.font_size*6;
  }

  click(x, y) {
    if (x > this.center)
      this.life++;
    else
      this.life--;
    this.render();
    menu.render();
  }

  render() {
    fill(this.color);
    if (this.fullscreen) {
      this.center = this.fw/2;
      rect(this.x + this.margin, this.y + this.margin,
         this.width - 2*this.margin, this.height - 2*this.margin, this.radius);
      this.font_size*=2;
    } else {
      this.center = this.width/2;
      rect(this.x + this.margin, this.y + this.margin,
         this.width - 2*this.margin, this.height - 2*this.margin, this.radius);

    textSize(this.font_size*2)
    fill(0)
    textAlign(CENTER, TOP)
    text(this.name, this.x + this.center, this.y + this.top_margin);
    textSize(this.font_size*5)
    text(this.life, this.x + this.center, this.y + this.top_line);
    var grid = getLayout(this.damage.length);
    var scale_x = this.width/(grid.x+1);
    var scale_y = (this.height - this.bottom_line)/(grid.y+1);
    var index = 0;
    textSize(this.font_size*2)
    for (var i = 0; i < grid.x; i++) {
      for (var j = 0; j < grid.y; j++) {
        if (index >= this.damage.length) continue;
        fill(this.damage[index].color)
        text(this.damage[index].amt, this.x + (i+1)*scale_x, this.y + (j+1)*scale_y + this.bottom_line);
        index++;
      }
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
  constructor(x, y, width, height) {
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
    return xp <= this.x && xp >= this.x-this.width &&
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
  contract() {
    if (this.expanded) {
      this.width = this.width/5;
      this.expanded = false;
    }
  }
  render() {
    if (this.expanded) {
      fill(100);
      rect(this.x - this.width, this.y,
            this.width, this.height*this.menu_items.length);
      for (var i = 0; i < this.menu_items.length; i++) {
        fill(150)
        rect(this.x - this.width+5, this.y + i*this.height+5,
            this.width-10, this.height-10, 25);
        fill(0)
        textAlign(CENTER, CENTER);
        textSize(this.height/2)
        text(this.menu_items[i].name, this.x - this.width, this.y + i*this.height,
            this.width, this.height);
      }
    }
    else {
      fill(100);
      rect(this.x - this.width, this.y,
            this.width, this.height);
    }
  }
}
