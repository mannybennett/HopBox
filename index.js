// Function that targets the start button parent container by its id and changes the display to none, while making the player box visible with display block
const hideButton = () => {
  document.getElementById("start-button").style.display = "none";
  document.getElementById("score").style.display = "block";
  document.getElementById("player-box").style.display = "block";
  window.requestAnimationFrame(gameLoop);
  lastRemoved = Date.now() + Math.random() * (maxSpawnGap - minSpawnGap) + minSpawnGap; 
};

// Invokes hideButton function on start button click
document.getElementById("start-button").addEventListener("click", hideButton);

const resetButton = () => {
  score = 0;
  document.getElementById("score").innerHTML = "SCORE: 0"
  document.getElementById("gameover").style.display = "none";
  document.getElementById("reset-button").style.display = "none";
  document.getElementById("player-box").style.display = "block";
  isGameOver = false;
  window.requestAnimationFrame(gameLoop);
  lastRemoved = Date.now() + Math.random() * (maxSpawnGap - minSpawnGap) + minSpawnGap;
};

document.getElementById("reset-button").addEventListener("click", resetButton);

const playerBox = document.getElementById("player-box");
let jumpHeight = 180;
let groundPosition = 6.5;
let position = groundPosition;
let isJumping = false;

// frame rate independent motion //
let dt; //frame time difference
let lastTime = performance.now();

const jumpPlayer = () => {
  if (!isJumping) {
    isJumping = true;
    jumpUp();
  };
};

const jumpUp = () => {
  if (position < jumpHeight) {
    position += 800 * dt; //units per second
    playerBox.style.bottom = position + "px";
    window.requestAnimationFrame(jumpUp);
  } else {
    fallDown();
  };
};

const fallDown = () => {
  if (position > groundPosition) {
    position -= 500 * dt; //units per second
    playerBox.style.bottom = position + "px";
    window.requestAnimationFrame(fallDown);
  } else {
    isJumping = false;
  };
};

document.addEventListener("keydown", function(event) {
  if ((event.key === " " || event.code === "Space") && !isGameOver) {
    jumpPlayer();
  };
});

// Create class for the obstacles (moving divs)
class Obstacle {
  constructor() {
    this.right = 0;
    this.top = 0;
    this.element = document.createElement('div');
    this.element.style.width = '20px';
    this.element.style.height = '30px';
    this.element.style.position = 'absolute';
    this.element.style.right = this.right + 'px';
    this.element.style.bottom = '0px';
    this.element.style.viewBox = '0 0 ' + this.right + ' 500';
    this.element.style.backgroundColor = 'red';
    document.querySelector('main').appendChild(this.element);
  };

  update () {
    this.right += 350 * dt; // Obstacle units per second
    this.element.style.right = this.right + 'px';
  };

  isOffScreen() {
    return this.right >= document.querySelector('main').offsetWidth - 35 ;
  };

  detectCollision(playerBox) {
    let playerBoxRect = playerBox.getBoundingClientRect();
    let obstacleRect = this.element.getBoundingClientRect();
    if (playerBoxRect.x < obstacleRect.x + obstacleRect.width &&
       playerBoxRect.x + playerBoxRect.width > obstacleRect.x &&
       playerBoxRect.y < obstacleRect.y + obstacleRect.height &&
       playerBoxRect.y + playerBoxRect.height > obstacleRect.y) {
      return true;
    } else {
      return false;
    };
  };
};

let isGameOver = false;
let obstacles = [];
let score = 0;
let minSpawnGap = 500; // ms
let maxSpawnGap = 1500; // ms
let lastRemoved = Date.now() + Math.random() * (maxSpawnGap - minSpawnGap) + minSpawnGap;

const gameLoop = () => {
  if (isGameOver) {
    return;
  };

  let now = performance.now();
  dt = (now - lastTime) / 1000.0; // calculate delta time and convert it to seconds
  lastTime = now;
  
  window.requestAnimationFrame(gameLoop);

  if (isJumping) {
    jumpPlayer();
  };

  if ((Date.now() >= lastRemoved) && obstacles.length < 3) {
    obstacles.push(new Obstacle());
    // Random delay before spawning the next obstacle
    lastRemoved = Date.now() + Math.random() * (maxSpawnGap - minSpawnGap) + minSpawnGap;
  };

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();
    if (obstacles[i].detectCollision(playerBox)) {
      isGameOver = true;
      obstacles.forEach(obstacle => obstacle.element.remove());
      obstacles = [];
      document.getElementById("gameover").style.display = "block";
      document.getElementById("reset-button").style.display = "block";
      document.getElementById("player-box").style.display = "none";
    };
    if(obstacles[i].isOffScreen()) {
      obstacles[i].element.remove();
      obstacles.splice(i, 1);
      if (!isGameOver) {
        document.getElementById("score").innerHTML = `SCORE: ${score += 1}`;
      };
    };
  };
};