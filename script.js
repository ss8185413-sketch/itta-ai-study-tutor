"use strict";

// =====================================================
// ITTA STUDY IQ - COMPLETE MAIN SCRIPT
// SSC / UPSC / BANK / WBP / KOLKATA POLICE / RAILWAY
// PART 1-20 JSON QUESTION SYSTEM
// =====================================================

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedExam = "";
let selectedPart = "";
let answerLocked = false;

const QUESTIONS_PER_TEST = 10;


// =====================================================
// EXAM FILES
// =====================================================

const examFiles = {
    SSC: "ssc_questions.json",
    UPSC: "upsc_questions.json",
    BANK: "bank_questions.json",
    WBP: "wbp_questions.json",
    KOLKATA_POLICE: "kolkata_police_questions.json",
    RAILWAY: "railway_questions.json"
};


// =====================================================
// EXAM NAMES
// =====================================================

const examPartNames = {
    SSC: "SSC",
    UPSC: "UPSC",
    BANK: "Bank",
    WBP: "WBP",
    KOLKATA_POLICE: "Kolkata Police",
    RAILWAY: "Railway"
};


// =====================================================
// PAGE READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ ITTA Study IQ Script Loaded");

    const questionBox =
        document.getElementById("question");

    if (questionBox) {

        questionBox.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                if (typeof askTutor === "function") {
                    askTutor();
                }

            }

        });

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
                "Server Error: " + response.status
            );

        }

        const data =
            await response.json();

        if (data.answer) {

            answerBox.innerText =
                data.answer;

        } else if (data.text) {

            answerBox.innerText =
                data.text;

        } else {

            answerBox.innerText =
                "Sorry, no answer received.";

        }

    } catch (error) {

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

    } catch (error) {

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

            <p>Your quiz system is ready.</p>

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

    showExamParts(exam);

}


// =====================================================
// SHOW PART 1-20
// =====================================================

function showExamParts(exam) {

    selectedExam = exam;
    selectedPart = "";

    const container =
        document.getElementById("mockTestBox");

    if (!container) {

        console.error(
            "mockTestBox not found"
        );

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
// SELECT EXAM PART
// =====================================================

async function selectExamPart(exam, partName) {

    selectedExam = exam;
    selectedPart = partName;

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    answerLocked = false;

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    const examName =
        examPartNames[exam] || exam;

    const partNumber =
        partName.replace("part", "");

    container.innerHTML = `

        <div class="result-box">

            <h3>
                📚 ${escapeHTML(examName)}
            </h3>

            <h4>
                Part ${escapeHTML(partNumber)}
            </h4>

            <p>
                ⏳ Loading questions...
            </p>

        </div>

    `;

    try {

        const questions =
            await loadExamPart(
                exam,
                partName
            );

        if (
            !Array.isArray(questions) ||
            questions.length === 0
        ) {

            container.innerHTML = `

                <div class="result-box">

                    <h3>
                        ⚠️ No Questions Found
                    </h3>

                    <p>
                        ${escapeHTML(examName)}
                        - Part ${escapeHTML(partNumber)}
                        এ এখনো questions যোগ করা হয়নি।
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

            return;
        }

        currentQuestions =
            shuffleArray(questions).slice(
                0,
                Math.min(
                    QUESTIONS_PER_TEST,
                    questions.length
                )
            );

        currentQuestionIndex = 0;
        score = 0;
        answerLocked = false;

        console.log(
            "Loaded:",
            currentQuestions.length,
            "questions"
        );

        showMockTest();

    } catch (error) {

        console.error(
            "Question Loading Error:",
            error
        );

        container.innerHTML = `

            <div class="result-box">

                <h3>
                    ❌ Question Loading Error
                </h3>

                <p>
                    ${escapeHTML(examName)}
                    - Part ${escapeHTML(partNumber)}
                    এর JSON file load করা যায়নি।
                </p>

                <p>
                    File:
                    <strong>
                        ${escapeHTML(
                            examFiles[exam] || "Unknown"
                        )}
                    </strong>
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

}


// =====================================================
// LOAD EXAM PART FROM JSON
// =====================================================

async function loadExamPart(exam, partName) {

    const file =
        examFiles[exam];

    if (!file) {

        throw new Error(
            "No JSON file configured for " + exam
        );

    }

    const response =
        await fetch(
            file + "?v=" + Date.now()
        );

    if (!response.ok) {

        throw new Error(
            "Could not load " +
            file +
            " (" +
            response.status +
            ")"
        );

    }

    const data =
        await response.json();

    console.log(
        "JSON loaded:",
        file
    );


    // -------------------------------------------------
    // FORMAT 1
    // {
    //   "part1": [...]
    // }
    // -------------------------------------------------

    if (
        data &&
        Array.isArray(data[partName])
    ) {

        return normalizeQuestions(
            data[partName]
        );

    }


    // -------------------------------------------------
    // FORMAT 2
    // {
    //   "parts": {
    //      "part1": [...]
    //   }
    // }
    // -------------------------------------------------

    if (
        data &&
        data.parts &&
        !Array.isArray(data.parts) &&
        Array.isArray(data.parts[partName])
    ) {

        return normalizeQuestions(
            data.parts[partName]
        );

    }


    // -------------------------------------------------
    // FORMAT 3
    // {
    //   "part1": {
    //      "questions": [...]
    //   }
    // }
    // -------------------------------------------------

    if (
        data &&
        data[partName] &&
        Array.isArray(data[partName].questions)
    ) {

        return normalizeQuestions(
            data[partName].questions
        );

    }


    // -------------------------------------------------
    // FORMAT 4
    // {
    //   "parts": [
    //      {
    //        "part": "part1",
    //        "questions": [...]
    //      }
    //   ]
    // }
    // -------------------------------------------------

    if (
        data &&
        Array.isArray(data.parts)
    ) {

        const foundPart =
            data.parts.find(function (item) {

                return (
                    item &&
                    (
                        item.part === partName ||
                        item.name === partName
                    )
                );

            });

        if (
            foundPart &&
            Array.isArray(foundPart.questions)
        ) {

            return normalizeQuestions(
                foundPart.questions
            );

        }

    }


    return [];

}


// =====================================================
// NORMALIZE QUESTIONS
// =====================================================

function normalizeQuestions(questions) {

    if (!Array.isArray(questions)) {
        return [];
    }

    return questions
        .filter(function (question) {

            return (
                question &&
                typeof question === "object"
            );

        })
        .map(function (question) {

            const normalized = {
                ...question
            };

            normalized.question =
                question.question ||
                question.questionText ||
                question.q ||
                question.text ||
                "";

            normalized.options =
                Array.isArray(question.options)
                    ? question.options
                    : (
                        Array.isArray(question.answers)
                            ? question.answers
                            : (
                                Array.isArray(question.choices)
                                    ? question.choices
                                    : []
                            )
                    );

            return normalized;

        })
        .filter(function (question) {

            return (
                question.question &&
                Array.isArray(question.options) &&
                question.options.length > 0
            );

        });

}


// =====================================================
// SHUFFLE ARRAY
// =====================================================

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

    const question =
        currentQuestions[
            currentQuestionIndex
        ];

    if (!question) {

        showResult();

        return;
    }

    answerLocked = false;

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
                    class="exam-btn"
                    onclick="restartMockTest()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

        return;
    }

    const examName =
        examPartNames[selectedExam] ||
        selectedExam;

    const partNumber =
        selectedPart.replace(
            "part",
            ""
        );

    let html = `

        <div class="mock-question">

            <h3>
                📚 ${escapeHTML(examName)}
                - Part ${escapeHTML(partNumber)}
            </h3>

            <h4>
                Question
                ${currentQuestionIndex + 1}
                /
                ${currentQuestions.length}
            </h4>

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

    container.innerHTML =
        html;

}


// =====================================================
// SELECT ANSWER
// =====================================================

function selectAnswer(selectedIndex) {

    if (answerLocked) {
        return;
    }

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

    if (
        selectedIndex < 0 ||
        selectedIndex >= options.length
    ) {
        return;
    }

    answerLocked = true;

    const correctAnswer =
        question.answer ??
        question.correctAnswer ??
        question.correct ??
        question.correct_option ??
        question.correctOption ??
        question.answerIndex ??
        question.correctIndex;

    let correctIndex = findCorrectIndex(
        correctAnswer,
        options
    );

    const buttons =
        document.querySelectorAll(
            ".option-btn"
        );

    buttons.forEach(function (button) {

        button.disabled = true;

    });


    // -------------------------------------------------
    // CHECK ANSWER
    // -------------------------------------------------

    const selectedButton =
        buttons[selectedIndex];

    const correctButton =
        buttons[correctIndex];


    if (
        correctIndex !== -1 &&
        selectedIndex === correctIndex
    ) {

        score++;

        if (selectedButton) {
            selectedButton.classList.add(
                "correct"
            );
        }

        showFeedback(
            "feedback",
            "✅ Correct!",
            true
        );

    } else {

        if (selectedButton) {
            selectedButton.classList.add(
                "wrong"
            );
        }

        if (correctButton) {
            correctButton.classList.add(
                "correct"
            );
        }

        if (correctIndex !== -1) {

            showFeedback(
                "feedback",
                "❌ Wrong! Correct answer: " +
                String(options[correctIndex]),
                false
            );

        } else {

            showFeedback(
                "feedback",
                "⚠️ Correct answer could not be identified.",
                false
            );

        }

    }


    // -------------------------------------------------
    // NEXT BUTTON
    // -------------------------------------------------

    const feedback =
        document.getElementById(
            "feedback"
        );

    if (feedback) {

        const nextButton =
            document.createElement("button");

        nextButton.type =
            "button";

        nextButton.className =
            "exam-btn next-btn";

        nextButton.innerText =
            currentQuestionIndex <
            currentQuestions.length - 1
                ? "➡️ Next Question"
                : "🏆 See Result";

        nextButton.onclick =
            function () {

                nextQuestion();

            };

        feedback.appendChild(
            nextButton
        );

    }

}


// =====================================================
// FIND CORRECT ANSWER INDEX
// =====================================================

function findCorrectIndex(
    correctAnswer,
    options
) {

    if (
        correctAnswer === null ||
        correctAnswer === undefined
    ) {

        return -1;

    }


    // -------------------------------------------------
    // NUMBER
    // -------------------------------------------------

    if (
        typeof correctAnswer === "number"
    ) {

        // Prefer 0-based if valid
        if (
            correctAnswer >= 0 &&
            correctAnswer < options.length
        ) {

            return correctAnswer;

        }

        // Otherwise treat as 1-based
        if (
            correctAnswer >= 1 &&
            correctAnswer <= options.length
        ) {

            return correctAnswer - 1;

        }

    }


    // -------------------------------------------------
    // STRING
    // -------------------------------------------------

    if (
        typeof correctAnswer === "string"
    ) {

        const answer =
            correctAnswer
                .trim()
                .toLowerCase();


        // A / B / C / D
        if (
            /^[a-z]$/.test(answer)
        ) {

            const letterIndex =
                answer.charCodeAt(0) -
                "a".charCodeAt(0);

            if (
                letterIndex >= 0 &&
                letterIndex < options.length
            ) {

                return letterIndex;

            }

        }


        // Numeric string
        if (
            /^\d+$/.test(answer)
        ) {

            const number =
                parseInt(answer, 10);

            if (
                number >= 0 &&
                number < options.length
            ) {

                return number;

            }

            if (
                number >= 1 &&
                number <= options.length
            ) {

                return number - 1;

            }

        }


        // Direct text match
        const directIndex =
            options.findIndex(function (option) {

                return (
                    String(option)
                        .trim()
                        .toLowerCase()
                    ===
                    answer
                );

            });

        if (directIndex !== -1) {

            return directIndex;

        }


        // Text contains match
        const containsIndex =
            options.findIndex(function (option) {

                const optionText =
                    String(option)
                        .trim()
                        .toLowerCase();

                return (
                    optionText.includes(answer) ||
                    answer.includes(optionText)
                );

            });

        if (containsIndex !== -1) {

            return containsIndex;

        }

    }


    return -1;

}


// =====================================================
// FEEDBACK
// =====================================================

function showFeedback(
    elementId,
    message,
    isCorrect
) {

    const feedback =
        document.getElementById(
            elementId
        );

    if (!feedback) {
        return;
    }

    feedback.innerHTML = `

        <div class="answer-feedback ${
            isCorrect
                ? "correct-feedback"
                : "wrong-feedback"
        }">

            ${escapeHTML(message)}

        </div>

    `;

}


// =====================================================
// NEXT QUESTION
// =====================================================

function nextQuestion() {

    if (
        currentQuestionIndex <
        currentQuestions.length - 1
    ) {

        currentQuestionIndex++;

        answerLocked = false;

        showMockTest();

    } else {

        showResult();

    }

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

    let message = "";

    if (percentage >= 80) {

        message =
            "🌟 Excellent! Great job!";

    } else if (percentage >= 60) {

        message =
            "👏 Very good! Keep studying.";

    } else if (percentage >= 40) {

        message =
            "👍 Good effort! Practice more.";

    } else {

        message =
            "📚 Keep practicing. You can improve!";

    }


    const examName =
        examPartNames[selectedExam] ||
        selectedExam;

    const partNumber =
        selectedPart.replace(
            "part",
            ""
        );


    container.innerHTML = `

        <div class="result-box">

            <h2>
                🏆 Test Complete
            </h2>

            <h3>
                ${escapeHTML(examName)}
                - Part ${escapeHTML(partNumber)}
            </h3>

            <div class="score-display">

                <h1>
                    ${score} / ${total}
                </h1>

                <h2>
                    ${percentage}%
                </h2>

            </div>

            <p>
                ${escapeHTML(message)}
            </p>

            <div class="result-buttons">

                <button
                    type="button"
                    class="exam-btn"
                    onclick="restartMockTest()"
                >
                    🔄 Try Again
                </button>

                <button
                    type="button"
                    class="exam-btn"
                    onclick="showExamParts('${selectedExam}')"
                >
                    📚 Choose Part
                </button>

                <button
                    type="button"
                    class="exam-btn"
                    onclick="chooseExamAgain()"
                >
                    🔙 Choose Exam
                </button>

            </div>

        </div>

    `;

}


// =====================================================
// RESTART SAME MOCK TEST
// =====================================================

function restartMockTest() {

    if (
        !selectedExam ||
        !selectedPart
    ) {

        return;

    }

    selectExamPart(
        selectedExam,
        selectedPart
    );

}


// =====================================================
// CHOOSE EXAM AGAIN
// =====================================================

function chooseExamAgain() {

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    selectedExam = "";
    selectedPart = "";
    answerLocked = false;

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="result-box">

            <h3>
                📚 Select Exam
            </h3>

            <p>
                Please choose an exam from the options above.
            </p>

        </div>

    `;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// GLOBAL EXPORT
// Ensures inline HTML onclick buttons work
// =====================================================

window.askTutor = askTutor;
window.startMic = startMic;

window.startQuiz = startQuiz;
window.closeQuiz = closeQuiz;

window.startMockTest = startMockTest;
window.showExamParts = showExamParts;
window.selectExamPart = selectExamPart;

window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;

window.showResult = showResult;
window.restartMockTest = restartMockTest;
window.chooseExamAgain = chooseExamAgain;


// =====================================================
// FINAL CHECK
// =====================================================

console.log(
    "🚀 ITTA Study IQ - All functions loaded successfully"
);
