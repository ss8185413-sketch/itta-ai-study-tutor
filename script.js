"use strict";

/* =====================================================
   ITTA STUDY IQ
   PART 1 / 3

   Includes:
   - AI Tutor
   - Microphone
   - Quick Quiz
   - Exam configuration
   - SSC CGL / CHSL / MTS etc.
   - Free Parts 1–20
   - Premium Parts 21–100
   - Golden Premium UI
   - ₹49 Premium price
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
   EXAM FILES
===================================================== */

const examFiles = {

    SSC: "ssc_questions.json",

    UPSC: "upsc_questions.json",

    BANK: "bank_questions.json",

    WBP: "wbp_questions.json",

    KOLKATA_POLICE:
        "kolkata_police_questions.json",

    RAILWAY:
        "railway_questions.json"

};


/* =====================================================
   EXAM NAMES
===================================================== */

const examPartNames = {

    SSC: "SSC",

    UPSC: "UPSC",

    BANK: "Bank",

    WBP: "WBP",

    KOLKATA_POLICE:
        "Kolkata Police",

    RAILWAY:
        "Railway"

};


/* =====================================================
   SSC / EXAM SUB-CATEGORIES
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

    recognition.interimResults =
        false;

    recognition.continuous =
        false;


    recognition.onstart =
        function () {

            questionBox.placeholder =
                "Listening...";

        };


    recognition.onresult =
        function (event) {

            questionBox.value =
                event
                    .results[0][0]
                    .transcript;

        };


    recognition.onerror =
        function (event) {

            console.error(
                "Microphone Error:",
                event.error
            );


            questionBox.placeholder =
                "Type your question here...";

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
        document.getElementById(
            "quizBox"
        );


    if (quizBox) {

        quizBox.innerHTML =
            "";

    }

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
        examPartNames[exam] ||
        exam;


    const categories =
        examCategories[exam] ||
        [];


    let freeButtonsHTML =
        "";


    for (
        let i =
            FREE_PART_START;

        i <=
            FREE_PART_END;

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


    let categoryHTML =
        "";


    if (
        categories.length >
        0
    ) {

        categoryHTML = `

            <div
                class="exam-category-section"
            >

                <div
                    class="exam-category-title"
                >

                    📚
                    ${escapeHTML(
                        examName
                    )}
                    Exams

                </div>


                <div class="exam-grid">

                    ${categories
                        .map(
                            function (
                                category
                            ) {

                                return `

                                    <button
                                        type="button"
                                        class="exam-btn category-btn"
                                        onclick="selectExamCategory('${exam}', '${category.replace(/'/g, "\\'")}')"
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


    container.innerHTML = `

        <div class="exam-parts">

            <h3>

                📚
                ${escapeHTML(
                    examName
                )}

            </h3>


            <p>

                Select your exam category
                and Mock Test

            </p>


            ${categoryHTML}


            <div
                class="free-section"
            >

                <h4>

                    🆓
                    Free Mock Tests

                </h4>


                <p>

                    Part 1 - 20

                </p>


                <div
                    class="exam-grid"
                >

                    ${freeButtonsHTML}

                </div>

            </div>


            <div
                class="paid-section"
            >

                <h4
                    class="paid-label"
                >

                    ⭐
                    Premium Mock Tests
                    — ₹49

                </h4>


                <p>

                    Part 21 - 100
                    • Golden Premium Access

                </p>


                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="showPaidParts('${exam}')"
                >

                    ⭐
                    Open Premium Parts
                    — ₹49

                </button>

            </div>

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


    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {

        return;

    }


    const categoryNote =
        document.createElement(
            "div"
        );


    categoryNote.className =
        "premium-category-section";


    categoryNote.innerHTML = `

        <div
            class="premium-category-title"
        >

            🎯 Selected:
            ${escapeHTML(
                category
            )}

        </div>


        <p
            style="margin:0;"
        >

            Choose Free Part 1–20
            or ⭐ Premium Part 21–100
            below.

        </p>

    `;


    const examParts =
        container.querySelector(
            ".exam-parts"
        );


    const freeSection =
        container.querySelector(
            ".free-section"
        );


    if (
        examParts &&
        freeSection
    ) {

        examParts.insertBefore(
            categoryNote,
            freeSection
        );

    }

}


/* =====================================================
   PREMIUM PARTS
   ===================================================== */

function showPaidParts(exam) {

    stopLiveTimer();

    clearAutoNextTimer();


    selectedExam =
        exam;

    selectedPart =
        "";


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


    let buttonsHTML =
        "";


    for (
        let i =
            PAID_PART_START;

        i <=
            PAID_PART_END;

        i++
    ) {

        buttonsHTML += `

            <button
                type="button"
                class="exam-btn part-btn paid-part-btn premium-main-btn"
                onclick="openPaidPart('${exam}', 'part${i}')"
            >

                ⭐ Part ${i}

            </button>

        `;

    }


    container.innerHTML = `

        <div
            class="exam-parts paid-parts-section"
        >

            <h3>

                ⭐
                ${escapeHTML(
                    examName
                )}
                Premium — ₹49

            </h3>


            <p>

                Golden Premium Mock Tests

            </p>


            <div
                class="premium-info"
            >

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
                    class="exam-btn premium-main-btn"
                    onclick="showPaymentMessage('${exam}')"
                >

                    ⭐ Unlock Premium
                    — ₹49

                </button>

            </div>


            <div
                class="exam-grid"
            >

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

   }/* =====================================================
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

                ${escapeHTML(
                    examName
                )}
                Premium

            </h2>


            <h3
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(
                    partText
                )}

            </h3>


            <div
                class="premium-payment-box"
                style="
                    margin-top:18px;
                    padding:18px;
                    border-radius:16px;
                    background:
                    linear-gradient(
                        135deg,
                        #fff8df,
                        #ffffff
                    );
                    border:
                    1px solid #e0b64e;
                "
            >

                <h2
                    style="
                        color:#9a6500;
                        margin-top:0;
                    "
                >

                    ⭐ GOLD PREMIUM

                </h2>


                <div
                    style="
                        font-size:32px;
                        font-weight:900;
                        color:#7b5100;
                        margin:10px 0;
                    "
                >

                    ₹49

                </div>


                <p>

                    One payment unlocks
                    Premium Parts 21–100.

                </p>


                <p>

                    Free Parts 1–20
                    will remain available.

                </p>


                <button
                    type="button"
                    class="exam-btn premium-main-btn"
                    onclick="startPremiumPayment('${exam}')"
                >

                    💳 Pay ₹49 & Unlock

                </button>


                <p
                    style="
                        font-size:13px;
                        margin-top:12px;
                    "
                >

                    🔒 Secure Premium Access

                </p>

            </div>


            <div
                class="result-buttons"
            >

                <button
                    type="button"
                    class="exam-btn"
                    onclick="showPaidParts('${exam}')"
                >

                    ⭐ Premium Parts

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
   PREMIUM PAYMENT START
===================================================== */

function startPremiumPayment(
    exam
) {

    /*
       IMPORTANT:

       এখানে এখনো real payment gateway
       connect করা হয়নি।

       তাই এই function শুধুমাত্র
       payment flow-এর UI প্রস্তুত করছে।

       Real ₹49 verification server-side
       Part 3-এর unlock system-এর সঙ্গে
       connect হবে।
    */


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


    container.innerHTML = `

        <div class="result-box">

            <div
                style="
                    font-size:48px;
                    text-align:center;
                "
            >

                💳

            </div>


            <h2
                style="
                    text-align:center;
                    color:#9a6500;
                "
            >

                Premium Payment

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


            <div
                style="
                    margin:18px 0;
                    padding:18px;
                    border-radius:16px;
                    background:#fff8df;
                    border:1px solid #e0b64e;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:14px;
                    "
                >

                    Premium Access

                </div>


                <div
                    style="
                        font-size:36px;
                        font-weight:900;
                        color:#8a5a00;
                        margin:8px 0;
                    "
                >

                    ₹49

                </div>


                <p>

                    Unlock Parts 21–100

                </p>

            </div>


            <div
                class="premium-payment-note"
            >

                <strong>

                    💳 Payment Gateway

                </strong>


                <p>

                    Payment gateway connection
                    will be added here.

                </p>


                <p
                    style="
                        font-size:13px;
                    "
                >

                    Payment must be verified
                    before Premium access
                    is granted.

                </p>

            </div>


            <button
                type="button"
                class="exam-btn premium-main-btn"
                onclick="showPaymentPending('${exam}')"
            >

                💳 Continue Payment — ₹49

            </button>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts('${exam}')"
                style="margin-top:10px;"
            >

                🔙 Back

            </button>

        </div>

    `;

}


/* =====================================================
   PAYMENT PENDING / GATEWAY PLACEHOLDER
===================================================== */

function showPaymentPending(
    exam
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


    container.innerHTML = `

        <div class="result-box">

            <div
                style="
                    font-size:48px;
                    text-align:center;
                "
            >

                🔐

            </div>


            <h2
                style="
                    text-align:center;
                    color:#9a6500;
                "
            >

                Payment Verification

            </h2>


            <p
                style="
                    text-align:center;
                "
            >

                ${escapeHTML(
                    examName
                )}
                Premium

            </p>


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

                    ₹49 Premium

                </strong>


                <p>

                    Parts 21–100 will unlock
                    only after successful
                    payment verification.

                </p>

            </div>


            <div
                class="premium-payment-note"
            >

                ⏳ Waiting for secure
                payment confirmation...

            </div>


            <button
                type="button"
                class="exam-btn"
                onclick="showPaidParts('${exam}')"
            >

                🔙 Back to Premium

            </button>

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
        partName.replace(
            "part",
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

                <div
                    class="result-box"
                >

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

            <div
                class="result-box"
            >

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
                    onclick="showExamParts('${exam}')"
                >

                    🔙 Back to Parts

                </button>

            </div>

        `;

    }

}


/* =====================================================
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
            .replace(
                /^part/i,
                ""
            );


    const keys = [

        partName,

        String(
            partName
        ).toLowerCase(),

        "Part" +
            number,

        "PART" +
            number,

        number

    ];


    /* =================================================
       FORMAT 1
    ================================================= */

    for (
        const key of keys
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


    /* =================================================
       FORMAT 2
    ================================================= */

    if (
        data &&
        data.parts &&
        !Array.isArray(
            data.parts
        )
    ) {

        for (
            const key of keys
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


    /* =================================================
       FORMAT 3
    ================================================= */

    for (
        const key of keys
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


    /* =================================================
       FORMAT 4
    ================================================= */

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


                    return (

                        item.part ===
                            partName ||

                        item.name ===
                            partName ||

                        String(
                            item.part
                        )
                            .toLowerCase() ===
                        String(
                            partName
                        )
                            .toLowerCase() ||

                        String(
                            item.name
                        )
                            .toLowerCase() ===
                        String(
                            partName
                        )
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


                normalized.question =
                    question.question ||
                    question.questionText ||
                    question.q ||
                    question.text ||
                    "";


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
   SHUFFLE ARRAY
===================================================== */

function shuffleArray(
   array
) {

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

}/* =====================================================
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


    let optionsHTML =
        "";


    options.forEach(
        function (
            option,
            index
        ) {

            optionsHTML += `

                <button
                    type="button"
                    class="quiz-option"
                    onclick="checkAnswer(${index})"
                >

                    <span>
                        ${String.fromCharCode(
                            65 + index
                        )}.
                    </span>

                    ${escapeHTML(
                        String(option)
                    )}

                </button>

            `;

        }
    );


    container.innerHTML = `

        <div
            class="mock-test-container"
        >

            <div
                class="mock-test-top"
            >

                <div>

                    <strong>

                        ${escapeHTML(
                            examPartNames[
                                selectedExam
                            ] ||
                            selectedExam
                        )}

                    </strong>


                    ${
                        selectedExamCategory
                            ? `
                                <div
                                    style="
                                        font-size:13px;
                                        margin-top:4px;
                                        color:#0756d9;
                                    "
                                >

                                    ${escapeHTML(
                                        selectedExamCategory
                                    )}

                                </div>
                            `
                            : ""
                    }

                </div>


                <div>

                    Question
                    ${current}
                    /
                    ${total}

                </div>

            </div>


            <div
                id="testTimer"
                class="test-timer"
            >

                ⏱️ 00:00

            </div>


            <div
                class="question-card"
            >

                <div
                    class="question-number"
                >

                    Question
                    ${current}

                </div>


                <h3>

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


            <button
                type="button"
                class="exam-btn"
                onclick="confirmExitTest()"
            >

                🚪 Exit Test

            </button>

        </div>

    `;

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


    let correctIndex =
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


    if (
        typeof answer ===
        "number"
    ) {

        return answer;

    }


    if (
        typeof answer ===
        "string"
    ) {

        const value =
            answer.trim();


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


        const upper =
            value.toUpperCase();


        if (
            /^[A-D]$/.test(
                upper
            )
        ) {

            return (
                upper.charCodeAt(0) -
                65
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
                .trim()
                .toUpperCase();


        if (
            /^[A-D]$/.test(
                value
            )
        ) {

            return (
                value.charCodeAt(0) -
                65
            );

        }

    }


    return 0;

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
                ) *
                100
            )
            : 0;


    let message =
        "";


    if (
        percentage >= 80
    ) {

        message =
            "Excellent performance! 🎉";

    }

    else if (
        percentage >= 60
    ) {

        message =
            "Good job! Keep practicing. 👍";

    }

    else {

        message =
            "Keep practicing and improve your score. 💪";

    }


    container.innerHTML = `

        <div
            class="result-box"
        >

            <div
                style="
                    font-size:50px;
                "
            >

                🏆

            </div>


            <h2>

                Test Completed!

            </h2>


            <h3>

                ${escapeHTML(
                    examPartNames[
                        selectedExam
                    ] ||
                    selectedExam
                )}

            </h3>


            ${
                selectedExamCategory
                    ? `
                        <p>
                            ${escapeHTML(
                                selectedExamCategory
                            )}
                        </p>
                    `
                    : ""
            }


            <div
                class="score-display"
            >

                <strong>

                    ${score}

                </strong>

                /

                ${total}

            </div>


            <div
                class="percentage-display"
            >

                ${percentage}%

            </div>


            <p>

                ${message}

            </p>


            <div
                class="result-buttons"
            >

                <button
                    type="button"
                    class="exam-btn"
                    onclick="selectExamPart('${selectedExam}', '${selectedPart}')"
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
   CHOOSE EXAM AGAIN
===================================================== */

function chooseExamAgain() {

    stopLiveTimer();

    clearAutoNextTimer();


    selectedExam =
        "";

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


    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            class="exam-selection"
        >

            <h3>

                🎯 Choose Your Exam

            </h3>


            <div
                class="exam-grid"
            >

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

                    📚 UPSC

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

                    👮 Kolkata Police

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
   TIMER
===================================================== */

function startLiveTimer() {

    stopLiveTimer();


    updateLiveTimer();


    testTimerInterval =
        setInterval(
            function () {

                updateLiveTimer();

            },
            1000
        );

}


function updateLiveTimer() {

    const timer =
        document.getElementById(
            "testTimer"
        );


    if (!timer) {

        return;

    }


    if (
        !testStartTime
    ) {

        timer.innerText =
            "⏱️ 00:00";

        return;

    }


    const elapsed =
        Math.floor(
            (
                Date.now() -
                testStartTime
            ) /
            1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    timer.innerText =

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

    const shouldExit =
        window.confirm(
            "Are you sure you want to exit this test?"
        );


    if (
        shouldExit
    ) {

        stopLiveTimer();

        clearAutoNextTimer();

        showExamParts(
            selectedExam
        );

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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
   PREMIUM ACCESS STATE
===================================================== */

/*
   IMPORTANT:

   Real payment verification must happen
   on the server.

   We NEVER unlock Premium merely because
   a button was clicked.

   This local helper only reads an already
   verified Premium status.
*/

function isPremiumUnlocked(
    exam
) {

    try {

        const key =
            "itta_premium_" +
            exam;


        return (
            localStorage.getItem(
                key
            ) === "unlocked"
        );

    }

    catch (error) {

        return false;

    }

}


/* =====================================================
   PREMIUM ACCESS AFTER VERIFIED PAYMENT
===================================================== */

function markPremiumUnlocked(
    exam
) {

    /*
       This function should ONLY be called
       after your backend verifies the
       ₹49 payment successfully.
    */

    try {

        localStorage.setItem(
            "itta_premium_" +
            exam,
            "unlocked"
        );


        showPaidParts(
            exam
        );

    }

    catch (error) {

        console.error(
            "Premium unlock error:",
            error
        );

    }

}


/* =====================================================
   OPEN PREMIUM PART SAFELY
===================================================== */

function openPremiumPartAfterVerification(
    exam,
    partName
) {

    if (
        !isPremiumUnlocked(
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
   REPLACE OPEN PAID PART FUNCTION
===================================================== */

function openPaidPart(
    exam,
    partName
) {

    openPremiumPartAfterVerification(
        exam,
        partName
    );

}


/* =====================================================
   GLOBAL FUNCTIONS
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


window.showPaymentMessage =
    showPaymentMessage;


window.startPremiumPayment =
    startPremiumPayment;


window.showPaymentPending =
    showPaymentPending;


window.checkAnswer =
    checkAnswer;


window.showResult =
    showResult;


window.chooseExamAgain =
    chooseExamAgain;


window.confirmExitTest =
    confirmExitTest;


window.markPremiumUnlocked =
    markPremiumUnlocked;


window.openPremiumPartAfterVerification =
    openPremiumPartAfterVerification;


/* =====================================================
   SCRIPT READY
===================================================== */

console.log(
    "✅ Itta Study IQ: Script fully loaded"
);

console.log(
    "⭐ Premium Parts:",
    PAID_PART_START +
    "–" +
    PAID_PART_END
);

console.log(
    "💰 Premium Price:",
    "₹" +
    PREMIUM_PRICE
);
  
