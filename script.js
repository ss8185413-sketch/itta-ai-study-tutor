"use strict";

// =====================================================
// ITTA STUDY IQ - COMPLETE MAIN SCRIPT
// =====================================================

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedExam = "";
let selectedPart = "";
let answerLocked = false;


// =====================================================
// EXAM PART SYSTEM
// =====================================================

const examPartNames = {
    "SSC": "SSC",
    "UPSC": "UPSC",
    "BANK": "Bank",
    "WBP": "WBP",
    "KOLKATA_POLICE": "Kolkata Police",
    "RAILWAY": "Railway"
};


// =====================================================
// PAGE READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ ITTA Study IQ Script Loaded");

    const questionBox =
        document.getElementById("question");

    if (questionBox) {

        questionBox.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    askTutor();
                }

            }
        );
    }

});


// =====================================================
// AI STUDY TUTOR
// =====================================================

async function askTutor() {

    const questionBox =
        document.getElementById("question");

    const answerBox =
        document.getElementById("answer");

    if (!questionBox || !answerBox) {
        return;
    }

    const question =
        questionBox.value.trim();

    if (!question) {

        answerBox.innerText =
            "Please type a question first.";

        return;
    }

    answerBox.innerText =
        "Thinking... ✨";

    try {

        const response =
            await fetch("/ask", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })

            });

        if (!response.ok) {

            throw new Error(
                "Server Error: " +
                response.status
            );
        }

        const data =
            await response.json();

        if (data.answer) {

            answerBox.innerText =
                data.answer;

        }

        else if (data.text) {

            answerBox.innerText =
                data.text;

        }

        else {

            answerBox.innerText =
                "Sorry, no answer received.";

        }

    }

    catch (error) {

        console.error(
            "AI Tutor Error:",
            error
        );

        answerBox.innerText =
            "AI Tutor is temporarily unavailable. Please try again.";

    }

}


// =====================================================
// MICROPHONE
// =====================================================

function startMic() {

    const questionBox =
        document.getElementById("question");

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

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.continuous = false;


    recognition.onstart = function () {

        questionBox.placeholder =
            "Listening...";

    };


    recognition.onresult = function (event) {

        questionBox.value =
            event.results[0][0].transcript;

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

        console.error(
            "Microphone Start Error:",
            error
        );

    }

}


// =====================================================
// STUDY QUIZ
// =====================================================

function startQuiz() {

    const quizBox =
        document.getElementById("quizBox");

    if (!quizBox) {
        return;
    }

    quizBox.innerHTML = `

        <div class="quiz-content">

            <h3>🧠 Quick Study Quiz</h3>

            <p>
                Your quiz system is ready.
            </p>

            <p>
                📚 You can add quiz questions here later.
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

    const quizBox =
        document.getElementById("quizBox");

    if (quizBox) {

        quizBox.innerHTML = "";

    }

}


// =====================================================
// START MOCK TEST
// =====================================================

function startMockTest(exam) {

    selectedExam = exam;

    selectedPart = "";

    currentQuestions = [];

    currentQuestionIndex = 0;

    score = 0;

    answerLocked = false;

    // এখন সব Exam-এ শুধু Part দেখাবে
    showExamParts(exam);
}


// =====================================================
// SHOW PART 1 - 20
// =====================================================

function showExamParts(exam) {

    selectedExam = exam;

    selectedPart = "";

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    const examName =
        examPartNames[exam] || exam;

    let buttonsHTML = "";


    for (let i = 1; i <= 20; i++) {

        buttonsHTML += `

            <button
                type="button"
                class="exam-btn part-btn"
                onclick="selectExamPart('${exam}', 'part${i}')"
            >
                📖 Part ${i}
            </button>

        `;
    }


    container.innerHTML = `

        <div class="exam-parts">

            <h3>
                📚 ${escapeHTML(examName)}
            </h3>

            <p>
                Select Part 1 - 20
            </p>

            <div class="exam-grid">

                ${buttonsHTML}

            </div>

        </div>

    `;

}


// =====================================================
// SELECT PART
// =====================================================

function selectExamPart(
    exam,
    partName
) {

    selectedExam = exam;

    selectedPart = partName;

    currentQuestions = [];

    currentQuestionIndex = 0;

    score = 0;

    answerLocked = false;


    console.log(
        "Selected Exam:",
        selectedExam
    );

    console.log(
        "Selected Part:",
        selectedPart
    );


    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }


    const examName =
        examPartNames[exam] || exam;

    const partNumber =
        partName.replace(
            "part",
            ""
        );


    container.innerHTML = `

        <div class="result-box">

            <h3>
                📚 ${escapeHTML(examName)}
            </h3>

            <h4>
                Part ${partNumber}
            </h4>

            <p>
                ✅ Part selected successfully.
            </p>

            <p>
                Questions will be added here later.
            </p>

            <button
                type="button"
                class="exam-btn"
                onclick="showExamParts('${exam}')"
            >
                🔙 Back to Parts
            </button>

        </div>

    `;

}


// =====================================================
// SHUFFLE ARRAY
// =====================================================

function shuffleArray(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


// =====================================================
// SHOW MOCK QUESTION
// =====================================================

function showMockTest() {

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }


    answerLocked = false;


    const question =
        currentQuestions[
            currentQuestionIndex
        ];


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


    if (
        !Array.isArray(options) ||
        options.length === 0
    ) {

        container.innerHTML = `

            <div class="result-box">

                <h3>
                    ⚠️ Question Error
                </h3>

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


    options.forEach(
        function (option, index) {

            html += `

                <button
                    type="button"
                    class="option-btn"
                    onclick="selectAnswer(${index})"
                >
                    ${escapeHTML(
                        String(option)
                    )}
                </button>

            `;

        }
    );


    html += `

            </div>

            <div id="feedback"></div>

        </div>

    `;


    container.innerHTML =
        html;

}


// =====================================================
// SELECT ANSWER
// =====================================================

function selectAnswer(
    selectedIndex
) {

    if (answerLocked) {
        return;
    }

    answerLocked = true;


    const question =
        currentQuestions[
            currentQuestionIndex
        ];


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


    document
        .querySelectorAll(
            ".option-btn"
        )
        .forEach(
            function (button) {

                button.disabled = true;

            }
        );


    let correctIndex = -1;


    // NUMBER ANSWER

    if (
        typeof correctAnswer === "number"
    ) {

        if (
            correctAnswer >= 0 &&
            correctAnswer < options.length
        ) {

            correctIndex =
                correctAnswer;

        }

        else if (
            correctAnswer >= 1 &&
            correctAnswer <= options.length
        ) {

            correctIndex =
                correctAnswer - 1;

        }

    }


    // TEXT ANSWER

    else if (
        typeof correctAnswer === "string"
    ) {

        const answer =
            correctAnswer
                .trim()
                .toLowerCase();


        correctIndex =
            options.findIndex(
                function (option) {

                    return (
                        String(option)
                            .trim()
                            .toLowerCase()
                        ===
                        answer
                    );

                }
            );


        if (correctIndex === -1) {

            const letters = [
                "a",
                "b",
                "c",
                "d"
            ];


            const letterIndex =
                letters.indexOf(
                    answer
                );


            if (
                letterIndex !== -1
            ) {

                correctIndex =
                    letterIndex;

            }

        }

    }


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (
        selectedIndex === correctIndex
    ) {

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


    setTimeout(
        function () {

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

        },
        800
    );

}


// =====================================================
// SHOW RESULT
// =====================================================

function showResult() {

    const container =
        document.getElementById(
            "mockTestBox"
        );

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


    let testName =
        selectedExam;


    if (
        selectedPart
    ) {

        const examName =
            examPartNames[
                selectedExam
            ] || selectedExam;


        const partNumber =
            selectedPart.replace(
                "part",
                ""
            );


        testName =
            examName +
            " - Part " +
            partNumber;

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
                onclick="chooseExamAgain()"
            >
                📚 Choose Exam
            </button>

        </div>

    `;

}


// =====================================================
// CHOOSE EXAM AGAIN
// =====================================================

function chooseExamAgain() {

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <p>
            👆 Select an exam above to start again.
        </p>

    `;


    container.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================================
// RESTART MOCK TEST
// =====================================================

function restartMockTest() {

    if (
        selectedExam &&
        selectedPart
    ) {

        showExamParts(
            selectedExam
        );

        return;

    }


    if (selectedExam) {

        showExamParts(
            selectedExam
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// WEEKLY CURRENT AFFAIRS
// =====================================================

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
                Important national affairs
                and government updates of the week.
            </p>

            <p>
                📝 Weekly Current Affairs
                questions will be added here.
            </p>

        </div>

    `;

                }
