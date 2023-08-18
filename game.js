let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;
let gameStarted = false;

// global Variables
let startGame;

let startGameAgain;
let endGame;
let body;
let startInterval1;
let startInterval2;
let startInterval3;
let isGamePlaying;
let isPlayerDead = false;
let totalBombs = 0;
let multiplier = 15;
let level = 1;

function keyup(event) {
  if (!gameStarted) return;
  const player = document.getElementById('player');
  if (event.keyCode === 37) {
    leftPressed = false;
    lastPressed = 'left';
  }
  if (event.keyCode === 39) {
    rightPressed = false;
    lastPressed = 'right';
  }
  if (event.keyCode === 38) {
    upPressed = false;
    lastPressed = 'up';
  }
  if (event.keyCode === 40) {
    downPressed = false;
    lastPressed = 'down';
  }

  player.className = `character stand ${lastPressed}`;
}


function move() {
  if (!gameStarted) return;
  var player = document.getElementById('player');
  var positionLeft = player.offsetLeft;
  var positionTop = player.offsetTop;

  if (downPressed == true) {
      var newTop = positionTop + 1;
      if (!CactusCollision(positionLeft, newTop)) {
          player.style.top = newTop + 'px';
          player.className = 'character walk down';
      }
  }
  if (upPressed == true) {
      var newTop = positionTop - 1;
      if (!CactusCollision(positionLeft, newTop)) {
          player.style.top = newTop + 'px';
          player.className = 'character walk up';
      }
  }
  if (leftPressed == true) {
      var newLeft = positionLeft - 1;
      if (!CactusCollision(newLeft, positionTop)) {
          player.style.left = newLeft + 'px';
          player.className = 'character walk left';
      }
  }
  if (rightPressed == true) {
      var newLeft = positionLeft + 1;
      if (!CactusCollision(newLeft, positionTop)) {
          player.style.left = newLeft + 'px';
          player.className = 'character walk right';
      }
  }
}



function CactusCollision(x, y) {
  var cacti = document.querySelectorAll('.cactus');
  for (var i = 0; i < cacti.length; i++) {
      var cactusLeft = cacti[i].offsetLeft;
      var cactusRight = cactusLeft + cacti[i].offsetWidth;
      var cactusTop = cacti[i].offsetTop;
      var cactusBottom = cactusTop + cacti[i].offsetHeight;

      if (x < cactusRight && x + 32 > cactusLeft && y < cactusBottom && y + 48 > cactusTop) {
          if (cacti[i].classList.contains('cactus')) {
              return true; // pass over the cactus
          }
          else {
              return false; // collided with another element
          }
      }
  }
  return false; // no collision detected
}



function keydown(event) {
  if (event.keyCode === 37) {
    leftPressed = true;
  }
  if (event.keyCode === 39) {
    rightPressed = true;
  }
  if (event.keyCode === 38) {
    upPressed = true;
  }
  if (event.keyCode === 40) {
    downPressed = true;
  }
}

/**
 * This function reset the global variable
 * Also clear the interval
 */
function resetValues() {
  // update the global variables
  totalBombs = 0;
  isPlayerDead = false;
  isGamePlaying = true;
  multiplier = 15;
  level = 1;

  removeBombs();

  clearInterval(startInterval1);
  clearInterval(startInterval2);
  clearInterval(startInterval3);
}

/**
 * A custom class to hide 'Game Over, Play Again? and End Game' from HTML
 */
function hideText() {
  // hides all HTML with the 'hide-text' class
  const hide = document.getElementsByClassName('hide-text');
  for (let i = 0; i < hide.length; i++) {
    hide[i].style.display = 'none';
  }
}

/**
 * This function returns the total-bomb count
 */
function getBombEscaped() {
  return totalBombs;
}

/**
 * This function changes the difficulty level while playing.
 * It keeps track of the global variable 'level'.
 */
function changeDifficultyLevel() {
  if (getBombEscaped() >= multiplier) {
    if (isGamePlaying) {
      // This increment the game level each time the user escape 15 bombs
      multiplier += 15;
      level++;
    }
  }

  if (level > 10) {
    level = 10;
  }

  return level;
}

/**
 * This function removes the arrows
 */
function removeArrows() {
  // gets all the arrows and remove.
  const arrows = document.getElementsByClassName('arrow');
  for (let i = 0; i < arrows.length; i++) {
    // only remove arrows that are out of screen.
    if (arrows[i].offsetTop < 0) arrows[i].remove();
  }
}

/**
 * This function clears enemies created.
 */
function clearEnemy() {
  // gets all tanks and remove them
  const enemies = document.getElementsByClassName('tank');
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].remove();
  }

  // remove out of screen arrows
  removeArrows();
}

/**
 * Randomly generate a number between 2 numbers
 * @param min
 * @param max
 * @returns {*}
 */
  function randomInteger(min, max) {
  return (Math.ceil(Math.random() * (max - min)) + min);
}

/**
 * This function creates the enemy position and bomb
 */
function createEnemyAndBomb() {
  // creates a div, add class of bomb
  const bomb = document.createElement('div');
  bomb.classList.add('bomb');

  // gets a random position between 1 and the width of the screen,
  // I removed 80 px do that the position does not go out of screen
  const position = Math.ceil((randomInteger(1, window.innerWidth - 80)));

  // adding the position to the bomb,
  // then 28px to make it appear like its from the tank
  bomb.style.left = `${position + 28}px`;

  // creates a div, add class of tank
  const tank = document.createElement('div');
  tank.classList.add('tank');

  // making the tank goes top and the position left
  tank.style.top = '0vh';
  tank.style.left = `${position}px`;

  // adding a custom slideIn animation
  tank.style.animation = 'slideIn 0.2s 1';

  // append the bomb and tank body
  body.appendChild(bomb);
  body.appendChild(tank);

  totalBombs++;

  return bomb;
}

/**
 * This function updates the html with the Bomb Escaped and Level.
 */
function updateUserBoard() {
  document.getElementsByTagName('span')[0].innerHTML = getBombEscaped().toString();
  document.getElementsByTagName('span')[1].innerHTML = level;
}

/**
 * This function generate rangeNumbers of numbers.
 * @param lowEnd
 * @param highEnd
 * @returns {*[]}
 */
function rangeNumbers(lowEnd, highEnd) {
  const rangeArray = [];
  for (let i = lowEnd; i <= highEnd; i++) {
    rangeArray.push(i);
  }
  return rangeArray;
}

/**
 * This function removes the bombs from the
 */
function removeBombs() {
  // setTimeout to 1 sec
  setTimeout(() => {
    // only remove the bomb when player is dead
    if (isPlayerDead) {
      const bombs = document.getElementsByClassName('bomb');
      for (let i = 0; i < bombs.length; i++) {
        bombs[i].remove();
      }
      // clears the enemy
      clearEnemy();
    }
  }, 1000);
}

/**
 * this function updates the local storage
 */
function updateLocalStorage() {
  localStorage.setItem('high-score', getBombEscaped());
  localStorage.setItem('highest-level', level);
}

/**
 * This function removes the live when the user character gets hit by arrow.
 */
function removeLives() {
  // update the level and bomb
  updateLocalStorage();
  // gets the current live of the user
  const lives = document.getElementsByClassName('health')[0].getElementsByTagName('li');
  if (lives.length > 1) {
    // if user has live, change character CSS and remove life.
    totalBombs--;
    document.getElementById('player').className = 'character hit left';
    lives[0].remove();
  } else {
    // if a user doesn't have live, change character to dead
    document.getElementById('player').className = 'character dead';

    resetValues();
    removeBombs();

    isGamePlaying = false;
    isPlayerDead = true;

    document.getElementsByClassName('game-over')[0].style.display = '';
    document.getElementsByClassName('play-again')[0].style.display = '';
    document.getElementsByClassName('end-game')[0].style.display = '';
    lives[0].remove();
  }
}

/**
 * This function adds back the live
 */
function addLives(live = 3) {
  const lives = document.getElementsByClassName('health')[0];
  for (let i = 0; i < live; i++) {
    const newLive = document.createElement('li');
    lives.appendChild(newLive);
  }
}

/**
 * This function returns, gets and stores the user details
 */
function getUserDetails() {
  // Gets the username from the local storage
  let placeholder = localStorage.getItem('username');
  if (placeholder === 'null') {
    placeholder = 'User 1';
  }

  // Prompt the user to enter nickname
  const user = prompt('Enter your nickname', placeholder);

  // Safes the username, high-score and level to local storage
  localStorage.setItem('username', user);

  return {
    name: localStorage.getItem('username'),
    score: localStorage.getItem('high-score'),
    level: localStorage.getItem('highest-level'),
  };
}

/**
 * This function displays the high score board.
 */
function displayScoreBoard() {
  // Hide all buttons
  hideText();

  // get user details
  const userDetails = getUserDetails();

  // display the username, high score, and level
  document.getElementsByClassName('details')[0].innerHTML = `Username: ${userDetails.name}`;
  document.getElementsByClassName('details')[1].innerHTML = `Highest Score: ${userDetails.score}`;
  document.getElementsByClassName('details')[2].innerHTML = `Level: ${userDetails.level}`;

  // display the 'High Score Board' and display the 'Play Again'
  document.getElementsByClassName('high-score')[0].style.display = '';
  document.getElementsByClassName('play-again')[0].style.display = '';

  // adjust the Play Again to take the High Score Board
  document.getElementsByClassName('play-again')[0].style.top = `${30}%`;
}

/**
 * This function shoots the arrow from the characters position
 */
function shootArrows() {
  // Get character and add class to make character shoot arrow
  const player = document.getElementById('player');
  player.className = 'character stand up fire';

  // Create the arrow element
  const arrow = document.createElement('div');
  arrow.className = 'arrow up';

  // Get the player's current position
  // or use the default from the css property of player top: 88vh; left: 200px;
  arrow.style.top = (player.style.top !== '') ? player.style.top : `${88}vh`;
  arrow.style.left = (player.style.left !== '') ? player.style.left : `${228}px`;

  // Adds arrow to body
  body.append(arrow);

  // set interval to move the arrow up.
  startInterval3 = setInterval(() => {
    const newTop = arrow.offsetTop - 2;
    arrow.style.top = `${newTop}px`;
  }, 10);
}

/**
 * This function fires the bomb.
 * It also moves the bomb
 */
function enemyFireBombs() {
  if (isGamePlaying === true) {
    // creates bomb
    const bomb = createEnemyAndBomb();

    // removes all out of screen arrows
    removeArrows();

    /**
         * I made use of the conversion from vh to px
         * The 'sky' class has a height property of 70vh;
         */
    const randomExplosion = Math.ceil((
      randomInteger((70 * window.innerHeight) / 100, (100 * window.innerHeight) / 100)
    ));

    // generate random number between 1 - 3 to determine the direction of bomb
    const direction = randomInteger(1, 3);
    // controls the bomb when they to bounce back when they hit the wall
    let left = false;
    let right = true;

    if (direction === 3) {
      left = true;
      right = false;
    }

    // set interval for random bomb spend
    startInterval2 = setInterval(() => {
      // update the user screen with the level and bomb count
      updateUserBoard();

      // get the current position of bomb
      const positionTop = bomb.offsetTop;
      let positionLeft = bomb.offsetLeft;

      // getting all the arrows on the screen
      const arrows = document.getElementsByClassName('arrow');

      // loop to get the collision with the bomb
      for (let i = 0; i < arrows.length; i++) {
        // get the rangeNumbers of the position of the bomb +/- 15 for wider coverage
        const array = rangeNumbers(arrows[i].offsetLeft - 15, arrows[i].offsetLeft + 15);

        // checking if the left position of the bomb is reach and the height ti get the contact
        if (array.includes(positionLeft) && arrows[i].offsetTop <= positionTop) {
          // remove the bomb and the arrow in contact.
          arrows[i].remove();
          bomb.remove();
        }
      }

      // moving the bomb through the screen
      const newTop = positionTop + 1;
      const element = document.elementFromPoint(bomb.offsetLeft, newTop);

      // checking in the element contain the bomb to change the direction
      if (bomb.classList.contains('bomb')) {
        // if 1 - straight
        // if 2 - diagonal right
        // if 3 - diagonal left
        if (direction === 1) {
          bomb.style.top = `${positionTop + 1}px`;
        } else {
          bomb.style.top = `${positionTop + 1}px`;

          if (right) {
            positionLeft++;
            bomb.style.left = `${positionLeft}px`;
            // changing the bomb direction move right and direction to 45 deg
            bomb.style.transform = 'rotate(45deg)';
          }

          if (left) {
            positionLeft--;
            bomb.style.left = `${positionLeft}px`;
            // changing the bomb direction move right and direction to 135 deg
            bomb.style.transform = 'rotate(135deg)';
          }

          if (window.innerWidth - 28 === positionLeft) {
            left = true;
            right = false;
          }

          if (positionLeft <= 0) {
            left = false;
            right = true;
          }
        }
      }

      // checking if the element is not null:
      // There were error when element is null or empty
      if (element !== null) {
        // checking for bomb contact with the character
        if (element.classList.contains('user')) {
          // stop the bomb movement and add explosion
          bomb.style.top = `${positionTop + 0}px`;
          bomb.className = 'explosion';
          bomb.style.transform = '';

          // removes live and explosions/bombs on the screen
          removeLives();

          setTimeout(() => {
            bomb.remove();
          }, 1000);
        }

        // checking if the bomb is in the green part position and explode randomly
        if (positionTop >= randomExplosion) {
          // stop the bomb movement, add explosion and
          // set the direction back to default for proper explosion
          bomb.style.top = `${positionTop + 0}px`;
          bomb.className = 'explosion';
          bomb.style.transform = '';

          setTimeout(() => {
            bomb.remove();
          }, 1000);
        }
      }
    }, randomInteger(1, 10));
  }
}

// Enemy starts attacking
function startAttacking() {
  // attack user based on difficulty level
  for (let i = 0; i < changeDifficultyLevel(); i++) {
    setTimeout(enemyFireBombs, 1000);
    clearEnemy();
  }
}

/**
 * This function starts the game
 */
function start() {
  gameStarted = true;
  // reset all variables
  resetValues();

  // hide text from the HTML
  hideText();

  // remove the first tank on the screen
  const tank = document.getElementById('tank');
  if (tank) tank.remove();

  // check if the game is currently playing
  if (isGamePlaying) {
    // hide the start button
    startGame.style.display = 'none';

    // display the screen score
    document.getElementsByClassName('username')[0].style.display = '';

    // immediately start the attack and set interval to 3 secs
    startAttacking();
    startInterval1 = setInterval(startAttacking, 3000);
  }
}

function myLoadFunction() {
  
  setInterval(move, 10);
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);

  // Event listener to start the game
  startGame = document.getElementsByClassName('start')[0];
  startGame.addEventListener('click', start);

  // Event listener to start the game again after game over
  startGameAgain = document.getElementsByClassName('play-again')[0];
  startGameAgain.addEventListener('click', start);

  // Event listener add lives back the game starts again
  startGameAgain.addEventListener('click', () => {
    
    addLives(3);
  });

  // Event listener to display score board when game ends.
  endGame = document.getElementsByClassName('end-game')[0];
  endGame.addEventListener('click', displayScoreBoard);
  body = document.getElementsByTagName('body')[0];

  // hide texts on the HTML
  hideText();

  /**
     * The event listener for when the user press space to shoot an arrow.
     */
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      // player only shoot after 0.5ms
      setTimeout(shootArrows, 500);
    }
  });
}

document.addEventListener('DOMContentLoaded', myLoadFunction);
