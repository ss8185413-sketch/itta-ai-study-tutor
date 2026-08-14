// ======================================================
// ITTA STUDY IQ
// COMPLETE SCRIPT.JS
// ======================================================


// ======================================================
// AI STUDY TUTOR
// ======================================================

async function askTutor() {

    const questionBox =
        document.getElementById("question");

    const answer =
        document.getElementById("answer");

    if (!questionBox || !answer) {
        console.error("AI Tutor elements not found.");
        return;
    }

    const question =
        questionBox.value.trim();

    if (!question) {

        answer.innerText =
            "Please type a question first.";

        return;
    }

    answer.innerHTML =
        "Thinking... ✨";

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

        const data =
            await response.json();

        if (!response.ok) {

            answer.innerText =
                data.error ||
                "Server error occurred.";

            return;
        }

        answer.innerHTML = "";

        const answerText =
            document.createElement("div");

        answerText.innerText =
            data.answer ||
            "No answer received.";

        answer.appendChild(answerText);


        // =========================
        // DIAGRAM
        // =========================

        if (data.diagram) {

            const diagramTitle =
                document.createElement("h3");

            diagramTitle.innerText =
                "📊 Diagram";

            diagramTitle.style.marginTop =
                "20px";

            answer.appendChild(
                diagramTitle
            );


            const diagramBox =
                document.createElement("div");

            diagramBox.style.marginTop =
                "10px";

            diagramBox.style.overflow =
                "auto";

            diagramBox.style.textAlign =
                "center";

            diagramBox.innerHTML =
                data.diagram;

            answer.appendChild(
                diagramBox
            );
        }

    } catch (error) {

        console.error(
            "AI Tutor Error:",
            error
        );

        answer.innerText =
            "Could not connect to the server.";
    }
}


// ======================================================
// MICROPHONE
// ======================================================

function startMic() {

    const questionBox =
        document.getElementById("question");

    const micBtn =
        document.getElementById("micBtn");

    if (!questionBox) {
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        questionBox.placeholder =
            "Voice recognition is not supported on this browser.";

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


    recognition.onstart = function () {

        if (micBtn) {
            micBtn.innerText =
                "🔴 Listening...";
        }
    };


    recognition.onresult =
        function (event) {

            const text =
                event.results[0][0]
                .transcript;

            questionBox.value =
                text;
        };


    recognition.onerror =
        function (error) {

            console.error(
                "Microphone Error:",
                error
            );

            if (micBtn) {
                micBtn.innerText =
                    "🎙️";
            }
        };


    recognition.onend =
        function () {

            if (micBtn) {
                micBtn.innerText =
                    "🎙️";
            }
        };


    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Microphone start error:",
            error
        );
    }
}


// ======================================================
// STUDY QUIZ
// ======================================================

const quizQuestions = [

    {
        question:
            "Which city is the capital of India?",

        options: [
            "Mumbai",
            "Kolkata",
            "New Delhi",
            "Chennai"
        ],

        answer: 2
    },


    {
        question:
            "What is the national animal of India?",

        options: [
            "Lion",
            "Tiger",
            "Elephant",
            "Deer"
        ],

        answer: 1
    },


    {
        question:
            "When did the Constitution of India come into effect?",

        options: [
            "15 August 1947",
            "26 January 1950",
            "26 November 1949",
            "2 October 1950"
        ],

        answer: 1
    },


    {
        question:
            "What is the national flower of India?",

        options: [
            "Rose",
            "Lotus",
            "Hibiscus",
            "Sunflower"
        ],

        answer: 1
    },


    {
        question:
            "Who was the first President of India?",

        options: [
            "Jawaharlal Nehru",
            "Dr. Rajendra Prasad",
            "Sardar Patel",
            "Dr. B. R. Ambedkar"
        ],

        answer: 1
    }

];


let currentQuiz = [];

let quizIndex = 0;

let quizScore = 0;


// ======================================================
// START QUIZ
// ======================================================

function startQuiz() {

    currentQuiz =
        [...quizQuestions]
        .sort(
            () => Math.random() - 0.5
        );

    quizIndex = 0;

    quizScore = 0;

    showQuizQuestion();
}


// ======================================================
// SHOW QUIZ QUESTION
// ======================================================

function showQuizQuestion() {

    const box =
        document.getElementById(
            "quizBox"
        );

    if (!box) {
        console.error("quizBox not found.");
        return;
    }


    if (
        quizIndex >=
        currentQuiz.length
    ) {

        const percentage =
            Math.round(
                (quizScore /
                    currentQuiz.length) *
                100
            );

        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    🎉 Quiz Complete!
                </h2>

                <p>
                    Score:
                    <strong>
                        ${quizScore}
                        /
                        ${currentQuiz.length}
                    </strong>
                </p>

                <p>
                    Percentage:
                    <strong>
                        ${percentage}%
                    </strong>
                </p>

                <button
                    onclick="startQuiz()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

        return;
    }


    const q =
        currentQuiz[quizIndex];


    box.innerHTML = `

        <div class="mock-question">

            <h3>
                Question ${quizIndex + 1}
            </h3>

            <p>
                ${escapeHTML(q.question)}
            </p>

            <div class="mock-options">

                ${q.options.map(
                    (option, index) => `

                    <button
                        class="option-btn"
                        onclick="selectQuizAnswer(${index})"
                    >
                        ${escapeHTML(option)}
                    </button>

                `
                ).join("")}

            </div>

        </div>

    `;
}


// ======================================================
// SELECT QUIZ ANSWER
// ======================================================

function selectQuizAnswer(selected) {

    const question =
        currentQuiz[quizIndex];

    if (!question) {
        return;
    }


    const buttons =
        document.querySelectorAll(
            "#quizBox .option-btn"
        );


    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );


    if (
        Number(selected) ===
        Number(question.answer)
    ) {

        quizScore++;

        if (buttons[selected]) {

            buttons[selected]
                .classList.add("correct");

        }

    } else {

        if (buttons[selected]) {

            buttons[selected]
                .classList.add("wrong");

        }

        if (buttons[question.answer]) {

            buttons[question.answer]
                .classList.add("correct");

        }
    }


    setTimeout(
        () => {

            quizIndex++;

            showQuizQuestion();

        },
        800
    );
}


// ======================================================
// COMPETITIVE MOCK TEST
// ======================================================


// ======================================================
// JSON FILES
// ======================================================

const mockQuestionFiles = {

    UPSC:
        "upsc_questions.json",

    SSC:
        "ssc_questions.json",

    BANK:
        "bank_questions.json",

    WBP:
        "wbp_questions.json",

    KOLKATA_POLICE:
        "kolkata_police_questions.json",

    RAILWAY:
        "railway_questions.json"

};


// ======================================================
// MOCK VARIABLES
// ======================================================

let currentMockExam = "";

let currentMockPart = "";

let currentMockQuestions = [];

let currentMockIndex = 0;

let mockScore = 0;

let mockAnswered = false;


// ======================================================
// START MOCK TEST
// ======================================================

async function startMockTest(exam) {

    currentMockExam =
        exam;

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {

        console.error(
            "mockTestBox not found."
        );

        return;
    }


    // =========================
    // SSC
    // =========================

    if (exam === "SSC") {

        await showSSCParts();

        return;
    }


    // =========================
    // OTHER EXAMS
    // =========================

    const file =
        mockQuestionFiles[exam];

    if (!file) {

        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    ⚠️ Exam Error
                </h2>

                <p>
                    Invalid exam selected.
                </p>

            </div>

        `;

        return;
    }


    currentMockPart = "";

    await loadMockQuestions(file);
}


// ======================================================
// SSC PART SELECTION
// ======================================================

async function showSSCParts() {

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {
        return;
    }


    box.innerHTML = `

        <div class="mock-result">

            <h2>
                📚 SSC Mock Test
            </h2>

            <p>
                Loading Parts...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                mockQuestionFiles.SSC
            );


        if (!response.ok) {

            throw new Error(
                "SSC question file could not be loaded."
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {

            throw new Error(
                "SSC JSON must contain Part-wise questions."
            );
        }


        const parts =
            Object.keys(data)
            .filter(
                key =>
                    Array.isArray(
                        data[key]
                    )
            );


        if (parts.length === 0) {

            throw new Error(
                "No SSC Parts found."
            );
        }


        let html = `

            <div class="mock-question">

                <h2>
                    📚 SSC Mock Test
                </h2>

                <p>
                    Select a Part
                </p>

                <div class="mock-options">

        `;


        parts.forEach(
            part => {

                const questions =
                    data[part];


                let partNumber =
                    part
                    .toLowerCase()
                    .replace(
                        "part",
                        ""
                    )
                    .trim();


                if (!partNumber) {
                    partNumber = "1";
                }


                const start =
                    (
                        (Number(partNumber) - 1) *
                        50
                    ) + 1;


                const end =
                    start +
                    questions.length -
                    1;


                html += `

                    <button
                        class="option-btn"
                        onclick="startSSCPart('${escapeAttribute(part)}')"
                    >

                        📘 Part ${escapeHTML(partNumber)}

                        <br>

                        <small>
                            Questions
                            ${start}-${end}
                        </small>

                    </button>

                `;
            }
        );


        html += `

                </div>

            </div>

        `;


        box.innerHTML =
            html;


    } catch (error) {

        console.error(
            "SSC Part Error:",
            error
        );


        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    ⚠️ SSC Question Bank Error
                </h2>

                <p>
                    SSC Parts could not be loaded.
                </p>

                <p>
                    Please check:
                    ssc_questions.json
                </p>

            </div>

        `;
    }
}


// ======================================================
// START SSC PART
// ======================================================

async function startSSCPart(part) {

    currentMockExam =
        "SSC";

    currentMockPart =
        part;

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {
        return;
    }


    box.innerHTML = `

        <div class="mock-result">

            <h2>
                📚 Loading SSC ${escapeHTML(part)}...
            </h2>

        </div>

    `;


    try {

        const response =
            await fetch(
                mockQuestionFiles.SSC
            );


        if (!response.ok) {

            throw new Error(
                "SSC question file could not be loaded."
            );
        }


        const data =
            await response.json();


        if (
            !data[part] ||
            !Array.isArray(
                data[part]
            ) ||
            data[part].length === 0
        ) {

            throw new Error(
                "Selected SSC Part is empty."
            );
        }


        currentMockQuestions =
            shuffleArray(
                data[part]
            );


        currentMockIndex = 0;

        mockScore = 0;

        mockAnswered = false;


        showMockQuestion();


    } catch (error) {

        console.error(
            "SSC Part Error:",
            error
        );


        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    ⚠️ Error
                </h2>

                <p>
                    SSC Part could not be loaded.
                </p>

            </div>

        `;
    }
}


// ======================================================
// LOAD OTHER EXAM QUESTIONS
// ======================================================

async function loadMockQuestions(file) {

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {
        return;
    }


    box.innerHTML = `

        <div class="mock-result">

            <h2>
                📚 Loading Questions...
            </h2>

        </div>

    `;


    try {

        const response =
            await fetch(file);


        if (!response.ok) {

            throw new Error(
                "Question file could not be loaded."
            );
        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "This exam JSON must contain an array."
            );
        }


        if (data.length === 0) {

            throw new Error(
                "Question bank is empty."
            );
        }


        currentMockQuestions =
            shuffleArray(data);

        currentMockIndex = 0;

        mockScore = 0;

        mockAnswered = false;


        showMockQuestion();


    } catch (error) {

        console.error(
            "Question Bank Error:",
            error
        );


        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    ⚠️ Question Bank Error
                </h2>

                <p>
                    ${escapeHTML(file)}
                    could not be loaded.
                </p>

            </div>

        `;
    }
}


// ======================================================
// SHOW MOCK QUESTION
// ======================================================

function showMockQuestion() {

    const box =
        document.getElementById(
            "mockTestBox"
        );

    if (!box) {
        return;
    }


    if (
        currentMockIndex >=
        currentMockQuestions.length
    ) {

        showMockResult();

        return;
    }


    mockAnswered = false;


    const q =
        currentMockQuestions[
            currentMockIndex
        ];


    if (
        !q ||
        !Array.isArray(q.options)
    ) {

        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    ⚠️ Invalid Question
                </h2>

                <p>
                    This question does not have valid options.
                </p>

            </div>

        `;

        return;
    }


    let title =
        getExamName(
            currentMockExam
        );


    if (
        currentMockExam === "SSC" &&
        currentMockPart
    ) {

        const partNumber =
            currentMockPart
            .toLowerCase()
            .replace(
                "part",
                ""
            )
            .trim();


        title +=
            " - Part " +
            partNumber;
    }


    box.innerHTML = `

        <div class="mock-question">

            <p>
                <strong>
                    ${escapeHTML(title)}
                </strong>
            </p>

            <p>
                Question
                ${currentMockIndex + 1}
                /
                ${currentMockQuestions.length}
            </p>

            <h3>
                ${escapeHTML(q.question)}
            </h3>

            <div class="mock-options">

                ${q.options.map(
