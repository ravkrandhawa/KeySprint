const typingTest = document.getElementById("test-text"); 
const timeLeft = document.getElementById("time-left"); 
const wordCount = document.getElementById("word-count"); 
const errorCount = document.getElementById("error-count"); 
const restartBtn = document.getElementById("restart-btn"); 
const inputText = document.getElementById("input-text"); 
const startBtn = document.getElementById("start-btn"); 

const aiProgressElement = document.getElementById("ai-progress"); 
const aiWpmElement = document.getElementById("ai-wpm"); 
const aiAccuracyElement = document.getElementById("ai-accuracy"); 

let timer = 60; 
let errors = 0; 
let wordsTyped = 0; 
let aiProgress = 0;  
let timerId = null; 
let aiTimerId = null; 
let aiAccuracy = 100; 
let aiSpeed = 300; 

const textPool = [
    "Dogs are loyal and loving companions that bring joy to millions of homes. Known for their boundless energy, playful nature, and devotion, they have earned the title of man's best friend.",
    "Twas the night before Christmas, and the air was filled with a magical stillness. Snow blanketed the ground, and homes radiated warmth as families gathered around fireplaces, waiting for Santa's arrival.",
    "The 2011 Vancouver Canucks' Stanley Cup run was unforgettable. Led by an exceptional roster, they dominated the season, igniting the hope of fans."
];

function selectText() {
    const randomIndex = Math.floor(Math.random() * textPool.length);
    typingTest.innerText = textPool[randomIndex];
}

function startTimer() {
    timerId = setInterval(() => {
        if (timer === 0) {
            clearInterval(timerId);
            clearInterval(aiTimerId);
            endTest();
            return;
        }
        timer--;
        timeLeft.textContent = timer;
    }, 1000);
}

function startAIProgress() {
    const testWords = typingTest.innerText.split(" ");
    aiProgress = 0; 
    aiProgressElement.innerText = ""; 
    let correctWords = 0;

    const startTime = Date.now(); 

    aiTimerId = setInterval(() => {
        if (aiProgress < testWords.length) {
            const correct = Math.random() * 100 <= aiAccuracy;
            const wordToAdd = correct ? testWords[aiProgress] : "___"; 

            aiProgressElement.innerHTML += wordToAdd + " ";
            if (correct) correctWords++;

            aiProgress++;

            const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
            aiWpmElement.textContent = ((aiProgress / elapsedTimeInSeconds) * 60).toFixed(1);

            aiAccuracyElement.textContent = aiAccuracy + "%";
        } else {
            clearInterval(aiTimerId);
            checkRaceResult();
        }
    }, aiSpeed);
}


function userStats() {
    const input = inputText.value.trim();
    const testWords = typingTest.innerText.trim().split(" ");
    const inputWords = input.split(" ");

    errors = 0;
    wordsTyped = inputWords.length;

    inputWords.forEach((word, index) => {
        if (word !== testWords[index]) errors++;
    });

    wordCount.textContent = wordsTyped;
    errorCount.textContent = errors;
}

function checkRaceResult() {
    const userInput = inputText.value.trim();
    const targetText = typingTest.innerText.trim();
    const aiFinished = aiProgress === targetText.split(" ").length;
    const userFinished = userInput === targetText;

    if (userFinished && aiFinished) {
        alert("It's a tie! Both you and the AI finished simultaneously.");
    } else if (userFinished) {
        alert("Congratulations! You won the race against the AI!");
    } else if (aiFinished) {
        alert("The AI won the race! Better luck next time.");
    }
}

function endTest() {
    inputText.disabled = true;
    clearInterval(timerId);
    clearInterval(aiTimerId);
    checkRaceResult();
}

function restartTest() {
    clearInterval(timerId);
    clearInterval(aiTimerId);

    timer = 60;
    errors = 0;
    wordsTyped = 0;
    aiProgress = 0;

    timeLeft.textContent = timer;
    wordCount.textContent = 0;
    errorCount.textContent = 0;
    aiProgressElement.innerText = "";
    aiWpmElement.textContent = "0";
    aiAccuracyElement.textContent = "100%";
    inputText.value = "";
    inputText.disabled = false;

    selectText();
}

function startTest() {
    startBtn.disabled = true;
    restartBtn.disabled = false;
    inputText.disabled = false;

    selectText();
    startTimer();
    startAIProgress();
}

startBtn.addEventListener("click", startTest);
inputText.addEventListener("input", userStats);
restartBtn.addEventListener("click", restartTest);
