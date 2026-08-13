/* 🧠 Class 10 Quiz */

const quizQuestions = [
    {
        question: "What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        answer: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Jupiter"],
        answer: 2
    },
    {
        question: "What is the chemical formula of water?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        answer: 1
    },
    {
        question: "Who wrote the Indian national anthem?",
        options: [
            "Rabindranath Tagore",
            "Bankim Chandra Chattopadhyay",
            "Kazi Nazrul Islam",
            "Sarat Chandra Chattopadhyay"
        ],
        answer: 0
    },
    {
        question: "What is 12 × 8?",
        options: ["86", "96", "108", "112"],
        answer: 1
    },
    {
        question: "Which gas do plants mainly absorb during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        answer: 2
    },
    {
        question: "How many states are there in India?",
        options: ["26", "28", "29", "30"],
        answer: 1
    },
    {
        question: "Which is the largest ocean in the world?",
        options: [
            "Atlantic Ocean",
            "Indian Ocean",
            "Pacific Ocean",
            "Arctic Ocean"
        ],
        answer: 2
    },
    {
        question: "What is the square of 15?",
        options: ["125", "200", "225", "250"],
        answer: 2
    },
    {
        question: "Which organ pumps blood throughout the human body?",
        options: ["Brain", "Lungs", "Heart", "Kidney"],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const quizBox = document.getElementById("quizBox");
    const q = quizQuestions[currentQuestion];

    quizBox.innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>
        <p><strong>${q.question}</strong></p>

        ${q.options.map((option, index) => `
            <button onclick="checkAnswer(${index})">
                ${option}
            </button>
        `).join("")}
    `;
}

function checkAnswer(selectedAnswer) {
    const q = quizQuestions[currentQuestion];

    if (selectedAnswer === q.answer) {
        score++;
        alert("✅ Correct!");
    } else {
        alert("❌ Wrong answer!");
    }

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const quizBox = document.getElementById("quizBox");

    quizBox.innerHTML = `
        <h3>🎉 Quiz Completed!</h3>
        <p>Your Score: <strong>${score} / ${quizQuestions.length}</strong></p>
        <button onclick="startQuiz()">🔄 Play Again</button>
    `;
                  }
