// Word list (top 200 English words similar to 10FastFingers)
const wordList = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'has', 'had', 'been', 'being', 'have', 'having',
    'do', 'does', 'did', 'doing', 'can', 'could', 'may', 'might', 'shall', 'should',
    'will', 'would', 'must', 'ought', 'need', 'dare', 'used', 'try', 'ask', 'want',
    'like', 'love', 'hate', 'prefer', 'hope', 'wish', 'expect', 'plan', 'mean', 'intend',
    'learn', 'study', 'know', 'understand', 'remember', 'forget', 'think', 'believe', 'feel', 'see',
    'hear', 'smell', 'taste', 'touch', 'look', 'watch', 'notice', 'recognize', 'find', 'discover',
    'take', 'bring', 'carry', 'hold', 'keep', 'put', 'place', 'set', 'lay', 'leave',
    'let', 'allow', 'permit', 'forbid', 'prevent', 'stop', 'continue', 'go', 'come', 'arrive',
    'reach', 'enter', 'exit', 'return', 'stay', 'remain', 'wait', 'happen', 'occur', 'become',
    'get', 'grow', 'turn', 'change', 'develop', 'improve', 'increase', 'decrease', 'rise', 'fall'
];

// DOM elements
const wordDisplay = document.getElementById('word-display');
const typingInput = document.getElementById('typing-input');
const timerElement = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const resultsDiv = document.getElementById('results');
const finalWpmSpan = document.getElementById('final-wpm');
const accuracySpan = document.getElementById('accuracy');

// Sidebar status elements
const wordsTypedSpan = document.getElementById('words-typed');
const correctWordsSpan = document.getElementById('correct-words');
const incorrectWordsSpan = document.getElementById('incorrect-words');
const accuracyStatusSpan = document.getElementById('accuracy-status');
const timeRemainingStatusSpan = document.getElementById('time-remaining-status');
const wpmStatusSpan = document.getElementById('wpm-status');

// Game variables
let words = [];
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let timer;
let timeLeft = 60;
let testStarted = false;
let totalTypedCharacters = 0;

// Initialize the game
function initGame() {
    // Reset variables
    currentWordIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    timeLeft = 60;
    testStarted = false;
    totalTypedCharacters = 0;

    // Update UI
    timerElement.textContent = timeLeft;
    typingInput.value = '';
    typingInput.disabled = false; // Ensure the input is enabled
    resultsDiv.style.display = 'none';

    // Reset sidebar statuses
    updateSidebarStatus();

    // Generate random words
    words = [];
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        words.push(wordList[randomIndex]);
    }

    // Display words
    displayWords();
}

// Display words in the word display area
function displayWords() {
    wordDisplay.innerHTML = '';
    words.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.textContent = word + ' ';
        wordElement.classList.add('word');
        if (index === currentWordIndex) {
            wordElement.classList.add('active');
        }
        wordDisplay.appendChild(wordElement);
    });
}

// Function to update the sidebar statuses
function updateSidebarStatus() {
    wordsTypedSpan.textContent = currentWordIndex;
    correctWordsSpan.textContent = correctCount;
    incorrectWordsSpan.textContent = incorrectCount;

    const totalWords = correctCount + incorrectCount;
    const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 100;
    accuracyStatusSpan.textContent = `${accuracy}%`;

    timeRemainingStatusSpan.textContent = `${timeLeft}s`;

    const minutesPassed = (60 - timeLeft) / 60;
    const wpm = Math.round((totalTypedCharacters / 5) / minutesPassed) || 0;
    wpmStatusSpan.textContent = wpm;
}

// Handle typing input
typingInput.addEventListener('input', () => {
    if (!testStarted) {
        testStarted = true;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            updateSidebarStatus();

            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }

    const currentWord = words[currentWordIndex];
    const inputValue = typingInput.value.trim();
    totalTypedCharacters++;

    if (inputValue === currentWord) {
        document.querySelectorAll('.word')[currentWordIndex].classList.add('correct');
    } else if (!currentWord.startsWith(inputValue)) {
        document.querySelectorAll('.word')[currentWordIndex].classList.add('incorrect');
    }

    updateSidebarStatus();
});

// Handle space to move to the next word
typingInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();

        const currentWord = words[currentWordIndex];
        const inputValue = typingInput.value.trim();

        if (inputValue === currentWord) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        currentWordIndex++;
        typingInput.value = '';

        if (currentWordIndex >= words.length) {
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * wordList.length);
                words.push(wordList[randomIndex]);
            }
        }

        displayWords();
        updateSidebarStatus();
    }
});

// Handle clicking on the typing input to start the game
typingInput.addEventListener('click', () => {
    if (!testStarted) { // Check if the game has not started
        initGame(); // Initialize the game
        typingInput.disabled = false; // Enable the input field
        typingInput.focus(); // Focus on the input field
    }
});

// End the test
function endTest() {
    clearInterval(timer);
    typingInput.disabled = true;
    testStarted = false;

    const totalWords = correctCount + incorrectCount;
    const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;
    const wpm = Math.round((totalTypedCharacters / 5) / 1) || 0;

    finalWpmSpan.textContent = wpm;
    accuracySpan.textContent = accuracy;
    resultsDiv.style.display = 'block';

    updateSidebarStatus();
}

// Event listeners
restartBtn.addEventListener('click', () => {
    clearInterval(timer); // Stop the timer
    initGame(); // Reinitialize the game
    typingInput.disabled = false;
    typingInput.focus();
});

// Initialize game on load
initGame();
