var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

var ww = window.innerWidth;
var wh = window.innerHeight;

canvas.width = ww;
canvas.height = wh;

let degToPi = Math.PI * 2 / 360;

class Ship {
  constructor(args) {
    let def = {
      x: 0,
      y: 0,
      r: 50,
      deg: 50 * degToPi
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  draw() {
    ctx.save();

    ctx.shadowBlur = 20;
    ctx.shadowColor = "white";

    ctx.rotate(this.deg);

    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 13;
    ctx.stroke();

    for (var i = 0; i < 3; i++) {
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.r);
      ctx.stroke();
      ctx.rotate(Math.PI * 2 / 3);
    }

    ctx.beginPath();
    ctx.arc(0, 0, this.r + 75, 0, Math.PI * 2);
    ctx.setLineDash([12]);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(this.r + 20, -50 / 2, 50, 50);

    ctx.beginPath();
    ctx.moveTo(this.r + 70, -25);
    ctx.lineTo(this.r + 70, 25);
    ctx.lineTo(this.r + 120, 15);
    ctx.lineTo(this.r + 120, -15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, this.r + 100, -Math.PI / 4 + 600, Math.PI / 4 + 600);
    ctx.setLineDash([]);
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.restore();
  }
}

class Bullet {
  constructor(args) {
    let def = {
      x: 0,
      y: 0,
      v: {
        x: 0,
        y: 0
      }
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  update() {
    this.x += this.v.x;
    this.y += this.v.y;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 10, 10);
    ctx.restore();
  }
}

var ship;

function init() {
  ship = new Ship({
    r: 70
  });
}

var time = 0;
var bullets = [];

function update() {
  ship.deg = mousePos.x / 50;

  time++;
  if (time % 30 === 0) {
    let b = new Bullet({
      x: ww / 2 + Math.cos(ship.deg) * (ship.r + 100),
      y: wh / 2 + Math.sin(ship.deg) * (ship.r + 100),
      v: {
        x: Math.cos(ship.deg) * 10,
        y: Math.sin(ship.deg) * 10
      }
    });
    bullets.push(b);
  }
  bullets.forEach(b => b.update());

  // if (time%100===0) {
  //   TweenMax.to(ship, 1, {
  //     deg: mousePos.x/50,
  //     ease: Elastic.easeOut
  //   });
  // }

  // console.log(mousePos);
}

function draw() {
  ctx.fillStyle = "#001D2E";
  ctx.fillRect(0, 0, ww, wh);

  // 格線
  let span = 50;
  ctx.beginPath();
  for (var i = 0; i < ww; i += span) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, wh);
  }
  for (var i = 0; i < wh; i += span) {
    ctx.moveTo(0, i);
    ctx.lineTo(ww, i);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.stroke();

  // 船
  ctx.save();
  ctx.translate(ww / 2, wh / 2);
  ship.draw();
  ctx.restore();

  bullets.forEach(b => b.draw());

  requestAnimationFrame(draw);
}

init();
let fps = 60;
setInterval(update, 1000 / fps);
requestAnimationFrame(draw);

var mousePos = {
  x: 0,
  y: 0
};
canvas.addEventListener('mousemove', function (evt) {
  mousePos.x = evt.x;
  mousePos.y = evt.y;
});