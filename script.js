// =========================
// AI STUDY TUTOR
// =========================

async function askTutor() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.innerText = "Please type a question first.";
        return;
    }

    answer.innerHTML = "Thinking... ✨";

    try {
        const response = await fetch(
            "https://itta-ai-study-tutor.onrender.com/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            answer.innerText =
                data.error || "Server error occurred.";
            return;
        }

        answer.innerHTML = "";

        const answerText = document.createElement("div");
        answerText.innerText =
            data.answer || "No answer received.";

        answer.appendChild(answerText);

        if (data.diagram) {
            const diagramTitle = document.createElement("h3");
            diagramTitle.innerText = "📊 Diagram";
            diagramTitle.style.marginTop = "20px";

            answer.appendChild(diagramTitle);

            const diagramBox = document.createElement("div");
            diagramBox.style.marginTop = "10px";
            diagramBox.style.overflow = "auto";
            diagramBox.style.textAlign = "center";

            diagramBox.innerHTML = data.diagram;

            answer.appendChild(diagramBox);
        }

    } catch (error) {
        console.error("Error:", error);

        answer.innerText =
            "Could not connect to the server.";
    }
}


// =========================
// MICROPHONE
// =========================

function startMic() {

    const questionBox =
        document.getElementById("question");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        questionBox.placeholder =
            "Voice recognition is not supported on this browser.";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = function () {
        document.getElementById("micBtn").innerText =
            "🔴 Listening...";
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        questionBox.value = text;
    };

    recognition.onerror = function () {
        document.getElementById("micBtn").innerText =
            "🎙️";
    };

    recognition.onend = function () {
        document.getElementById("micBtn").innerText =
            "🎙️";
    };

    recognition.start();
}


// =========================
// STUDY QUIZ
// =========================

const quizQuestions = [
    {
        question: "ভারতের রাজধানী কোনটি?",
        options: [
            "মুম্বাই",
            "কলকাতা",
            "নয়াদিল্লি",
            "চেন্নাই"
        ],
        answer: 2
    },

    {
        question: "ভারতের জাতীয় পশু কোনটি?",
        options: [
            "সিংহ",
            "বাঘ",
            "হাতি",
            "হরিণ"
        ],
        answer: 1
    },

    {
        question: "ভারতের সংবিধান কবে কার্যকর হয়?",
        options: [
            "১৫ আগস্ট ১৯৪৭",
            "২৬ জানুয়ারি ১৯৫০",
            "২৬ নভেম্বর ১৯৪৯",
            "২ অক্টোবর ১৯৫০"
        ],
        answer: 1
    },

    {
        question: "ভারতের জাতীয় ফুল কোনটি?",
        options: [
            "গোলাপ",
            "পদ্ম",
            "জবা",
            "সূর্যমুখী"
        ],
        answer: 1
    },

    {
        question: "ভারতের প্রথম রাষ্ট্রপতি কে ছিলেন?",
        options: [
            "জওহরলাল নেহরু",
            "ড. রাজেন্দ্র প্রসাদ",
            "সর্দার প্যাটেল",
            "ড. বি. আর. আম্বেদকর"
        ],
        answer: 1
    }
];

let currentQuiz = [];
let quizIndex = 0;
let quizScore = 0;


// Start Quiz

function startQuiz() {

    currentQuiz =
        [...quizQuestions]
        .sort(() => Math.random() - 0.5);

    quizIndex = 0;
    quizScore = 0;

    showQuizQuestion();
}


// Show Quiz Question

function showQuizQuestion() {

    const box =
        document.getElementById("quizBox");

    if (quizIndex >= currentQuiz.length) {

        box.innerHTML = `
            <div class="mock-result">

                <h2>🎉 Quiz Complete!</h2>

                <p>
                    তোমার স্কোর:
                    <strong>
                        ${quizScore} / ${currentQuiz.length}
                    </strong>
                </p>

                <button onclick="startQuiz()">
                    🔄 আবার Quiz দাও
                </button>

            </div>
        `;

        return;
    }

    const q = currentQuiz[quizIndex];

    box.innerHTML = `
        <div class="mock-question">

            <h3>
                ${quizIndex + 1}. ${q.question}
            </h3>

            ${q.options.map((option, index) => `
                <button
                    class="option-btn"
                    onclick="selectQuizAnswer(${index})"
                >
                    ${option}
                </button>
            `).join("")}

        </div>
    `;
}


// Select Quiz Answer

function selectQuizAnswer(selected) {

    const correct =
        currentQuiz[quizIndex].answer;

    if (selected === correct) {
        quizScore++;
    }

    quizIndex++;

    showQuizQuestion();
}


// =========================
// COMPETITIVE MOCK TEST
// =========================

// SSC questions will be loaded separately
// from ssc_questions.json

const mockQuestions = {

    UPSC: [

        {
            question:
                "ভারতের সংবিধান কবে কার্যকর হয়?",

            options: [
                "১৫ আগস্ট ১৯৪৭",
                "২৬ জানুয়ারি ১৯৫০",
                "২৬ নভেম্বর ১৯৪৯",
                "২ অক্টোবর ১৯৫০"
            ],

            answer: 1
        },

        {
            question:
                "ভারতের প্রথম রাষ্ট্রপতি কে ছিলেন?",

            options: [
                "জওহরলাল নেহরু",
                "ড. রাজেন্দ্র প্রসাদ",
                "সর্দার প্যাটেল",
                "ড. বি. আর. আম্বেদকর"
            ],

            answer: 1
        }

    ],


    SSC: [],


    BANK: [

        {
            question:
                "RBI-এর পূর্ণরূপ কী?",

            options: [
                "Reserve Bank of India",
                "Royal Bank of India",
                "Regional Bank of India",
                "Reserve Banking Institution"
            ],

            answer: 0
        },

        {
            question:
                "ভারতের কেন্দ্রীয় ব্যাংক কোনটি?",

            options: [
                "SBI",
                "PNB",
                "RBI",
                "BOI"
            ],

            answer: 2
        }

    ],


    WBP: [

        {
            question:
                "West Bengal-এর রাজধানী কোনটি?",

            options: [
                "হাওড়া",
                "কলকাতা",
                "দুর্গাপুর",
                "শিলিগুড়ি"
            ],

            answer: 1
        },

        {
            question:
                "West Bengal Police কোন রাজ্যের পুলিশ বাহিনী?",

            options: [
                "বিহার",
                "ওড়িশা",
                "পশ্চিমবঙ্গ",
                "ঝাড়খণ্ড"
            ],

            answer: 2
        }

    ],


    KOLKATA_POLICE: [

        {
            question:
                "কলকাতা কোন রাজ্যের রাজধানী?",

            options: [
                "বিহার",
                "পশ্চিমবঙ্গ",
                "অসম",
                "ওড়িশা"
            ],

            answer: 1
        },

        {
            question:
                "কলকাতা পুলিশ কোন শহরের আইন-শৃঙ্খলা রক্ষা করে?",

            options: [
                "দুর্গাপুর",
                "কলকাতা",
                "হাওড়া",
                "শিলিগুড়ি"
            ],

            answer: 1
        }

    ],


    RAILWAY: [

        {
            question:
                "ভারতীয় রেলের সদর দপ্তর কোথায়?",

            options: [
                "মুম্বাই",
                "নয়াদিল্লি",
                "কলকাতা",
                "চেন্নাই"
            ],

            answer: 1
        },

        {
            question:
                "ভারতীয় রেলের প্রধান পরিবহন মাধ্যম কী?",

            options: [
                "রেলপথ",
                "জলপথ",
                "আকাশপথ",
                "সড়কপথ"
            ],

            answer: 0
        }

    ]

};


let currentMockExam = "";
let currentMockQuestions = [];
let currentMockIndex = 0;
let mockScore = 0;


// =========================
// START MOCK TEST
// =========================

async function startMockTest(exam) {

    currentMockExam = exam;

    // =========================
    // SSC SEPARATE QUESTION BANK
    // =========================

    if (exam === "SSC") {

        try {

            const response =
                await fetch("ssc_questions.json");

            if (!response.ok) {
                throw new Error(
                    "SSC question file not found"
                );
            }

            const sscQuestions =
                await response.json();

            mockQuestions.SSC =
                sscQuestions;

        } catch (error) {

            console.error(
                "SSC Question Bank Error:",
                error
            );

            const box =
                document.getElementById("mockTestBox");

            box.innerHTML = `
                <div class="mock-result">

                    <h2>⚠️ SSC Question Bank Error</h2>

                    <p>
                        SSC question bank load করা যায়নি।
                    </p>

                </div>
            `;

            return;
        }
    }


    // Check question availability

    if (
        !mockQuestions[exam] ||
        mockQuestions[exam].length === 0
    ) {

        const box =
            document.getElementById("mockTestBox");

        box.innerHTML = `
            <div class="mock-result">

                <h2>⚠️ No Questions Available</h2>

                <p>
                    এই পরীক্ষার জন্য এখনো প্রশ্ন যোগ করা হয়নি।
                </p>

            </div>
        `;

        return;
    }


    currentMockQuestions =
        [...mockQuestions[exam]]
        .sort(() => Math.random() - 0.5);

    currentMockIndex = 0;
    mockScore = 0;

    showMockQuestion();
}


// =========================
// SHOW MOCK QUESTION
// =========================

function showMockQuestion() {

    const box =
        document.getElementById("mockTestBox");

    if (currentMockIndex >= currentMockQuestions.length) {

        showMockResult();

        return;
    }

    const q =
        currentMockQuestions[currentMockIndex];

    box.innerHTML = `

        <div class="mock-question">

            <p>
                ${currentMockExam} Mock Test
            </p>

            <p>
                প্রশ্ন ${currentMockIndex + 1}
                /
                ${currentMockQuestions.length}
            </p>

            <h3>
                ${q.question}
            </h3>

            ${q.options.map((option, index) => `

                <button
                    class="option-btn"
                    onclick="selectMockAnswer(${index})"
                >
                    ${option}
                </button>

            `).join("")}

        </div>
    `;
}


// =========================
// SELECT MOCK ANSWER
// =========================

function selectMockAnswer(selected) {

    const correct =
        currentMockQuestions[currentMockIndex].answer;

    if (selected === correct) {
        mockScore++;
    }

    currentMockIndex++;

    showMockQuestion();
}


// =========================
// MOCK RESULT
// =========================

function showMockResult() {

    const box =
        document.getElementById("mockTestBox");

    const total =
        currentMockQuestions.length;

    const percentage =
        total > 0
            ? Math.round((mockScore / total) * 100)
            : 0;

    box.innerHTML = `

        <div class="mock-result">

            <h2>🎉 Mock Test Complete!</h2>

            <h3>${currentMockExam}</h3>

            <p>
                তোমার স্কোর:
                <strong>
                    ${mockScore}
                    /
                    ${total}
                </strong>
            </p>

            <p>
                Percentage:
                <strong>
                    ${percentage}%
                </strong>
            </p>

            <button
                onclick="startMockTest('${currentMockExam}')"
            >
                🔄 আবার পরীক্ষা দাও
            </button>

        </div>
    `;
            }
