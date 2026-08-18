"use strict";

// =====================================================
// ITTA STUDY IQ - COMPLETE MAIN SCRIPT
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
    "SSC": "ssc_questions.json",
    "UPSC": "upsc_questions.json",
    "BANK": "bank_questions.json",
    "WBP": "wbp_questions.json",
    "KOLKATA_POLICE": "kolkata_police_questions.json",
    "RAILWAY": "railway_questions.json"
};


// =====================================================
// EXAM NAMES
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

async function selectExamPart(
    exam,
    partName
) {

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
                Part ${partNumber}
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
                        - Part ${partNumber}
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


        // Shuffle questions
        const shuffledQuestions =
            shuffleArray(questions);


        // Take maximum 10 questions
        currentQuestions =
            shuffledQuestions.slice(
                0,
                Math.min(
                    QUESTIONS_PER_TEST,
                    shuffledQuestions.length
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
                    - Part ${partNumber}
                    এর JSON file load করা যায়নি।
                </p>

                <p>
                    File name:
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


    // ---------------------------------------------
    // Normal structure:
    // {
    //   "part1": [ ... ],
    //   "part2": [ ... ]
    // }
    // ---------------------------------------------

    if (
        Array.isArray(
            data[partName]
        )
    ) {

        return normalizeQuestions(
            data[partName]
        );

    }


    // ---------------------------------------------
    // Structure:
    // {
    //   "parts": {
    //      "part1": [...]
    //   }
    // }
    // ---------------------------------------------

    if (
        data.parts &&
        Array.isArray(
            data.parts[partName]
        )
    ) {

        return normalizeQuestions(
            data.parts[partName]
        );

    }


    // ---------------------------------------------
    // Structure:
    // {
    //   "part1": {
    //      "questions": [...]
    //   }
    // }
    // ---------------------------------------------

    if (
        data[partName] &&
        Array.isArray(
            data[partName].questions
        )
    ) {

        return normalizeQuestions(
            data[partName].questions
        );

    }


    // ---------------------------------------------
    // Structure:
    // {
    //   "parts": [
    //      {
    //        "part": "part1",
    //        "questions": [...]
    //      }
    //   ]
    // }
    // ---------------------------------------------

    if (Array.isArray(data.parts)) {

        const foundPart =
            data.parts.find(
                function (item) {

                    return (
                        item.part === partName ||
                        item.name === partName
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


// =====================================================
// NORMALIZE QUESTIONS
// =====================================================

function normalizeQuestions(
    questions
) {

    if (!Array.isArray(questions)) {
        return [];
    }


    return questions
        .filter(
            function (question) {

                return (
                    question &&
                    typeof question === "object"
                );

            }
        )
        .map(
            function (question) {

                return {
                    ...question,

                    question:
                        question.question ||
                        question.questionText ||
                        question.q ||
                        "",

                    options:
                        Array.isArray(
                            question.options
                        )
                            ? question.options
                            : (
                                Array.isArray(
                                    question.answers
                                )
                                    ? question.answers
                                    : []
                            )
                };

            }
        )
        .filter(
            function (question) {

                return (
                    question.question &&
                    question.options.length > 0
                );

            }
        );

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
        question.correct_option ??
        question.correctOption;


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


    // =================================================
    // NUMBER ANSWER
    // =================================================

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


    // =================================================
    // STRING ANSWER
    // =================================================

    else if (
        typeof correctAnswer === "string"
    ) {

        const answer =
            correctAnswer
                .trim()
                .toLowerCase();


        // Direct option match
        correctIndex =
            options.findIndex(
                function (option) {

                    return (
                        String(option)
                            .trim()
                            .toLowerCase()
                        ===
                        answer
                    
