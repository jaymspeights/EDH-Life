var players = [];
var width;
var height;
var menu;
var drag = {'player':null, 'x_offset':null, 'y_offset':null, 'x':null, 'y':null}
var full = null;

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  createCanvas(windowWidth, windowHeight)
  menu = new Menu(width-5, 5, height/10, height/10);
  addPlayer();
  noLoop();
}

function draw() {
  background(0)
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
}

function mouseClicked() {
  if (menu.inBounds(mouseX, mouseY)) {
    menu.click(mouseX-menu.x+menu.width, mouseY - menu.y);
    redraw();
    return;
  } else if (menu.expanded){
    menu.collapse();
    redraw();
    return;
  }
  if (full != null) {
    full.click(mouseX, mouseY)
    return;
  }
  for (var i = 0; i < players.length; i++) {
    if (players[i].inBounds(mouseX, mouseY)) {
      players[i].click(mouseX-players[i].x, mouseY-players[i].y);
    }
  }
}

function mouseDragged() {
  if (drag.player == null) {
    if (full != null) {
      drag.player = full;
      drag.x_offset = mouseX - full.x;
      drag.y_offset = mouseY - full.y;
      drag.x = full.x;
      drag.y = full.y;
      drag.player.x = mouseX - drag.x_offset;
      drag.player.y = mouseY - drag.y_offset;
      redraw();
      return;
    }
    for(var i = 0; i < players.length; i++) {
      if (players[i].inBounds(mouseX, mouseY)) {
        drag.player = players[i];
        drag.x_offset = mouseX - players[i].x;
        drag.y_offset = mouseY - players[i].y;
        drag.x = players[i].x;
        drag.y = players[i].y;
        break;
      }
    }
  }
  drag.player.x = mouseX - drag.x_offset;
  drag.player.y = mouseY - drag.y_offset;
  redraw();
}

function mouseReleased() {
  if (drag.player != null) {
    var dx = Math.abs(drag.player.x - drag.x);
    var dy = Math.abs(drag.player.y - drag.y);
    if (dx > width/3 || dy > width/3 || dx+dy > width/3) {
      full = drag.player.fullscreen(width, height);
      if (full == null) {
        orientPlayers();
      }
    } else {
      drag.player.x = drag.x;
      drag.player.y = drag.y;
    }
    drag.player = null;
    redraw();
  }
}

function addPlayer() {
  if (players.length == 9) return;
  var newPlayer = new Player(0, 0, 0, 0, getRandomColor(), 'Player ' + (players.length+1));
  for (let p of players) {
    p.damage.push({'amt':0, 'color':newPlayer.color});
    newPlayer.damage.push({'amt':0, 'color':p.color});
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
        players[index].x = x*scale_x;
        players[index].y = y*scale_y;
        players[index].width = scale_x;
        players[index].height = scale_y;
        players[index].setFontSize(scale_y/16);
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

function getRandomColor() {
  return `rgb(${Math.floor(Math.random()*256)},
    ${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
}
