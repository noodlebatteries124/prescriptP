let mode = "idle"; 
let scrambleInterval = null; 
let lockingInterval = null;
let spans = [];
let locked = [];
const scrambleSound = new Audio('scramble.mp3');


const phraseBank = [
    "_GO_DRINK_WATER_",
    "_SOLO_LEVELING_SUCKS_",
    "_WIN_10_CLASHES_WITH_WRATH_SKILLS_",
    "_SINNERS_WITH_THE_HIGHEST_SPEED_TARGET_THE_SLOWEST_ENEMY_SLOT",
    "_YOU_SMELL_",
    "_EAT_ONE_LUNACY_"
];

const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_=+".split("");

function buildSpans(count) {
    const lettersContainer = document.getElementById("letters");
    lettersContainer.innerHTML = ""; 
    for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        lettersContainer.appendChild(span);
    }
    spans = document.querySelectorAll("#letters span");
    locked = new Array(spans.length).fill(false);
}

function init() {
    const taskContainer = document.getElementById("taskingit");
    taskContainer.innerHTML = `
        <div class="containingit">
            <div id="letters"></div>
            <button id="taskButton">Task</button>
            <button onclick="document.getElementById('player').play()">Saikai</button>
        </div>
    `;
    buildSpans(8); 
    document.getElementById("taskButton").addEventListener("click", handleClick);
}

function randomChar() {
    return charPool[Math.floor(Math.random() * charPool.length)];
}

function handleClick() {
    if (mode === "locking" || mode === "clearing") return;
    if (mode === "idle") startTask();
    else if (mode === "complete") startClearSequence();
}

function startTask() {
    mode = "scrambling";

    const targetWord = phraseBank[Math.floor(Math.random() * phraseBank.length)];

    buildSpans(targetWord.length);
    locked.fill(false);

    const btn = document.getElementById("taskButton");
    btn.innerText = "...";

    scrambleSound.loop = true;
    scrambleSound.play();

    scrambleInterval = setInterval(() => {
        spans.forEach((span, index) => {
            if (!locked[index]) span.innerText = randomChar();
        });
    }, 200);

    setTimeout(() => {
        mode = "locking";
        let index = 0;
        lockingInterval = setInterval(() => {
            locked[index] = true;
            
            spans[index].innerText = targetWord[index];

            index++;
            if (index === spans.length) {
                clearInterval(lockingInterval);
                clearInterval(scrambleInterval);
                scrambleSound.pause();
                scrambleSound.currentTime = 0;
                mode = "complete";
                btn.innerText = "Clear";
            }
        }, 50);
    }, 1000);
}

function startClearSequence() {
    mode = "clearing";
    const btn = document.getElementById("taskButton");
    
    const message = "_CLEAR._";
    buildSpans(message.length);

    scrambleSound.loop = false;
    scrambleSound.play();

    let index = 0;
    lockingInterval = setInterval(() => {
        spans[index].innerText = message[index];
        index++;

        if (index === message.length) {
            clearInterval(lockingInterval);
            scrambleSound.pause();
            scrambleSound.currentTime = 0;
            mode = "idle";
            btn.innerText = "Task";
        }
    }, 50);
}

init();