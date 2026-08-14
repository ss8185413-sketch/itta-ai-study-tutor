// =========================
// AI STUDY TUTOR
// =========================

async function askTutor() {

    const question =
        document.getElementById("question").value.trim();

    const answer =
        document.getElementById("answer");

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
            "Error:",
            error
        );

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


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";

    recognition.interimResults =
        false;

    recognition.continuous =
        false;


    recognition.onstart = function () {

        const micBtn =
            document.getElementById("micBtn");

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
        function () {

            const micBtn =
                document.getElementById("micBtn");

            if (micBtn) {
                micBtn.innerText =
                    "🎙️";
            }
        };


    recognition.onend =
        function () {

            const micBtn =
                document.getElementById("micBtn");

            if (micBtn) {
                micBtn.innerText =
                    "🎙️";
            }
        };


    recognition.start();
}


// =========================
// STUDY QUIZ
// =========================

const quizQuestions = [

    {
        question:
            "ভারতের রাজধানী কোনটি?",

        options: [
            "মুম্বাই",
            "কলকাতা",
            "নয়াদিল্লি",
            "চেন্নাই"
        ],

        answer: 2
    },


    {
        question:
            "ভারতের জাতীয় পশু কোনটি?",

        options: [
            "সিংহ",
            "বাঘ",
            "হাতি",
            "হরিণ"
        ],

        answer: 1
    },


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
            "ভারতের জাতীয় ফুল কোনটি?",

        options: [
            "গোলাপ",
            "পদ্ম",
            "জবা",
            "সূর্যমুখী"
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

];


let currentQuiz = [];

let quizIndex = 0;

let quizScore = 0;


// =========================
// START QUIZ
// =========================

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


// =========================
// SHOW QUIZ QUESTION
// =========================

function showQuizQuestion() {

    const box =
        document.getElementById(
            "quizBox"
        );


    if (!box) {
        return;
    }


    if (
        quizIndex >=
        currentQuiz.length
    ) {

        box.innerHTML = `

            <div class="mock-result">

                <h2>
                    🎉 Quiz Complete!
                </h2>

                <p>
                    তোমার স্কোর:
                    <strong>
                        ${quizScore}
                        /
                        ${currentQuiz.length}
                    </strong>
                </p>

                <button
                    onclick="startQuiz()"
                >
                    🔄 আবার Quiz দাও
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
                ${quizIndex + 1}.
                ${q.question}
            </h3>


            ${q.options.map(
                (option, index) => `

                <button
                    class="option-btn"
                    onclick="
                        selectQuizAnswer(${index})
                    "
                >
                    ${option}
                </button>

            `
            ).join("")}

        </div>

    `;
}


// =========================
// SELECT QUIZ ANSWER
// =========================

function selectQuizAnswer(selected) {

    const correct =
        currentQuiz[
            quizIndex
        ].answer;


    if (
        selected === correct
    ) {

        quizScore++;
    }


    quizIndex++;

    showQuizQuestion();
}


// ======================================================
// COMPETITIVE MOCK TEST
// ======================================================


// =========================
// SEPARATE JSON FILES
// =========================

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


// =========================
// MOCK VARIABLES
// =========================

let currentMockExam = "";

let currentMockPart = "";

let currentMockQuestions = [];

let currentMockIndex = 0;

let mockScore = 0;


// =========================
// START MOCK TEST
// =========================

async function startMockTest(exam) {

    currentMockExam =
        exam;


    const file =
        mockQuestionFiles[exam];


    if (!file) {

        console.error(
            "Question file not found:",
            exam
        );

        return;
    }


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
    // SSC PART SELECTION
    // =========================

    if (exam === "SSC") {

        await showSSCParts();

        return;
    }


    // =========================
    // OTHER EXAMS
    // =========================

    loadMockQuestions(file);

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
                Select a Part
            </p>

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
                "Could not load SSC question file."
            );
        }


        const data =
            await response.json();


        // Check Part structure

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new Error(
                "Invalid SSC JSON structure."
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
                    Select the Part you want to attempt
                </p>

                <div class="mock-options">

        `;


        parts.forEach(
            (part, index) => {

                const questions =
                    data[part];


                const partNumber =
                    part
                    .replace(
                        "part",
                        ""
                    );


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
                        onclick="
                            startSSCPart('${part}')
                        "
                    >
                        📘 Part ${partNumber}
                        <br>
                        <small>
                            Questions ${start}-${end}
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
                    SSC Parts load করা যায়নি।
                </p>

                <p>
                    Check ssc_questions.json
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
                📚 Loading SSC ${part}...
            </h2>

            <p>
                Please wait...
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
                "Could not load SSC question file."
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
            [...data[part]]
            .sort(
                () =>
                    Math.random() - 0.5
            );


        currentMockIndex =
            0;

        mockScore =
            0;


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
                    ${part}
                    load করা যায়নি।
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

            <p>
                Please wait...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(file);


        if (!response.ok) {

            throw new Error(
                "Could not load " +
                file
            );
        }


        const questions =
            await response.json();


        if (
            !Array.isArray(
                questions
            ) ||
            questions.length === 0
        ) {

            throw new Error(
                "Question bank is empty."
            );
        }


        currentMockPart =
            "";


        currentMockQuestions =
            [...questions]
            .sort(
                () =>
                    Math.random() - 0.5
            );


        currentMockIndex =
            0;

        mockScore =
            0;


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
                    ${file}
                    load করা যায়নি।
                </p>

                <p>
                    Check the JSON file name
                    and GitHub folder.
                </p>

            </div>

        `;
    }
}


// =========================
// SHOW MOCK QUESTION
// =========================

function showMockQuestion() {

    const box =
        document.getElementById(
            "mockTestBox"
        );


    if (
        currentMockIndex >=
        currentMockQuestions.length
    ) {

        showMockResult();

        return;
    }


    const q =
        currentMockQuestions[
            currentMockIndex
        ];


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
            .replace(
                "part",
                ""
            );


        title +=
            " - Part " +
            partNumber;
    }


    box.innerHTML = `

        <div class="mock-question">

            <p>

                <strong>
                    ${title}
                </strong>

                Mock Test

            </p>


            <p>

                Question
                ${currentMockIndex + 1}
                /
                ${currentMockQuestions.length}

            </p>


            <h3>
                ${q.question}
            </h3>


            <div class="mock-options">

                ${q.options.map(
                    (option, index) => `

                    <button
                        class="option-btn"
                        onclick="
                            selectMockAnswer(${index})
                        "
                    >
                        ${option}
                    </button>

                `
                ).join("")}

            </div>

        </div>

    `;
}


// =========================
// EXAM NAME
// =========================

function getExamName(exam) {

    const names = {

        UPSC:
            "UPSC",

        SSC:
            "SSC",

        BANK:
            "Bank",

        WBP:
            "WBP",

        KOLKATA_POLICE:
            "Kolkata Police",

        RAILWAY:
            "Railway"

    };


    return (
        names[exam] ||
        exam
    );
}


// =========================
// SELECT MOCK ANSWER
// =========================

function selectMockAnswer(selected) {

    const question =
        currentMockQuestions[
            currentMockIndex
        ];


    const selectedText =
        question.options[
            selected
        ];


    const correctText =
        question.answer;


    const buttons =
        document.querySelectorAll(
            "#mockTestBox .option-btn"
        );


    // Disable buttons

    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );


    // =========================
    // CORRECT / WRONG
    // =========================

    buttons.forEach(
        button => {

            const buttonText =
                button.innerText.trim();


            if (
                buttonText ===
                correctText.trim()
            ) {

                button.classList.add(
                    "correct"
                );
            }


            if (
                buttonText ===
                selectedText.trim() &&
                selectedText.trim() !==
                correctText.trim()
            ) {

                button.classList.add(
                    "wrong"
                );
            }

        }
    );


    // =========================
    // SCORE
    // =========================

    if (
        selectedText.trim() ===
        correctText.trim()
    ) {

        mockScore++;
    }


    // =========================
    // NEXT QUESTION
    // =========================

    setTimeout(
        () => {

            currentMockIndex++;

            showMockQuestion();

        },
        800
    );
}


// =========================
// MOCK RESULT
// =========================

function showMockResult() {

    const box =
        document.getElementById(
            "mockTestBox"
        );

                
