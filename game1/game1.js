 // Game variables and constants
 const canvas = document.getElementById('gameCanvas');
 const ctx = canvas.getContext('2d');
 canvas.width = 800;
 canvas.height = 600;

 const birdImg = new Image();
 birdImg.src = 'bird.png'; // Make sure this path is correct

 const seedImg = new Image();
 seedImg.src = 'seed.png'; // Make sure this path is correct

 const bird = {
     x: canvas.width / 2,
     y: canvas.height - 60,
     width: 50,
     height: 50,
     speed: 10
 };

 const seeds = [];
 const seedFrequency = 100; // Lower number means more frequent seeds
 let gameInterval;
 let score = 0;
 let isGamePaused = false;
 let timerInterval;
 let secondsPassed = 0;

 const seedBaseSpeed = 3; // Base speed of seeds
 let seedSpeedIncrement = 0; // Incremental speed that will increase over time
 
 setInterval(() => {
 seedSpeedIncrement += 0.05; // Increase the speed increment by 1 every second
 }, 1000);


 let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

document.addEventListener('keydown', function(e) {
if (keys.hasOwnProperty(e.key)) {
 keys[e.key] = true;
}
});

document.addEventListener('keyup', function(e) {
if (keys.hasOwnProperty(e.key)) {
 keys[e.key] = false;
}
});

function moveBird() {
if (keys.ArrowLeft && bird.x > 0) {
 bird.x -= bird.speed;
}
if (keys.ArrowRight && bird.x < canvas.width - bird.width) {
 bird.x += bird.speed;
}
if (keys.ArrowUp && bird.y > 0) {
 bird.y -= bird.speed;
}
if (keys.ArrowDown && bird.y < canvas.height - bird.height) {
 bird.y += bird.speed;
}
}




function addSeed() {
if (Math.random() * seedFrequency < 1) {
 seeds.push({
     x: Math.random() * canvas.width,
     y: 0,
     width: 30,
     height: 30,
     speed: seedBaseSpeed + seedSpeedIncrement // Use base speed + increment
 });
}
}


 function updateGame() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
moveBird();
ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

addSeed();
for (let i = seeds.length - 1; i >= 0; i--) {
 const seed = seeds[i];
 seed.y += seed.speed;
 ctx.drawImage(seedImg, seed.x, seed.y, seed.width, seed.height);

 if (seed.y > canvas.height) {
     seeds.splice(i, 1);
     score -= 2; // Deduct 2 points for a missed seed
 } else if (seed.x < bird.x + bird.width &&
            seed.x + seed.width > bird.x &&
            seed.y < bird.y + bird.height &&
            seed.y + seed.height > bird.y) {
     score++;
     seeds.splice(i, 1);
 }
}

// Ensure score does not go below 0
if (score < 0) {
 score = 0;
}

document.getElementById('score').textContent = 'Score: ' + score;
}

 function startGame() {
     if (!gameInterval) {
         gameInterval = setInterval(updateGame, 20);
         timerInterval = setInterval(updateTimer, 1000);
     }
 }
 function pauseGame() {
     isGamePaused = !isGamePaused;
     const pauseButton = document.getElementById('pauseGame');
     pauseButton.textContent = isGamePaused ? 'Resume' : 'Pause';
     // If game is paused, clear intervals
     if (isGamePaused) {
         clearInterval(gameInterval);
         clearInterval(timerInterval);
     } else {
         // If game is resumed, start intervals again
         gameInterval = setInterval(updateGame, 20);
         timerInterval = setInterval(updateTimer, 1000);
     }
 }

 function updateTimer() {
     secondsPassed++;
     let minutes = Math.floor(secondsPassed / 60);
     let seconds = secondsPassed % 60;
     document.getElementById('timer').textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
 }

 function saveScore() {
     let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
     let date = new Date();
     highScores.push({
         score: score,
         date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
         playTime: document.getElementById('timer').textContent.replace('Time: ', '')
     });
     highScores.sort((a, b) => b.score - a.score); // Sort from highest to lowest score
     localStorage.setItem('highScores', JSON.stringify(highScores));
     resetGame();
 }

 function resetGame() {
     clearInterval(gameInterval);
     clearInterval(timerInterval);
     secondsPassed = 0;
     document.getElementById('timer').textContent = 'Time: 00:00';
     score = 0;
     document.getElementById('score').textContent = 'Score: 0';
     seeds.length = 0; // Clear seeds array
     bird.x = canvas.width / 2; // Reset bird position
     isGamePaused = false;
     document.getElementById('pauseGame').textContent = 'Pause';
 }

 function loadHighScores() {
     let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
     let highScoresList = document.getElementById('highScoresList');
     highScoresList.innerHTML = ''; // Clear existing list items
     highScores.forEach((item) => {
         let li = document.createElement('li');
         li.textContent = `Score: ${item.score}, Date: ${item.date}, Time Played: ${item.playTime}`;
         highScoresList.appendChild(li);
     });
 }

 document.getElementById('pauseGame').addEventListener('click', pauseGame);

 document.getElementById('saveGame').addEventListener('click', function() {
     saveScore();
     document.getElementById('gamePage').style.display = 'none';
     document.getElementById('homePage').style.display = 'block';
 });

 document.getElementById('viewHighScores').addEventListener('click', function() {
     document.getElementById('homePage').style.display = 'none';
     document.getElementById('highScorePage').style.display = 'block';
     loadHighScores();
 });

 document.getElementById('backFromHighScores').addEventListener('click', function() {
     document.getElementById('highScorePage').style.display = 'none';
     document.getElementById('homePage').style.display = 'block';
 });

 document.getElementById('startGame').addEventListener('click', function() {
     document.getElementById('homePage').style.display = 'none';
     document.getElementById('gamePage').style.display = 'block';
     startGame();
 });

 document.getElementById('backHome').addEventListener('click', function() {
     document.getElementById('gamePage').style.display = 'none';
     document.getElementById('homePage').style.display = 'block';
     pauseGame(); // Pause the game when going back to the home page
     resetGame(); // Reset the game score and timer
 });

 // Start the game automatically when the script loads
 startGame();