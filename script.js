"use strict";

/* =====================================================
   ITTA STUDY IQ — UPDATED SCRIPT
   Exams:
   SSC, UPSC, Bank, WBP, Kolkata Police, Railway,
   WBCS, WBPSC Clerkship

   Free Parts: 1–20
   Premium Parts: 21–100
===================================================== */

window.ITTAStudyIQ = window.ITTAStudyIQ || {};

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

const QUESTIONS_PER_TEST = 10;
const AUTO_NEXT_DELAY = 1200;

const FREE_PART_START = 1;
const FREE_PART_END = 20;

const PAID_PART_START = 21;
const PAID_PART_END = 100;

const PREMIUM_PRICE = 49;


/* =====================================================
   EXAM JSON FILES
===================================================== */

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
        "wbcs_questions.json",

    WBPSC_CLERKSHIP:
        "wbpsc_clerkship_questions.json"

};


/* =====================================================
   EXAM DISPLAY NAMES
===================================================== */

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


/* =====================================================
   EXAM CATEGORIES
===================================================== */

const examCategories = {

    SSC: [
        "SSC CGL",
        "SSC CHSL",
        "SSC MTS",
        "SSC GD",
        "SSC CPO",
        "SSC Stenographer"
    ],

    UPSC: [
        "UPSC Civil Services (CSE)",
        "UPSC CDS",
        "UPSC NDA",
        "UPSC CAPF"
    ],

    BANK: [
        "SBI PO",
        "SBI Clerk",
        "IBPS PO",
        "IBPS Clerk",
        "IBPS RRB",
        "RBI Grade B"
    ],

    WBP: [
        "WBP Constable",
        "WBP SI",
        "WBP Lady Constable"
    ],

    KOLKATA_POLICE: [
        "Kolkata Police Constable",
        "Kolkata Police SI"
    ],

    RAILWAY: [
        "RRB NTPC",
        "RRB Group D",
        "RRB ALP",
        "RRB JE",
        "RRB Technician"
    ],

    WBCS: [
        "WBCS Executive",
        "WBCS Preliminary",
        "WBCS Main"
    ],

    WBPSC_CLERKSHIP: [
        "WBPSC Clerkship Part I",
        "WBPSC Clerkship Part II"
    ]

};


/* =====================================================
   PAGE READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "✅ Itta Study IQ updated script loaded"
        );

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
                            typeof askTutor ===
                            "function"
                        ) {

                            askTutor();

                        }

                    }

                }
            );

        }

    }
);


/* =====================================================
   AI STUDY TUTOR
===================================================== */

async function askTutor() {

    const questionBox =
        document.getElementById("question");

    const answerBox =
        document.getElementById("answer");

    if (
        !questionBox ||
        !answerBox
    ) {
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
            await fetch(
                "/ask",
                {
                    method: "POST",

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

    recognition.onstart =
        function () {

            questionBox.placeholder =
                "Listening...";

        };

    recognition.onresult =
        function (event) {

            questionBox.value =
                event.results[0][0].transcript;

        };

    recognition.onerror =
        function (event) {

            console.error(
                "Microphone Error:",
                event.error
            );

        };

    recognition.onend =
        function () {

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

            <h3>
                🧠 Quick Study Quiz
            </h3>

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
    }/* =====================================================
   MOCK TEST — START
===================================================== */

function startMockTest(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = "";
    selectedExamCategory = "";

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    answerLocked = false;
    testStartTime = null;
    testEndTime = null;

    showExamParts(exam);
}


/* =====================================================
   SHOW EXAM PARTS
===================================================== */

function showExamParts(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = "";

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        console.error(
            "mockTestBox not found"
        );
        return;
    }

    const examName =
        examPartNames[exam] || exam;

    const categories =
        examCategories[exam] || [];


    /* -----------------------------
       CATEGORY BUTTONS
    ----------------------------- */

    let categoryHTML = "";

    if (categories.length > 0) {

        categoryHTML = `

            <div class="exam-category-section">

                <div class="exam-category-title">

                    📚
                    ${escapeHTML(examName)}
                    Exams

                </div>

                <div class="exam-grid">

                    ${categories
                        .map(
                            function (category) {

                                return `

                                    <button
                                        type="button"
                                        class="exam-btn category-btn"
                                        onclick="selectExamCategory(
                                            '${exam}',
                                            '${category.replace(
                                                /'/g,
                                                "\\'"
                                            )}'
                                        )"
                                    >

                                        ${escapeHTML(
                                            category
                                        )}

                                    </button>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </div>

        `;

    }


    /* -----------------------------
       FREE PARTS 1–20
    ----------------------------- */

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
                onclick="
                    selectExamPart(
                        '${exam}',
                        'part${i}'
                    )
                "
            >

                🆓 Part ${i}

            </button>

        `;

    }


    /* -----------------------------
       MAIN SCREEN
    ----------------------------- */

    container.innerHTML = `

        <div class="exam-parts">

            <h3>

                📚
                ${escapeHTML(examName)}

            </h3>

            <p>

                Select your exam category
                and Mock Test

            </p>


            ${categoryHTML}


            <!-- FREE SECTION -->

            <div class="free-section">

                <h4>

                    🆓
                    Free Mock Tests

                </h4>

                <p>

                    Part 1 - 20

                </p>

                <div class="exam-grid">

                    ${freeButtonsHTML}

                </div>

            </div>


            <!-- PREMIUM SECTION -->

            <div class="premium-section">

                <h4>

                    ⭐
                    Premium Mock Tests

                </h4>

                <p>

                    Part 21 - 100

                </p>

                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="
                        showPaidParts(
                            '${exam}'
                        )
                    "
                >

                    ⭐ Premium Parts 21–100

                </button>

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="
                    chooseExamAgain()
                "
            >

                🔙 Back to Exams

            </button>

        </div>

    `;

}


/* =====================================================
   EXAM CATEGORY
===================================================== */

function selectExamCategory(
    exam,
    category
) {

    selectedExam = exam;

    selectedExamCategory =
        category;

    showExamParts(exam);

}


/* =====================================================
   PREMIUM PARTS
===================================================== */

function showPaidParts(exam) {

    stopLiveTimer();
    clearAutoNextTimer();

    selectedExam = exam;
    selectedPart = "";

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }

    const examName =
        examPartNames[exam] ||
        exam;


    let buttonsHTML = "";


    /* -----------------------------
       PART 21–100 BUTTONS
    ----------------------------- */

    for (
        let i = PAID_PART_START;
        i <= PAID_PART_END;
        i++
    ) {

        buttonsHTML += `

            <button
                type="button"
                class="
                    exam-btn
                    part-btn
                    paid-part-btn
                    premium-main-btn
                "
                onclick="
                    openPaidPart(
                        '${exam}',
                        'part${i}'
                    )
                "
            >

                ⭐ Part ${i}

            </button>

        `;

    }


    container.innerHTML = `

        <div
            class="
                exam-parts
                paid-parts-section
            "
        >

            <h3>

                ⭐
                ${escapeHTML(examName)}
                Premium — ₹49

            </h3>


            <p>

                Golden Premium Mock Tests

            </p>


            <div class="premium-info">

                <strong>

                    ⭐ GOLD PREMIUM — ₹49

                </strong>

                <p>

                    Free Parts 1–20
                    are available.

                    Premium Parts 21–100
                    contain advanced
                    practice questions.

                </p>


                <button
                    type="button"
                    class="
                        exam-btn
                        premium-main-btn
                    "
                    onclick="
                        showPaymentMessage(
                            '${exam}'
                        )
                    "
                >

                    ⭐ Unlock Premium — ₹49

                </button>

            </div>


            <div class="exam-grid">

                ${buttonsHTML}

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="
                    showExamParts(
                        '${exam}'
                    )
                "
            >

                🔙 Back to Free Parts

            </button>

        </div>

    `;

}


/* =====================================================
   PREMIUM PART OPEN
===================================================== */

function openPaidPart(
    exam,
    partName
) {

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
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }

    const examName =
        examPartNames[exam] ||
        exam;


    const partText =
        partName
            ? "Part " +
              String(partName)
                  .replace(
                      "part",
                      ""
                  )
            : "Premium Parts 21–100";


    container.innerHTML = `

        <div class="result-box">

            <div
                style="
                    font-size:48px;
                    text-align:center;
                    margin-bottom:10px;
                "
            >

                ⭐

            </div>


            <h2
                style="
                    color:#9a6500;
                    text-align:center;
                "
            >

                ${escapeHTML(examName)}
                Premium

            </h2>


            <h3
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(partText)}

            </h3>


            <div
                style="
                    padding:16px;
                    margin:16px 0;
                    border-radius:14px;
                    background:#fff8df;
                    border:1px solid #e0b64e;
                "
            >

                <strong>

                    ⭐ Premium Access — ₹49

                </strong>

                <p>

                    Parts 21–100 are
                    protected Premium
                    Mock Tests.

                </p>

            </div>


            <div
                class="premium-payment-note"
            >

                🔐
                Secure payment
                verification required.

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="
                    showPaidParts(
                        '${exam}'
                    )
                "
            >

                🔙 Back to Premium

            </button>


            <button
                type="button"
                class="exam-btn"
                onclick="
                    showExamParts(
                        '${exam}'
                    )
                "
            >

                🔙 Back to Parts

            </button>

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

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


/* =====================================================
   SHUFFLE ARRAY
===================================================== */

function shuffleArray(array) {

    const result =
        [...array];

    for (
        let i =
            result.length - 1;
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

} /* =====================================================
   LOAD EXAM PART JSON
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


    /*
       IMPORTANT:
       cache: no-store prevents the browser
       from repeatedly using an old WBP JSON.
    */

    const response =
        await fetch(
            file +
            "?v=" +
            Date.now(),
            {
                method: "GET",
                cache: "no-store"
            }
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


    /*
       Supported JSON structure:

       {
         "exam": "WBP",
         "parts": [
           {
             "part": "part1",
             "questions": []
           }
         ]
       }

       Also supports:
       "name": "part1"
    */

    if (
        data &&
        Array.isArray(
            data.parts
        )
    ) {

        const foundPart =
            data.parts.find(
                function (item) {

                    if (!item) {
                        return false;
                    }


                    const itemPart =
                        String(
                            item.part ??
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const itemName =
                        String(
                            item.name ??
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const requestedPart =
                        String(
                            partName
                        )
                            .trim()
                            .toLowerCase();


                    return (
                        itemPart ===
                        requestedPart ||

                        itemName ===
                        requestedPart ||

                        itemPart ===
                        requestedPart
                            .replace(
                                "part",
                                ""
                            ) ||

                        itemName ===
                        requestedPart
                            .replace(
                                "part",
                                ""
                            )
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


    /*
       Alternative structure:

       {
         "part1": {
           "questions": []
         }
       }
    */

    const directPart =
        data &&
        data[partName];


    if (
        directPart &&
        Array.isArray(
            directPart.questions
        )
    ) {

        return normalizeQuestions(
            directPart.questions
        );

    }


    /*
       Alternative structure:

       {
         "part1": []
       }
    */

    if (
        data &&
        Array.isArray(
            data[partName]
        )
    ) {

        return normalizeQuestions(
            data[partName]
        );

    }


    return [];

}


/* =====================================================
   NORMALIZE QUESTIONS
===================================================== */

function normalizeQuestions(
    questions
) {

    if (
        !Array.isArray(
            questions
        )
    ) {

        return [];

    }


    return questions

        .filter(
            function (question) {

                return (
                    question &&
                    typeof question ===
                    "object"
                );

            }
        )

        .map(
            function (question) {

                const normalized = {
                    ...question
                };


                /* -----------------------------
                   QUESTION TEXT
                ----------------------------- */

                normalized.question =
                    question.question ||
                    question.questionText ||
                    question.q ||
                    question.text ||
                    "";


                /* -----------------------------
                   OPTIONS
                ----------------------------- */

                normalized.options =
                    Array.isArray(
                        question.options
                    )
                        ? question.options

                        : (
                            Array.isArray(
                                question.answers
                            )
                                ? question.answers

                                : (
                                    Array.isArray(
                                        question.choices
                                    )
                                        ? question.choices

                                        : []
                                )
                        );


                /* -----------------------------
                   CORRECT ANSWER
                ----------------------------- */

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

            }
        )

        .filter(
            function (question) {

                return (
                    question.question &&
                    Array.isArray(
                        question.options
                    ) &&
                    question.options.length >
                    0
                );

            }
        );

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


    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {
        return;
    }


    const examName =
        examPartNames[exam] ||
        exam;


    const partNumber =
        String(partName)
            .replace(
                /part/i,
                ""
            );


    container.innerHTML = `

        <div class="result-box">

            <h3>

                📚
                ${escapeHTML(
                    examName
                )}

            </h3>

            <h4>

                Part
                ${escapeHTML(
                    partNumber
                )}

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
            !Array.isArray(
                questions
            ) ||
            questions.length === 0
        ) {

            container.innerHTML = `

                <div class="result-box">

                    <h3>

                        ⚠️
                        No Questions Found

                    </h3>

                    <p>

                        ${escapeHTML(
                            examName
                        )}
                        -
                        Part
                        ${escapeHTML(
                            partNumber
                        )}

                        এ এখনো questions
                        যোগ করা হয়নি।

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
                        onclick="
                            showExamParts(
                                '${exam}'
                            )
                        "
                    >

                        🔙 Back to Parts

                    </button>

                </div>

            `;

            return;

        }


        /*
           Randomly select maximum
           10 questions.
        */

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

                    ❌
                    Question Loading Error

                </h3>


                <p>

                    ${escapeHTML(
                        examName
                    )}
                    -
                    Part
                    ${escapeHTML(
                        partNumber
                    )}
                    এর JSON file
                    load করা যায়নি।

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
                    onclick="
                        showExamParts(
                            '${exam}'
                        )
                    "
                >

                    🔙 Back to Parts

                </button>

            </div>

        `;

    }

}


/* =====================================================
   MOCK TEST DISPLAY
===================================================== */

function showMockTest() {

    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {
        return;
    }


    if (
        !currentQuestions.length
    ) {
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


    answerLocked =
        false;


    const total =
        currentQuestions.length;


    const current =
        currentQuestionIndex + 1;


    const questionText =
        question.question ||
        "";


    const options =
        Array.isArray(
            question.options
        )
            ? question.options
            : [];


    let optionsHTML = "";


    options.forEach(
        function (
            option,
            index
        ) {

            optionsHTML += `

                <button
                    type="button"
                    class="quiz-option"
                    onclick="
                        checkAnswer(
                            ${index}
                        )
                    "
                >

                    <span
                        class="option-letter"
                    >

                        ${String.fromCharCode(
                            65 + index
                        )}

                    </span>

                    <span>

                        ${escapeHTML(
                            option
                        )}

                    </span>

                </button>

            `;

        }
    );


    container.innerHTML = `

        <div class="mock-test-container">

            <div class="test-header">

                <div>

                    📚
                    ${escapeHTML(
                        examPartNames[
                            selectedExam
                        ] ||
                        selectedExam
                    )}

                </div>


                <div>

                    Part
                    ${escapeHTML(
                        String(
                            selectedPart
                        ).replace(
                            /part/i,
                            ""
                        )
                    )}

                </div>


                <div>

                    Question
                    ${current}
                    /
                    ${total}

                </div>


                <div
                    id="liveTimer"
                >

                    ⏱️ 00:00

                </div>

            </div>


            ${
                selectedExamCategory
                    ? `

                        <div
                            class="
                                selected-category
                            "
                        >

                            ${escapeHTML(
                                selectedExamCategory
                            )}

                        </div>

                    `
                    : ""
            }


            <div class="question-box">

                <h3>

                    Q${current}.

                    ${escapeHTML(
                        questionText
                    )}

                </h3>


                <div
                    class="quiz-options"
                >

                    ${optionsHTML}

                </div>

            </div>

        </div>

    `;

}
   } /* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(
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


    answerLocked =
        true;


    const buttons =
        document.querySelectorAll(
            ".quiz-option"
        );


    const correctIndex =
        getCorrectAnswerIndex(
            question
        );


    buttons.forEach(
        function (
            button,
            index
        ) {

            button.disabled =
                true;


            if (
                index ===
                correctIndex
            ) {

                button.classList.add(
                    "correct-answer"
                );

            }


            if (
                index ===
                selectedIndex &&
                index !==
                correctIndex
            ) {

                button.classList.add(
                    "wrong-answer"
                );

            }

        }
    );


    if (
        selectedIndex ===
        correctIndex
    ) {

        score++;

    }


    autoNextTimer =
        setTimeout(
            function () {

                currentQuestionIndex++;


                if (
                    currentQuestionIndex >=
                    currentQuestions.length
                ) {

                    testEndTime =
                        Date.now();

                    stopLiveTimer();

                    showResult();

                }

                else {

                    showMockTest();

                }

            },
            AUTO_NEXT_DELAY
        );

}


/* =====================================================
   GET CORRECT ANSWER INDEX
===================================================== */

function getCorrectAnswerIndex(
    question
) {

    let answer =
        question.answer;


    /* -----------------------------
       NUMBER ANSWER
    ----------------------------- */

    if (
        typeof answer ===
        "number"
    ) {

        return answer;

    }


    /* -----------------------------
       STRING ANSWER
    ----------------------------- */

    if (
        typeof answer ===
        "string"
    ) {

        const value =
            answer.trim();


        /* 0 / 1 / 2 / 3 */

        if (
            /^[0-9]+$/.test(
                value
            )
        ) {

            return parseInt(
                value,
                10
            );

        }


        /* A / B / C / D */

        const upper =
            value.toUpperCase();


        if (
            /^[A-D]$/.test(
                upper
            )
        ) {

            return (
                upper.charCodeAt(
                    0
                ) - 65
            );

        }


        /* Answer text */

        const options =
            question.options ||
            [];


        const found =
            options.findIndex(
                function (
                    option
                ) {

                    return (
                        String(
                            option
                        )
                            .trim()
                            .toLowerCase() ===
                        value.toLowerCase()
                    );

                }
            );


        if (
            found >= 0
        ) {

            return found;

        }

    }


    /* -----------------------------
       OTHER COMMON FORMATS
    ----------------------------- */

    if (
        typeof question.correctIndex ===
        "number"
    ) {

        return question.correctIndex;

    }


    if (
        typeof question.correctAnswer ===
        "number"
    ) {

        return question.correctAnswer;

    }


    if (
        typeof question.correctAnswer ===
        "string"
    ) {

        const value =
            question.correctAnswer
                .trim();


        if (
            /^[A-D]$/.test(
                value.toUpperCase()
            )
        ) {

            return (
                value.toUpperCase()
                    .charCodeAt(
                        0
                    ) - 65
            );

        }


        const options =
            question.options ||
            [];


        const found =
            options.findIndex(
                function (
                    option
                ) {

                    return (
                        String(
                            option
                        )
                            .trim()
                            .toLowerCase() ===
                        value.toLowerCase()
                    );

                }
            );


        if (
            found >= 0
        ) {

            return found;

        }

    }


    return -1;

}


/* =====================================================
   RESULT
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


    const total =
        currentQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (
                    score /
                    total
                ) * 100
            )
            : 0;


    let resultMessage =
        "";


    if (
        percentage >= 80
    ) {

        resultMessage =
            "🎉 Excellent Performance!";

    }

    else if (
        percentage >= 60
    ) {

        resultMessage =
            "👏 Very Good!";

    }

    else if (
        percentage >= 40
    ) {

        resultMessage =
            "👍 Keep Practicing!";

    }

    else {

        resultMessage =
            "📚 More Practice Needed.";

    }


    const examName =
        examPartNames[
            selectedExam
        ] ||
        selectedExam;


    const partNumber =
        String(
            selectedPart
        )
            .replace(
                /part/i,
                ""
            );


    container.innerHTML = `

        <div class="result-box">

            <div
                style="
                    font-size:56px;
                    text-align:center;
                "
            >

                🏆

            </div>


            <h2
                style="
                    text-align:center;
                "
            >

                Test Completed!

            </h2>


            <h3
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(
                    examName
                )}

                —

                Part
                ${escapeHTML(
                    partNumber
                )}

            </h3>


            <div
                class="result-summary"
            >

                <div>

                    <strong>
                        Score
                    </strong>

                    <br>

                    ${score}
                    /
                    ${total}

                </div>


                <div>

                    <strong>
                        Percentage
                    </strong>

                    <br>

                    ${percentage}%

                </div>

            </div>


            <h3
                style="
                    text-align:center;
                "
            >

                ${resultMessage}

            </h3>


            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:10px;
                    margin-top:20px;
                "
            >

                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        selectExamPart(
                            '${selectedExam}',
                            '${selectedPart}'
                        )
                    "
                >

                    🔄 Try Again

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            '${selectedExam}'
                        )
                    "
                >

                    📚 Choose Another Part

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        chooseExamAgain()
                    "
                >

                    🏠 Choose Another Exam

                </button>

            </div>

        </div>

    `;

}


/* =====================================================
   LIVE TIMER
===================================================== */

function startLiveTimer() {

    stopLiveTimer();


    const timerElement =
        document.getElementById(
            "liveTimer"
        );


    if (!timerElement) {
        return;
    }


    testStartTime =
        Date.now();


    updateLiveTimer();


    testTimerInterval =
        setInterval(
            function () {

                updateLiveTimer();

            },
            1000
        );

}


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateLiveTimer() {

    const timerElement =
        document.getElementById(
            "liveTimer"
        );


    if (
        !timerElement ||
        !testStartTime
    ) {

        return;

    }


    const elapsed =
        Math.floor(
            (
                Date.now() -
                testStartTime
            ) / 1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    timerElement.innerText =
        "⏱️ " +
        String(
            minutes
        ).padStart(
            2,
            "0"
        ) +
        ":" +
        String(
            seconds
        ).padStart(
            2,
            "0"
        );

}


/* =====================================================
   STOP TIMER
===================================================== */

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


/* =====================================================
   CLEAR AUTO NEXT
===================================================== */

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
    selectedExamCategory = "";

    answerLocked = false;


    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {
        return;
    }


    /*
       If the original HTML has
       exam-selection buttons,
       return to that section.
    */

    const examSelection =
        document.getElementById(
            "examSelection"
        );


    if (
        examSelection
    ) {

        examSelection.scrollIntoView({
            behavior: "smooth"
        });

        return;

    }


    container.innerHTML = `

        <div class="exam-parts">

            <h3>

                🎯 Choose Exam

            </h3>


            <div class="exam-grid">


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'SSC'
                        )
                    "
                >

                    📘 SSC

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'UPSC'
                        )
                    "
                >

                    📕 UPSC

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'BANK'
                        )
                "
                >

                    🏦 Bank

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'WBP'
                        )
                    "
                >

                    👮 WBP

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'KOLKATA_POLICE'
                        )
                    "
                >

                    👮 Kolkata Police

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'RAILWAY'
                        )
                    "
                >

                    🚆 Railway

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'WBCS'
                        )
                    "
                >

                    🏛️ WBCS

                </button>


                <button
                    type="button"
                    class="exam-btn"
                    onclick="
                        showExamParts(
                            'WBPSC_CLERKSHIP'
                        )
                    "
                >

                    📚 WBPSC Clerkship

                </button>


            </div>

        </div>

    `;

}


/* =====================================================
   GLOBAL EXPORTS
   Makes buttons work even when
   called from HTML onclick.
===================================================== */

window.startQuiz =
    startQuiz;

window.closeQuiz =
    closeQuiz;

window.startMic =
    startMic;

window.askTutor =
    askTutor;

window.startMockTest =
    startMockTest;

window.showExamParts =
    showExamParts;

window.selectExamPart =
    selectExamPart;

window.selectExamCategory =
    selectExamCategory;

window.showPaidParts =
    showPaidParts;

window.openPaidPart =
    openPaidPart;

window.showPaymentMessage =
    showPaymentMessage;

window.checkAnswer =
    checkAnswer;

window.showResult =
    showResult;

window.chooseExamAgain =
    chooseExamAgain;

window.startLiveTimer =
    startLiveTimer;

window.stopLiveTimer =
    stopLiveTimer;/* =====================================================
   EXTRA SAFETY / CLEANUP
===================================================== */

function resetMockTestState() {

    stopLiveTimer();
    clearAutoNextTimer();

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    selectedExam = "";
    selectedPart = "";
    selectedExamCategory = "";

    answerLocked = false;

    testStartTime = null;
    testEndTime = null;

}


/* =====================================================
   CHECK JSON FILE CONFIGURATION
===================================================== */

function checkExamFiles() {

    const results = {};

    Object.keys(examFiles).forEach(
        function (exam) {

            results[exam] =
                examFiles[exam];

        }
    );

    console.table(results);

    return results;

}


/* =====================================================
   SHOW EXAM LIST
   Backup function if HTML exam buttons
   are not available.
===================================================== */

function showAllExams() {

    const container =
        document.getElementById(
            "mockTestBox"
        );

    if (!container) {
        return;
    }


    resetMockTestState();


    const examButtons =
        [

            {
                id: "SSC",
                name: "📘 SSC"
            },

            {
                id: "UPSC",
                name: "📕 UPSC"
            },

            {
                id: "BANK",
                name: "🏦 Bank"
            },

            {
                id: "WBP",
                name: "👮 WBP"
            },

            {
                id: "KOLKATA_POLICE",
                name: "👮 Kolkata Police"
            },

            {
                id: "RAILWAY",
                name: "🚆 Railway"
            },

            {
                id: "WBCS",
                name: "🏛️ WBCS"
            },

            {
                id: "WBPSC_CLERKSHIP",
                name: "📚 WBPSC Clerkship"
            }

        ];


    container.innerHTML = `

        <div class="exam-parts">

            <h3>

                🎯 Select Competitive Exam

            </h3>


            <p>

                Choose an exam to continue.

            </p>


            <div class="exam-grid">

                ${
                    examButtons
                        .map(
                            function (item) {

                                return `

                                    <button
                                        type="button"
                                        class="exam-btn"
                                        onclick="
                                            showExamParts(
                                                '${item.id}'
                                            )
                                        "
                                    >

                                        ${item.name}

                                    </button>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </div>

    `;

}


/* =====================================================
   PREMIUM PART RANGE VALIDATION
===================================================== */

function isPremiumPart(
    partName
) {

    const number =
        parseInt(
            String(partName)
                .replace(
                    /[^0-9]/g,
                    ""
                ),
            10
        );


    return (
        number >= PAID_PART_START &&
        number <= PAID_PART_END
    );

}


/* =====================================================
   FREE PART RANGE VALIDATION
===================================================== */

function isFreePart(
    partName
) {

    const number =
        parseInt(
            String(partName)
                .replace(
                    /[^0-9]/g,
                    ""
                ),
            10
        );


    return (
        number >= FREE_PART_START &&
        number <= FREE_PART_END
    );

}


/* =====================================================
   GET PART NUMBER
===================================================== */

function getPartNumber(
    partName
) {

    const number =
        parseInt(
            String(partName)
                .replace(
                    /[^0-9]/g,
                    ""
                ),
            10
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return 0;

    }


    return number;

}


/* =====================================================
   PREMIUM ACCESS CHECK
===================================================== */

function hasPremiumAccess(
    exam
) {

    /*
       Payment system can later store
       verified access here.

       IMPORTANT:
       Do not unlock Premium merely
       because a localStorage value exists.
    */

    const access =
        localStorage.getItem(
            "itta_premium_" +
            exam
        );


    return (
        access ===
        "verified"
    );

}


/* =====================================================
   SAFE PREMIUM OPEN
===================================================== */

async function openPremiumQuestionPart(
    exam,
    partName
) {

    if (
        !isPremiumPart(
            partName
        )
    ) {

        selectExamPart(
            exam,
            partName
        );

        return;

    }


    if (
        !hasPremiumAccess(
            exam
        )
    ) {

        showPaymentMessage(
            exam,
            partName
        );

        return;

    }


    await selectExamPart(
        exam,
        partName
    );

}


/* =====================================================
   VERIFY PREMIUM ACCESS
   This function is intentionally separate
   from payment UI.
===================================================== */

function setVerifiedPremiumAccess(
    exam
) {

    if (
        !exam ||
        !examFiles[exam]
    ) {

        return false;

    }


    localStorage.setItem(
        "itta_premium_" +
        exam,
        "verified"
    );


    return true;

}


/* =====================================================
   REMOVE LOCAL PREMIUM ACCESS
===================================================== */

function removePremiumAccess(
    exam
) {

    localStorage.removeItem(
        "itta_premium_" +
        exam
    );

}


/* =====================================================
   CLEAR ALL LOCAL TEST DATA
===================================================== */

function clearMockTestData() {

    Object.keys(
        examFiles
    ).forEach(
        function (exam) {

            localStorage.removeItem(
                "itta_premium_" +
                exam
            );

        }
    );


    resetMockTestState();

}


/* =====================================================
   WBP FILE CHECK
===================================================== */

function checkWBPFile() {

    const wbpFile =
        examFiles.WBP;


    console.log(
        "WBP JSON file:",
        wbpFile
    );


    return wbpFile;

}


/* =====================================================
   APP VERSION
===================================================== */

const ITTA_SCRIPT_VERSION =
    "2026.08.20-WBP-WBCS-WBPSC";


console.log(
    "Itta Study IQ Script Version:",
    ITTA_SCRIPT_VERSION
);


/* =====================================================
   FINAL GLOBAL EXPORTS
===================================================== */

window.resetMockTestState =
    resetMockTestState;

window.checkExamFiles =
    checkExamFiles;

window.showAllExams =
    showAllExams;

window.isPremiumPart =
    isPremiumPart;

window.isFreePart =
    isFreePart;

window.getPartNumber =
    getPartNumber;

window.hasPremiumAccess =
    hasPremiumAccess;

window.openPremiumQuestionPart =
    openPremiumQuestionPart;

window.setVerifiedPremiumAccess =
    setVerifiedPremiumAccess;

window.removePremiumAccess =
    removePremiumAccess;

window.clearMockTestData =
    clearMockTestData;

window.checkWBPFile =
    checkWBPFile;


/* =====================================================
   PREVENT OLD WBP JSON CACHE
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        console.log(
            "WBP source:",
            examFiles.WBP
        );

    }
);/* =====================================================
   FINAL INITIALIZATION
===================================================== */

/*
   Make sure the important functions are available
   to HTML onclick buttons.
*/

window.startQuiz =
    startQuiz;

window.closeQuiz =
    closeQuiz;

window.startMic =
    startMic;

window.askTutor =
    askTutor;

window.startMockTest =
    startMockTest;

window.showExamParts =
    showExamParts;

window.selectExamPart =
    selectExamPart;

window.selectExamCategory =
    selectExamCategory;

window.showPaidParts =
    showPaidParts;

window.openPaidPart =
    openPaidPart;

window.showPaymentMessage =
    showPaymentMessage;

window.checkAnswer =
    checkAnswer;

window.showResult =
    showResult;

window.chooseExamAgain =
    chooseExamAgain;

window.checkExamFiles =
    checkExamFiles;

window.checkWBPFile =
    checkWBPFile;

window.showAllExams =
    showAllExams;


/* =====================================================
   STARTUP CHECK
===================================================== */

(function () {

    console.log(
        "===================================="
    );

    console.log(
        "✨ ITTA STUDY IQ"
    );

    console.log(
        "Mock Test System Loaded"
    );

    console.log(
        "Free Parts: 1–20"
    );

    console.log(
        "Premium Parts: 21–100"
    );

    console.log(
        "===================================="
    );


    console.log(
        "Available Exams:"
    );

    Object.keys(
        examFiles
    ).forEach(
        function (exam) {

            console.log(
                exam +
                " → " +
                examFiles[exam]
            );

        }
    );


    /*
       WBP must use ONLY the new file.
    */

    console.log(
        "WBP source:",
        examFiles.WBP
    );


    /*
       New exams
    */

    console.log(
        "WBCS source:",
        examFiles.WBCS
    );

    console.log(
        "WBPSC Clerkship source:",
        examFiles.WBPSC_CLERKSHIP
    );


})();


/* =====================================================
   OPTIONAL DEBUG COMMANDS
===================================================== */

/*
   Browser console-এ নিচের commands ব্যবহার
   করে পরীক্ষা করা যাবে:

   checkExamFiles()

   checkWBPFile()

   showAllExams()

*/


/* =====================================================
   END OF SCRIPT
===================================================== */

console.log(
    "✅ Itta Study IQ script.js ready."
);
