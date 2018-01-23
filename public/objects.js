
function Player (x, y, h, w, color, name){

  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.color = color;
  this.name = name;
  this.life = 40;
  this.damage = [];
  this.top_margin = 5;
  this.margin = 2;
  this.radius = 25;
  this.full = false;

  this.inBounds = function(xp, yp) {
    return xp >= this.x && xp <= this.x+this.width &&
            yp >= this.y && yp <= this.y+this.height;
  }

  this.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  this.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  }

  this.fullscreen = function(width, height, oldx, oldy) {
    if (players.length > 2)
      if (this.full == false) {
        this.storew = this.width;
        this.storeh = this.height;
        this.storex = oldx;
        this.storey = oldy;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.full = true;
        this.render();
        return this;
      }
      else {
        this.width = this.storew;
        this.height = this.storeh;
        this.x = this.storex;
        this.y = this.storey;
        this.full = false;
        this.render();
        return null;
      }
  }

  this.click = function(x, y) {
    if (this.full) {
      //name clicked
      if (y < this.top_line) {
        //name clicked
      } // life clicked
      else if (x < this.center) {
        if (x < this.center/2)
          this.life--;
        else
          this.life++;
        this.render();
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
        this.render();
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
      this.render();
    }
  }

  this.render = function() {
    this.buffer = createGraphics(this.width, this.height);
    this.buffer.pixelDensity(1)
    this.font_size = this.height/16;
    this.top_line = this.top_margin + this.font_size*3;
    if (players.length==1) this.font_size *=1.75;
    this.center = this.width/2;
    this.buffer.fill(this.color);
    this.buffer.rect(this.margin, this.margin, this.width - 2*this.margin,
        this.height - 2*this.margin, this.radius);
    this.buffer.textSize(this.font_size*2)
    this.buffer.fill(0)
    this.buffer.textAlign(CENTER, TOP);
    this.buffer.text(this.name, this.center, this.top_margin);
    this.buffer.textSize(this.font_size*5)
    if (this.full) {
      this.buffer.textAlign(CENTER, CENTER)
      this.buffer.text(this.life, this.center/2, this.height/2);
      this.buffer.line(this.center, this.top_line, this.center, this.height-this.top_line);
      this.buffer.textSize(this.font_size*2);
      this.scale = (this.height-this.top_line)/(this.damage.length+1);
      this.buffer.push();
      this.buffer.strokeWeight(3);
      this.buffer.stroke(0)
      for (let i = 0; i < this.damage.length; i++) {
        this.buffer.fill(this.damage[i].color);
        this.buffer.text(this.damage[i].amt, this.center*1.5, this.top_line+(i+1)*this.scale);
      }
      this.buffer.pop();
    } else {
      this.bottom_line = this.top_margin + this.font_size*6;
      this.buffer.text(this.life, this.center, this.top_line);
      var grid = getLayout(this.damage.length);
      var scale_x = this.width/(grid.x+1);
      var scale_y = (this.height - this.bottom_line)/(grid.y+1);
      var index = 0;
      this.buffer.textSize(this.font_size*2)
      this.buffer.push();
      this.buffer.strokeWeight(1);
      this.buffer.stroke(0)
      for (var i = 0; i < grid.x; i++) {
        for (var j = 0; j < grid.y; j++) {
          if (index >= this.damage.length) continue;
          this.buffer.fill(this.damage[index].color)
          this.buffer.text(this.damage[index].amt, (i+1)*scale_x, (j+1)*scale_y + this.bottom_line);
          index++;
        }
      }
      this.buffer.pop();
    }
  }

  this.draw = function () {
    image(this.buffer, this.x, this.y);
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

function Menu (x, y, w, h, img) {
  //(x,y) == top right corner
  this.img = img;
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.expanded = false;
  this.menu_items = [];
  var addPlayerItem = {'name':'Add Player','action': addPlayer};
  var removePlayerItem = {'name':'Remove Player','action': removePlayer};
  var resetLifeItem = {'name':'Reset Life','action': resetLife};
  this.menu_items.push(addPlayerItem);
  this.menu_items.push(removePlayerItem);
  this.menu_items.push(resetLifeItem);

  this.inBounds = function(xp, yp) {
    if (this.expanded) {
      return xp <= width+this.x && xp >= width+this.x-this.width &&
              yp >= this.y && yp <= this.y+this.height*this.menu_items.length;
    } else {
      return xp <= width+this.x && xp >= width+this.x-this.width &&
              yp >= this.y && yp <= this.y+this.height;
    }
  }

  this.click = function(x, y) {
    if (this.expanded) {
      var index = Math.floor(y/this.height);
      this.menu_items[index].action();
    } else {
      this.expand();
    }
  }
  this.expand = function() {
    if (this.expanded == false) {
      this.width = this.width*5;
      this.expanded = true;
    }
  }
  this.collapse = function() {
    if (this.expanded) {
      this.width = this.width/5;
      this.expanded = false;
    }
  }
  this.draw = function() {
    if (this.expanded) {
      fill(0, 0, 50);
      rect(width + this.x - this.width, this.y,
            this.width, this.height*this.menu_items.length, 10);
      for (var i = 0; i < this.menu_items.length; i++) {
        fill(0, 0, 70)
        rect(width + this.x - this.width+3, this.y + i*this.height+3,
            this.width-6, this.height-6, 10);
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
