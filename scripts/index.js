const typingTest = document.getElementById("test-text");
const timeLeft = document.getElementById("time-left");
const wordCount = document.getElementById("word-count");
const errorCount = document.getElementById("error-count");
const restartBtn = document.getElementById("restart-btn");
const inputText = document.getElementById("input-text");
const startBtn = document.getElementById("start-btn");
const fontSelection = document.getElementById("font-selection"); 

fetch("./data/google-fonts.json") 
    .then((response) => response.json())
    .then((fonts) => {
        fonts.items.forEach((font) => {
            const option = document.createElement("option"); 
            option.value = font.family; 
            option.textContent = font.family; 
            fontSelection.appendChild(option); 
        });
    })
    .catch((error) => console.error("Error loading fonts:", error)); 


fontSelection.addEventListener("change", (e) => {
    const selectedFont = e.target.value; 

    if (selectedFont) {
        const fontLink = document.createElement("link"); 
        fontLink.rel = "stylesheet"; 
        fontLink.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(" ","+")}&display=swap`;
        const oldLink = document.getElementById("dynamic-font-link"); 
        if (oldLink) {
            oldLink.remove(); 
        }
        fontLink.id = "dynamic-font-link"; 
        document.head.appendChild(fontLink);
        typingTest.style.fontFamily = `'${selectedFont}', sans-serif`;
        inputText.style.fontFamily = `'${selectedFont}', sans-serif`; 
    }
});

let timer = 60;
let errors = 0;
let wordsTyped = 0;
let timerid = 0;

let aiWordsTyped = 0;
let aiErrors = 0; 
let aiTimerId = null; 

const textPool = [
    "Star Wars is a legendary saga that spans generations, blending epic battles, intricate politics, and timeless stories of hope and redemption. Set in a galaxy far, far away, it explores the eternal conflict between the light and dark sides of the Force, a mystical energy that binds all living things. The series follows heroes like Luke Skywalker, Princess Leia, and Rey as they rise from humble beginnings to confront oppressive forces like the Galactic Empire and the First Order. Central to the saga is the journey of Anakin Skywalker, a Jedi prophesied to bring balance to the Force, who succumbs to darkness and becomes Darth Vader, one of the galaxy's most feared villains. Star Wars is not just about war; it delves into themes of loyalty, sacrifice, and the enduring power of family. From the sweeping deserts of Tatooine to the frozen landscapes of Hoth and the bustling metropolis of Coruscant, the galaxy is filled with diverse planets, alien species, and powerful factions vying for control. With lightsaber duels, starship battles, and deep emotional stakes, Star Wars captures the imagination, inviting audiences to believe in the power of courage and the hope that even in the darkest times, the light will prevail.",
    "Dogs are loyal and loving companions that have earned the title of man’s best friend through centuries of close partnership with humans. Known for their boundless energy, playful nature, and unwavering devotion, dogs bring joy to millions of households worldwide. Each breed, from the regal German Shepherd to the mischievous Dachshund, offers unique traits that suit a variety of lifestyles and needs. Beyond companionship, dogs have proven themselves as invaluable working partners, excelling in roles such as search and rescue, therapy, law enforcement, and even guiding the visually impaired. Their intelligence and trainability make them versatile and capable, while their ability to form deep emotional bonds with humans makes them irreplaceable members of the family. A dog’s loyalty is unmatched as they instinctively sense their owners’ moods, providing comfort during hard times and celebrating during moments of happiness. Their playful antics and silly habits bring laughter and light into daily life. Whether it is a wagging tail at the door after a long day or a soft nuzzle during a quiet moment, dogs have a unique way of making us feel loved and appreciated. In return, they ask for little more than kindness, attention, and a warm place to rest. Truly, dogs embody the purest form of unconditional love.",
    "Twas the night before Christmas, and the air was filled with a magical stillness. Snow blanketed the ground, glistening under the soft glow of streetlights, while homes radiated warmth and cheer. Inside, families gathered around crackling fireplaces, sharing stories and laughter as the scent of cinnamon and pine filled the room. Stockings hung by the mantel, waiting to be filled with tiny treasures, while twinkling lights on the Christmas tree danced like stars in the night. The excitement was palpable, with whispers of Santa’s arrival floating among sleepy children who struggled to stay awake. Outside, the world seemed to hold its breath, as if waiting for something extraordinary. In the distance, faint jingles echoed through the crisp air, carried by the wind. Perhaps it was sleigh bells or merely the imagination of hopeful hearts. The spirit of Christmas wrapped itself around everyone, a gentle reminder of the joy found in togetherness, generosity, and wonder. As the clock ticked closer to midnight, dreams began to unfold, and a silent peace blanketed the world. It was a night to believe in magic, where even the simplest moments sparkled with possibility, and love became the greatest gift of all.",
    "The 2011 Vancouver Canucks’ Stanley Cup run was a season of electrifying hope and unforgettable moments. Led by an exceptional roster featuring Henrik and Daniel Sedin, Ryan Kesler, and goaltender Roberto Luongo, the team dominated the NHL during the regular season, securing the Presidents’ Trophy for their league-best record. With a potent offense, impenetrable defense, and unmatched depth, the Canucks seemed destined to bring the Cup to Vancouver for the first time in franchise history. The playoffs were a rollercoaster of emotions. The first round saw an intense battle against the Chicago Blackhawks, their nemesis from previous seasons. After blowing a 3-0 series lead, Vancouver triumphed in Game 7 with an overtime goal by Alex Burrows, sparking euphoria across the city. As the playoffs progressed, the Canucks dispatched the Nashville Predators and San Jose Sharks, advancing to the Stanley Cup Final for the first time since 1994. The Final against the Boston Bruins was a grueling, hard-fought series. Despite leading 2-0 early, the Canucks struggled with injuries and relentless physical play, ultimately falling in Game 7. While heartbreak defined the ending, the 2011 Cup run remains a testament to the resilience, skill, and spirit of one of the greatest teams in Canucks history."
];

function selectText() {
    const randomTextIndex = Math.floor(Math.random() * textPool.length);
    const randomText = textPool[randomTextIndex];
    typingTest.innerText = randomText;
};

function startTimer() {
    timerid = setInterval(() => {
        timer--;
        timeLeft.textContent = timer;

        if (timer === 0) {
            clearInterval(timerid);
            endTest();
        }
    }, 1000);
};

function userStats() {
    const input = inputText.value;
    const test = typingTest.innerText;
    const inputWords = input.split(" ");
    const testWords = test.split(" ");

    errors = 0;
    wordsTyped = inputWords.length;

    inputWords.forEach((word, index) => {
        if (word !== testWords[index]) {
            errors++;
        };
    });

    wordCount.textContent = wordsTyped;
    errorCount.textContent = errors;
};

function endTest() {
    inputText.disabled = true;
    alert("Time's up!");
};

function restartTest() {
    selectText();
    timer = 60;
    errors = 0;
    wordsTyped = 0;
    timeLeft.textContent = timer;
    wordCount.textContent = 0;
    errorCount.textContent = 0;
    inputText.disabled = false;
    inputText.value = "";
    inputText.value = "";
    clearInterval(timerid);
    startTimer();
};

function startTest() {
    inputText.disabled = false;

    startBtn.disabled = true;
    restartBtn.disabled = false;
    selectText();
    startTimer();
}

startBtn.addEventListener("click", startTest);
inputText.addEventListener("input", userStats);
restartBtn.addEventListener("click", restartTest);  