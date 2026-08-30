/* =========================================================
   ITTA LEARN
   FINAL SCRIPT — PART 1
   8 EXAMS + AI + MIC + QUIZ
========================================================= */

"use strict";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

let selectedExam = "";
let selectedPart = "";
let selectedExamCategory = "";

let answerLocked = false;

let testStartTime = null;
let testEndTime = null;

let testTimerInterval = null;
let autoNextTimer = null;

let recognition = null;
let isListening = false;


/* =========================================================
   TEST SETTINGS
========================================================= */

const QUESTIONS_PER_TEST = 10;

const AUTO_NEXT_DELAY = 900;

const FREE_PART_START = 1;
const FREE_PART_END = 20;

const PAID_PART_START = 21;
const PAID_PART_END = 100;

const PREMIUM_PRICE = 49;


/* =========================================================
   ALL 8 EXAMS
   EACH EXAM USES ITS OWN JSON FILE
========================================================= */

const examFiles = {

    SSC:
        "ssc_questions.json",

    UPSC:
        "upsc_questions.json",

    BANK:
        "bank_questions.json",

    WBP:
        "wbp_questions_1_to_100_bengali.json",

    KOLKATA_POLICE:
        "kolkata_police_questions.json",

    RAILWAY:
        "railway_questions.json",

    WBCS:
        "wbsc_questions.json",

    WBPSC_CLERKSHIP:
        "wbpsc_clerkship_questions.json"

};


/* =========================================================
   EXAM DISPLAY NAMES
========================================================= */

const examPartNames = {

    SSC:
        "SSC",

    UPSC:
        "UPSC",

    BANK:
        "Bank",

    WBP:
        "WBP",

    KOLKATA_POLICE:
        "Kolkata Police",

    RAILWAY:
        "Railway",

    WBCS:
        "WBCS",

    WBPSC_CLERKSHIP:
        "WBPSC Clerkship"

};


/* =========================================================
   EXAM CATEGORIES
========================================================= */

const examCategories = {

    SSC: [
        "SSC General Studies",
        "SSC PYQ"
    ],

    UPSC: [
        "UPSC General Studies",
        "UPSC PYQ"
    ],

    BANK: [
        "Banking Awareness",
        "Bank PYQ"
    ],

    WBP: [
        "WBP General Studies",
        "WBP PYQ"
    ],

    KOLKATA_POLICE: [
        "Kolkata Police General Studies",
        "Kolkata Police PYQ"
    ],

    RAILWAY: [
        "Railway General Studies",
        "Railway PYQ"
    ],

    WBCS: [
        "WBCS General Studies",
        "WBCS PYQ"
    ],

    WBPSC_CLERKSHIP: [
        "Clerkship General Studies",
        "Clerkship PYQ"
    ]

};


/* =========================================================
   BASIC HELPER
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")

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


/* =========================================================
   SHUFFLE QUESTIONS
========================================================= */

function shuffleArray(array) {

    const result =
        Array.isArray(array)
            ? [...array]
            : [];

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


/* =========================================================
   GET EXAM NAME
========================================================= */

function getExamName(exam) {

    return (
        examPartNames[exam] ||
        exam ||
        ""
    );

}


/* =========================================================
   GET PART NUMBER
========================================================= */

function getPartNumber(part) {

    return String(
        part || ""
    ).replace(
        /^part/i,
        ""
    );

}


/* =========================================================
   STOP TIMER
========================================================= */

function stopLiveTimer() {

    if (
        testTimerInterval
    ) {

        clearInterval(
            testTimerInterval
        );

        testTimerInterval =
            null;

    }

}


/* =========================================================
   CLEAR AUTO NEXT
========================================================= */

function clearAutoNextTimer() {

    if (
        autoNextTimer
    ) {

        clearTimeout(
            autoNextTimer
        );

        autoNextTimer =
            null;

    }

}


/* =========================================================
   RESET TEST STATE
========================================================= */

function resetTestState(
    clearExam = true
) {

    stopLiveTimer();

    clearAutoNextTimer();

    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    selectedPart =
        "";

    selectedExamCategory =
        "";

    answerLocked =
        false;

    testStartTime =
        null;

    testEndTime =
        null;

    if (
        clearExam
    ) {

        selectedExam =
            "";

    }

}


/* =========================================================
   SIMPLE MESSAGE
========================================================= */

function showMessage(
    message,
    type = "info"
) {

    const box =
        $("mockTestBox");

    if (!box) {

        alert(message);

        return;

    }

    const icon =
        type === "success"
            ? "✅"
            : type === "error"
                ? "❌"
                : type === "warning"
                    ? "⚠️"
                    : "ℹ️";

    box.innerHTML = `

        <div class="result-box">

            <h3>
                ${icon}
                ${escapeHTML(message)}
            </h3>

            <button
                type="button"
                class="exam-btn"
                onclick="backToExamList()"
            >
                🔙 Back to Exams
            </button>

        </div>

    `;

}


/* =========================================================
   PAGE READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "✅ ITTA LEARN loaded successfully"
        );

        console.log(
            "✅ 8 Exam system ready"
        );

        console.log(
            "✅ AI Tutor ready"
        );

        console.log(
            "✅ Microphone system ready"
        );

    }
);/* =========================================================
   ITTA LEARN - PART 2
   EXAM LIST + PART SELECTION
========================================================= */


/* =========================================================
   SHOW ALL 8 EXAMS
========================================================= */

function backToExamList() {

    stopLiveTimer();
    clearAutoNextTimer();

    resetTestState(true);

    const box =
        $("mockTestBox");

    if (!box) {

        console.error(
            "❌ mockTestBox not found"
        );

        return;

    }


    box.innerHTML = `

        <div class="exam-selection">

            <h3>
                🎯 Select Your Exam
            </h3>

            <div class="exam-grid">

                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('SSC')"
                >
                    📘 SSC
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('UPSC')"
                >
                    🏛️ UPSC
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('BANK')"
                >
                    🏦 Bank
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('WBP')"
                >
                    👮 WBP
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('KOLKATA_POLICE')"
                >
                    🚔 Kolkata Police
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('RAILWAY')"
                >
                    🚆 Railway
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('WBCS')"
                >
                    🏛️ WBCS
                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="startMockTest('WBPSC_CLERKSHIP')"
                >
                    📚 WBPSC Clerkship
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   START SELECTED EXAM
========================================================= */

function startMockTest(
    exam
) {

    stopLiveTimer();
    clearAutoNextTimer();

    if (
        !examFiles[exam]
    ) {

        showMessage(
            "This exam is not configured.",
            "error"
        );

        return;

    }


    selectedExam =
        exam;

    selectedPart =
        "";

    selectedExamCategory =
        "";

    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    answerLocked =
        false;

    testStartTime =
        null;

    testEndTime =
        null;


    showExamParts(
        exam
    );

}


/* =========================================================
   OLD BUTTON COMPATIBILITY
========================================================= */

function openMockTest(
    exam
) {

    startMockTest(
        exam
    );

}


/* =========================================================
   SHOW PARTS
========================================================= */

function showExamParts(
    exam
) {

    stopLiveTimer();
    clearAutoNextTimer();


    if (
        !examFiles[exam]
    ) {

        showMessage(
            "Exam configuration not found.",
            "error"
        );

        return;

    }


    selectedExam =
        exam;


    selectedPart =
        "";


    const box =
        $("mockTestBox");


    if (!box) {

        console.error(
            "❌ mockTestBox not found"
        );

        return;

    }


    const examName =
        getExamName(
            exam
        );


    const categories =
        examCategories[exam] || [];


    /* =========================
       CATEGORY BUTTONS
    ========================= */

    let categoryHTML =
        "";


    if (
        categories.length
    ) {

        categoryHTML = `

            <div
                class="exam-category-section"
            >

                <h4>
                    📚 Categories
                </h4>

                <div
                    class="exam-grid"
                >

                    ${categories.map(
                        function(category) {

                            return `

                                <button
                                    type="button"
                                    class="exam-btn"
                                    onclick="selectExamCategory(
                                        '${escapeHTML(exam)}',
                                        '${escapeHTML(category)}'
                                    )"
                                >

                                    ${escapeHTML(category)}

                                </button>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    }


    /* =========================
       FREE PARTS 1–20
    ========================= */

    let freeParts =
        "";


    for (
        let i = FREE_PART_START;
        i <= FREE_PART_END;
        i++
    ) {

        freeParts += `

            <button
                type="button"
                class="exam-btn"
                onclick="selectExamPart(
                    '${escapeHTML(exam)}',
                    'part${i}'
                )"
            >

                🆓 Part ${i}

            </button>

        `;

    }


    /* =========================
       DISPLAY
    ========================= */

    box.innerHTML = `

        <div
            class="exam-parts"
        >

            <h3>
                📚 ${escapeHTML(examName)}
            </h3>


            ${
                selectedExamCategory
                    ? `

                        <p>

                            🎯 Selected:

                            <strong>
                                ${escapeHTML(
                                    selectedExamCategory
                                )}
                            </strong>

                        </p>

                    `
                    : ""
            }


            ${categoryHTML}


            <hr>


            <h4>
                🆓 Free Parts 1–20
            </h4>


            <div
                class="exam-grid"
            >

                ${freeParts}

            </div>


            <hr>


            <h4>
                ⭐ Premium Parts 21–100
            </h4>


            <p>
                Premium Access:
                ₹${PREMIUM_PRICE}
            </p>


            <button
                type="button"
                class="exam-btn premium-main-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )"
            >

                ⭐ Open Premium Parts

            </button>


            <br>


            <button
                type="button"
                class="exam-btn"
                onclick="backToExamList()"
            >

                🔙 Back to Exams

            </button>

        </div>

    `;

}


/* =========================================================
   CATEGORY SELECTION
========================================================= */

function selectExamCategory(
    exam,
    category
) {

    selectedExam =
        exam;

    selectedExamCategory =
        category;


    showExamParts(
        exam
    );

}


/* =========================================================
   PART ALIASES
========================================================= */

function selectPart(
    exam,
    part
) {

    selectExamPart(
        exam,
        part
    );

}


function loadPart(
    exam,
    part
) {

    selectExamPart(
        exam,
        part
    );

}/* =========================================================
   ITTA LEARN - PART 3
   JSON LOADER + QUESTION NORMALIZER
========================================================= */


/* =========================================================
   LOAD EXAM JSON
========================================================= */

async function fetchExamJSON(exam) {

    const file =
        examFiles[exam];


    if (!file) {

        throw new Error(
            "JSON file configured নেই: " + exam
        );

    }


    const response =
        await fetch(
            file + "?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            file +
            " load হয়নি. HTTP " +
            response.status
        );

    }


    return await response.json();

}


/* =========================================================
   EXTRACT QUESTION ARRAY
========================================================= */

function extractQuestionArray(
    data
) {

    if (
        Array.isArray(data)
    ) {

        return data;

    }


    if (
        !data ||
        typeof data !== "object"
    ) {

        return [];

    }


    const possibleKeys = [

        "questions",

        "data",

        "items",

        "questionBank",

        "question_bank"

    ];


    for (
        const key of possibleKeys
    ) {

        if (
            Array.isArray(
                data[key]
            )
        ) {

            return data[key];

        }

    }


    /* =========================
       PART-WISE JSON
    ========================= */

    const merged = [];


    for (
        const key of Object.keys(data)
    ) {

        if (
            /^part\s*\d+$/i.test(
                key
            )
            &&
            Array.isArray(
                data[key]
            )
        ) {

            merged.push(
                ...data[key]
            );

        }

    }


    return merged;

}


/* =========================================================
   GET SPECIFIC PART
========================================================= */

function getPartData(
    data,
    partName
) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return null;

    }


    const number =
        getPartNumber(
            partName
        );


    const keys = [

        partName,

        "Part " + number,

        "part" + number,

        "part_" + number,

        number

    ];


    for (
        const key of keys
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                data,
                key
            )
        ) {

            return data[key];

        }

    }


    return null;

}


/* =========================================================
   NORMALIZE ONE QUESTION
========================================================= */

function normalizeQuestion(
    raw
) {

    if (
        !raw ||
        typeof raw !== "object"
    ) {

        return null;

    }


    const question =

        raw.question ??

        raw.q ??

        raw.questionText ??

        raw.text ??

        "";


    let options =

        raw.options ??

        raw.choices ??

        raw.answers ??

        [];


    /* =========================
       OBJECT OPTIONS
    ========================= */

    if (
        !Array.isArray(options) &&
        options &&
        typeof options === "object"
    ) {

        options =
            Object.values(
                options
            );

    }


    options =
        Array.isArray(options)

            ? options.map(
                function(option) {

                    return String(
                        option ?? ""
                    );

                }
            )

            : [];


    /* =========================
       ANSWER
    ========================= */

    let answer =

        raw.answer ??

        raw.correctAnswer ??

        raw.correct ??

        raw.correct_option ??

        raw.correctOption;


    /* =========================
       ANSWER AS NUMBER
    ========================= */

    if (
        typeof answer === "number"
    ) {

        if (
            options[answer]
        ) {

            answer =
                options[answer];

        }

    }


    /* =========================
       ANSWER AS A/B/C/D
    ========================= */

    if (
        typeof answer === "string"
    ) {

        const trimmed =
            answer.trim();


        const letterMatch =
            trimmed.match(
                /^[A-D]$/i
            );


        if (
            letterMatch
        ) {

            const index =
                trimmed
                    .toUpperCase()
                    .charCodeAt(0)
                    - 65;


            if (
                options[index]
            ) {

                answer =
                    options[index];

            }

        }

    }


    const explanation =

        raw.explanation ??

        raw.explain ??

        raw.solution ??

        "";


    /* =========================
       INVALID QUESTION
    ========================= */

    if (
        !question ||
        options.length < 2 ||
        answer === undefined
    ) {

        return null;

    }


    return {

        question:
            String(question),

        options:
            options,

        answer:
            String(answer),

        explanation:
            String(
                explanation || ""
            )

    };

}


/* =========================================================
   NORMALIZE QUESTION LIST
========================================================= */

function normalizeQuestions(
    rawArray
) {

    if (
        !Array.isArray(
            rawArray
        )
    ) {

        return [];

    }


    return rawArray

        .map(
            normalizeQuestion
        )

        .filter(
            Boolean
        );

}


/* =========================================================
   SELECT PART AND LOAD QUESTIONS
========================================================= */

async function selectExamPart(
    exam,
    partName
) {

    stopLiveTimer();

    clearAutoNextTimer();


    selectedExam =
        exam;

    selectedPart =
        partName;


    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    answerLocked =
        false;


    testStartTime =
        null;

    testEndTime =
        null;


    const box =
        $("mockTestBox");


    if (!box) {

        console.error(
            "❌ mockTestBox not found"
        );

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <h3>
                📚 ${escapeHTML(
                    getExamName(exam)
                )}
            </h3>

            <p>
                Part
                ${escapeHTML(
                    getPartNumber(
                        partName
                    )
                )}
            </p>

            <p>
                ⏳ Loading questions...
            </p>

        </div>

    `;


    try {

        /* =========================
           LOAD JSON
        ========================= */

        const data =
            await fetchExamJSON(
                exam
            );


        /* =========================
           FIND PART
        ========================= */

        // Handle all supported JSON layouts:
        // {"Part 1": [...]}, {"part1": [...]},
        // {"parts":{"Part 1":[...]}}, and
        // {"parts":[{"part":1,"questions":[...]}]}.
        const rawQuestions =
            findQuestionsFromPart(
                data,
                partName
            );


        /* =========================
           NORMALIZE
        ========================= */

        const questions =
            normalizeQuestions(
                rawQuestions
            );


        if (
            !questions.length
        ) {

            throw new Error(

                "Part " +
                getPartNumber(
                    partName
                ) +
                " এ কোনো valid question পাওয়া যায়নি।"

            );

        }


        /* =========================
           RANDOM 10 QUESTIONS
        ========================= */

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


        currentQuestionIndex =
            0;

        score =
            0;

        answerLocked =
            false;


        testStartTime =
            Date.now();

        testEndTime =
            null;


        /* =========================
           SHOW FIRST QUESTION
        ========================= */

        renderQuestion();


        /* =========================
           START TIMER
        ========================= */

        startLiveTimer();


    } catch (
        error
    ) {

        console.error(
            "Question loading error:",
            error
        );


        box.innerHTML = `

            <div class="result-box">

                <h3>
                    ❌ Questions Load হয়নি
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

                <p>
                    JSON file name এবং
                    Part structure check করো।
                </p>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="showExamParts(
                        '${escapeHTML(exam)}'
                    )"
                >

                    🔙 Choose Part

                </button>

            </div>

        `;

    }

}/* =========================================================
   ITTA LEARN - PART 4
   QUESTION SCREEN + ANSWER + NEXT/PREVIOUS
========================================================= */


/* =========================================================
   RENDER CURRENT QUESTION
========================================================= */

function renderQuestion() {

    const box =
        $("mockTestBox");


    if (
        !box ||
        !currentQuestions.length
    ) {

        return;

    }


    const q =
        currentQuestions[
            currentQuestionIndex
        ];


    if (!q) {

        return;

    }


    const progress =
        `${currentQuestionIndex + 1} / ${currentQuestions.length}`;


    box.innerHTML = `

        <div class="quiz-box">


            <!-- HEADER -->

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <strong>

                    📚
                    ${escapeHTML(
                        getExamName(
                            selectedExam
                        )
                    )}

                    —
                    Part
                    ${escapeHTML(
                        getPartNumber(
                            selectedPart
                        )
                    )}

                </strong>


                <strong id="liveTimer">

                    ⏱️ 00:00

                </strong>

            </div>


            <!-- PROGRESS -->

            <p>

                Question
                ${progress}

            </p>


            <hr>


            <!-- QUESTION -->

            <h3>

                ${escapeHTML(
                    q.question
                )}

            </h3>


            <!-- OPTIONS -->

            <div
                class="options"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:10px;
                "
            >

                ${q.options.map(
                    function(option, index) {

                        return `

                            <button

                                type="button"

                                class="
                                    exam-btn
                                    option-btn
                                "

                                id="
                                    option-${index}
                                "

                                onclick="
                                    answerQuestion(
                                        ${index}
                                    )
                                "
                            >

                                ${String
                                    .fromCharCode(
                                        65 + index
                                    )
                                }.

                                ${escapeHTML(
                                    option
                                )}

                            </button>

                        `;

                    }
                ).join("")}

            </div>


            <!-- ANSWER FEEDBACK -->

            <div
                id="answerFeedback"
                style="
                    margin-top:15px;
                    line-height:1.6;
                "
            ></div>


            <!-- NAVIGATION -->

            <div
                class="result-buttons"
                style="
                    margin-top:15px;
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                "
            >

                <button
                    type="button"
                    class="exam-btn"
                    onclick="previousQuestion()"
                >

                    ◀ Previous

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="nextQuestion()"
                >

                    Next ▶

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="confirmExitTest()"
                >

                    ✕ Exit

                </button>

            </div>

        </div>

    `;


    /* =========================
       UPDATE TIMER
    ========================= */

    updateLiveTimer();

}


/* =========================================================
   ANSWER QUESTION
========================================================= */

function answerQuestion(
    index
) {

    if (
        answerLocked
    ) {

        return;

    }


    const q =
        currentQuestions[
            currentQuestionIndex
        ];


    if (!q) {

        return;

    }


    const selected =
        q.options[index] ??
        "";


    const correct =
        String(
            q.answer
        ).trim();


    const isCorrect =

        selected
            .trim()
            .toLowerCase()

        ===

        correct
            .trim()
            .toLowerCase();


    /* =========================
       LOCK ANSWER
    ========================= */

    answerLocked =
        true;


    /* =========================
       SCORE
    ========================= */

    if (
        isCorrect
    ) {

        score++;

    }


    /* =========================
       DISABLE OPTIONS
    ========================= */

    document
        .querySelectorAll(
            ".option-btn"
        )
        .forEach(
            function(button) {

                button.disabled =
                    true;

            }
        );


    /* =========================
       FEEDBACK
    ========================= */

    const feedback =
        $("answerFeedback");


    if (
        feedback
    ) {

        if (
            isCorrect
        ) {

            feedback.innerHTML = `

                <div
                    style="
                        padding:10px;
                        border-radius:8px;
                    "
                >

                    <strong>
                        ✅ Correct Answer!
                    </strong>

                </div>

            `;

        } else {

            feedback.innerHTML = `

                <div
                    style="
                        padding:10px;
                        border-radius:8px;
                    "
                >

                    <strong>
                        ❌ Wrong Answer
                    </strong>

                    <br>

                    Correct Answer:

                    <strong>
                        ${escapeHTML(
                            correct
                        )}
                    </strong>

                </div>

            `;

        }


        /* =========================
           EXPLANATION
        ========================= */

        if (
            q.explanation
        ) {

            feedback.innerHTML += `

                <p>

                    <strong>
                        📖 Explanation:
                    </strong>

                    <br>

                    ${escapeHTML(
                        q.explanation
                    )}

                </p>

            `;

        }

    }


    /* =========================
       AUTO NEXT
    ========================= */

    clearAutoNextTimer();


    autoNextTimer =
        setTimeout(
            function() {

                nextQuestion();

            },
            AUTO_NEXT_DELAY
        );

}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

    clearAutoNextTimer();


    if (
        !currentQuestions.length
    ) {

        return;

    }


    /* =========================
       ANSWER MUST BE SELECTED
    ========================= */

    if (
        !answerLocked
    ) {

        alert(
            "আগে একটি answer select করো।"
        );

        return;

    }


    /* =========================
       NEXT
    ========================= */

    if (
        currentQuestionIndex
        <
        currentQuestions.length - 1
    ) {

        currentQuestionIndex++;

        answerLocked =
            false;

        renderQuestion();

        return;

    }


    /* =========================
       LAST QUESTION
    ========================= */

    finishTest();

}


/* =========================================================
   PREVIOUS QUESTION
========================================================= */

function previousQuestion() {

    clearAutoNextTimer();


    if (
        !currentQuestions.length
    ) {

        return;

    }


    if (
        currentQuestionIndex <= 0
    ) {

        alert(
            "এটাই প্রথম question।"
        );

        return;

    }


    currentQuestionIndex--;

    answerLocked =
        false;


    renderQuestion();

}


/* =========================================================
   UPDATE LIVE TIMER
========================================================= */

function updateLiveTimer() {

    const timer =
        $("liveTimer");


    if (
        !timer ||
        !testStartTime
    ) {

        return;

    }


    const elapsed =
        Math.max(
            0,
            Math.floor(
                (
                    Date.now()
                    -
                    testStartTime
                ) / 1000
            )
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    timer.textContent =

        "⏱️ " +

        String(
            minutes
        ).padStart(
            2,
            "0"
        )

        +

        ":" +

        String(
            seconds
        ).padStart(
            2,
            "0"
        );

}


/* =========================================================
   START LIVE TIMER
========================================================= */

function startLiveTimer() {

    stopLiveTimer();


    function tick() {

        updateLiveTimer();

    }


    tick();


    testTimerInterval =
        setInterval(
            tick,
            1000
        );

}


/* =========================================================
   FINISH TEST
========================================================= */

function finishTest() {

    if (
        !currentQuestions.length
    ) {

        showExamParts(
            selectedExam
        );

        return;

    }


    testEndTime =
        Date.now();


    stopLiveTimer();

    clearAutoNextTimer();


    showResult();

   }/* =========================================================
   ITTA LEARN - PART 5
   RESULT + RETRY + EXIT + NAVIGATION
========================================================= */


/* =========================================================
   SHOW RESULT
========================================================= */

function showResult() {

    stopLiveTimer();
    clearAutoNextTimer();

    const box =
        $("mockTestBox");

    if (!box) {
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


    let resultMessage = "";

    if (percentage >= 80) {

        resultMessage =
            "🏆 Excellent!";

    } else if (percentage >= 60) {

        resultMessage =
            "👏 Very Good!";

    } else if (percentage >= 40) {

        resultMessage =
            "👍 Good Try!";

    } else {

        resultMessage =
            "📚 Keep Practising!";

    }


    const examName =
        getExamName(
            selectedExam
        );


    const partNumber =
        getPartNumber(
            selectedPart
        );


    box.innerHTML = `

        <div class="result-box">

            <h2>
                🏆 Test Completed
            </h2>

            <h3>
                ${escapeHTML(
                    examName
                )}
                —
                Part ${escapeHTML(
                    partNumber
                )}
            </h3>


            <div
                class="result-score"
                style="
                    margin:20px 0;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:40px;
                        font-weight:bold;
                    "
                >

                    ${score}/${total}

                </div>


                <div
                    style="
                        font-size:22px;
                        margin-top:8px;
                    "
                >

                    ${percentage}%

                </div>

            </div>


            <h3>
                ${resultMessage}
            </h3>


            <div
                style="
                    margin:15px 0;
                    line-height:1.8;
                "
            >

                <p>

                    📊 Correct:
                    <strong>
                        ${score}
                    </strong>

                </p>


                <p>

                    ❌ Incorrect:
                    <strong>
                        ${Math.max(
                            0,
                            total - score
                        )}
                    </strong>

                </p>


                <p>

                    📝 Total:
                    <strong>
                        ${total}
                    </strong>

                </p>

            </div>


            <div
                class="result-buttons"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:10px;
                    justify-content:center;
                "
            >

                <button
                    type="button"
                    class="exam-btn"
                    onclick="retryCurrentPart()"
                >

                    🔄 Retry Part

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="showExamParts(
                        '${escapeHTML(
                            selectedExam
                        )}'
                    )"
                >

                    📚 Choose Part

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="backToExamList()"
                >

                    🔙 All Exams

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   RETRY CURRENT PART
========================================================= */

function retryCurrentPart() {

    const exam =
        selectedExam;

    const part =
        selectedPart;


    if (
        !exam ||
        !part
    ) {

        backToExamList();

        return;

    }


    selectExamPart(
        exam,
        part
    );

}


/* =========================================================
   CHOOSE EXAM AGAIN
========================================================= */

function chooseExamAgain() {

    stopLiveTimer();

    clearAutoNextTimer();

    backToExamList();

}


/* =========================================================
   EXIT TEST CONFIRMATION
========================================================= */

function confirmExitTest() {

    const confirmed =
        window.confirm(
            "তুমি কি এই test থেকে বের হতে চাও?"
        );


    if (
        confirmed
    ) {

        exitCurrentTest();

    }

}


/* =========================================================
   EXIT CURRENT TEST
========================================================= */

function exitCurrentTest() {

    stopLiveTimer();

    clearAutoNextTimer();


    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    answerLocked =
        false;

    testStartTime =
        null;

    testEndTime =
        null;


    showExamParts(
        selectedExam
    );

}


/* =========================================================
   GO BACK TO PARTS
========================================================= */

function backToParts() {

    stopLiveTimer();

    clearAutoNextTimer();


    if (
        selectedExam
    ) {

        showExamParts(
            selectedExam
        );

    } else {

        backToExamList();

    }

}


/* =========================================================
   GO BACK TO HOME / MOCK TEST
========================================================= */

function goBack() {

    backToExamList();

}


/* =========================================================
   GENERIC BACK BUTTON
========================================================= */

function goBackToMockTest() {

    backToExamList();

}


/* =========================================================
   START QUIZ ALIAS
========================================================= */

function startQuiz(
    exam,
    part
) {

    if (
        exam &&
        part
    ) {

        selectExamPart(
            exam,
            part
        );

        return;

    }


    if (
        exam
    ) {

        startMockTest(
            exam
        );

        return;

    }


    backToExamList();

}


/* =========================================================
   LOAD QUESTIONS ALIAS
========================================================= */

function loadQuestions(
    exam,
    part
) {

    if (
        !exam
    ) {

        showMessage(
            "Exam select করো।",
            "warning"
        );

        return;

    }


    selectExamPart(
        exam,
        part || "part1"
    );

}


/* =========================================================
   CURRENT SCORE
========================================================= */

function getCurrentScore() {

    return score;

}


/* =========================================================
   CURRENT QUESTION NUMBER
========================================================= */

function getCurrentQuestionNumber() {

    return (
        currentQuestionIndex + 1
    );

}


/* =========================================================
   TOTAL QUESTION NUMBER
========================================================= */

function getTotalQuestionNumber() {

    return currentQuestions.length;

           }/* =========================================================
   ITTA LEARN - PART 6
   🎙️ MICROPHONE + 🤖 AI TUTOR
========================================================= */


/* =========================================================
   FIND AI INPUT ELEMENT
========================================================= */

function getAIInput() {

    const possibleIds = [

        // Current Itta Learn HTML uses id="question".
        // Keep legacy IDs for compatibility with older layouts.
        "question",
        "questionInput",
        "aiInput",
        "userInput",
        "promptInput",
        "chatInput",
        "messageInput"

    ];

    for (
        const id of possibleIds
    ) {

        const element =
            $(id);

        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* =========================================================
   FIND AI RESPONSE BOX
========================================================= */

function getAIResponseBox() {

    const possibleIds = [

        // Current Itta Learn HTML uses id="answer".
        // Keep legacy IDs for compatibility with older layouts.
        "answer",
        "aiResponse",
        "response",
        "chatResponse",
        "answerBox",
        "aiOutput",
        "responseBox"

    ];


    for (
        const id of possibleIds
    ) {

        const element =
            $(id);

        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* =========================================================
   MICROPHONE SUPPORT CHECK
========================================================= */

function isMicSupported() {

    return Boolean(

        window.SpeechRecognition ||

        window.webkitSpeechRecognition

    );

}


/* =========================================================
   CREATE SPEECH RECOGNITION
========================================================= */

function createRecognition() {

    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;


    if (
        !SpeechRecognition
    ) {

        return null;

    }


    const recog =
        new SpeechRecognition();


    recog.lang =
        "bn-IN";


    recog.continuous =
        false;


    recog.interimResults =
        true;


    recog.maxAlternatives =
        1;


    return recog;

}


/* =========================================================
   START MICROPHONE
========================================================= */

function startMicrophone() {

    if (
        isListening
    ) {

        stopMicrophone();

        return;

    }


    if (
        !isMicSupported()
    ) {

        alert(
            "এই browser/device-এ microphone speech recognition support নেই।"
        );

        return;

    }


    const input =
        getAIInput();


    if (
        !input
    ) {

        alert(
            "AI input box পাওয়া যায়নি।"
        );

        return;

    }


    recognition =
        createRecognition();


    if (
        !recognition
    ) {

        return;

    }


    let finalText =
        "";


    recognition.onstart =
        function () {

            isListening =
                true;


            updateMicButtons(
                true
            );

        };


    recognition.onresult =
        function (event) {

            let interimText =
                "";


            for (
                let i =
                    event.resultIndex;

                i <
                    event.results.length;

                i++
            ) {

                const transcript =

                    event
                        .results[i][0]
                        .transcript;


                if (
                    event
                        .results[i]
                        .isFinal
                ) {

                    finalText +=
                        transcript + " ";

                } else {

                    interimText +=
                        transcript;

                }

            }


            input.value =
                (
                    finalText +
                    interimText
                ).trim();


            /* =========================
               TRIGGER INPUT EVENT
            ========================= */

            input.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

        };


    recognition.onerror =
        function (event) {

            console.error(
                "🎙️ Mic error:",
                event.error
            );


            isListening =
                false;


            updateMicButtons(
                false
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                alert(
                    "Microphone permission allow করতে হবে।"
                );

            }

        };


    recognition.onend =
        function () {

            isListening =
                false;


            updateMicButtons(
                false
            );


            recognition =
                null;

        };


    try {

        recognition.start();

    } catch (
        error
    ) {

        console.error(
            "Mic start error:",
            error
        );

        isListening =
            false;

        updateMicButtons(
            false
        );

    }

}


/* =========================================================
   STOP MICROPHONE
========================================================= */

function stopMicrophone() {

    if (
        recognition
    ) {

        try {

            recognition.stop();

        } catch (
            error
        ) {

            console.warn(
                error
            );

        }

    }


    recognition =
        null;

    isListening =
        false;


    updateMicButtons(
        false
    );

}


/* =========================================================
   MIC BUTTON UI
========================================================= */

function updateMicButtons(
    listening
) {

    const buttons =

        document.querySelectorAll(
            "[data-mic-button]"
        );


    buttons.forEach(
        function(button) {

            button.textContent =

                listening
                    ? "⏹️ Stop Mic"
                    : "🎙️ Mic";

        }
    );


    const oldButtons =

        document.querySelectorAll(
            "#micBtn, #micButton, .mic-btn"
        );


    oldButtons.forEach(
        function(button) {

            if (
                !button
                    .hasAttribute(
                        "data-mic-button"
                    )
            ) {

                button.textContent =

                    listening
                        ? "⏹️"
                        : "🎙️";

            }

        }
    );

}


/* =========================================================
   HTML COMPATIBILITY ALIASES
========================================================= */

function startMic() {
    startMicrophone();
}

async function askTutor() {
    return askIttaAI();
}

/* =========================================================
   MIC ALIASES
========================================================= */

function startVoiceInput() {

    startMicrophone();

}


function startVoiceRecognition() {

    startMicrophone();

}


function toggleMicrophone() {

    startMicrophone();

}


function useMic() {

    startMicrophone();

}


/* =========================================================
   STOP VOICE
========================================================= */

function stopVoiceInput() {

    stopMicrophone();

}


/* =========================================================
   SEND QUESTION TO AI
========================================================= */

async function askIttaAI() {

    const input =
        getAIInput();


    if (
        !input
    ) {

        alert(
            "AI input box পাওয়া যায়নি।"
        );

        return;

    }


    const question =
        String(
            input.value || ""
        ).trim();


    if (
        !question
    ) {

        alert(
            "আগে একটি প্রশ্ন লিখো বা Mic দিয়ে বলো।"
        );

        return;

    }


    const responseBox =
        getAIResponseBox();


    if (
        responseBox
    ) {

        responseBox.innerHTML = `

            <div>

                ⏳ Itta AI ভাবছে...

            </div>

        `;

    }


    try {

        const response =
            await fetch(
                "/ask",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            question:
                                question

                        })

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        /* =========================
           DIFFERENT RESPONSE FORMATS
        ========================= */

        const answer =

            data.answer ??

            data.response ??

            data.text ??

            data.message ??

            "";


        if (
            !answer
        ) {

            throw new Error(
                "AI কোনো উত্তর দেয়নি।"
            );

        }


        if (
            responseBox
        ) {

            responseBox.innerHTML = `

                <div
                    class="ai-answer"
                >

                    ${formatAIAnswer(
                        answer
                    )}

                </div>

            `;

        }


    } catch (
        error
    ) {

        console.error(
            "AI error:",
            error
        );


        if (
            responseBox
        ) {

            responseBox.innerHTML = `

                <div>

                    ❌ AI উত্তর পাওয়া যায়নি।

                    <br>

                    ${escapeHTML(
                        error.message
                    )}

                </div>

            `;

        }

    }

}


/* =========================================================
   AI SEND ALIASES
========================================================= */

function sendToAI() {

    askIttaAI();

}


function askAI() {

    askIttaAI();

}


function sendQuestion() {

    askIttaAI();

}


/* =========================================================
   FORMAT AI RESPONSE
========================================================= */

function formatAIAnswer(
    text
) {

    let output =
        escapeHTML(
            text
        );


    /* =========================
       BASIC MARKDOWN
    ========================= */

    output =
        output.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    output =
        output.replace(
            /\n/g,
            "<br>"
        );


    return output;

}


/* =========================================================
   ENTER KEY FOR AI
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const target =
            event.target;


        if (
            !target
        ) {

            return;

        }


        const isInput =

            target.id ===
                "questionInput"

            ||

            target.id ===
                "aiInput"

            ||

            target.id ===
                "userInput"

            ||

            target.id ===
                "chatInput";


        if (
            isInput &&
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            askIttaAI();

        }

    }
);


/* =========================================================
   AUTOMATICALLY CONNECT OLD MIC BUTTONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const micButtons =

            document.querySelectorAll(
                "#micBtn, #micButton, .mic-btn, [data-mic-button]"
            );


        micButtons.forEach(
            function(button) {

                button.setAttribute(
                    "data-mic-button",
                    "true"
                );


                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        startMicrophone();

                    }
                );

            }
        );


        const sendButtons =

            document.querySelectorAll(
                "#askBtn, #sendBtn, #askButton, .ask-btn"
            );


        sendButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        askIttaAI();

                    }
                );

            }
        );

    }
);/* =========================================================
   ITTA LEARN - PART 7
   PREMIUM PARTS 21–100 + BUTTON COMPATIBILITY
========================================================= */


/* =========================================================
   PREMIUM ACCESS
========================================================= */

let premiumUnlocked = false;


/* =========================================================
   CHECK PREMIUM STATUS
========================================================= */

function isPremiumUnlocked() {

    try {

        return (
            premiumUnlocked === true ||
            localStorage.getItem(
                "itta_premium_unlocked"
            ) === "true"
        );

    } catch (error) {

        return premiumUnlocked === true;

    }

}


/* =========================================================
   SAVE PREMIUM STATUS
========================================================= */

function unlockPremiumLocal() {

    premiumUnlocked =
        true;


    try {

        localStorage.setItem(
            "itta_premium_unlocked",
            "true"
        );

    } catch (error) {

        console.warn(
            "LocalStorage unavailable"
        );

    }

}


/* =========================================================
   SHOW PREMIUM PARTS
========================================================= */

function showPaidParts(
    exam
) {

    selectedExam =
        exam;


    const box =
        $("mockTestBox");


    if (!box) {

        return;

    }


    let partsHTML =
        "";


    for (
        let i =
            PAID_PART_START;

        i <=
            PAID_PART_END;

        i++
    ) {

        partsHTML += `

            <button
                type="button"
                class="exam-btn"
                onclick="openPremiumPart(
                    '${escapeHTML(exam)}',
                    'part${i}'
                )"
            >

                ⭐ Part ${i}

            </button>

        `;

    }


    box.innerHTML = `

        <div class="exam-parts">

            <h3>
                ⭐ Premium —
                ${escapeHTML(
                    getExamName(exam)
                )}
            </h3>


            <p>

                Parts 21–100

                <br>

                Premium Access:
                ₹${PREMIUM_PRICE}

            </p>


            <div
                class="exam-grid"
            >

                ${partsHTML}

            </div>


            <br>


            <button
                type="button"
                class="exam-btn"
                onclick="showExamParts(
                    '${escapeHTML(exam)}'
                )"
            >

                🔙 Back

            </button>

        </div>

    `;

}


/* =========================================================
   OPEN PREMIUM PART
========================================================= */

function openPremiumPart(
    exam,
    part
) {

    if (
        !isPremiumUnlocked()
    ) {

        showPremiumPayment(
            exam,
            part
        );

        return;

    }


    selectExamPart(
        exam,
        part
    );

}


/* =========================================================
   PREMIUM PAYMENT SCREEN
========================================================= */

function showPremiumPayment(
    exam,
    part
) {

    const box =
        $("mockTestBox");


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <h2>
                ⭐ Premium Access
            </h2>


            <p>

                Exam:

                <strong>
                    ${escapeHTML(
                        getExamName(exam)
                    )}
                </strong>

            </p>


            <p>

                Part:

                <strong>
                    ${escapeHTML(
                        getPartNumber(part)
                    )}
                </strong>

            </p>


            <h3>
                ₹${PREMIUM_PRICE}
            </h3>


            <p>

                Premium Parts
                21–100 unlock করার জন্য
                Premium access প্রয়োজন।

            </p>


            <button
                type="button"
                class="exam-btn"
                onclick="startPremiumPayment(
                    '${escapeHTML(exam)}',
                    '${escapeHTML(part)}'
                )"
            >

                💳 Unlock Premium

            </button>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )"
            >

                🔙 Back

            </button>

        </div>

    `;

}


/* =========================================================
   PAYMENT PLACEHOLDER
========================================================= */

function startPremiumPayment(
    exam,
    part
) {

    /*
       IMPORTANT:

       এখানে fake payment success করা হয়নি।

       Real payment gateway connect করার পরে
       payment successful হলে:

       premiumPaymentSuccess();

       call করবে।
    */


    const box =
        $("mockTestBox");


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <h3>
                💳 Premium Payment
            </h3>


            <p>

                Real payment gateway
                এখনো connect করা হয়নি।

            </p>


            <p>

                Payment gateway connect করার পরে
                successful payment হলে
                Premium automatically unlock হবে।

            </p>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )"
            >

                🔙 Back

            </button>

        </div>

    `;

}


/* =========================================================
   REAL PAYMENT SUCCESS CALLBACK
========================================================= */

function premiumPaymentSuccess() {

    unlockPremiumLocal();


    alert(
        "✅ Premium successfully unlocked!"
    );


    if (
        selectedExam
    ) {

        showPaidParts(
            selectedExam
        );

    } else {

        backToExamList();

    }

}


/* =========================================================
   MANUAL PREMIUM UNLOCK FUNCTION
   FOR TESTING ONLY
========================================================= */

function testUnlockPremium() {

    unlockPremiumLocal();


    alert(
        "✅ Premium test access enabled."
    );

}


/* =========================================================
   LOCK PREMIUM
========================================================= */

function resetPremiumAccess() {

    premiumUnlocked =
        false;


    try {

        localStorage.removeItem(
            "itta_premium_unlocked"
        );

    } catch (error) {

        console.warn(
            error
        );

    }


    alert(
        "Premium access reset."
    );

}


/* =========================================================
   GLOBAL BUTTON COMPATIBILITY
========================================================= */

function showMockTest() {

    backToExamList();

}


function openMockTests() {

    backToExamList();

}


function openQuiz() {

    backToExamList();

}


function startMock() {

    backToExamList();

}


function showQuiz() {

    backToExamList();

}


/* =========================================================
   EXAM BUTTON ALIASES
========================================================= */

function openSSC() {

    startMockTest("SSC");

}


function openUPSC() {

    startMockTest("UPSC");

}


function openBank() {

    startMockTest("BANK");

}


function openWBP() {

    startMockTest("WBP");

}


function openKolkataPolice() {

    startMockTest(
        "KOLKATA_POLICE"
    );

}


function openRailway() {

    startMockTest(
        "RAILWAY"
    );

}


function openWBCS() {

    startMockTest(
        "WBCS"
    );

}


function openWBPSCClerkship() {

    startMockTest(
        "WBPSC_CLERKSHIP"
    );

}


/* =========================================================
   GENERIC EXAM OPENER
========================================================= */

function openExam(
    exam
) {

    if (
        examFiles[exam]
    ) {

        startMockTest(
            exam
        );

        return;

    }


    const normalized =
        String(
            exam || ""
        )
        .toUpperCase()
        .replace(
            /\s+/g,
            "_"
        );


    if (
        examFiles[normalized]
    ) {

        startMockTest(
            normalized
        );

        return;

    }


    alert(
        "Exam পাওয়া যায়নি: " +
        exam
    );

}


/* =========================================================
   SAFE WINDOW EXPORTS
========================================================= */

window.startMockTest =
    startMockTest;

window.openMockTest =
    openMockTest;

window.showExamParts =
    showExamParts;

window.selectExamPart =
    selectExamPart;

window.selectPart =
    selectPart;

window.loadPart =
    loadPart;

window.answerQuestion =
    answerQuestion;

window.nextQuestion =
    nextQuestion;

window.previousQuestion =
    previousQuestion;

window.finishTest =
    finishTest;

window.showResult =
    showResult;

window.retryCurrentPart =
    retryCurrentPart;

window.chooseExamAgain =
    chooseExamAgain;

window.backToExamList =
    backToExamList;

window.backToParts =
    backToParts;

window.exitCurrentTest =
    exitCurrentTest;

window.confirmExitTest =
    confirmExitTest;

window.startQuiz =
    startQuiz;

window.loadQuestions =
    loadQuestions;


/* =========================================================
   AI GLOBAL FUNCTIONS
========================================================= */

window.askIttaAI =
    askIttaAI;

window.askAI =
    askAI;

window.sendToAI =
    sendToAI;

window.sendQuestion =
    sendQuestion;


/* =========================================================
   MIC GLOBAL FUNCTIONS
========================================================= */

window.startMic =
    startMic;

window.askTutor =
    askTutor;

window.startMicrophone =
    startMicrophone;

window.stopMicrophone =
    stopMicrophone;

window.startVoiceInput =
    startVoiceInput;

window.startVoiceRecognition =
    startVoiceRecognition;

window.toggleMicrophone =
    toggleMicrophone;

window.useMic =
    useMic;

window.stopVoiceInput =
    stopVoiceInput;


/* =========================================================
   PREMIUM GLOBAL FUNCTIONS
========================================================= */

window.showPaidParts =
    showPaidParts;

window.openPremiumPart =
    openPremiumPart;

window.startPremiumPayment =
    startPremiumPayment;

window.premiumPaymentSuccess =
    premiumPaymentSuccess;

window.testUnlockPremium =
    testUnlockPremium;

window.resetPremiumAccess =
    resetPremiumAccess;


/* =========================================================
   EXAM GLOBAL FUNCTIONS
========================================================= */

window.openSSC =
    openSSC;

window.openUPSC =
    openUPSC;

window.openBank =
    openBank;

window.openWBP =
    openWBP;

window.openKolkataPolice =
    openKolkataPolice;

window.openRailway =
    openRailway;

window.openWBCS =
    openWBCS;

window.openWBPSCClerkship =
    openWBPSCClerkship;

window.openExam =
    openExam;

window.showMockTest =
    showMockTest;

window.openMockTests =
    openMockTests;

window.openQuiz =
    openQuiz;

window.startMock =
    startMock;

window.showQuiz =
    showQuiz;


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "================================="
        );

        console.log(
            "✅ ITTA LEARN SCRIPT READY"
        );

        console.log(
            "✅ SSC"
        );

        console.log(
            "✅ UPSC"
        );

        console.log(
            "✅ BANK"
        );

        console.log(
            "✅ WBP"
        );

        console.log(
            "✅ KOLKATA POLICE"
        );

        console.log(
            "✅ RAILWAY"
        );

        console.log(
            "✅ WBCS"
        );

        console.log(
            "✅ WBPSC CLERKSHIP"
        );

        console.log(
            "🎙️ MICROPHONE READY"
        );

        console.log(
            "🤖 AI READY"
        );

        console.log(
            "⭐ PREMIUM READY"
        );

        console.log(
            "================================="
        );

    }
);/* =========================================================
   ITTA LEARN - PART 8
   FINAL COMPATIBILITY + ERROR HANDLING
========================================================= */


/* =========================================================
   SAFE FUNCTION CALL
========================================================= */

function safeCall(
    fn,
    ...args
) {

    try {

        if (
            typeof fn === "function"
        ) {

            return fn(
                ...args
            );

        }

    } catch (error) {

        console.error(
            "Function error:",
            error
        );

    }

    return null;

}


/* =========================================================
   HANDLE JSON / FETCH ERROR
========================================================= */

window.addEventListener(
    "unhandledrejection",
    function(event) {

        console.error(
            "Unhandled Promise Error:",
            event.reason
        );

    }
);


window.addEventListener(
    "error",
    function(event) {

        console.error(
            "JavaScript Error:",
            event.error || event.message
        );

    }
);


/* =========================================================
   CONNECT OLD EXAM BUTTONS
========================================================= */

function connectExamButtons() {

    const examMap = {

        "ssc":
            "SSC",

        "upsc":
            "UPSC",

        "bank":
            "BANK",

        "wbp":
            "WBP",

        "kolkata-police":
            "KOLKATA_POLICE",

        "kolkata_police":
            "KOLKATA_POLICE",

        "railway":
            "RAILWAY",

        "wbcs":
            "WBCS",

        "wbpsc-clerkship":
            "WBPSC_CLERKSHIP",

        "wbpsc_clerkship":
            "WBPSC_CLERKSHIP"

    };


    Object.keys(
        examMap
    ).forEach(
        function(key) {

            const elements =
                document.querySelectorAll(
                    `[data-exam="${key}"]`
                );


            elements.forEach(
                function(element) {

                    element.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            startMockTest(
                                examMap[key]
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   CONNECT AI BUTTONS
========================================================= */

function connectAIButtons() {

    const aiButtons =
        document.querySelectorAll(
            "#askBtn, #askButton, #sendBtn, #sendButton, .ask-btn, .send-ai-btn"
        );


    aiButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    askIttaAI();

                }
            );

        }
    );

}


/* =========================================================
   CONNECT MICROPHONE BUTTONS
========================================================= */

function connectMicrophoneButtons() {

    const micButtons =
        document.querySelectorAll(
            "#micBtn, #micButton, #voiceBtn, #voiceButton, .mic-btn, .voice-btn"
        );


    micButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    toggleMicrophone();

                }
            );

        }
    );

}


/* =========================================================
   CONNECT ENTER KEY
========================================================= */

function connectAIEnterKey() {

    const input =
        getAIInput();


    if (
        !input
    ) {

        return;

    }


    input.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                askIttaAI();

            }

        }
    );

}


/* =========================================================
   CHECK REQUIRED ELEMENTS
========================================================= */

function checkRequiredElements() {

    const mockBox =
        $("mockTestBox");


    if (
        !mockBox
    ) {

        console.warn(
            "⚠️ mockTestBox পাওয়া যায়নি। HTML-এ id='mockTestBox' আছে কি না check করো।"
        );

    }


    const aiInput =
        getAIInput();


    if (
        !aiInput
    ) {

        console.warn(
            "⚠️ AI input box পাওয়া যায়নি।"
        );

    }


    const aiResponse =
        getAIResponseBox();


    if (
        !aiResponse
    ) {

        console.warn(
            "⚠️ AI response box পাওয়া যায়নি।"
        );

    }

}


/* =========================================================
   CHECK EXAM CONFIGURATION
========================================================= */

function checkExamConfiguration() {

    Object.keys(
        examFiles
    ).forEach(
        function(exam) {

            if (
                !examFiles[exam]
            ) {

                console.error(
                    "❌ JSON file missing for:",
                    exam
                );

            } else {

                console.log(
                    "📁 " +
                    exam +
                    " → " +
                    examFiles[exam]
                );

            }

        }
    );

}


/* =========================================================
   TEST JSON FILES
========================================================= */

async function testExamJSON(
    exam
) {

    try {

        const data =
            await fetchExamJSON(
                exam
            );


        const questions =
            extractQuestionArray(
                data
            );


        console.log(
            "✅ " +
            exam +
            " JSON loaded. Questions:",
            questions.length
        );


        return true;

    } catch (
        error
    ) {

        console.error(
            "❌ " +
            exam +
            " JSON failed:",
            error
        );


        return false;

    }

}


/* =========================================================
   TEST ALL EXAMS
========================================================= */

async function testAllExamJSON() {

    const results = {};


    for (
        const exam of
        Object.keys(
            examFiles
        )
    ) {

        results[exam] =
            await testExamJSON(
                exam
            );

    }


    console.table(
        results
    );


    return results;

}


/* =========================================================
   OPTIONAL DEBUG FUNCTION
========================================================= */

function debugIttaLearn() {

    console.log(
        "========== ITTA LEARN DEBUG =========="
    );


    console.log(
        "Selected Exam:",
        selectedExam
    );


    console.log(
        "Selected Part:",
        selectedPart
    );


    console.log(
        "Questions:",
        currentQuestions.length
    );


    console.log(
        "Current Question:",
        currentQuestionIndex + 1
    );


    console.log(
        "Score:",
        score
    );


    console.log(
        "Premium:",
        isPremiumUnlocked()
    );


    console.log(
        "Mic Supported:",
        isMicSupported()
    );


    console.log(
        "======================================"
    );

}


/* =========================================================
   RESET EVERYTHING
========================================================= */

function resetIttaLearn() {

    stopLiveTimer();

    clearAutoNextTimer();

    stopMicrophone();


    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    selectedExam =
        "";

    selectedPart =
        "";

    selectedExamCategory =
        "";

    answerLocked =
        false;

    testStartTime =
        null;

    testEndTime =
        null;


    backToExamList();

}


/* =========================================================
   GLOBAL DEBUG / RESET
========================================================= */

window.testExamJSON =
    testExamJSON;

window.testAllExamJSON =
    testAllExamJSON;

window.debugIttaLearn =
    debugIttaLearn;

window.resetIttaLearn =
    resetIttaLearn;


/* =========================================================
   FINAL DOM INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        try {

            connectExamButtons();

            connectAIButtons();

            connectMicrophoneButtons();

            connectAIEnterKey();

            checkRequiredElements();

            checkExamConfiguration();


            console.log(
                "✅ Button compatibility connected"
            );


            console.log(
                "✅ AI buttons connected"
            );


            console.log(
                "✅ Mic buttons connected"
            );


            console.log(
                "✅ JSON configuration checked"
            );


            console.log(
                "🎉 ITTA LEARN FINAL SCRIPT INITIALIZED"
            );


        } catch (
            error
        ) {

            console.error(
                "❌ Initialization error:",
                error
            );

        }

    }
);


/* =========================================================
   FINAL GLOBAL ERROR PROTECTION
========================================================= */

window.addEventListener(
    "beforeunload",
    function() {

        stopLiveTimer();

        clearAutoNextTimer();

        if (
            recognition
        ) {

            try {

                recognition.stop();

            } catch (
                error
            ) {

                console.warn(
                    error
                );

            }

        }

    }
);


/* =========================================================
   END OF SCRIPT
========================================================= *//* =========================================================
   ITTA LEARN - PART 9
   ADVANCED PART FINDER + JSON COMPATIBILITY
========================================================= */


/* =========================================================
   FIND PART KEY
========================================================= */

function findPartKey(data, partName) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return null;

    }


    const number =
        getPartNumber(
            partName
        );


    const wantedNumber =
        String(number).trim();


    const keys =
        Object.keys(data);


    for (
        const key of keys
    ) {

        const normalized =
            String(key)
                .toLowerCase()
                .replace(
                    /[\s_-]/g,
                    ""
                );


        const wanted =
            "part" +
            wantedNumber;


        if (
            normalized === wanted
        ) {

            return key;

        }

    }


    return null;

}


/* =========================================================
   ADVANCED PART QUESTION FINDER
========================================================= */

function findQuestionsFromPart(
    data,
    partName
) {
    if (!data || typeof data !== "object") return [];

    const number = Number(getPartNumber(partName));
    if (!number) return [];

    const containers = [data, data.parts, data.part, data.questionParts, data.question_parts];

    for (const container of containers) {
        if (!container) continue;

        // Object format: { "Part 1": [...] } / { "part1": [...] }
        if (!Array.isArray(container) && typeof container === "object") {
            for (const key of Object.keys(container)) {
                const keyNumber = Number(String(key).match(/\d+/)?.[0] || 0);
                if (keyNumber === number) {
                    const value = container[key];
                    const questions = extractQuestionArray(value);
                    if (questions.length) return questions;
                }
            }
        }

        // Array format: [{ part: 1, questions: [...] }, ...]
        if (Array.isArray(container)) {
            for (const item of container) {
                if (!item || typeof item !== "object") continue;
                const itemNumber = Number(
                    item.part ?? item.partNumber ?? item.part_no ?? item.number ??
                    (String(item.id ?? "").match(/\d+/)?.[0] || 0)
                );
                if (itemNumber === number) {
                    const questions = extractQuestionArray(item.questions ?? item.data ?? item.items ?? item);
                    if (questions.length) return questions;
                }
            }
        }
    }

    return [];
}

/* =========================================================
   REPLACE PART LOADER WITH ADVANCED LOADER
========================================================= */

async function loadSelectedPart(
    exam,
    partName
) {

    const data =
        await fetchExamJSON(
            exam
        );


    const rawQuestions =
        findQuestionsFromPart(
            data,
            partName
        );


    const questions =
        normalizeQuestions(
            rawQuestions
        );


    if (
        !questions.length
    ) {

        throw new Error(

            exam +
            " → " +
            partName +
            " এ valid questions পাওয়া যায়নি।"

        );

    }


    return questions;

}


/* =========================================================
   ADVANCED QUESTION STARTER
========================================================= */

async function startSelectedPart(
    exam,
    partName
) {

    stopLiveTimer();

    clearAutoNextTimer();


    selectedExam =
        exam;

    selectedPart =
        partName;


    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    answerLocked =
        false;


    const box =
        $("mockTestBox");


    if (
        box
    ) {

        box.innerHTML = `

            <div class="result-box">

                <h3>
                    📚 Loading...
                </h3>

                <p>

                    ${escapeHTML(
                        getExamName(
                            exam
                        )
                    )}

                    —

                    Part
                    ${escapeHTML(
                        getPartNumber(
                            partName
                        )
                    )}

                </p>

                <p>
                    ⏳ Questions loading...
                </p>

            </div>

        `;

    }


    try {

        const questions =
            await loadSelectedPart(
                exam,
                partName
            );


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


        currentQuestionIndex =
            0;

        score =
            0;

        answerLocked =
            false;

        testStartTime =
            Date.now();

        testEndTime =
            null;


        renderQuestion();

        startLiveTimer();


    } catch (
        error
    ) {

        console.error(
            error
        );


        if (
            box
        ) {

            box.innerHTML = `

                <div class="result-box">

                    <h3>
                        ❌ Questions পাওয়া যায়নি
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>


                    <button
                        type="button"
                        class="exam-btn"
                        onclick="showExamParts(
                            '${escapeHTML(exam)}'
                        )"
                    >

                        🔙 Back

                    </button>

                </div>

            `;

        }

    }

}


/* =========================================================
   ADVANCED PART FUNCTION
========================================================= */

function openPart(
    exam,
    part
) {

    return startSelectedPart(
        exam,
        part
    );

}


/* =========================================================
   GLOBAL EXPORT
========================================================= */

window.openPart =
    openPart;

window.startSelectedPart =
    startSelectedPart;

window.loadSelectedPart =
    loadSelectedPart;

window.findQuestionsFromPart =
    findQuestionsFromPart;


/* =========================================================
   FINAL MESSAGE
========================================================= */

console.log(
    "✅ Advanced JSON Part Finder loaded"
);

console.log(
    "✅ Part 1 / part1 / Part_1 supported"
);
/* =========================================================
   ITTA LEARN - SUPABASE LOGIN / SIGN UP
   ADD-ON ONLY — EXISTING APP LOGIC LEFT UNCHANGED
========================================================= */

(function () {
    "use strict";

    const ITTA_SUPABASE_URL =
        "https://aihtcylgmafslwkmagfa.supabase.co";

    const ITTA_SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_ggO6yw6McKguUBC1_YWAAA_jrC6bS0h";

    let ittaSupabase = null;
    let ittaAuthReady = false;

    function ittaLoadSupabase() {
        return new Promise(function (resolve, reject) {
            if (window.supabase && typeof window.supabase.createClient === "function") {
                resolve();
                return;
            }

            const existing = document.querySelector(
                'script[data-itta-supabase="true"]'
            );

            if (existing) {
                existing.addEventListener("load", function () { resolve(); });
                existing.addEventListener("error", function () {
                    reject(new Error("Supabase library load failed."));
                });
                return;
            }

            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.async = true;
            script.dataset.ittaSupabase = "true";

            script.onload = function () { resolve(); };
            script.onerror = function () {
                reject(new Error("Supabase library load failed."));
            };

            document.head.appendChild(script);
        });
    }

    function ittaEscape(value) {
        if (typeof escapeHTML === "function") {
            return escapeHTML(value);
        }

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function ittaFindLoginButton() {
        const selectors = [
            "#loginBtn",
            "#loginButton",
            "#signupBtn",
            "#signUpBtn",
            "#authBtn",
            "[data-auth-button]",
            ".login-btn",
            ".signup-btn"
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    function ittaCreateAuthUI() {
        if (document.getElementById("ittaAuthArea")) return;

        const host = document.createElement("div");
        host.id = "ittaAuthArea";
        host.style.cssText =
            "margin:12px 0;text-align:center;position:relative;z-index:10;";

        host.innerHTML = `
            <button
                id="ittaLoginOpenBtn"
                type="button"
                class="exam-btn"
                style="cursor:pointer;"
            >🔐 Login / Sign Up</button>

            <span
                id="ittaUserStatus"
                style="display:none;margin-left:8px;font-weight:600;"
            ></span>
        `;

        const preferredHost =
            document.querySelector("header") ||
            document.querySelector("nav") ||
            document.querySelector("main") ||
            document.body.firstElementChild;

        if (preferredHost && preferredHost.parentNode) {
            preferredHost.parentNode.insertBefore(host, preferredHost.nextSibling);
        } else {
            document.body.prepend(host);
        }

        document.getElementById("ittaLoginOpenBtn").addEventListener(
            "click",
            function () {
                ittaOpenAuthModal();
            }
        );
    }

    function ittaCreateModal() {
        if (document.getElementById("ittaAuthModal")) return;

        const modal = document.createElement("div");
        modal.id = "ittaAuthModal";
        modal.style.cssText =
            "display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);" +
            "z-index:99999;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;";

        modal.innerHTML = `
            <div
                style="
                    width:min(420px,100%);
                    max-height:90vh;
                    overflow:auto;
                    background:#fff;
                    border-radius:16px;
                    padding:20px;
                    box-sizing:border-box;
                    box-shadow:0 10px 40px rgba(0,0,0,.25);
                    color:#111;
                "
            >
                <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                    <h2 id="ittaAuthTitle" style="margin:0;">🔐 Login</h2>
                    <button
                        id="ittaAuthCloseBtn"
                        type="button"
                        aria-label="Close"
                        style="border:0;background:transparent;font-size:24px;cursor:pointer;"
                    >×</button>
                </div>

                <p id="ittaAuthMessage" style="margin:12px 0;line-height:1.5;"></p>

                <label style="display:block;margin:10px 0 6px;">Email</label>
                <input
                    id="ittaAuthEmail"
                    type="email"
                    autocomplete="email"
                    placeholder="Enter email"
                    style="width:100%;padding:11px;box-sizing:border-box;border:1px solid #ccc;border-radius:8px;"
                >

                <label style="display:block;margin:10px 0 6px;">Password</label>
                <input
                    id="ittaAuthPassword"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Enter password"
                    style="width:100%;padding:11px;box-sizing:border-box;border:1px solid #ccc;border-radius:8px;"
                >

                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
                    <button
                        id="ittaLoginSubmit"
                        type="button"
                        class="exam-btn"
                    >🔐 Login</button>

                    <button
                        id="ittaSignupSubmit"
                        type="button"
                        class="exam-btn"
                    >📝 Sign Up</button>

                    <button
                        id="ittaLogoutSubmit"
                        type="button"
                        class="exam-btn"
                        style="display:none;"
                    >🚪 Logout</button>
                </div>

                <p style="margin:14px 0 0;font-size:13px;opacity:.75;">
                    Your password is handled by Supabase Authentication.
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("ittaAuthCloseBtn").addEventListener(
            "click",
            ittaCloseAuthModal
        );

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                ittaCloseAuthModal();
            }
        });

        document.getElementById("ittaLoginSubmit").addEventListener(
            "click",
            ittaLogin
        );

        document.getElementById("ittaSignupSubmit").addEventListener(
            "click",
            ittaSignup
        );

        document.getElementById("ittaLogoutSubmit").addEventListener(
            "click",
            ittaLogout
        );
    }

    function ittaOpenAuthModal() {
        const modal = document.getElementById("ittaAuthModal");
        if (!modal) return;

        modal.style.display = "flex";

        const password = document.getElementById("ittaAuthPassword");
        if (password) password.value = "";

        ittaSetMessage("", "info");
        ittaUpdateAuthUI();
    }

    function ittaCloseAuthModal() {
        const modal = document.getElementById("ittaAuthModal");
        if (modal) modal.style.display = "none";
    }

    function ittaSetMessage(message, type) {
        const box = document.getElementById("ittaAuthMessage");
        if (!box) return;

        const prefix =
            type === "success" ? "✅ " :
            type === "error" ? "❌ " :
            type === "warning" ? "⚠️ " :
            "";

        box.innerHTML =
            prefix + ittaEscape(message);

        box.style.fontWeight = type === "error" ? "600" : "400";
    }

    function ittaGetCredentials() {
        const emailElement = document.getElementById("ittaAuthEmail");
        const passwordElement = document.getElementById("ittaAuthPassword");

        const email = String(emailElement?.value || "").trim();
        const password = String(passwordElement?.value || "");

        if (!email) {
            ittaSetMessage("Email লিখুন।", "warning");
            return null;
        }

        if (!password || password.length < 6) {
            ittaSetMessage("Password কমপক্ষে 6 characters হতে হবে।", "warning");
            return null;
        }

        return { email, password };
    }

    async function ittaEnsureProfile(user) {
        if (!ittaSupabase || !user) return;

        try {
            await ittaSupabase
                .from("profiles")
                .upsert(
                    {
                        id: user.id,
                        email: user.email
                    },
                    { onConflict: "id" }
                );
        } catch (error) {
            console.warn("Profile sync skipped:", error);
        }
    }

    async function ittaLogin() {
        if (!ittaSupabase) {
            ittaSetMessage("Supabase এখনও ready হয়নি। একটু পরে আবার চেষ্টা করুন।", "error");
            return;
        }

        const credentials = ittaGetCredentials();
        if (!credentials) return;

        ittaSetMessage("Login হচ্ছে...", "info");

        const result = await ittaSupabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        });

        if (result.error) {
            console.error("Supabase login error:", result.error);
            ittaSetMessage(result.error.message, "error");
            return;
        }

        await ittaEnsureProfile(result.data.user);

        ittaSetMessage("Login successful!", "success");
        ittaUpdateAuthUI(result.data.user);

        setTimeout(function () {
            ittaCloseAuthModal();
        }, 600);
    }

    async function ittaSignup() {
        if (!ittaSupabase) {
            ittaSetMessage("Supabase এখনও ready হয়নি। একটু পরে আবার চেষ্টা করুন।", "error");
            return;
        }

        const credentials = ittaGetCredentials();
        if (!credentials) return;

        ittaSetMessage("Account তৈরি হচ্ছে...", "info");

        const result = await ittaSupabase.auth.signUp({
            email: credentials.email,
            password: credentials.password
        });

        if (result.error) {
            console.error("Supabase signup error:", result.error);
            ittaSetMessage(result.error.message, "error");
            return;
        }

        if (result.data.user) {
            await ittaEnsureProfile(result.data.user);
        }

        if (result.data.session) {
            ittaSetMessage("Sign Up successful!", "success");
            ittaUpdateAuthUI(result.data.user);

            setTimeout(function () {
                ittaCloseAuthModal();
            }, 600);
        } else {
            ittaSetMessage(
                "Account তৈরি হয়েছে। Email verification চাইলে আপনার email inbox check করুন।",
                "success"
            );
        }
    }

    async function ittaLogout() {
        if (!ittaSupabase) return;

        const result = await ittaSupabase.auth.signOut();

        if (result.error) {
            console.error("Supabase logout error:", result.error);
            ittaSetMessage(result.error.message, "error");
            return;
        }

        ittaSetMessage("Logout successful.", "success");
        ittaUpdateAuthUI(null);
    }

    function ittaUpdateAuthUI(user) {
        const openButton = document.getElementById("ittaLoginOpenBtn");
        const status = document.getElementById("ittaUserStatus");
        const loginButton = document.getElementById("ittaLoginSubmit");
        const signupButton = document.getElementById("ittaSignupSubmit");
        const logoutButton = document.getElementById("ittaLogoutSubmit");
        const title = document.getElementById("ittaAuthTitle");

        if (user) {
            if (openButton) openButton.textContent = "👤 Account";
            if (status) {
                status.style.display = "inline";
                status.textContent = user.email || "Logged in";
            }
            if (loginButton) loginButton.style.display = "none";
            if (signupButton) signupButton.style.display = "none";
            if (logoutButton) logoutButton.style.display = "inline-block";
            if (title) title.textContent = "👤 Account";
        } else {
            if (openButton) openButton.textContent = "🔐 Login / Sign Up";
            if (status) status.style.display = "none";
            if (loginButton) loginButton.style.display = "inline-block";
            if (signupButton) signupButton.style.display = "inline-block";
            if (logoutButton) logoutButton.style.display = "none";
            if (title) title.textContent = "🔐 Login";
        }
    }

    function ittaConnectExistingAuthButtons() {
        const selectors = [
            "#loginBtn",
            "#loginButton",
            "#signupBtn",
            "#signUpBtn",
            "#authBtn",
            "[data-auth-button]",
            ".login-btn",
            ".signup-btn"
        ];

        document.querySelectorAll(selectors.join(",")).forEach(function (button) {
            if (button.dataset.ittaAuthConnected === "true") return;

            button.dataset.ittaAuthConnected = "true";
            button.addEventListener("click", function (event) {
                event.preventDefault();
                ittaOpenAuthModal();
            });
        });
    }

    async function ittaInitAuth() {
        try {
            await ittaLoadSupabase();

            ittaSupabase = window.supabase.createClient(
                ITTA_SUPABASE_URL,
                ITTA_SUPABASE_PUBLISHABLE_KEY
            );

            ittaAuthReady = true;

            const sessionResult =
                await ittaSupabase.auth.getSession();

            const user =
                sessionResult.data?.session?.user || null;

            await ittaEnsureProfile(user);
            ittaUpdateAuthUI(user);

            ittaSupabase.auth.onAuthStateChange(function (_event, session) {
                const currentUser = session?.user || null;
                ittaUpdateAuthUI(currentUser);

                if (currentUser) {
                    setTimeout(function () {
                        ittaEnsureProfile(currentUser);
                    }, 0);
                }
            });

            console.log("✅ Supabase Login / Sign Up ready");
        } catch (error) {
            console.error("❌ Supabase Auth initialization failed:", error);
            ittaSetMessage(
                "Login system load হয়নি। Existing app functionality is unchanged.",
                "error"
            );
        }
    }

    function ittaInitAuthUI() {
        ittaCreateAuthUI();
        ittaCreateModal();
        ittaConnectExistingAuthButtons();
        ittaInitAuth();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            ittaInitAuthUI,
            { once: true }
        );
    } else {
        ittaInitAuthUI();
    }

    window.ittaOpenAuth = ittaOpenAuthModal;
    window.ittaLogin = ittaLogin;
    window.ittaSignup = ittaSignup;
    window.ittaLogout = ittaLogout;
    window.ittaGetSupabase = function () {
        return ittaSupabase;
    };

})();
