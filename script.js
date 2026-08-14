// ===============================
// ITTA STUDY IQ - MAIN SCRIPT
// ===============================

// ===============================
// AI STUDY TUTOR
// ===============================

async function askTutor() {

    const questionBox = document.getElementById("question");
    const answerBox = document.getElementById("answer");

    if (!questionBox || !answerBox) {
        console.error("Question or Answer element not found.");
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
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        if (data.answer) {
            answerBox.innerText = data.answer;
        } else if (data.text) {
            answerBox.innerText = data.text;
        } else {
            answerBox.innerText = "Sorry, no answer received.";
        }

    } catch (error) {

        console.error("AI Tutor Error:", error);

        answerBox.innerText =
            "Something went wrong. Please try again.";
    }
}


// ===============================
// ENTER KEY FOR AI TUTOR
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
// MOCK TEST DATA
// ===============================

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedExam = "";


// ===============================
// START MOCK TEST
// ===============================

async function startMockTest(exam) {

    selectedExam = exam;
    currentQuestionIndex = 0;
    score = 0;

    try {

        let fileName = "";

        if (exam === "SSC") {
            fileName = "ssc_questions.json";
        }
        else if (exam === "UPSC") {
            fileName = "upsc_questions.json";
        }
        else if (exam === "Bank") {
            fileName = "bank_questions.json";
        }
        else if (exam === "WBP") {
            fileName = "wbp_questions.json";
        }
        else if (exam === "Kolkata Police") {
            fileName = "kolkata_police_questions.json";
        }
        else if (exam === "Railway") {
            fileName = "railway_questions.json";
        }
        else {
            alert("Exam not found.");
            return;
        }

        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error("Question file not found.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            alert("No questions found.");
            return;
        }

        currentQuestions = shuffleArray(data).slice(
            0,
            Math.min(10, data.length)
        );

        showMockTest();

    } catch (error) {

        console.error("Mock Test Error:", error);

        alert(
            "Question file load হচ্ছে না।\n\n" +
            "Check করো JSON file-এর নাম এবং location ঠিক আছে কিনা।"
        );

    }
}


// ===============================
// SHUFFLE QUESTIONS
// ===============================

function shuffleArray(array) {

    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [newArray[i], newArray[j]] =
            [newArray[j], newArray[i]];

    }

    return newArray;
}


// ===============================
// SHOW MOCK TEST
// ===============================

function showMockTest() {

    const container =
        document.getElementById("mockTest");

    if (!container) {
        console.error("mockTest element not found.");
        return;
    }

    container.innerHTML = "";

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

    let html = "";

    html += `
        <div class="mock-question">

            <h3>
                Question ${currentQuestionIndex + 1}
                / ${currentQuestions.length}
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
                onclick="selectAnswer(${index})">

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

    if (!question) return;

    const correctAnswer =
        question.answer ??
        question.correctAnswer ??
        question.correct ??
        question.correct_option;

    const options =
        question.options ||
        question.answers ||
        [];

    const buttons =
        document.querySelectorAll(".option-btn");

    buttons.forEach(function (button) {

        button.disabled = true;

    });

    const feedback =
        document.getElementById("feedback");

    let correctIndex = -1;

    if (typeof correctAnswer === "number") {

        correctIndex = correctAnswer;

    }
    else if (typeof correctAnswer === "string") {

        correctIndex =
            options.findIndex(function (option) {

                return String(option).trim().toLowerCase() ===
                    correctAnswer.trim().toLowerCase();

            });

        if (correctIndex === -1) {

            const letters = ["A", "B", "C", "D"];

            correctIndex =
                letters.indexOf(
                    correctAnswer.trim().toUpperCase()
                );

        }

    }

    if (selectedIndex === correctIndex) {

        score++;

        if (feedback) {
            feedback.innerHTML =
                "<p>✅ Correct!</p>";
        }

    } else {

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

        } else {

            showResult();

        }

    }, 900);
}


// ===============================
// RESULT
// ===============================

function showResult() {

    const container =
        document.getElementById("mockTest");

    if (!container) return;

    const total =
        currentQuestions.length;

    const percentage =
        total > 0
            ? Math.round((score / total) * 100)
            : 0;

    container.innerHTML = `

        <div class="result-box">

            <h2>🎉 Test Complete!</h2>

            <p>
                Exam: ${escapeHTML(selectedExam)}
            </p>

            <h3>
                Score: ${score} / ${total}
            </h3>

            <h3>
                Percentage: ${percentage}%
            </h3>

            <button
                type="button"
                onclick="restartMockTest()">

                🔄 Try Again

            </button>

        </div>

    `;
}


// ===============================
// RESTART TEST
// ===============================

function restartMockTest() {

    if (!selectedExam) return;

    startMockTest(selectedExam);

}


// ===============================
// HTML ESCAPE
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
// SAFE BUTTON CONNECTION
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // AI Tutor button
    const tutorButton =
        document.getElementById("askButton");

    if (tutorButton) {

        tutorButton.onclick = function () {
            askTutor();
        };

    }


    // SSC
    const sscButton =
        document.getElementById("sscButton");

    if (sscButton) {
        sscButton.onclick = function () {
            startMockTest("SSC");
        };
    }


    // UPSC
    const upscButton =
        document.getElementById("upscButton");

    if (upscButton) {
        upscButton.onclick = function () {
            startMockTest("UPSC");
        };
    }


    // Bank
    const bankButton =
        document.getElementById("bankButton");

    if (bankButton) {
        bankButton.onclick = function () {
            startMockTest("Bank");
        };
    }


    // WBP
    const wbpButton =
        document.getElementById("wbpButton");

    if (wbpButton) {
        wbpButton.onclick = function () {
            startMockTest("WBP");
        };
    }


    // Kolkata Police
    const kpButton =
        document.getElementById("kolkataPoliceButton");

    if (kpButton) {
        kpButton.onclick = function () {
            startMockTest("Kolkata Police");
        };
    }


    // Railway
    const railwayButton =
        document.getElementById("railwayButton");

    if (railwayButton) {
        railwayButton.onclick = function () {
            startMockTest("Railway");
        };
    }

});
