"use strict";

/* =====================================================
   ITTA STUDY IQ - COMPLETE SCRIPT
   SSC / UPSC / BANK / WBP / KOLKATA POLICE / RAILWAY
   FREE PART 1-20 + PREMIUM PART 21-100
   AUTOMATIC NEXT QUESTION
   LIVE TIMER
   RESULT SYSTEM
   AI TUTOR + MICROPHONE + QUIZ
===================================================== */

window.ITTAStudyIQ = window.ITTAStudyIQ || {};

/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

let selectedExam = "";
let selectedPart = "";

let answerLocked = false;

let testStartTime = null;
let testEndTime = null;

let testTimerInterval = null;
let autoNextTimer = null;

/* =====================================================
   SETTINGS
===================================================== */

const QUESTIONS_PER_TEST = 10;
const AUTO_NEXT_DELAY = 1200;

const FREE_PART_START = 1;
const FREE_PART_END = 20;

const PAID_PART_START = 21;
const PAID_PART_END = 100;

/* =====================================================
   EXAM FILES
===================================================== */

const examFiles = {
    SSC: "ssc_questions.json",
    UPSC: "upsc_questions.json",
    BANK: "bank_questions.json",
    WBP: "wbp_questions.json",
    KOLKATA_POLICE: "kolkata_police_questions.json",
    RAILWAY: "railway_questions.json"
};

/* =====================================================
   EXAM NAMES
===================================================== */

const examPartNames = {
    SSC: "SSC",
    UPSC: "UPSC",
    BANK: "Bank",
    WBP: "WBP",
    KOLKATA_POLICE: "Kolkata Police",
    RAILWAY: "Railway"
};

/* =====================================================
   PAGE READY
===================================================== */

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

                    if (
                        typeof askTutor === "function"
                    ) {
                        askTutor();
                    }

                }

            }
        );

    }

});

/* =====================================================
   AI STUDY TUTOR
===================================================== */

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
                    "Content-Type":
                        "application/json"
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

/* =====================================================
   MICROPHONE
===================================================== */

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

/* =====================================================
   QUICK QUIZ
===================================================== */

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

            <button
                type="button"
                class="exam-btn"
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

/* =====================================================
   START MOCK TEST
===================================================== */

function startMockTest(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = "";

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    answerLocked = false;

    testStartTime = null;
    testEndTime = null;

    showExamParts(exam);

}

/* =====================================================
   SHOW FREE + PAID PARTS
===================================================== */

function showExamParts(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = "";

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        console.error("mockTestBox not found");
        return;
    }

    const examName =
        examPartNames[exam] || exam;

    let freeButtonsHTML = "";

    for (
        let i = FREE_PART_START;
        i <= FREE_PART_END;
        i++
    ) {

        freeButtonsHTML += `
            <button
                type="button"
                class="exam-btn part-btn"
                onclick="selectExamPart('${exam}', 'part${i}')"
            >
                🆓 Part ${i}
            </button>
        `;

    }

    container.innerHTML = `

        <div class="exam-parts">

            <h3>
                📚 ${escapeHTML(examName)}
            </h3>

            <p>
                Select a Mock Test
            </p>

            <div class="free-section">

                <h4>
                    🆓 Free Mock Tests
                </h4>

                <p>
                    Part 1 - 20
                </p>

                <div class="exam-grid">
                    ${freeButtonsHTML}
                </div>

            </div>

            <div class="paid-section">

                <h4>
                    🔒 Premium Mock Tests
                </h4>

                <p>
                    Advanced questions from Part 21 onward.
                </p>

                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="showPaidParts('${exam}')"
                >
                    🔒 Open Premium Parts
                </button>

            </div>

        </div>
    `;

}

/* =====================================================
   PAID PARTS
===================================================== */

function showPaidParts(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

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

    for (
        let i = PAID_PART_START;
        i <= PAID_PART_END;
        i++
    ) {

        buttonsHTML += `
            <button
                type="button"
                class="exam-btn part-btn paid-part-btn"
                onclick="openPaidPart('${exam}', 'part${i}')"
            >
                🔒 Part ${i}
            </button>
        `;

    }

    container.innerHTML = `

        <div class="exam-parts paid-parts-section">

            <h3>
                🔒 ${escapeHTML(examName)} Premium
            </h3>

            <p>
                Premium Mock Tests
            </p>

            <div class="premium-info">

                <strong>
                    ⭐ Premium Question Bank
                </strong>

                <p>
                    Free Parts 1–20 are available.
                    Premium Parts contain advanced practice questions.
                </p>

                <button
                    type="button"
                    class="exam-btn"
                    onclick="showPaymentMessage('${exam}')"
                >
                    💳 Unlock Premium
                </button>

            </div>

            <div class="exam-grid">
                ${buttonsHTML}
            </div>

            <button
                type="button"
                class="exam-btn"
                onclick="showExamParts('${exam}')"
            >
                🔙 Back to Free Parts
            </button>

        </div>
    `;

}

/* =====================================================
   PAID PART OPEN
===================================================== */

function openPaidPart(exam, partName) {

    /*
       IMPORTANT:
       Real payment verification will be connected
       server-side later.

       Until verified payment is connected,
       premium parts remain locked.
    */

    showPaymentMessage(
        exam,
        partName
    );

}

/* =====================================================
   PAYMENT SCREEN
===================================================== */

function showPaymentMessage(
    exam,
    partName = ""
) {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {
        return;
    }

    const examName =
        examPartNames[exam] || exam;

    const partText =
        partName
            ? "Part " +
              String(partName)
                  .replace("part", "")
            : "Premium Parts";

    container.innerHTML = `

        <div class="result-box">

            <div style="
                font-size:42px;
                text-align:center;
            ">
                🔒
            </div>

            <h2>
                ${escapeHTML(examName)} Premium
            </h2>

            <h3>
                ${escapeHTML(partText)}
            </h3>

            <p>
                This premium section is locked.
            </p>

            <p>
                Complete the payment to unlock
                premium questions.
            </p>

            <div class="premium-payment-note">

                💳 Payment Gateway

                <br>

                <small>
                    Payment integration will be
                    connected here.
                </small>

            </div>

            <div class="result-buttons">

                <button
                    type="button"
                    class="exam-btn"
                    onclick="showPaidParts('${exam}')"
                >
                    🔒 Premium Parts
                </button>

                <button
                    type="button"
                    class="exam-btn"
                    onclick="showExamParts('${exam}')"
                >
                    🆓 Free Parts 1–20
                </button>

            </div>

        </div>
    `;

}

/* =====================================================
   SELECT FREE EXAM PART
===================================================== */

async function selectExamPart(
    exam,
    partName
) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = partName;

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    answerLocked = false;

    testStartTime = null;
    testEndTime = null;

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
                        - Part
                        ${escapeHTML(partNumber)}
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
            shuffleArray(
                questions
            ).slice(
                0,
                Math.min(
                    QUESTIONS_PER_TEST,
                    questions.length
                )
            );

        currentQuestionIndex = 0;
        score = 0;
        answerLocked = false;

        testStartTime = Date.now();
        testEndTime = null;

        startLiveTimer();

        showMockTest();

    }

    catch (error) {

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
                    - Part
                    ${escapeHTML(partNumber)}
                    এর JSON file load করা যায়নি।
                </p>

                <p>
                    File:
                    <strong>
                        ${escapeHTML(
                            examFiles[exam] ||
                            "Unknown"
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

/* =====================================================
   LOAD JSON PART
===================================================== */

async function loadExamPart(
    exam,
    partName
) {

    const file =
        examFiles[exam];

    if (!file) {

        throw new Error(
            "No JSON file configured for " +
            exam
        );

    }

    const response =
        await fetch(
            file +
            "?v=" +
            Date.now()
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

    const number =
        String(partName)
            .replace(/^part/i, "");

    const keys = [
        partName,
        String(partName).toLowerCase(),
        "Part" + number,
        "PART" + number,
        number
    ];

    /* FORMAT 1 */

    for (const key of keys) {

        if (
            data &&
            Array.isArray(data[key])
        ) {

            return normalizeQuestions(
                data[key]
            );

        }

    }

    /* FORMAT 2 */

    if (
        data &&
        data.parts &&
        !Array.isArray(data.parts)
    ) {

        for (const key of keys) {

            if (
                Array.isArray(
                    data.parts[key]
                )
            ) {

                return normalizeQuestions(
                    data.parts[key]
                );

            }

        }

    }

    /* FORMAT 3 */

    for (const key of keys) {

        if (
            data &&
            data[key] &&
            Array.isArray(
                data[key].questions
            )
        ) {

            return normalizeQuestions(
                data[key].questions
            );

        }

    }

    /* FORMAT 4 */

    if (
        data &&
        Array.isArray(data.parts)
    ) {

        const foundPart =
            data.parts.find(
                function (item) {

                    if (!item) {
                        return false;
                    }

                    return (
                        item.part === partName ||
                        item.name === partName ||
                        String(item.part)
                            .toLowerCase()
                            === String(partName)
                                .toLowerCase() ||
                        String(item.name)
                            .toLowerCase()
                            === String(partName)
                                .toLowerCase()
                    );

                }
            );

        if (
            foundPart &&
            Array.isArray(
                foundPart.questions
            )
        ) {

            return normalizeQuestions(
                foundPart.questions
            );

        }

    }

    return [];

}

/* =====================================================
   NORMALIZE QUESTIONS
===================================================== */

function normalizeQuestions(
    questions
) {

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

            normalized.answer =
                question.answer ??
                question.correctAnswer ??
                question.correct ??
                question.correct_option ??
                question.correctOption ??
                question.answerIndex ??
                question.correctIndex ??
                question.correct_answer;

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

/* =====================================================
   SHUFFLE
===================================================== */

function shuffleArray(array) {

    const result = [...array];

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
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;

}

/* =====================================================
   SHOW MOCK QUESTION
===================================================== */

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
        examPartNames[
            selectedExam
        ] ||
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
                - Part
                ${escapeHTML(partNumber)}
            </h3>

            <div
                id="liveTestTimer"
                class="live-test-timer"
                style="
                    text-align:center;
                    font-size:18px;
                    font-weight:700;
                    margin:12px 0;
                    padding:10px;
                    border-radius:12px;
                    background:#eef4ff;
                "
            >
                ⏱️ Time: 0 sec
            </div>

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

    container.innerHTML = html;

    updateLiveTimer();

}

/* =====================================================
   SELECT ANSWER
===================================================== */

function selectAnswer(
    selectedIndex
) {

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
        question.correctIndex ??
        question.correct_answer;

    const correctIndex =
        findCorrectIndex(
            correctAnswer,
            options
        );

    const buttons =
        document.querySelectorAll(
            ".option-btn"
        );

    buttons.forEach(
        function (button) {
            button.disabled = true;
        }
    );

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

    }

    else {

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
                String(
                    options[correctIndex]
                ),
                false
            );

        }

        else {

            showFeedback(
                "feedback",
                "⚠️ Correct answer could not be identified.",
                false
            );

        }

    }

    clearAutoNextTimer();

    autoNextTimer =
        setTimeout(
            function () {

                autoNextTimer = null;

                if (
                    currentQuestionIndex <
                    currentQuestions.length - 1
                ) {

                    currentQuestionIndex++;

                    answerLocked = false;

                    showMockTest();

                }

                else {

                    showResult();

                }

            },
            AUTO_NEXT_DELAY
        );

}

/* =====================================================
   FIND CORRECT ANSWER
===================================================== */

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

    if (
        typeof correctAnswer === "number"
    ) {

        if (
            correctAnswer >= 0 &&
            correctAnswer < options.length
        ) {

            return correctAnswer;

        }

        if (
            correctAnswer >= 1 &&
            correctAnswer <= options.length
        ) {

            return correctAnswer - 1;

        }

    }

    if (
        typeof correctAnswer === "string"
    ) {

        const answer =
            correctAnswer
                .trim()
                .toLowerCase();

        if (
            /^[a-z]$/.test(answer)
        ) {

            const index =
                answer.charCodeAt(0) -
                "a".charCodeAt(0);

            if (
                index >= 0 &&
                index < options.length
            ) {

                return index;

            }

        }

        if (
            /^\d+$/.test(answer)
        ) {

            const number =
                parseInt(
                    answer,
                    10
                );

            if (
                number >= 1 &&
                number <= options.length
            ) {

                return number - 1;

            }

        }

        const directIndex =
            options.findIndex(
                function (option) {

                    return (
                        String(option)
                            .trim()
                            .toLowerCase()
                        === answer
                    );

                }
            );

        if (directIndex !== -1) {
            return directIndex;
        }

        const partialIndex =
            options.findIndex(
                function (option) {

                    const optionText =
                        String(option)
                            .trim()
                            .toLowerCase();

                    return (
                        optionText.includes(answer) ||
                        answer.includes(optionText)
                    );

                }
            );

        if (partialIndex !== -1) {
            return partialIndex;
        }

    }

    return -1;

}

/* =====================================================
   FEEDBACK
===================================================== */

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

        <div
            class="answer-feedback ${
                isCorrect
                    ? "correct-feedback"
                    : "wrong-feedback"
            }"
        >
            ${escapeHTML(message)}
        </div>

    `;

}

/* =====================================================
   LIVE TIMER
===================================================== */

function startLiveTimer() {

    stopLiveTimer();

    updateLiveTimer();

    testTimerInterval =
        setInterval(
            updateLiveTimer,
            1000
        );

}

function updateLiveTimer() {

    if (!testStartTime) {
        return;
    }

    const elapsed =
        Date.now() -
        testStartTime;

    const timer =
        document.getElementById(
            "liveTestTimer"
        );

    if (timer) {

        timer.innerText =
            "⏱️ Time: " +
            formatTime(elapsed);

    }

}

function stopLiveTimer() {

    if (testTimerInterval) {

        clearInterval(
            testTimerInterval
        );

        testTimerInterval = null;

    }

}

function clearAutoNextTimer() {

    if (autoNextTimer) {

        clearTimeout(
            autoNextTimer
        );

        autoNextTimer = null;

    }

}

/* =====================================================
   SHOW RESULT
===================================================== */

function showResult() {

    stopLiveTimer();
    clearAutoNextTimer();

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }

    testEndTime = Date.now();

    let elapsedTime = 0;

    if (testStartTime) {

        elapsedTime =
            testEndTime -
            testStartTime;

    }

    const timeTaken =
        formatTime(elapsedTime);

    const total =
        currentQuestions.length;

    const percentage =
        total > 0
            ? Math.round(
                (score / total) *
                100
            )
            : 0;

    let message;

    if (percentage >= 80) {

        message =
            "🌟 Excellent! Great job!";

    }

    else if (percentage >= 60) {

        message =
            "👏 Very good! Keep studying.";

    }

    else if (percentage >= 40) {

        message =
            "👍 Good effort! Practice more.";

    }

    else {

        message =
            "📚 Keep practicing. You can improve!";

    }

    const examName =
        examPartNames[
            selectedExam
        ] ||
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
                - Part
                ${escapeHTML(partNumber)}
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

            <div class="time-result">

                <h3>
                    ⏱️ Total Time Taken
                </h3>

                <h2>
                    ${escapeHTML(timeTaken)}
                </h2>

            </div>

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

/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(milliseconds) {

    const totalSeconds =
        Math.floor(
            milliseconds / 1000
        );

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    if (hours > 0) {

        return (
            hours +
            " hr " +
            minutes +
            " min " +
            seconds +
            " sec"
        );

    }

    if (minutes > 0) {

        return (
            minutes +
            " min " +
            seconds +
            " sec"
        );

    }

    return seconds + " sec";

}

/* =====================================================
   RESTART SAME TEST
===================================================== */

function restartMockTest() {

    stopLiveTimer();
    clearAutoNextTimer();

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

/* =====================================================
   CHOOSE EXAM AGAIN
===================================================== */

function chooseExamAgain() {

    stopLiveTimer();
    clearAutoNextTimer();

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    selectedExam = "";
    selectedPart = "";

    answerLocked = false;

    testStartTime = null;
    testEndTime = null;

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

/* =====================================================
   ESCAPE HTML
===================================================== */

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

/* =====================================================
   GLOBAL FUNCTIONS
   IMPORTANT FOR HTML onclick
===================================================== */

window.askTutor = askTutor;
window.startMic = startMic;

window.startQuiz = startQuiz;
window.closeQuiz = closeQuiz;

window.startMockTest = startMockTest;

window.showExamParts =
    showExamParts;

window.selectExamPart =
    selectExamPart;

window.selectAnswer =
    selectAnswer;

window.showResult =
    showResult;

window.restartMockTest =
    restartMockTest;

window.chooseExamAgain =
    chooseExamAgain;

window.startLiveTimer =
    startLiveTimer;

window.stopLiveTimer =
    stopLiveTimer;

window.clearAutoNextTimer =
    clearAutoNextTimer;

window.showPaidParts =
    showPaidParts;

window.openPaidPart =
    openPaidPart;

window.showPaymentMessage =
    showPaymentMessage;

window.ITTAStudyIQ.ready = true;

console.log(
    "🚀 ITTA Study IQ Loaded Successfully"
);

console.log(
    "📚 Free Parts 1-20: READY"
);

console.log(
    "🔒 Premium Parts 21-100: READY"
);

console.log(
    "🧠 Questions: READY"
);

console.log(
    "⏱️ Live Timer: READY"
);

console.log(
    "➡️ Automatic Next Question: READY"
);

console.log(
    "🏆 Result System: READY"
);
