// ======================
// Lightbulb Toggle Logic
// ======================
let toggle = document.getElementById("toggle");
let bulbOn = false;

if (localStorage.getItem("bulbOn") !== null) {
  bulbOn = localStorage.getItem("bulbOn") === "true";
}

function changeBulbColor(color) {
  document.documentElement.style.setProperty('--light-color', color);
}

function applyBulbState() {
  if (!toggle) return;

  if (bulbOn) {
    toggle.classList.remove('off');
    document.body.classList.remove('dim');
    changeBulbColor('#fff');
  } else {
    toggle.classList.add('off');
    document.body.classList.add('dim');
    changeBulbColor('#444');
  }
}

applyBulbState();

if (toggle) {
  toggle.onclick = function () {
    bulbOn = !bulbOn;
    localStorage.setItem("bulbOn", bulbOn);
    applyBulbState();
  };
}

// ======================
// Style Switcher Logic
// ======================
const switchBtn = document.getElementById("style-switch");
const stylesheet = document.querySelector("link[rel='stylesheet']");

if (stylesheet && localStorage.getItem("altStyle") === "true") {
  stylesheet.href = "styles-alt.css";
}

if (switchBtn && stylesheet) {
  switchBtn.addEventListener("click", () => {
    const isAlt = stylesheet.href.includes("styles-alt.css");
    if (isAlt) {
      stylesheet.href = "styles.css";
      localStorage.setItem("altStyle", false);
    } else {
      stylesheet.href = "styles-alt.css";
      localStorage.setItem("altStyle", true);
    }
  });
}

// ======================
// Asteroids Game Logic
// ======================
const canvas = document.getElementById('gameCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let ship, bullets, asteroids, score;
  const keys = { left: false, right: false, up: false, space: false };

  function initGame() {
    ship = { x: WIDTH/2, y: HEIGHT/2, angle: 0, radius: 10, speed: 0 };
    bullets = [];
    asteroids = [];
    score = 0;
    spawnAsteroids(5);
  }

  function spawnAsteroids(count) {
    for (let i = 0; i < count; i++) {
      createAsteroid(Math.random() * WIDTH, Math.random() * HEIGHT, 30);
    }
  }

  function createAsteroid(x, y, radius) {
    asteroids.push({
      x, y, radius,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2
    });
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'ArrowUp') keys.up = true;
    if (e.code === 'Space') keys.space = true;
  });

  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'ArrowUp') keys.up = false;
    if (e.code === 'Space') keys.space = false;
  });

  function update() {
    if (keys.left) ship.angle -= 0.05;
    if (keys.right) ship.angle += 0.05;
    if (keys.up) ship.speed += 0.1;
    else ship.speed *= 0.98;

    ship.x += Math.cos(ship.angle) * ship.speed;
    ship.y += Math.sin(ship.angle) * ship.speed;

    if (ship.x > WIDTH) ship.x = 0;
    if (ship.x < 0) ship.x = WIDTH;
    if (ship.y > HEIGHT) ship.y = 0;
    if (ship.y < 0) ship.y = HEIGHT;

    if (keys.space && bullets.length < 5) {
      bullets.push({
        x: ship.x + Math.cos(ship.angle) * ship.radius,
        y: ship.y + Math.sin(ship.angle) * ship.radius,
        dx: Math.cos(ship.angle) * 6,
        dy: Math.sin(ship.angle) * 6,
        life: 0
      });
    }

    bullets.forEach((b, i) => {
      b.x += b.dx;
      b.y += b.dy;
      b.life++;
      if (b.x > WIDTH) b.x = 0;
      if (b.x < 0) b.x = WIDTH;
      if (b.y > HEIGHT) b.y = 0;
      if (b.y < 0) b.y = HEIGHT;
      if (b.life > 50) bullets.splice(i, 1);
    });

    asteroids.forEach((a, i) => {
      a.x += a.dx;
      a.y += a.dy;
      if (a.x > WIDTH) a.x = 0;
      if (a.x < 0) a.x = WIDTH;
      if (a.y > HEIGHT) a.y = 0;
      if (a.y < 0) a.y = HEIGHT;

      bullets.forEach((b, j) => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < a.radius) {
          bullets.splice(j, 1);
          if (a.radius > 15) {
            createAsteroid(a.x, a.y, a.radius/2);
            createAsteroid(a.x, a.y, a.radius/2);
          }
          asteroids.splice(i, 1);
          score += 10;
        }
      });

      const distShip = Math.hypot(a.x - ship.x, a.y - ship.y);
      if (distShip < a.radius + ship.radius) {
        initGame(); // Reset game on collision
      }
    });

    if (asteroids.length === 0) {
      spawnAsteroids(5);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.beginPath();
    ctx.moveTo(ship.radius, 0);
    ctx.lineTo(-ship.radius, ship.radius/2);
    ctx.lineTo(-ship.radius, -ship.radius/2);
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'white';
    bullets.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'white';
    asteroids.forEach(a => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay) scoreDisplay.innerText = "Score: " + score;
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  initGame();
  gameLoop();
}
