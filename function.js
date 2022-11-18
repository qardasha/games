let frame = document.getElementById("frame");
let target = document.querySelector(".target");
let username = "";
let username_text = document.getElementById("username-text");
let points = 0;
let pointsCount = document.getElementById("points-count");
let pointsEarntCount = document.getElementById("points-earnt-count");

target.style.top = "200px";
target.style.left = "840px";

let gameActive = false;

function createArrow() {
	if (gameActive) {
		let arrow = document.createElement("img");
		arrow.src = "https://media.discordapp.net/attachments/1041716359354134650/1042765985595273246/908D6C23-6EE4-4B61-ABB5-48BC87CB8C12.png";
		arrow.classList.add("arrow");
		arrow.style.left = 0;
		var bounding = event.currentTarget.getBoundingClientRect();
		var offsetValue = event.clientY - bounding.top + "px";
		arrow.style.top = offsetValue;
		frame.appendChild(arrow);
		arrow.setAttribute("data-top", offsetValue);
	}
}

let timeRemaining = 60;
let timerText = document.getElementById("timer-text");
let countdown = document.getElementById("countdown");

let new_highscore = document.getElementById("new-highscore");

let splash_screen = document.getElementById("splash-screen")

window.setTimeout(hideSplash, 3000);

function hideSplash() {
	splash_screen.style.display = "none";
}

window.setInterval(moveArrows, 10);
window.setInterval(moveTarget, 10);
window.setInterval(increaseSpeed, 2000);
window.setInterval(timer, 1000);

function moveArrows() {
	let arrows = document.querySelectorAll(".arrow");
	for (let i = 0; arrows.length > i; i++) {
		let leftAmount = parseInt(arrows[i].style.left) + 20;
		arrows[i].style.left = leftAmount + "px";
		
		let arrowTop = parseInt(window.getComputedStyle(arrows[i]).getPropertyValue("top"));
		let arrowBottom = parseInt(window.getComputedStyle(arrows[i]).getPropertyValue("bottom"));
		let targetTop = parseInt(window.getComputedStyle(target).getPropertyValue("top"));
		let targetBottom = parseInt(window.getComputedStyle(target).getPropertyValue("bottom"));
		
		 if ((arrows[i].style.left == target.style.left) && (arrowTop >= targetTop && arrowBottom >= targetBottom)) {
			let pointsEarnt;
			if (targetSpeed != 0) {
				pointsEarnt = targetSpeed * 75;
			}
			else pointsEarnt = 25;
			points += pointsEarnt;
			pointsCount.innerHTML = points;
			let earntExplosion = document.createElement("div");
			earntExplosion.classList.add("earnt-explosion");
			frame.appendChild(earntExplosion);
			earntExplosion.style.top = arrows[i].getAttribute("data-top");
			earntExplosion.style.left = "840px";
			let earntDisplay = document.createElement("p");
			window.setTimeout(function() {
				earntExplosion.remove();
			}, 250)
			window.setTimeout(function() {
				earntDisplay.remove();
			}, 1000);
			earntDisplay.classList.add("earnt-display");
			earntDisplay.innerHTML = "+" + pointsEarnt;
			pointsEarntCount.appendChild(earntDisplay);
			arrows[i].remove();
		}
		
		if (parseInt(arrows[i].style.left) >= 900) {
		
			let pointsLost;
			
			switch (targetSpeed) {
			    case 0:
			    	pointsLost = 100;
			    	break;
			    case 1:
			    	pointsLost = 80;
			    	break;
			    case 2:
			    	pointsLost = 60;
			    	break;
			    case 3:
			    	pointsLost = 40;
			    	break;
			    case 4:
			    	pointsLost = 20;
			}
			
			let lossExplosion = document.createElement("div");
			lossExplosion.classList.add("loss-explosion");
			frame.appendChild(lossExplosion);
			lossExplosion.style.top = arrows[i].getAttribute("data-top");
			lossExplosion.style.left = "890px";
			window.setTimeout(function() {
				lossExplosion.remove();
			}, 250)
			
			let lossDisplay = document.createElement("p");
			window.setTimeout(function() {
			lossDisplay.remove();
			}, 1000);
			lossDisplay.classList.add("loss-display");
			pointsEarntCount.appendChild(lossDisplay);
				
			if ((points - pointsLost) >= 0) {
				lossDisplay.innerHTML = "-" + pointsLost;
				points -= pointsLost;
			}
			else if (points == 0) {
				
			}
			else {
				lossDisplay.innerHTML = "-" + points;
				points = 0;
			}
			
			pointsCount.innerHTML = points;
			
			arrows[i].remove();
		}
	}
}

let moveUp = false;

let targetSpeed = 0;

function moveTarget() {
	if (gameActive) {
		if (!moveUp) {
			target.style.top = parseInt(target.style.top) + targetSpeed + "px";
		}
		else if (moveUp) {
			target.style.top = parseInt(target.style.top) - targetSpeed + "px";
		}
	
		if (parseInt(target.style.top) <= 0) moveUp = false;
		else if (parseInt(target.style.top) >= 400) moveUp = true;
	}
}

let speedStop = false;

function increaseSpeed() {
	if (gameActive) {
		if (targetSpeed < 3 && !speedStop) targetSpeed += 1;
		else if (speedStop) {
			targetSpeed = 4;
			speedStop = false;  
		}
		else if (targetSpeed == 4) {
			targetSpeed = 1;
		}
	
		if (targetSpeed == 3) {
			targetSpeed = 0;
			speedStop = true;
		}
	}
}

let checkArrowCount = false;

function timer() {
	if (gameActive) {
		if (timeRemaining == 60) timerText.innerHTML = "1:00";
		if (timeRemaining > 0) timeRemaining--;
		if (timeRemaining < 10) {
			timerText.innerHTML = "0:0" + timeRemaining;
		}
		else timerText.innerHTML = "0:" + timeRemaining;
	
		if (timeRemaining <= 10) {
			countdown.innerHTML = timeRemaining;
		}
	
		if (timeRemaining == 0) {
			countdown.innerHTML = "Game Over";
			countdown.style.fontSize = "30px";
			countdown.style.top = "10px";
			gameActive = false;
			checkArrowCount = true;
		}
	}
	
	if (checkArrowCount) {
		let arrows = document.querySelectorAll(".arrow");
		if (arrows.length == 0) {
			finishScreenFunc();
			checkArrowCount = false;
		}
	}
}

let finalScore = document.getElementById("final-score");
let highscoreText = document.getElementById("highscore-text");

let highscore = parseInt(localStorage.getItem("highscore")) || 0;
let highscore_user = localStorage.getItem("highscore_user");

function finishScreenFunc() {
	finalScore.innerHTML = points;
	updateHighscore();
	finishScreen.style.display = "flex";
}

function updateHighscore() {
	if (points > highscore) {
		highscore = points;
		localStorage.setItem("highscore", JSON.stringify(highscore));
		localStorage.setItem("highscore_user", username);
		new_highscore.style.display = "inline";
	}
	else new_highscore.style.display = "none";
	
	highscoreText.innerHTML = highscore;
}

let codes = ["AGH181", "BHA211", "CSI290", "DFF991", "EKE001", "FTP334", "GMN101", "HJH006", "IUX500", "JSV347"];

let canSubmit = false;

function verifyInput(event) {
	for (let i = 0; codes.length > i; i++) {
		if (event.target.parentNode.elements.code.value == codes[i]) {
			event.target.parentNode.elements.submit.style.backgroundColor = "blue";
			canSubmit = true;
			break;
		}
		else {
			event.target.parentNode.elements.submit.style.backgroundColor = "darkgrey";
			canSubmit = false;
		}
	}
}

let scd_ID;

function submitClicked(event) {
	if (canSubmit) {
		event.target.parentNode.style.display = "none";
		username = event.target.elements.name.value;
		username_text.innerHTML = username;
		scd_ID = window.setInterval(startCountdown, 1000);
	}
}

let startCountdownDiv = document.getElementById("start-countdown");
let startCountdownTime = 4;

let finishScreen = document.getElementById("finish-screen");

function startCountdown() {
	startCountdownDiv.style.display = "flex";
	startCountdownDiv.style.backgroundColor = "rgb(0, 0, 0, 0.2)";
	
	if (startCountdownTime > 1) {
		startCountdownTime--;
		startCountdownDiv.innerHTML = startCountdownTime;
	}
	else if (startCountdownTime == 1) {
		startCountdownTime--;
		startCountdownDiv.style.backgroundColor = "transparent";
		startCountdownDiv.innerHTML = "GO";
		gameActive = true;
	}
	else {
		startCountdownDiv.style.display = "none";
		window.clearInterval(scd_ID);
	}
}

function resetButtonFunc() {
	if (gameActive) {
		gameActive = false;
		window.clearInterval(scd_ID);
		resetGame();
	}
}

function resetGame() {
	finishScreen.style.display = "none";
	timeRemaining = 60;
	timerText.innerHTML = "1:00";
	points = 0;
	pointsCount.innerHTML = 0;
	startCountdownTime = 4;
	targetSpeed = 0;
	countdown.innerHTML = "";
	countdown.style.fontSize = "50px";
	countdown.style.top = "0";
	scd_ID = window.setInterval(startCountdown, 1000);
}

let highscoreInfo = document.getElementById("highscore-info");

function viewHighscore() {
	highscoreInfo.innerHTML = `<b>${highscore}</b> by <b>${highscore_user}</b>`;
}
