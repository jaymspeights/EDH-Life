var players = [];
var width;
var height;
var menu;

//player currenty being dragged
var drag = {'player':null, 'x_offset':null, 'y_offset':null, 'x':null, 'y':null}

//contains current fullscreen player
var full;

//is screen rotated?
var rot = false;

//used for mouseX/Y transformations when rotated
var mx = 0;
var my = 0;

var settings_img;
var moving = false;

function preload() {
  settings_img = loadImage('images/settings.png');
}

function setup() {
  colorMode(HSB);
  width = window.innerWidth;
  height = window.innerHeight;
  createCanvas(width, height)
  if (height > width) {
    rot = true;
    height = window.innerWidth;
    width = window.innerHeight;
  }
  settings_img.resize(height/10, height/10);
  menu = new Menu(-5, 5, height/10, height/10, settings_img);
  addPlayer();
  noLoop();
}

function draw() {
  background(0)
  if (rot) {
    push();
    translate(height/2, width/2);
    rotate(radians(90));
    translate(-width/2, -height/2);
  }
  for (var i = 0; i < players.length; i++) {
    players[i].draw();
  }
  if (drag.player != null) {
    drag.player.draw();
  }
  if (full != null) {
    full.draw();
  }
  menu.draw();
  if (rot) {
    pop();
  }
}

window.addEventListener("orientationchange", function() {
    setTimeout(rotateCanvas, 200);
});

function rotateCanvas() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  if (window.innerHeight > window.innerWidth) {
    rot = true;
    height = window.innerWidth;
    width = window.innerHeight;
  } else {
    rot = false;
    width = window.innerWidth;
    height = window.innerHeight;
  }
  orientPlayers();
  if (full != null)
    full.fullscreen(width, height);
  redraw();
}

function touchMoved() {
  if (moving == false) {
    moving = true;
    return;
  }
  if (menu.expanded)
    menu.collapse();
  //if rotated, invert x/y
  if (rot) {
    mx = mouseY;
    my = height - mouseX;
  } else {
    mx = mouseX;
    my = mouseY;
  }
  if (drag.player == null) {
    let p;
    if (full != null) {
      p = full;
    } else {
      for(var i = 0; i < players.length; i++) {
        if (players[i].inBounds(mx, my)) {
          p = players[i]
          break
        }
      }
    }
    drag.player = p;
    drag.x_offset = mx - p.x;
    drag.y_offset = my - p.y;
    drag.x = p.x;
    drag.y = p.y;
  }
  drag.player.moveTo(mx - drag.x_offset, my - drag.y_offset);
  redraw();
  return;
}

function touchEnded() {
  moving = false;
  //drag released
  if (drag.player != null) {
    var dx = Math.abs(drag.player.x - drag.x);
    var dy = Math.abs(drag.player.y - drag.y);
    if ((dx > width/4 || dy > width/4 || dx+dy > width/4) && players.length>2) {
      full = drag.player.fullscreen(width, height, drag.x, drag.y);
    } else {
      drag.player.moveTo(drag.x, drag.y);
    }
    drag.player = null
    redraw();
  } //single touch
  else {
    if (drag.player != null) return false;
    if (rot) {
      mx = mouseY;
      my = height - mouseX;
    } else {
      mx = mouseX;
      my = mouseY;
    }
    if (menu.inBounds(mx, my)) {
      menu.click(mx+menu.x-menu.width, my - menu.y);
      redraw();
      return false;
    } else if (menu.expanded){
      menu.collapse();
      redraw();
      return false;
    }
    if (full != null) {
      full.click(mx, my)
      redraw();
      return false;
    }
    for (var i = 0; i < players.length; i++) {
      if (players[i].inBounds(mx, my)) {
        players[i].click(mx-players[i].x, my-players[i].y);
        redraw();
      }
    }
  }
  return false;
}

function addPlayer() {
  if (players.length == 9) {
    menu.collapse();
    return;
  }
  full = null;
  var newPlayer = new Player(0, 0, 0, 0, getRandomColor(), '');//'Player ' + (players.length+1));
  for (var i = 0; i < players.length; i++) {
    players[i].damage.push({'amt':0, 'color':newPlayer.color});
    newPlayer.damage.push({'amt':0, 'color':players[i].color});
  }
  players.push(newPlayer);
  orientPlayers();
  redraw();
}

function removePlayer() {
  if (players.length == 0) return;
  var removed_player;
  if (full != null) {
    removed_player = full;
    for (let i = 0; i < players.length; i++) {
      if (full == players[i])
        players.splice(i, 1);
    }
    full = null;
  } else {
    removed_player = players.pop();
  }
  pallete.push(removed_player.color);
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].damage.length; j++) {
      if (players[i].damage[j].color == removed_player.color) {
        players[i].damage.splice(j, 1);
        break;
      }
    }
  }
  orientPlayers();
  redraw();
}

function resetLife(life) {
  for (let i = 0; i < players.length; i++) {
    players[i].life = life;
    for (let j = 0; j < players[i].damage.length; j++) {
      players[i].damage[j].amt = 0;
    }
  }
  renderPlayers();
  redraw();
}

function orientPlayers() {
  if (players.length == 0) return;
  var divisor = getDivisors(players.length);
  var scale_x = width / divisor.x;
  var scale_y = height / divisor.y;
  var index = 0;
  for (var y = 0; y < divisor.y; y++) {
    for (var x = 0; x < divisor.x; x++) {
      if (index > players.length) return;
      if (players.length == index) {
        players[index-1].width += scale_x;
      }
      else {
        players[index].full = false;
        players[index].x = x*scale_x;
        players[index].y = y*scale_y;
        players[index].width = scale_x;
        players[index].height = scale_y;
      }
      index += 1;
    }
  }
  renderPlayers();
}

function renderPlayers() {
  for (let i = 0; i < players.length; i++) {
    players[i].render();
  }
}

function getDivisors(num) {
  if (num == 1) return {x:1, y:1};
  if (num == 2) return {x:2, y:1};
  if (num == 3 || num == 4) return {x:2, y:2};
  if (num == 5 || num == 6) return {x:3, y:2};
  if (num == 7 || num == 8) return {x:4, y:2};
  if (num == 9) return {x:3, y:3};
}

var offset = Math.floor(Math.random()*180)-90;
var pallete = [];
for (var i = 0; i < 9; i++) {
  let b = i < 5? '95%':'55%';
  pallete.push('hsb('+(Math.floor(offset + i*360*0.618033988749895+360)%360)+',100%,'+b+')')
}


function getRandomColor() {
  var r = Math.floor(Math.random()*pallete.length);
  var color = pallete[r];
  pallete.splice(r, 1);
  return color;
}
