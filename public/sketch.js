var players = [];
var width;
var height;
var menu;

//player currenty being dragged
var drag = {'player':null, 'x_offset':null, 'y_offset':null, 'x':null, 'y':null}

//contains current fullscreen player
var full = null;

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
    players[i].render()
  }
  if (drag.player != null) {
    drag.player.render();
  }
  if (full != null) {
    full.render();
  }
  menu.render();
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
  if (rot) {
    mx = mouseY;
    my = height - mouseX;
  } else {
    mx = mouseX;
    my = mouseY;
  }
  if (drag.player == null) {
    if (full != null) {
      drag.player = full;
      drag.x_offset = mx - full.x;
      drag.y_offset = my - full.y;
      drag.x = full.x;
      drag.y = full.y;
      drag.player.x = mx - drag.x_offset;
      drag.player.y = my - drag.y_offset;
      redraw();
      return false;
    }
    for(var i = 0; i < players.length; i++) {
      if (players[i].inBounds(mx, my)) {
        drag.player = players[i];
        drag.x_offset = mx - players[i].x;
        drag.y_offset = my - players[i].y;
        drag.x = players[i].x;
        drag.y = players[i].y;
        break;
      }
    }
  }
  drag.player.x = mx - drag.x_offset;
  drag.player.y = my - drag.y_offset;
  redraw();
  return;
}

function touchEnded() {
  moving = false;
  if (drag.player != null) {
    var dx = Math.abs(drag.player.x - drag.x);
    var dy = Math.abs(drag.player.y - drag.y);
    if (dx > width/4 || dy > width/4 || dx+dy > width/4) {
      full = drag.player.fullscreen(width, height);
      if (full == null) {
        orientPlayers();
      }
    } else {
      drag.player.x = drag.x;
      drag.player.y = drag.y;
    }
    drag.player = null
    redraw();
  } else {
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
      return;
    } else if (menu.expanded){
      menu.collapse();
      redraw();
      return
    }
    if (full != null) {
      full.click(mx, my)
      redraw();
      return;
    }
    for (var i = 0; i < players.length; i++) {
      if (players[i].inBounds(mx, my)) {
        players[i].click(mx-players[i].x, my-players[i].y);
        redraw();
      }
    }
  }
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

function orientPlayers() {
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
var color_index = 0;
function getRandomColor() {
  let b = color_index < 5? '95%':'55%';
  let c = 'hsb('+(Math.floor(offset+color_index*360*0.618033988749895+360)%360)+',100%,'+b+')';
  color_index++;
  return c;
}
