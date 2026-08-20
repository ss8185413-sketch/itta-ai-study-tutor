"use strict";

/* =====================================================
   ITTA STUDY IQ
   FINAL WORKING SCRIPT
   PART 1 / 6

   Includes:
   - AI Tutor
   - Microphone
   - Quick Quiz
   - Exam configuration
   - Free Parts 1–20
   - Premium Parts 21–100
   - Golden Premium UI
   - ₹49 Premium price
===================================================== */

window.ITTAStudyIQ =
    window.ITTAStudyIQ || {};


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

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


/* =====================================================
   SETTINGS
===================================================== */

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
        "railway_questions.json"

};


/* =====================================================
   EXAM NAMES
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
        "Railway"

};


/* =====================================================
   EXAM SUB-CATEGORIES
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

    ]

};


/* =====================================================
   PAGE READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "✅ ITTA Study IQ Script Loaded"
        );


        const questionBox =
            document.getElementById(
                "question"
            );


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
        document.getElementById(
            "question"
        );


    const answerBox =
        document.getElementById(
            "answer"
        );


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
        document.getElementById(
            "question"
        );


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


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.onstart =
        function () {

            questionBox.placeholder =
                "Listening...";

        };


    recognition.onresult =
        function (event) {

            if (
                event.results &&
                event.results[0] &&
                event.results[0][0]
            ) {

                questionBox.value =
                    event.results[0][0]
                        .transcript;

            }

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
        document.getElementById(
            "quizBox"
        );


    if (!quizBox) {

        return;

    }


    quizBox.innerHTML = `

        <div class="quiz-content">

            <h3>
                🧠 Quick Study Quiz
            </h3>

            <p>
                Quick Quiz system is ready.
            </p>

            <button
                type="button"
                class="exam-btn"
                onclick="closeQuiz()">

                ✖ Close

            </button>

        </div>

    `;

}


function closeQuiz() {

    const quizBox =
        document.getElementById(
            "quizBox"
        );


    if (quizBox) {

        quizBox.innerHTML = "";

    }

}


/* =====================================================
   BASIC HELPER FUNCTIONS
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


function shuffleArray(array) {

    if (
        !Array.isArray(array)
    ) {

        return [];

    }


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


function getExamName(exam) {

    return (
        examPartNames[exam] ||
        exam ||
        ""
    );

}


function getPartNumber(part) {

    return String(
        part || ""
    )
        .replace(
            /^part/i,
            ""
        );

}


/* =====================================================
   START MOCK TEST
===================================================== */

function startMockTest(exam) {

    stopLiveTimer();

    clearAutoNextTimer();


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


/* =====================================================
   SHOW EXAM PARTS
===================================================== */

function showExamParts(exam) {

    stopLiveTimer();

    clearAutoNextTimer();


    selectedExam =
        exam;


    selectedPart =
        "";


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        console.error(
            "mockTestBox not found"
        );

        return;

    }


    const examName =
        getExamName(
            exam
        );


    const categories =
        examCategories[exam] ||
        [];


    let categoryHTML =
        "";


    if (
        categories.length
    ) {

        categoryHTML = `

            <div class="exam-category-section">

                <h4>
                    📚 Exam Categories
                </h4>

                <div class="exam-grid">

                    ${
                        categories
                            .map(
                                category => `

                                <button
                                    type="button"
                                    class="exam-btn"
                                    onclick="selectExamCategory(
                                        '${escapeHTML(exam)}',
                                        '${escapeHTML(category)}'
                                    )">

                                    ${escapeHTML(
                                        category
                                    )}

                                </button>

                            `
                            )
                            .join("")
                    }

                </div>

            </div>

        `;

    }


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
                )">

                🆓 Part ${i}

            </button>

        `;

    }


    box.innerHTML = `

        <div class="exam-parts">

            <h3>
                📚 ${escapeHTML(
                    examName
                )}
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


            <div class="exam-grid">

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
                )">

                ⭐ Open Premium Parts

            </button>

        </div>

    `;

}


/* =====================================================
   SELECT EXAM CATEGORY
===================================================== */

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

   }/* =====================================================
   PREMIUM PARTS 21–100
===================================================== */

function showPaidParts(exam) {

    stopLiveTimer();

    clearAutoNextTimer();

    selectedExam =
        exam;

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {

        return;

    }

    const examName =
        getExamName(exam);

    let premiumParts =
        "";


    for (
        let i = PAID_PART_START;
        i <= PAID_PART_END;
        i++
    ) {

        premiumParts += `

            <button
                type="button"
                class="exam-btn premium-main-btn"
                onclick="openPaidPart(
                    '${escapeHTML(exam)}',
                    'part${i}'
                )">

                ⭐ Part ${i}

            </button>

        `;

    }


    box.innerHTML = `

        <div class="exam-parts">

            <h3>
                ⭐ ${escapeHTML(
                    examName
                )} Premium
            </h3>

            <p>
                Premium Parts 21–100
            </p>


            <div
                style="
                    padding:18px;
                    margin:15px 0;
                    border-radius:14px;
                    background:#fff8df;
                    border:1px solid #e0b64e;
                    text-align:center;
                "
            >

                <strong>
                    ⭐ GOLD PREMIUM
                </strong>

                <h2>
                    ₹${PREMIUM_PRICE}
                </h2>

                <p>
                    Unlock Premium Parts
                    21–100.
                </p>

                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="showPaymentMessage(
                        '${escapeHTML(exam)}'
                    )">

                    💳 Unlock Premium

                </button>

            </div>


            <div class="exam-grid">

                ${premiumParts}

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="showExamParts(
                    '${escapeHTML(exam)}'
                )">

                🔙 Back

            </button>

        </div>

    `;

}


/* =====================================================
   OPEN PREMIUM PART
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


function unlockPremium(exam) {

    showPaymentMessage(
        exam
    );

}


function startPremiumPart(
    exam,
    partName
) {

    showPaymentMessage(
        exam,
        partName
    );

}


/* =====================================================
   PREMIUM PAYMENT SCREEN
===================================================== */

function showPaymentMessage(
    exam,
    partName = ""
) {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    const examName =
        getExamName(exam);


    const partText =
        partName
            ? "Part " +
              getPartNumber(
                  partName
              )
            : "Parts 21–100";


    box.innerHTML = `

        <div class="result-box">

            <h2>
                ⭐ Premium Access
            </h2>


            <h3>
                ${escapeHTML(
                    examName
                )}
            </h3>


            <p>
                ${escapeHTML(
                    partText
                )}
            </p>


            <div
                style="
                    padding:18px;
                    margin:18px 0;
                    border-radius:16px;
                    background:#fff8df;
                    border:1px solid #e0b64e;
                    text-align:center;
                "
            >

                <h2>
                    ⭐ GOLD PREMIUM
                </h2>


                <div
                    style="
                        font-size:32px;
                        font-weight:900;
                    "
                >

                    ₹${PREMIUM_PRICE}

                </div>


                <p>
                    One payment unlocks
                    Premium Parts 21–100.
                </p>


                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="startPremiumPayment(
                        '${escapeHTML(exam)}'
                    )">

                    💳 Pay ₹${PREMIUM_PRICE}

                </button>

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )">

                🔙 Premium Parts

            </button>

        </div>

    `;

}


/* =====================================================
   PREMIUM PAYMENT
===================================================== */

function startPremiumPayment(
    exam
) {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <h2>
                💳 Premium Payment
            </h2>


            <h3>
                ${escapeHTML(
                    getExamName(exam)
                )}
            </h3>


            <div
                style="
                    text-align:center;
                    padding:20px;
                "
            >

                <h1>
                    ₹${PREMIUM_PRICE}
                </h1>


                <p>
                    Premium Parts 21–100
                </p>


                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="showPaymentPending(
                        '${escapeHTML(exam)}'
                    )">

                    💳 Continue Payment

                </button>

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )">

                🔙 Back

            </button>

        </div>

    `;

}


/* =====================================================
   PAYMENT VERIFICATION SCREEN
===================================================== */

function showPaymentPending(
    exam
) {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <h2>
                🔐 Payment Verification
            </h2>


            <p>
                ${escapeHTML(
                    getExamName(exam)
                )}
                Premium
            </p>


            <div
                style="
                    padding:18px;
                    margin:15px 0;
                    border-radius:14px;
                    background:#fff8df;
                "
            >

                ⏳ Waiting for secure
                payment confirmation...

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts(
                    '${escapeHTML(exam)}'
                )">

                🔙 Back

            </button>

        </div>

    `;

}


/* =====================================================
   LOAD EXAM PART
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


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

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
                Part ${escapeHTML(
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

        const questions =
            await loadExamPart(
                exam,
                partName
            );


        if (
            !questions.length
        ) {

            box.innerHTML = `

                <div class="result-box">

                    <h3>
                        ⚠️ No Questions Found
                    </h3>


                    <p>
                        Part
                        ${escapeHTML(
                            getPartNumber(
                                partName
                            )
                        )}
                        এ questions পাওয়া যায়নি।
                    </p>


                    <button
                        type="button"
                        class="exam-btn"
                        onclick="showExamParts(
                            '${escapeHTML(exam)}'
                        )">

                        🔙 Back

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


        showMockTest();

        startLiveTimer();


    }

    catch (error) {

        console.error(
            "Question loading error:",
            error
        );


        box.innerHTML = `

            <div class="result-box">

                <h3>
                    ❌ Question Loading Error
                </h3>


                <p>
                    JSON file load করা যায়নি।
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
                    onclick="showExamParts(
                        '${escapeHTML(exam)}'
                    )">

                    🔙 Back

                </button>

            </div>

        `;

    }

}


/* =====================================================
   JSON LOADER
   Supports:
   1. parts:[{part:1,questions:[]}]
   2. part1:[]
   3. parts:{part1:[]}
   4. part1:{questions:[]}
   5. direct array
===================================================== */

async function loadExamPart(
    exam,
    partName
) {

    const file =
        examFiles[exam];


    if (!file) {

        throw new Error(
            "JSON file not configured for " +
            exam
        );

    }


    const response =
        await fetch(
            file +
            "?v=" +
            Date.now(),
            {
                cache:
                    "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Could not load " +
            file
        );

    }


    const data =
        await response.json();


    const number =
        String(
            getPartNumber(
                partName
            )
        );


    const wanted =
        String(
            partName
        ).toLowerCase();


    /* -----------------------------------------
       FORMAT 1:
       parts: [
           {
               part: 1,
               questions: []
           }
       ]
    ----------------------------------------- */

    if (
        data &&
        Array.isArray(
            data.parts
        )
    ) {

        const found =
            data.parts.find(
                item => {

                    if (!item) {

                        return false;

                    }


                    const itemPart =
                        String(
                            item.part ??
                            item.partNumber ??
                            item.name ??
                            ""
                        )
                        .toLowerCase()
                        .replace(
                            /^part/,
                            ""
                        );


                    return (
                        itemPart ===
                        number
                    );

                }
            );


        if (
            found &&
            Array.isArray(
                found.questions
            )
        ) {

            return normalizeQuestions(
                found.questions
            );

        }

    }


    /* -----------------------------------------
       FORMAT 2:
       {
           "part1": []
       }
    ----------------------------------------- */

    const possibleKeys = [

        wanted,

        "part" + number,

        "Part" + number,

        "PART" + number,

        number

    ];


    for (
        const key of possibleKeys
    ) {

        if (
            data &&
            Array.isArray(
                data[key]
            )
        ) {

            return normalizeQuestions(
                data[key]
            );

        }

    }


    /* -----------------------------------------
       FORMAT 3:
       {
           "parts": {
               "part1": []
           }
       }
    ----------------------------------------- */

    if (
        data &&
        data.parts &&
        !Array.isArray(
            data.parts
        )
    ) {

        for (
            const key of possibleKeys
        ) {

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


    /* -----------------------------------------
       FORMAT 4:
       {
           "part1": {
               "questions": []
           }
       }
    ----------------------------------------- */

    for (
        const key of possibleKeys
    ) {

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


    /* -----------------------------------------
       FORMAT 5:
       DIRECT ARRAY
    ----------------------------------------- */

    if (
        Array.isArray(
            data
        )
    ) {

        return normalizeQuestions(
            data
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
            item =>
                item &&
                typeof item ===
                "object"
        )

        .map(
            item => {

                const question =
                    {
                        ...item
                    };


                question.question =
                    item.question ||
                    item.questionText ||
                    item.q ||
                    item.text ||
                    "";


                question.options =
                    Array.isArray(
                        item.options
                    )
                    ? item.options

                    : Array.isArray(
                        item.answers
                    )
                    ? item.answers

                    : Array.isArray(
                        item.choices
                    )
                    ? item.choices

                    : [];


                question.answer =
                    item.answer ??
                    item.correctAnswer ??
                    item.correct ??
                    item.correct_answer ??
                    item.correctOption ??
                    item.correct_option ??
                    item.answerIndex ??
                    item.correctIndex;


                return question;

            }
        )

        .filter(
            item =>
                item.question &&
                Array.isArray(
                    item.options
                ) &&
                item.options.length >
                0
        );

                       }/* =====================================================
   SHOW MOCK TEST QUESTION
===================================================== */

function showMockTest() {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    if (
        !currentQuestions.length
    ) {

        showResult();

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
        currentQuestionIndex +
        1;


    let optionsHTML =
        "";


    question.options.forEach(
        (
            option,
            index
        ) => {

            optionsHTML += `

                <button
                    type="button"
                    class="quiz-option"
                    onclick="checkAnswer(
                        ${index}
                    )">

                    <span>
                        ${String.fromCharCode(
                            65 + index
                        )}.
                    </span>

                    ${escapeHTML(
                        option
                    )}

                </button>

            `;

        }
    );


    box.innerHTML = `

        <div class="mock-test-container">

            <div class="mock-test-top">

                <strong>
                    ${escapeHTML(
                        getExamName(
                            selectedExam
                        )
                    )}
                </strong>


                <span>
                    Question
                    ${current}
                    /
                    ${total}
                </span>

            </div>


            <div
                id="testTimer"
                class="test-timer"
            >

                ⏱️ 00:00

            </div>


            <div class="question-card">

                <div class="question-number">

                    Question ${current}

                </div>


                <h3>

                    ${escapeHTML(
                        question.question
                    )}

                </h3>


                <div class="quiz-options">

                    ${optionsHTML}

                </div>

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="confirmExitTest()">

                🚪 Exit Test

            </button>

        </div>

    `;

}


/* =====================================================
   FIND CORRECT ANSWER INDEX
===================================================== */

function getCorrectAnswerIndex(
    question
) {

    if (!question) {

        return 0;

    }


    const answer =
        question.answer;


    /* -----------------------------------------
       NUMBER
       ----------------------------------------- */

    if (
        typeof answer ===
        "number"
    ) {

        return answer;

    }


    /* -----------------------------------------
       STRING
       ----------------------------------------- */

    if (
        typeof answer ===
        "string"
    ) {

        const value =
            answer.trim();


        /* Numeric answer */

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
                upper.charCodeAt(0)
                - 65
            );

        }


        /* Answer text */

        const options =
            question.options ||
            [];


        const found =
            options.findIndex(
                option =>
                    String(option)
                        .trim()
                        .toLowerCase() ===
                    value.toLowerCase()
            );


        if (
            found >= 0
        ) {

            return found;

        }

    }


    /* -----------------------------------------
       correctIndex
       ----------------------------------------- */

    if (
        typeof question.correctIndex ===
        "number"
    ) {

        return question.correctIndex;

    }


    /* -----------------------------------------
       correctAnswer NUMBER
       ----------------------------------------- */

    if (
        typeof question.correctAnswer ===
        "number"
    ) {

        return question.correctAnswer;

    }


    /* -----------------------------------------
       correctAnswer LETTER
       ----------------------------------------- */

    if (
        typeof question.correctAnswer ===
        "string"
    ) {

        const value =
            question.correctAnswer
                .trim()
                .toUpperCase();


        if (
            /^[A-D]$/.test(
                value
            )
        ) {

            return (
                value.charCodeAt(0)
                - 65
            );

        }

    }


    return 0;

}


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(
    selectedIndex
) {

    if (
        answerLocked
    ) {

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
        (
            button,
            index
        ) => {

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


    clearAutoNextTimer();


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
   SHOW RESULT
===================================================== */

function showResult() {

    stopLiveTimer();

    clearAutoNextTimer();


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    const total =
        currentQuestions.length;


    const percentage =
        total > 0

            ? (
                score /
                total *
                100
            ).toFixed(1)

            : "0.0";


    const examName =
        getExamName(
            selectedExam
        );


    const partNumber =
        getPartNumber(
            selectedPart
        );


    /* -----------------------------------------
       TIME TAKEN
       ----------------------------------------- */

    let timeTaken =
        "";


    if (
        testStartTime &&
        testEndTime
    ) {

        const seconds =
            Math.max(
                0,
                Math.floor(
                    (
                        testEndTime -
                        testStartTime
                    ) /
                    1000
                )
            );


        const minutes =
            Math.floor(
                seconds /
                60
            );


        const remaining =
            seconds %
            60;


        timeTaken =

            String(
                minutes
            ).padStart(
                2,
                "0"
            )

            +

            ":"

            +

            String(
                remaining
            ).padStart(
                2,
                "0"
            );

    }


    /* -----------------------------------------
       RESULT MESSAGE
       ----------------------------------------- */

    let message =
        "Keep practicing!";


    if (
        Number(
            percentage
        ) >= 80
    ) {

        message =
            "Excellent performance! 🎉";

    }

    else if (
        Number(
            percentage
        ) >= 60
    ) {

        message =
            "Very good! Keep improving. 👍";

    }

    else if (
        Number(
            percentage
        ) >= 40
    ) {

        message =
            "Good effort. Practice more. 📚";

    }


    box.innerHTML = `

        <div class="result-box">


            <div
                style="
                    font-size:52px;
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

                Test Completed

            </h2>


            <h3
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(
                    examName
                )}

            </h3>


            <p
                style="
                    text-align:center;
                "
            >

                ${
                    partNumber
                        ? "Part " +
                          escapeHTML(
                              partNumber
                          )
                        : ""
                }

            </p>


            <div class="result-stats">


                <div>

                    <strong>
                        ${score}
                    </strong>

                    <span>
                        Correct
                    </span>

                </div>


                <div>

                    <strong>
                        ${Math.max(
                            0,
                            total - score
                        )}
                    </strong>

                    <span>
                        Wrong
                    </span>

                </div>


                <div>

                    <strong>
                        ${total}
                    </strong>

                    <span>
                        Total
                    </span>

                </div>


                <div>

                    <strong>
                        ${percentage}%
                    </strong>

                    <span>
                        Score
                    </span>

                </div>


            </div>


            ${
                timeTaken

                    ? `

                        <p
                            style="
                                text-align:center;
                                margin-top:15px;
                            "
                        >

                            ⏱️ Time:
                            <strong>
                                ${timeTaken}
                            </strong>

                        </p>

                      `

                    : ""
            }


            <h3
                style="
                    text-align:center;
                    margin-top:18px;
                "
            >

                ${message}

            </h3>


            <div class="result-buttons">


                <button
                    type="button"
                    class="exam-btn"
                    onclick="selectExamPart(
                        '${escapeHTML(
                            selectedExam
                        )}',
                        '${escapeHTML(
                            selectedPart
                        )}'
                    )"
                >

                    🔄 Try Again

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


            </div>


        </div>

    `;

}


/* =====================================================
   FINISH TEST
===================================================== */

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

}


/* =====================================================
   CHOOSE EXAM AGAIN
===================================================== */

function chooseExamAgain() {

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


    showExamParts(
        selectedExam
    );

}


/* =====================================================
   TIMER
===================================================== */

function startLiveTimer() {

    stopLiveTimer();


    const timer =
        document.getElementById(
            "testTimer"
        );


    if (!timer) {

        return;

    }


    if (!testStartTime) {

        testStartTime =
            Date.now();

    }


    function updateTimer() {

        const elapsed =
            Math.max(
                0,
                Math.floor(
                    (
                        Date.now() -
                        testStartTime
                    ) /
                    1000
                )
            );


        const minutes =
            Math.floor(
                elapsed /
                60
            );


        const seconds =
            elapsed %
            60;


        timer.innerText =

            "⏱️ "

            +

            String(
                minutes
            ).padStart(
                2,
                "0"
            )

            +

            ":"

            +

            String(
                seconds
            ).padStart(
                2,
                "0"
            );

    }


    updateTimer();


    testTimerInterval =
        setInterval(
            updateTimer,
            1000
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
   EXIT TEST
===================================================== */

function confirmExitTest() {

    const exit =
        window.confirm(
            "Are you sure you want to exit the test?"
        );


    if (!exit) {

        return;

    }


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


    showExamParts(
        selectedExam
    );

}/* =====================================================
   GLOBAL BUTTON / UI HELPERS
===================================================== */

function closeMockTest() {

    stopLiveTimer();

    clearAutoNextTimer();


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (box) {

        box.innerHTML = "";

    }


    currentQuestions =
        [];

    currentQuestionIndex =
        0;

    score =
        0;

    answerLocked =
        false;

}


/* =====================================================
   BACK TO EXAM LIST
===================================================== */

function backToExamList() {

    stopLiveTimer();

    clearAutoNextTimer();


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

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


            </div>

        </div>

    `;

}


/* =====================================================
   REFRESH CURRENT EXAM
===================================================== */

function refreshExam() {

    if (
        selectedExam
    ) {

        showExamParts(
            selectedExam
        );

    }

    else {

        backToExamList();

    }

}


/* =====================================================
   SAFE HTML MESSAGE
===================================================== */

function showMessage(
    message,
    type = "info"
) {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        alert(
            message
        );

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
                ${escapeHTML(
                    message
                )}
            </h3>


            <button
                type="button"
                class="exam-btn"
                onclick="refreshExam()"
            >

                🔙 Back

            </button>

        </div>

    `;

}


/* =====================================================
   PREMIUM ACCESS CHECK
===================================================== */

function isPremiumUnlocked(
    exam
) {

    try {

        return (
            localStorage.getItem(
                "itta_premium_" +
                exam
            ) === "true"
        );

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        return false;

    }

}


/* =====================================================
   SAVE PREMIUM ACCESS
===================================================== */

function savePremiumAccess(
    exam
) {

    try {

        localStorage.setItem(
            "itta_premium_" +
            exam,
            "true"
        );


        return true;

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        return false;

    }

}


/* =====================================================
   REMOVE PREMIUM ACCESS
===================================================== */

function removePremiumAccess(
    exam
) {

    try {

        localStorage.removeItem(
            "itta_premium_" +
            exam
        );


        return true;

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        return false;

    }

}


/* =====================================================
   CHECK PREMIUM PART
===================================================== */

function canOpenPremiumPart(
    exam
) {

    return isPremiumUnlocked(
        exam
    );

}


/* =====================================================
   PREMIUM PART OPEN
===================================================== */

function openPremiumPart(
    exam,
    partName
) {

    if (
        !canOpenPremiumPart(
            exam
        )
    ) {

        showPaymentMessage(
            exam,
            partName
        );

        return;

    }


    selectExamPart(
        exam,
        partName
    );

}


/* =====================================================
   PAYMENT SUCCESS DEMO / CALLBACK
===================================================== */

function premiumPaymentSuccess(
    exam
) {

    if (
        !exam
    ) {

        return;

    }


    const saved =
        savePremiumAccess(
            exam
        );


    if (!saved) {

        showMessage(
            "Premium access could not be saved.",
            "error"
        );

        return;

    }


    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div class="result-box">

            <div
                style="
                    font-size:55px;
                    text-align:center;
                "
            >

                🎉

            </div>


            <h2
                style="
                    text-align:center;
                "
            >

                Premium Unlocked!

            </h2>


            <p
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(
                    getExamName(
                        exam
                    )
                )}
                Parts 21–100 are now
                available.

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

        </div>

    `;

}


/* =====================================================
   PAYMENT PLACEHOLDER
===================================================== */

function processPayment(
    exam
) {

    /*
       IMPORTANT:

       This function does NOT pretend
       that a real payment has happened.

       Connect your actual payment gateway
       here before calling:

       premiumPaymentSuccess(exam);

    */


    showMessage(
        "Payment gateway is not connected yet.",
        "warning"
    );

}


/* =====================================================
   GLOBAL PAYMENT BUTTON HANDLER
===================================================== */

function payPremium(
    exam
) {

    processPayment(
        exam
    );

}


/* =====================================================
   PART LOCK HANDLER
===================================================== */

function handlePartClick(
    exam,
    partNumber
) {

    const number =
        parseInt(
            partNumber,
            10
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        showMessage(
            "Invalid part number.",
            "error"
        );

        return;

    }


    if (
        number >=
            FREE_PART_START &&
        number <=
            FREE_PART_END
    ) {

        selectExamPart(
            exam,
            "part" +
            number
        );

        return;

    }


    if (
        number >=
            PAID_PART_START &&
        number <=
            PAID_PART_END
    ) {

        openPremiumPart(
            exam,
            "part" +
            number
        );

        return;

    }


    showMessage(
        "Invalid part.",
        "error"
    );

}


/* =====================================================
   CURRENT EXAM INFO
===================================================== */

function getCurrentExam() {

    return selectedExam || "";

}


function getCurrentPart() {

    return selectedPart || "";

}


/* =====================================================
   RESET TEST STATE
===================================================== */

function resetTestState() {

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

    answerLocked =
        false;

    testStartTime =
        null;

    testEndTime =
        null;

}


/* =====================================================
   SAFE START EXAM
===================================================== */

function safeStartExam(
    exam
) {

    if (
        !examFiles[exam]
    ) {

        showMessage(
            "This exam is not configured.",
            "error"
        );

        return;

    }


    resetTestState();


    startMockTest(
        exam
    );

}


/* =====================================================
   EXAM BUTTON SHORTCUTS
===================================================== */

function startSSC() {

    safeStartExam(
        "SSC"
    );

}


function startUPSC() {

    safeStartExam(
        "UPSC"
    );

}


function startBank() {

    safeStartExam(
        "BANK"
    );

}


function startWBP() {

    safeStartExam(
        "WBP"
    );

}


function startKolkataPolice() {

    safeStartExam(
        "KOLKATA_POLICE"
    );

}


function startRailway() {

    safeStartExam(
        "RAILWAY"
    );

}


/* =====================================================
   WINDOW EXPORTS
   Makes inline onclick functions work reliably.
===================================================== */

window.askTutor =
    askTutor;

window.startMic =
    startMic;

window.startQuiz =
    startQuiz;

window.closeQuiz =
    closeQuiz;

window.startMockTest =
    startMockTest;

window.showExamParts =
    showExamParts;

window.selectExamCategory =
    selectExamCategory;

window.selectExamPart =
    selectExamPart;

window.showPaidParts =
    showPaidParts;

window.openPaidPart =
    openPaidPart;

window.openPremiumPart =
    openPremiumPart;

window.unlockPremium =
    unlockPremium;

window.startPremiumPart =
    startPremiumPart;

window.showPaymentMessage =
    showPaymentMessage;

window.startPremiumPayment =
    startPremiumPayment;

window.showPaymentPending =
    showPaymentPending;

window.premiumPaymentSuccess =
    premiumPaymentSuccess;

window.processPayment =
    processPayment;

window.payPremium =
    payPremium;

window.showMockTest =
    showMockTest;

window.checkAnswer =
    checkAnswer;

window.showResult =
    showResult;

window.finishTest =
    finishTest;

window.chooseExamAgain =
    chooseExamAgain;

window.confirmExitTest =
    confirmExitTest;

window.closeMockTest =
    closeMockTest;

window.backToExamList =
    backToExamList;

window.refreshExam =
    refreshExam;

window.showMessage =
    showMessage;

window.handlePartClick =
    handlePartClick;

window.safeStartExam =
    safeStartExam;

window.startSSC =
    startSSC;

window.startUPSC =
    startUPSC;

window.startBank =
    startBank;

window.startWBP =
    startWBP;

window.startKolkataPolice =
    startKolkataPolice;

window.startRailway =
    startRailway;


/* =====================================================
   SCRIPT STATUS
===================================================== */

console.log(
    "✅ ITTA Study IQ: all main functions registered."
);

console.log(
    "📚 Exam files:",
    examFiles
); /* =====================================================
    EXTRA SAFETY / COMPATIBILITY FUNCTIONS
 ===================================================== */

 function ensureMockBox() {

     let box =
         document.getElementById(
             "mockTestBox"
         );

     if (
         !box
     ) {

         console.warn(
             "mockTestBox was not found."
         );

     }

     return box;

 }


 /* =====================================================
    RELOAD CURRENT PART
 ===================================================== */

 function reloadCurrentPart() {

     if (
         selectedExam &&
         selectedPart
     ) {

         selectExamPart(
             selectedExam,
             selectedPart
         );

         return;

     }


     if (
         selectedExam
     ) {

         showExamParts(
             selectedExam
         );

         return;

     }


     backToExamList();

 }


 /* =====================================================
    GO BACK FROM RESULT
 ===================================================== */

 function goBackFromResult() {

     stopLiveTimer();

     clearAutoNextTimer();


     if (
         selectedExam
     ) {

         showExamParts(
             selectedExam
         );

     }

     else {

         backToExamList();

     }

 }


 /* =====================================================
    RETRY SAME TEST
 ===================================================== */

 function retryTest() {

     if (
         !selectedExam ||
         !selectedPart
     ) {

         backToExamList();

         return;

     }


     selectExamPart(
         selectedExam,
         selectedPart
     );

 }


 /* =====================================================
    NEXT QUESTION MANUAL
 ===================================================== */

 function nextQuestion() {

     if (
         !currentQuestions.length
     ) {

         return;

     }


     if (
         currentQuestionIndex >=
         currentQuestions.length - 1
     ) {

         testEndTime =
             Date.now();

         stopLiveTimer();

         showResult();

         return;

     }


     currentQuestionIndex++;

     answerLocked =
         false;

     showMockTest();

 }


 /* =====================================================
    PREVIOUS QUESTION
 ===================================================== */

 function previousQuestion() {

     if (
         !currentQuestions.length
     ) {

         return;

     }


     if (
         currentQuestionIndex <=
         0
     ) {

         return;

     }


     currentQuestionIndex--;

     answerLocked =
         false;

     showMockTest();

 }


 /* =====================================================
    QUESTION COUNT
 ===================================================== */

 function getQuestionCount() {

     return (
         currentQuestions.length
     );

 }


 /* =====================================================
    SCORE PERCENTAGE
 ===================================================== */

 function getScorePercentage() {

     if (
         !currentQuestions.length
     ) {

         return 0;

     }


     return (
         score /
         currentQuestions.length *
         100
     );

 }


 /* =====================================================
    LOCAL STORAGE SAFE HELPERS
 ===================================================== */

 function safeSetItem(
     key,
     value
 ) {

     try {

         localStorage.setItem(
             key,
             value
         );

         return true;

     }

     catch (
         error
     ) {

         console.error(
             "localStorage error:",
             error
         );

         return false;

     }

 }


 function safeGetItem(
     key
 ) {

     try {

         return localStorage.getItem(
             key
         );

     }

     catch (
         error
     ) {

         console.error(
             "localStorage error:",
             error
         );

         return null;

     }

 }


 function safeRemoveItem(
     key
 ) {

     try {

         localStorage.removeItem(
             key
         );

         return true;

     }

     catch (
         error
     ) {

         console.error(
             "localStorage error:",
             error
         );

         return false;

     }

 }


 /* =====================================================
    PREMIUM STATUS
 ===================================================== */

 function getPremiumStatus(
     exam
 ) {

     if (
         !exam
     ) {

         return false;

     }


     return (
         safeGetItem(
             "itta_premium_" +
             exam
         ) === "true"
     );

 }


 function setPremiumStatus(
     exam,
     status
 ) {

     if (
         !exam
     ) {

         return false;

     }


     if (
         status
     ) {

         return safeSetItem(
             "itta_premium_" +
             exam,
             "true"
         );

     }


     return safeRemoveItem(
         "itta_premium_" +
         exam
     );

 }


 /* =====================================================
    PREMIUM PART ACCESS
 ===================================================== */

 function openRequestedPart(
     exam,
     partNumber
 ) {

     const number =
         Number(
             partNumber
         );


     if (
         !Number.isInteger(
             number
         )
     ) {

         showMessage(
             "Invalid part number.",
             "error"
         );

         return;

     }


     if (
         number >= 1 &&
         number <= 20
     ) {

         selectExamPart(
             exam,
             "part" +
             number
         );

         return;

     }


     if (
         number >= 21 &&
         number <= 100
     ) {

         if (
             getPremiumStatus(
                 exam
             )
         ) {

             selectExamPart(
                 exam,
                 "part" +
                 number
             );

         }

         else {

             showPaymentMessage(
                 exam,
                 "part" +
                 number
             );

         }

         return;

     }


     showMessage(
         "Part must be between 1 and 100.",
         "error"
     );

 }


 /* =====================================================
    PREMIUM DEMO UNLOCK
 ===================================================== */

 function testPremiumUnlock(
     exam
 ) {

     const confirmed =
         window.confirm(
             "Enable Premium access for testing?"
         );


     if (
         !confirmed
     ) {

         return;

     }


     if (
         setPremiumStatus(
             exam,
             true
         )
     ) {

         premiumPaymentSuccess(
             exam
         );

     }

     else {

         showMessage(
             "Could not save Premium access.",
             "error"
         );

     }

 }


 /* =====================================================
    CLEAR PREMIUM TEST ACCESS
 ===================================================== */

 function clearPremiumTestAccess(
     exam
 ) {

     const confirmed =
         window.confirm(
             "Remove Premium test access?"
         );


     if (
         !confirmed
     ) {

         return;

     }


     setPremiumStatus(
         exam,
         false
     );


     showPaidParts(
         exam
     );

 }


 /* =====================================================
    JSON CONNECTION TEST
 ===================================================== */

 async function testExamFile(
     exam
 ) {

     const file =
         examFiles[exam];


     if (
         !file
     ) {

         console.error(
             "No JSON file configured:",
             exam
         );

         return false;

     }


     try {

         const response =
             await fetch(
                 file +
                 "?test=" +
                 Date.now(),
                 {
                     cache:
                         "no-store"
                 }
             );


         if (
             !response.ok
         ) {

             console.error(
                 "JSON file error:",
                 file,
                 response.status
             );

             return false;

         }


         const data =
             await response.json();


         console.log(
             "✅ JSON connected:",
             exam,
             file,
             data
         );


         return true;

     }

     catch (
         error
     ) {

         console.error(
             "❌ JSON connection failed:",
             exam,
             error
         );


         return false;

     }

 }


 /* =====================================================
    TEST ALL EXAM FILES
 ===================================================== */

 async function testAllExamFiles() {

     const results = {};


     for (
         const exam of
         Object.keys(
             examFiles
         )
     ) {

         results[exam] =
             await testExamFile(
                 exam
             );

     }


     console.table(
         results
     );


     return results;

 }


 /* =====================================================
    DEBUG INFORMATION
 ===================================================== */

 function showDebugInfo() {

     console.log(
         "=============================="
     );

     console.log(
         "ITTA STUDY IQ DEBUG"
     );

     console.log(
         "=============================="
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
         "Question Index:",
         currentQuestionIndex
     );


     console.log(
         "Score:",
         score
     );


     console.log(
         "Premium:",
         selectedExam
             ? getPremiumStatus(
                 selectedExam
             )
             : false
     );


     console.log(
         "=============================="
     );

 }


 /* =====================================================
    PREVENT ACCIDENTAL FORM SUBMIT
 ===================================================== */

 document.addEventListener(
     "submit",
     function (
         event
     ) {

         const form =
             event.target;


         if (
             form &&
             form.closest &&
             form.closest(
                 "#mockTestBox"
             )
         ) {

             event.preventDefault();

         }

     }
 );


 /* =====================================================
    BUTTON SAFETY
 ===================================================== */

 document.addEventListener(
     "click",
     function (
         event
     ) {

         const target =
             event.target;


         if (
             !target
         ) {

             return;

         }


         const button =
             target.closest
                 ? target.closest(
                     "button"
                 )
                 : null;


         if (
             !button
         ) {

             return;

         }


         /*
            Prevent accidental double-clicks
            only while a test answer is locked.
         */

         if (
             button.classList.contains(
                 "quiz-option"
             ) &&
             answerLocked
         ) {

             event.preventDefault();

         }

     }
 );


 /* =====================================================
    PAGE VISIBILITY
 ===================================================== */

 document.addEventListener(
     "visibilitychange",
     function () {

         if (
             document.hidden
         ) {

             return;

         }


         /*
            Re-render the current timer
            when the app comes back.
         */

         if (
             testStartTime &&
             currentQuestions.length &&
             !answerLocked
         ) {

             startLiveTimer();

         }

     }
 );


 /* =====================================================
    BEFORE PAGE LEAVE
 ===================================================== */

 window.addEventListener(
     "beforeunload",
     function () {

         stopLiveTimer();

         clearAutoNextTimer();

     }
 );


 /* =====================================================
    KEYBOARD SUPPORT
 ===================================================== */

 document.addEventListener(
     "keydown",
     function (
         event
     ) {

         /*
            Do not interfere with typing.
         */

         const active =
             document.activeElement;


         if (
             active &&
             (
                 active.tagName ===
                 "INPUT" ||

                 active.tagName ===
                 "TEXTAREA"
             )
         ) {

             return;

         }


         /*
            Number keys 1–4
            answer options.
         */

         if (
             currentQuestions.length &&
             !answerLocked
         ) {

             if (
                 ["1","2","3","4"]
                     .includes(
                         event.key
                     )
             ) {

                 const index =
                     Number(
                         event.key
                     ) - 1;


                 const question =
                     currentQuestions[
                         currentQuestionIndex
                     ];


                 if (
                     question &&
                     question.options &&
                     index <
                     question.options.length
                 ) {

                     checkAnswer(
                         index
                     );

                 }

             }

         }

     }
 );


 /* =====================================================
    STARTUP CHECK
 ===================================================== */

 window.addEventListener(
     "load",
     function () {

         console.log(
             "✅ ITTA Study IQ fully initialized."
         );


         /*
            These checks only log errors.
            They do NOT stop the app.
         */

         const mockBox =
             document.getElementById(
                 "mockTestBox"
             );


         if (
             !mockBox
         ) {

             console.warn(
                 "⚠️ mockTestBox not found in HTML."
             );

         }


         const questionBox =
             document.getElementById(
                 "question"
             );


         if (
             !questionBox
         ) {

             console.warn(
                 "⚠️ AI Tutor question box not found."
             );

         }

     }
 );


 /* =====================================================
    FINAL GLOBAL EXPORTS
 ===================================================== */

 window.reloadCurrentPart =
     reloadCurrentPart;

 window.goBackFromResult =
     goBackFromResult;

 window.retryTest =
     retryTest;

 window.nextQuestion =
     nextQuestion;

 window.previousQuestion =
     previousQuestion;

 window.getQuestionCount =
     getQuestionCount;

 window.getScorePercentage =
     getScorePercentage;

 window.getPremiumStatus =
     getPremiumStatus;

 window.setPremiumStatus =
     setPremiumStatus;

 window.openRequestedPart =
     openRequestedPart;

 window.testPremiumUnlock =
     testPremiumUnlock;

 window.clearPremiumTestAccess =
     clearPremiumTestAccess;

 window.testExamFile =
     testExamFile;

 window.testAllExamFiles =
     testAllExamFiles;

 window.showDebugInfo =
     showDebugInfo;


/* =====================================================
   END OF PART 5
===================================================== *//* =====================================================
   FINAL COMPATIBILITY LAYER
===================================================== */

/*
   Some older HTML versions may call these names.
   Keeping aliases prevents buttons from becoming
   non-functional after the script update.
*/


function openMockTest(
    exam
) {

    startMockTest(
        exam
    );

}


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

}


function backToParts(
    exam
) {

    showExamParts(
        exam ||
        selectedExam
    );

}


function backToPremium(
    exam
) {

    showPaidParts(
        exam ||
        selectedExam
    );

}


/* =====================================================
   OLD PREMIUM BUTTON COMPATIBILITY
===================================================== */

function buyPremium(
    exam
) {

    showPaymentMessage(
        exam ||
        selectedExam
    );

}


function payNow(
    exam
) {

    startPremiumPayment(
        exam ||
        selectedExam
    );

}


function unlockPart(
    exam,
    part
) {

    openPremiumPart(
        exam ||
        selectedExam,
        part
    );

}


/* =====================================================
   RESULT BUTTON COMPATIBILITY
===================================================== */

function restartTest() {

    retryTest();

}


function restartMockTest() {

    retryTest();

}


function backToExam() {

    goBackFromResult();

}


/* =====================================================
   AI TUTOR COMPATIBILITY
===================================================== */

function sendQuestion() {

    askTutor();

}


function askQuestion() {

    askTutor();

}


/* =====================================================
   MIC COMPATIBILITY
===================================================== */

function voiceInput() {

    startMic();

}


function startVoice() {

    startMic();

}


/* =====================================================
   QUIZ COMPATIBILITY
===================================================== */

function openQuiz() {

    startQuiz();

}


/* =====================================================
   GLOBAL ALIASES
===================================================== */

window.openMockTest =
    openMockTest;

window.selectPart =
    selectPart;

window.loadPart =
    loadPart;

window.backToParts =
    backToParts;

window.backToPremium =
    backToPremium;

window.buyPremium =
    buyPremium;

window.payNow =
    payNow;

window.unlockPart =
    unlockPart;

window.restartTest =
    restartTest;

window.restartMockTest =
    restartMockTest;

window.backToExam =
    backToExam;

window.sendQuestion =
    sendQuestion;

window.askQuestion =
    askQuestion;

window.voiceInput =
    voiceInput;

window.startVoice =
    startVoice;

window.openQuiz =
    openQuiz;


/* =====================================================
   FINAL EXAM CONFIGURATION CHECK
===================================================== */

(function finalConfigurationCheck() {

    const requiredExams = [

        "SSC",
        "UPSC",
        "BANK",
        "WBP",
        "KOLKATA_POLICE",
        "RAILWAY"

    ];


    requiredExams.forEach(
        function (
            exam
        ) {

            if (
                !examFiles[exam]
            ) {

                console.error(
                    "❌ Missing exam configuration:",
                    exam
                );

            }

        }
    );


    console.log(
        "📚 Configured exams:",
        Object.keys(
            examFiles
        )
    );


    console.log(
        "🆓 Free Parts:",
        FREE_PART_START +
        "–" +
        FREE_PART_END
    );


    console.log(
        "⭐ Premium Parts:",
        PAID_PART_START +
        "–" +
        PAID_PART_END
    );


    console.log(
        "💰 Premium Price: ₹" +
        PREMIUM_PRICE
    );


    console.log(
        "🎯 Final script loaded successfully."
    );

})();


/* =====================================================
   END — ITTA STUDY IQ FINAL SCRIPT
===================================================== */
