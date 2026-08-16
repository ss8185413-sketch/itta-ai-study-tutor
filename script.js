// ===============================
// ITTA STUDY IQ - MAIN SCRIPT
// ===============================

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedExam = "";
let selectedPart = "";


// ===============================
// PAGE READY
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const questionBox = document.getElementById("question");

    if (questionBox) {

        questionBox.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();
                askTutor();

            }

        });

    }

});


// ===============================
// AI STUDY TUTOR
// ===============================

async function askTutor() {

    const questionBox = document.getElementById("question");
    const answerBox = document.getElementById("answer");

    if (!questionBox || !answerBox) {
        return;
    }

    const question = questionBox.value.trim();

    if (!question) {
        answerBox.innerText = "Please type a question first.";
        return;
    }

    answerBox.innerText = "Thinking... ✨";

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        if (!response.ok) {
            throw new Error("Server Error: " + response.status);
        }

        const data = await response.json();

        if (data.answer) {
            answerBox.innerText = data.answer;
        }
        else if (data.text) {
            answerBox.innerText = data.text;
        }
        else {
            answerBox.innerText = "Sorry, no answer received.";
        }

    }
    catch (error) {

        console.error("AI Tutor Error:", error);

        answerBox.innerText =
            "AI Tutor is temporarily unavailable. Please try again.";

    }

}


// ===============================
// MICROPHONE
// ===============================

function startMic() {

    const questionBox = document.getElementById("question");

    if (!questionBox) {
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported on this browser."
        );

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = function () {
        questionBox.placeholder = "Listening...";
    };

    recognition.onresult = function (event) {

        questionBox.value =
            event.results[0][0].transcript;

        questionBox.placeholder =
            "Type your question here...";

    };

    recognition.onerror = function (event) {

        console.error(
            "Microphone Error:",
            event.error
        );

        questionBox.placeholder =
            "Type your question here...";

    };

    recognition.onend = function () {

        questionBox.placeholder =
            "Type your question here...";

    };

    try {
        recognition.start();
    }
    catch (error) {
        console.error(error);
    }

}


// ===============================
// SIMPLE STUDY QUIZ
// ===============================

function startQuiz() {

    const quizBox = document.getElementById("quizBox");

    if (!quizBox) {
        return;
    }

    quizBox.innerHTML = `

        <div class="quiz-content">

            <h3>🧠 Quick Study Quiz</h3>

            <p>
                Your quiz system is ready.
            </p>

            <button
                type="button"
                onclick="closeQuiz()"
            >
                ✖ Close
            </button>

        </div>

    `;

}


function closeQuiz() {

    const quizBox = document.getElementById("quizBox");

    if (quizBox) {
        quizBox.innerHTML = "";
    }

}


// ===============================
// START MOCK TEST
// ===============================

async function startMockTest(exam) {

    selectedExam = exam;
    selectedPart = "";

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    // SSC has Part system
    if (exam === "SSC") {

        showSSCParts();
        return;

    }

    const files = {

        "UPSC": "upsc_questions.json",

        "BANK": "bank_questions.json",

        "WBP": "wbp_questions.json",

        "KOLKATA_POLICE":
            "kolkata_police_questions.json",

        "RAILWAY":
            "railway_questions.json"

    };

    const fileName = files[exam];

    if (!fileName) {

        alert("Exam not found.");

        return;
    }

    try {

        const response = await fetch(
            fileName + "?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "File not found: " + fileName
            );

        }

        const data = await response.json();

        if (!Array.isArray(data)) {

            alert(
                fileName +
                " format is incorrect."
            );

            return;
        }

        if (data.length === 0) {

            alert(
                "No questions found in " +
                fileName
            );

            return;
        }

        currentQuestions =
            shuffleArray(data).slice(
                0,
                Math.min(10, data.length)
            );

        showMockTest();

    }
    catch (error) {

        console.error(
            "Mock Test Error:",
            error
        );

        alert(
            "Question file load হচ্ছে না.\n\n" +
            "Check করো:\n" +
            fileName +
            "\n\nFileটি একই folder-এ আছে কিনা।"
        );

    }

}


// ===============================
// SSC PARTS
// ===============================

function showSSCParts() {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    let buttons = "";

    for (let i = 1; i <= 20; i++) {

        buttons += `

            <button
                type="button"
                class="exam-btn"
                onclick="startSSCPart('part${i}')"
            >
                📖 Part ${i}
            </button>

        `;

    }

    container.innerHTML = `

        <div class="ssc-parts">

            <h3>📚 SSC Mock Test</h3>

            <p>
                Select an SSC Part
            </p>

            <div class="exam-grid">

                ${buttons}

            </div>

        </div>

    `;

}


// ===============================
// START SSC PART
// ===============================

async function startSSCPart(partName) {

    selectedExam = "SSC";
    selectedPart = partName;

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    try {

        const response = await fetch(
            "ssc_questions.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "SSC file not found"
            );

        }

        const data = await response.json();

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {

            alert(
                "ssc_questions.json format ঠিক নেই."
            );

            return;
        }

        if (
            !Object.prototype.hasOwnProperty.call(
                data,
                partName
            )
        ) {

            alert(
                "SSC " +
                partName +
                " পাওয়া যায়নি."
            );

            console.log(
                "Available Parts:",
                Object.keys(data)
            );

            return;
        }

        const questions = data[partName];

        if (!Array.isArray(questions)) {

            alert(
                partName +
                " question format ঠিক নেই."
            );

            return;
        }

        if (questions.length === 0) {

            alert(
                partName +
                " এ কোনো প্রশ্ন নেই."
            );

            return;
        }

        currentQuestions =
            shuffleArray(questions).slice(
                0,
                Math.min(10, questions.length)
            );

        showMockTest();

    }
    catch (error) {

        console.error(
            "SSC Error:",
            error
        );

        alert(
            "SSC question file load হচ্ছে না.\n\n" +
            "ssc_questions.json check করো."
        );

    }

}


// ===============================
// SHUFFLE
// ===============================

function shuffleArray(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;

}


// ===============================
// SHOW MOCK TEST
// ===============================

function showMockTest() {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    const question =
        currentQuestions[currentQuestionIndex];

    if (!question) {

        showResult();
        return;

    }

    const questionText =
        question.question ||
        question.questionText ||
        question.q ||
        "Question not found";

    const options =
        question.options ||
        question.answers ||
        [];

    if (!Array.isArray(options) || options.length === 0) {

        container.innerHTML = `

            <div class="result-box">

                <h3>⚠️ Question Error</h3>

                <p>
                    এই প্রশ্নের options পাওয়া যায়নি।
                </p>

                <button
                    type="button"
                    onclick="restartMockTest()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

        return;
    }

    let html = `

        <div class="mock-question">

            <h3>
                Question
                ${currentQuestionIndex + 1}
                /
                ${currentQuestions.length}
            </h3>

            <p>
                ${escapeHTML(questionText)}
            </p>

            <div class="options">

    `;

    options.forEach(function (option, index) {

        html += `

            <button
                type="button"
                class="option-btn"
                onclick="selectAnswer(${index})"
            >
                ${escapeHTML(String(option))}
            </button>

        `;

    });

    html += `

            </div>

            <div id="feedback"></div>

        </div>

    `;

    container.innerHTML = html;

}


// ===============================
// SELECT ANSWER
// ===============================

function selectAnswer(selectedIndex) {

    const question =
        currentQuestions[currentQuestionIndex];

    if (!question) {
        return;
    }

    const options =
        question.options ||
        question.answers ||
        [];

    const correctAnswer =
        question.answer ??
        question.correctAnswer ??
        question.correct ??
        question.correct_option;

    const buttons =
        document.querySelectorAll(".option-btn");

    buttons.forEach(function (button) {
        button.disabled = true;
    });

    let correctIndex = -1;

    // Answer is number
    if (typeof correctAnswer === "number") {

        // Support both 0-based and 1-based
        if (
            correctAnswer >= 0 &&
            correctAnswer < options.length
        ) {

            correctIndex = correctAnswer;

        }
        else if (
            correctAnswer >= 1 &&
            correctAnswer <= options.length
        ) {

            correctIndex = correctAnswer - 1;

        }

    }

    // Answer is text
    else if (typeof correctAnswer === "string") {

        const answerText =
            correctAnswer.trim().toLowerCase();

        correctIndex =
            options.findIndex(function (option) {

                return String(option)
                    .trim()
                    .toLowerCase() === answerText;

            });

        // A/B/C/D
        if (correctIndex === -1) {

            const letters = [
                "a",
                "b",
                "c",
                "d"
            ];

            const letterIndex =
                letters.indexOf(answerText);

            if (letterIndex !== -1) {
                correctIndex = letterIndex;
            }

        }

    }

    const feedback =
        document.getElementById("feedback");

    if (selectedIndex === correctIndex) {

        score++;

        if (feedback) {
            feedback.innerHTML =
                "<p>✅ Correct!</p>";
        }

    }
    else {

        if (feedback) {

            feedback.innerHTML =
                "<p>❌ Incorrect!</p>";

        }

    }

    setTimeout(function () {

        currentQuestionIndex++;

        if (
            currentQuestionIndex <
            currentQuestions.length
        ) {

            showMockTest();

        }
        else {

            showResult();

        }

    }, 800);

}


// ===============================
// RESULT
// ===============================

function showResult() {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    const total =
        currentQuestions.length;

    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

    let testName = selectedExam;

    if (
        selectedExam === "SSC" &&
        selectedPart
    ) {

        testName =
            "SSC - " +
            selectedPart.replace(
                "part",
                "Part "
            );

    }

    container.innerHTML = `

        <div class="result-box">

            <h2>
                🎉 Test Complete!
            </h2>

            <p>
                Exam:
                ${escapeHTML(testName)}
            </p>

            <h3>
                Score:
                ${score} / ${total}
            </h3>

            <h3>
                Percentage:
                ${percentage}%
            </h3>

            <button
                type="button"
                onclick="restartMockTest()"
            >
                🔄 Try Again
            </button>

            <button
                type="button"
                onclick="showExamButtons()"
            >
                📚 Choose Exam
            </button>

        </div>

    `;

}


// ===============================
// SHOW EXAM BUTTONS
// ===============================

function showExamButtons() {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    container.innerHTML = `

        <p>
            Select an exam to start your mock test.
        </p>

    `;

}


// ===============================
// RESTART
// ===============================

function restartMockTest() {

    if (
        selectedExam === "SSC" &&
        selectedPart
    ) {

        startSSCPart(selectedPart);
        return;

    }

    if (selectedExam) {

        startMockTest(selectedExam);
        return;

    }

}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// WEEKLY CURRENT AFFAIRS
// ===============================

function loadCurrentAffairs() {

    const box =
        document.getElementById(
            "currentAffairsBox"
        );

    if (!box) {
        return;
    }

    box.innerHTML = `

        <div class="current-affairs-content">

            <h3>
                📅 Weekly Current Affairs
            </h3>

            <p>
                <strong>
                    9 – 15 August 2026
                </strong>
            </p>

            <h3>
                🇮🇳 National Affairs
            </h3>

            <p>
                Important national events and
                government updates of the week.
            </p>

            <h3>
                🌍 International Affairs
            </h3>

            <p>
                Important international developments
                for competitive-exam revision.
            </p>

            <h3>
                💰 Economy & Banking
            </h3>

            <p>
                Important economy and banking updates
                for this week's revision.
            </p>

            <h3>
                🔬 Science & Technology
            </h3>

            <p>
                Important science and technology
                developments of the week.
            </p>

            <h3>
                🏆 Sports
            </h3>

            <p>
                Important national and international
                sports updates.
            </p>

            <h3>
                🏅 Awards & Appointments
            </h3>

            <p>
                Important awards and appointments
                for competitive exams.
            </p>

            <h3>
                🏛️ Government Schemes
            </h3>

            <p>
                Important government schemes,
                campaigns and announcements.
            </p>

        </div>

    `;

}


// ===============================
// DEBUG
// ===============================

console.log(
    "✅ Itta Study IQ script loaded successfully."
);
