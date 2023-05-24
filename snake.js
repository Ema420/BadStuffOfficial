/*
    MIT License

    Copyright (c) 2017 Le Garage

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/



// Class representing the game
class Game {
  // Build a new game with the given pixel width and height
  constructor(width, height) {
    // At the beginnig, no movement is set, the game is paused
    this.nextMove = undefined;
    this.alreadyMoved = false;
    this.width = width;
    this.height = height;
    this.tileWidth = 15;
    this.tileHeight = 15;
    // Initialize a 1 sized snake at the center of the game board
    this.snake = [
      [
        Math.round(width / (2 * this.tileWidth)),
        Math.round(height / (2 * this.tileHeight))
      ]
    ];
    this.food = undefined;
    this.gameover = false;
    this.scoreHtmlElmt = document.getElementById("score");
    this.addFood();
  }
  
  move(e) {
    var popup = document.getElementById("pausePopup");
      
      switch (e.detail.dir) {
        case "left":
          
          if (this.nextMove != "right" && !this.alreadyMoved) {
            this.nextMove = "left";
            this.alreadyMoved = true;
          }
          break;
        case "up":
          if (this.nextMove != "down" && !this.alreadyMoved) {
            this.nextMove = "up";
            this.alreadyMoved = true;
          }
          break;
        case "right":
          if (this.nextMove != "left" && !this.alreadyMoved) {
            this.nextMove = "right";
            this.alreadyMoved = true;
          }
          break;
        case "down":
          if (this.nextMove != "up" && !this.alreadyMoved) {
            this.nextMove = "down";
            this.alreadyMoved = true;
          }
          break;
        case " ":
          this.nextMove = undefined;
          this.alreadyMoved = false;
          
          break;
        default:
          
          // Do nothing just ignore it
          break;
      }
  }
  

  // Callback function called when a keyboard key
  // is pushed down
  keyDown(e) {
    console.log(e);
    //Get the pause popup div
    var popup = document.getElementById("pausePopup");
    console.log(e.key);
    switch (e.key) {
      case "ArrowLeft":
        if (this.nextMove != "right" && !this.alreadyMoved) {
          this.nextMove = "left";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowUp":
        if (this.nextMove != "down" && !this.alreadyMoved) {
          this.nextMove = "up";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowRight":
        if (this.nextMove != "left" && !this.alreadyMoved) {
          this.nextMove = "right";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowDown":
        if (this.nextMove != "up" && !this.alreadyMoved) {
          this.nextMove = "down";
          this.alreadyMoved = true;
        }
        break;
      default:
        // Do nothing just ignore it
        break;
    }
  }

  // Add a food somewhere in the game (randomly)
  addFood() {
    var x = Math.floor(Math.random() * Math.round(this.width / this.tileWidth) - 1);
    var y = Math.floor(Math.random() * Math.round(this.height / this.tileHeight) - 1);
    var board = document.querySelector("#game");
console.log(Math.round(this.width / this.tileWidth));
    for (var i = 0; i < this.snake.length; i++) {
      var xy = this.snake[i];

      if ((xy[0] == x && xy[1] == y)) {
        return this.addFood();
      }
      if(xy[0]>=Math.round(this.width / this.tileWidth) && xy[1]>=Math.round(this.height / this.tileHeight)){
        return this.addFood();
      }
    }

    this.food = [x, y];
  }

  // Update the game state with the next move
  update() {
    if (this.gameover) return;
    this.alreadyMoved = false;
    var newHead = this.snake[0].slice();
    switch (this.nextMove) {
      case undefined:
        return;
        break;
      case "left":
        newHead[0] -= 1;
        break;
      case "up":
        newHead[1] -= 1;
        break;
      case "right":
        newHead[0] += 1;
        break;
      case "down":
        newHead[1] += 1;
        break;
      default:
        throw "Unexpected move";
    }

    // Game Over If snake is going out ouf the game
    if (newHead[0] < 0) {
      this.gameover = true;
      this.temp = true;
      newHead[0] = 0;
    } else if (newHead[0] >= Math.round(this.width / this.tileWidth)) {
      this.gameover = true;
      this.temp = true;
      newHead[0] = Math.round(this.width / this.tileWidth) - 1;
    }
    if (newHead[1] < 0) {
      this.gameover = true;
      this.temp = true;
      newHead[1] = 0;
    } else if (newHead[1] >= Math.round(this.height / this.tileHeight)) {
      this.gameover = true;
      this.temp = true;
      newHead[1] = Math.round(this.height / this.tileHeight) - 1;
    }

    if (this.gameover) return;

    //Check if next move is on some food
    if (newHead[0] == this.food[0] && newHead[1] == this.food[1]) {
      // Move food to another place
      //This place must not be somewhere on the snake
      this.addFood();
    } else {
      this.snake.pop(); //Don't grow the snake
    }
    // Push the snake's new head position
    this.snake.unshift(newHead);

    // Game Over If snake bites itself
    for (var i = 1; i < this.snake.length; i++) {
      if (newHead[0] == this.snake[i][0] && newHead[1] == this.snake[i][1]) {
        this.gameover = true;
        this.temp = true;
        return;
      }
    }
  }

  // Draw / render the current game state
  render(ctx) {
    // Clear the screen
    ctx.clearRect(0, 0, this.width, this.height);

    // Update score HTML element
    this.scoreHtmlElmt.textContent = this.snake.length - 1;

    // Draw the borders
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.width, this.height);

    // Draw the snake
    
    let ghost = document.querySelector("#ghost");
    
    for (var i = 0; i < this.snake.length; i++) {
      var xy = this.snake[i];
      //this.snake[i] = "fantasma.png";
      ctx.drawImage(ghost, xy[0] * this.tileWidth, xy[1] * this.tileHeight, this.tileWidth*2, 2*this.tileHeight);
      
    }
    
    // Draw the food
    var food = new Image();
    food.src = "img/food.png";
    
    food.setAttribute("id","food");
    
    //let food = document.querySelector("#food");
    console.log(food);
    //ctx.drawImage(food, xy[0] * this.tileWidth, xy[1] * this.tileHeight, this.tileWidth*2, 2*this.tileHeight);
    ctx.drawImage(
      food,
      this.food[0] * this.tileWidth,
      this.food[1] * this.tileHeight,this.tileWidth*2, 2*this.tileHeight
    );
    console.log(ctx);
    //GameOver
    if (this.gameover) {
      location.href = 'gameover.html';
      
    }
  }

  //restart() {}
}

function play() {
  var audio = document.getElementById("theme");
  
  audio.play();
  
  start();
}

function start() {
  const menu = document.getElementById("menu");
  menu.setAttribute("class","hide");


  var punteggio = document.querySelector("#punteggio");
  punteggio.classList.add("hide");
  var score = document.querySelector("#hide");
  score.removeAttribute("id");

  var canvas = document.querySelector("#game");
  canvas.classList.remove("hide");
  canvas.setAttribute("width",window.screen.width);
  canvas.setAttribute("height",window.screen.height);
    
  console.log(localStorage);

  //const menu = document.createElement('div');
  //const root = document.getElementById("root");
  //console.log(root)
  //root.insertBefore(menu,div[0]);
  //console.log(menu);
  //menu.setAttribute("id","menu");
  //menu.setAttribute("width",window.screen.availWidth);
  //menu.setAttribute("height",window.screen.availHeight);
  //const title = document.createElement('div');
  //title.setAttribute("id","title");
  //menu.appendChild(title);
  
  //const img1 = document.createElement("img");
  //img1.setAttribute("src","Titolo.png")
  //title.appendChild(img1);

  //const ist = document.createElement('p');
  //ist.setAttribute("id","ist");
  //title.appendChild(ist);
  //const img2 = document.createElement("img");
  //img2.setAttribute("src","Istruzioni.png")
 // ist.appendChild(img2);


  game = new Game(window.screen.width, window.screen.height);
 
  document.onkeydown = function(e) {
    game.keyDown(e);
  };

  

  document.addEventListener('swiped', function(e) {
    //console.log(e.target); // element that was swiped
    //console.log(e.detail); // see event data below
    console.log(e.detail.dir); // swipe direction
    //console.log(e);
  
    game.move(e);
  
  });
  
  var ctx = canvas.getContext("2d");
  loop(game, ctx);
}

// The game update and rendering loop
function loop(game, ctx) {
  if(this.gameover==true){return }else{
  game.update();
  game.render(ctx);
  // every 5 food eaten, increase spead by 10 ms
  var snakeFastIndex = Math.floor(game.snake.length / 5);
  if (snakeFastIndex == 0) {
    var speed = 80;
  } else {
    // if speed should be faster to 30 ms, keep it to 30 ms, so the player can still play
    if (snakeFastIndex > 5) {
      var speed = 30;
    } else {
      var speed = 80 - 10 * snakeFastIndex;
    }
  }
  setTimeout(function() {
    loop(game, ctx);
    }, speed);
}
}

function restart() {
  location.reload();
}

function showLeaderboard() {
  const score = document.querySelector("#punteggio");
  
  for(let i=0; i<localStorage.length; i++) {
    let key = localStorage.key(i);

    let t = document.createElement('string');
    t.textContent = localStorage.getItem(key);
    console.log(score);
    score.appendChild(t);
    
    console.log(localStorage.getItem(key));
  }
  
}

function drawObstacles(ctx){

}
