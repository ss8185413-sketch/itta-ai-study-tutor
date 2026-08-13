async function askTutor() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.innerText = "Please type a question first.";
        return;
    }

    answer.innerText = "Thinking... 🤖";

    try {
        const response = await fetch(
            "https://itta-ai-study-tutor.onrender.com/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            answer.innerText =
                data.error || "Server error occurred.";
            return;
        }

        if (data.answer) {
            answer.innerText = data.answer;
        } else {
            answer.innerText = "No answer received.";
        }

    } catch (error) {
        console.error("Error:", error);

        answer.innerText =
            "Could not connect to the server.";
    }
}


/* 🎙️ Voice Mic */
function startMic() {
    const question = document.getElementById("question");
    const micBtn = document.getElementById("micBtn");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported on this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.innerText = "🔴 Listening...";

    recognition.start();

    recognition.onresult = function(event) {
        question.value = event.results[0][0].transcript;
    };

    recognition.onerror = function() {
        micBtn.innerText = "🎙️";
        alert("Could not hear your voice. Please try again.");
    };

    recognition.onend = function() {
        micBtn.innerText = "🎙️";
    };
}


/* 🧠 Quiz */

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;


/* Load questions from questions.json */
async function loadQuestions() {
    try {
        const response = await fetch("questions.json");

        if (!response.ok) {
            throw new Error("Could not load questions.");
        }

        quizQuestions = await response.json();

        startQuiz();

    } catch (error) {
        console.error(error);

        document.getElementById("quizBox").innerHTML = `
            <p>❌ Could not load quiz questions.</p>
            <p>Please try again later.</p>
        `;
    }
}


/* Shuffle questions */
function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


/* Start Quiz */
function startQuiz() {

    if (quizQuestions.length === 0) {
        loadQuestions();
        return;
    }

    currentQuestion = 0;
    score = 0;

    /* Take random 10 questions */
    quizQuestions = shuffleArray(quizQuestions).slice(0, 10);

    showQuestion();
}


/* Show Question */
function showQuestion() {

    const quizBox = document.getElementById("quizBox");
    const q = quizQuestions[currentQuestion];

    quizBox.innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>

        <p><strong>${q.question}</strong></p>

        <div class="quiz-options">

            ${q.options.map((option, index) => `
                <button onclick="checkAnswer(${index})">
                    ${option}
                </button>
            `).join("")}

        </div>

        <div id="quizMessage"></div>
    `;
}


/* Check Answer */
function checkAnswer(selectedAnswer) {

    const q = quizQuestions[currentQuestion];
    const quizBox = document.getElementById("quizBox");

    const buttons =
        quizBox.querySelectorAll(".quiz-options button");

    /* Disable all options */
    buttons.forEach(button => {
        button.disabled = true;
    });


    if (selectedAnswer === q.answer) {

        score++;

        quizBox.innerHTML += `
            <p>✅ Correct!</p>
        `;

    } else {

        quizBox.innerHTML += `
            <p>❌ Wrong!</p>
            <p>The correct answer is:
            <strong>${q.options[q.answer]}</strong></p>
        `;
    }


    /* Next question after 1 second */
    setTimeout(() => {

        currentQuestion++;

        if (currentQuestion < quizQuestions.length) {

            showQuestion();

        } else {

            showResult();

        }

    }, 1000);
}


/* Quiz Result */
function showResult() {

    const quizBox =
        document.getElementById("quizBox");

    quizBox.innerHTML = `
        <h3>🎉 Quiz Completed!</h3>

        <p>
            Your Score:
            <strong>${score} / ${quizQuestions.length}</strong>
        </p>

        <button onclick="startQuiz()">
            🔄 Play Again
        </button>
    `;
}
