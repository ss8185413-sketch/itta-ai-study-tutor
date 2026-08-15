// ===============================
// ITTA STUDY IQ - MAIN SCRIPT
// ===============================


// ===============================
// GLOBAL VARIABLES
// ===============================

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedExam = "";
let selectedPart = "";


// ===============================
// AI STUDY TUTOR
// ===============================

async function askTutor() {

    const questionBox = document.getElementById("question");
    const answerBox = document.getElementById("answer");

    if (!questionBox || !answerBox) {
        console.error("AI Tutor elements not found.");
        return;
    }

    const question = questionBox.value.trim();

    if (!question) {
        answerBox.innerText = "Please type a question first.";
        return;
    }

    answerBox.innerText = "Thinking... ✨";

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        if (!response.ok) {
            throw new Error("Server Error: " + response.status);
        }

        const data = await response.json();

        if (data.answer) {
            answerBox.innerText = data.answer;
        }
        else if (data.text) {
            answerBox.innerText = data.text;
        }
        else {
            answerBox.innerText = "Sorry, no answer received.";
        }

    }
    catch (error) {

        console.error("AI Tutor Error:", error);

        answerBox.innerText =
            "Something went wrong. Please try again.";

    }
}


// ===============================
// AI ENTER KEY
// ===============================

document.addEventListener("DOMContentLoaded", function () {

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


// ===============================
// START MOCK TEST
// ===============================

async function startMockTest(exam) {

    selectedExam = exam;
    selectedPart = "";

    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;


    // ===============================
    // SSC PART SELECTION
    // ===============================

    if (exam === "SSC") {

        showSSCParts();

        return;

    }


    // ===============================
    // OTHER EXAMS
    // ===============================

    let fileName = "";

    if (exam === "UPSC") {
        fileName = "upsc_questions.json";
    }
    else if (exam === "BANK") {
        fileName = "bank_questions.json";
    }
    else if (exam === "WBP") {
        fileName = "wbp_questions.json";
    }
    else if (exam === "KOLKATA_POLICE") {
        fileName = "kolkata_police_questions.json";
    }
    else if (exam === "RAILWAY") {
        fileName = "railway_questions.json";
    }
    else {

        alert("Exam not found.");

        return;

    }


    try {

        const response =
            await fetch(fileName);

        if (!response.ok) {

            throw new Error(
                "Question file not found: " + fileName
            );

        }

        const data =
            await response.json();


        if (!Array.isArray(data)) {

            alert(
                "Question file format is incorrect."
            );

            return;

        }


        if (data.length === 0) {

            alert("No questions found.");

            return;

        }


        currentQuestions =
            shuffleArray(data).slice(
                0,
                Math.min(10, data.length)
            );


        showMockTest();

    }
    catch (error) {

        console.error(
            "Mock Test Error:",
            error
        );

        alert(
            "Question file load হচ্ছে না.\n\n" +
            "File name এবং location check করো."
        );

    }

}


// ===============================
// SHOW SSC PARTS
// ===============================

function showSSCParts() {

    const container =
        document.getElementById("mockTestBox");

    if (!container) {

        console.error(
            "mockTestBox element not found."
        );

        return;

    }


    container.innerHTML = `

        <div class="ssc-parts">

            <h3>📚 SSC Mock Test</h3>

            <p>Select a Part</p>


            <button
                type="button"
                onclick="startSSCPart('part1')"
            >
                📖 Part 1
            </button>


            <button
                type="button"
                onclick="startSSCPart('part2')"
            >
                📖 Part 2
            </button>


            <button
                type="button"
                onclick="startSSCPart('part3')"
            >
                📖 Part 3
            </button>


            <button
                type="button"
                onclick="startSSCPart('part4')"
            >
                📖 Part 4
            </button>


            <button
                type="button"
                onclick="startSSCPart('part5')"
            >
                📖 Part 5
            </button>


            <button
                type="button"
                onclick="startSSCPart('part6')"
            >
                📖 Part 6
            </button>


            <button
                type="button"
                onclick="startSSCPart('part7')"
            >
                📖 Part 7
            </button>


            <button
                type="button"
                onclick="startSSCPart('part8')"
            >
                📖 Part 8
            </button>


            <button
                type="button"
                onclick="startSSCPart('part9')"
            >
                📖 Part 9
            </button>


            <button
                type="button"
                onclick="startSSCPart('part10')"
            >
                📖 Part 10
            </button>

        </div>

    `;

}


// ===============================
// START SSC PART
// ===============================

async function startSSCPart(partName) {

    selectedExam = "SSC";
    selectedPart = partName;

    currentQuestionIndex = 0;
    score = 0;
    currentQuestions = [];


    try {

        const response =
            await fetch("ssc_questions.json");


        if (!response.ok) {

            throw new Error(
                "SSC JSON file not found."
            );

        }


        const data =
            await response.json();


        // ===============================
        // CHECK SELECTED PART
        // ===============================

        if (
            !data ||
            !Array.isArray(data[partName])
        ) {

            alert(
                "SSC " +
                partName +
                " পাওয়া যায়নি."
            );

            return;

        }


        const partQuestions =
            data[partName];


        if (partQuestions.length === 0) {

            alert(
                "এই Part-এ কোনো প্রশ্ন নেই."
            );

            return;

        }


        // ===============================
        // RANDOM 10 QUESTIONS
        // ===============================

        currentQuestions =
            shuffleArray(
                partQuestions
            ).slice(
                0,
                Math.min(10, partQuestions.length)
            );


        showMockTest();

    }
    catch (error) {

        console.error(
            "SSC Part Error:",
            error
        );

        alert(
            "SSC question file load হচ্ছে না."
        );

    }

}


// ===============================
// SHUFFLE ARRAY
// ===============================

function shuffleArray(array) {

    const newArray =
        [...array];


    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            newArray[i],
            newArray[j]
        ] =
        [
            newArray[j],
            newArray[i]
        ];

    }


    return newArray;

}


// ===============================
// SHOW MOCK TEST
// ===============================

function showMockTest() {

    const container =
        document.getElementById(
            "mockTestBox"
        );


    if (!container) {

        console.error(
            "mockTestBox not found."
        );

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


    const questionText =
        question.question ||
        question.questionText ||
        question.q ||
        "Question not found";


    const options =
        question.options ||
        question.answers ||
        [];


    let html = "";


    html += `

        <div class="mock-question">

            <h3>
                Question
                ${currentQuestionIndex + 1}
                /
                ${currentQuestions.length}
            </h3>

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


// ===============================
// SELECT ANSWER
// ===============================

function selectAnswer(
    selectedIndex
) {

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
        question.correct_option;


    const buttons =
        document.querySelectorAll(
            ".option-btn"
        );


    buttons.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    let correctIndex = -1;


    // ===============================
    // ANSWER IS NUMBER
    // ===============================

    if (
        typeof correctAnswer ===
        "number"
    ) {

        correctIndex =
            correctAnswer;

    }


    // ===============================
    // ANSWER IS TEXT
    // ===============================

    else if (
        typeof correctAnswer ===
        "string"
    ) {

        correctIndex =
            options.findIndex(
                function (option) {

                    return (
                        String(option)
                            .trim()
                            .toLowerCase()
                        ===
                        correctAnswer
                            .trim()
                            .toLowerCase()
                    );

                }
            );


        // ===============================
        // A / B / C / D SUPPORT
        // ===============================

        if (
            correctIndex === -1
        ) {

            const letters =
                [
                    "A",
                    "B",
                    "C",
                    "D"
                ];


            correctIndex =
                letters.indexOf(
                    correctAnswer
                        .trim()
                        .toUpperCase()
                );

        }

    }


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (
        selectedIndex ===
        correctIndex
    ) {

        score++;


        if (feedback) {

            feedback.innerHTML =
                "<p>✅ Correct!</p>";

        }

    }
    else {

        if (feedback) {

            feedback.innerHTML =
                "<p>❌ Incorrect!</p>";

        }

    }


    // ===============================
    // NEXT QUESTION
    // ===============================

    setTimeout(
        function () {

            currentQuestionIndex++;


            if (
                currentQuestionIndex <
                currentQuestions.length
            ) {

                showMockTest();

            }
            else {

                showResult();

            }

        },
        900
    );

}


// ===============================
// SHOW RESULT
// ===============================

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


    let testName =
        selectedExam;


    if (
        selectedExam === "SSC" &&
        selectedPart
    ) {

        testName =
            "SSC - " +
            selectedPart
                .replace(
                    "part",
                    "Part "
                );

    }


    container.innerHTML = `

        <div class="result-box">

            <h2>
                🎉 Test Complete!
            </h2>

            <p>
                Exam:
                ${escapeHTML(testName)}
            </p>

            <h3>
                Score:
                ${score}
                /
                ${total}
            </h3>

            <h3>
                Percentage:
                ${percentage}%
            </h3>


            <button
                type="button"
                onclick="restartMockTest()"
            >

                🔄 Try Again

            </button>


            <button
                type="button"
                onclick="startMockTest('SSC')"
            >

                📚 Choose Part

            </button>

        </div>

    `;

}


// ===============================
// RESTART
// ===============================

function restartMockTest() {

    if (
        selectedExam === "SSC" &&
        selectedPart
    ) {

        startSSCPart(
            selectedPart
        );

        return;

    }


    if (selectedExam) {

        startMockTest(
            selectedExam
        );

    }

}


// ===============================
// HTML ESCAPE
// ===============================

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


// ===============================
// SIMPLE QUIZ SUPPORT
// ===============================

function startQuiz() {

    const quizBox =
        document.getElementById(
            "quizBox"
        );


    if (!quizBox) {

        return;

    }


    quizBox.innerHTML = `

        <div>

            <h3>
                🧠 Quiz
            </h3>

            <p>
                Quiz system is ready.
            </p>

        </div>

    `;

}


// ===============================
// MICROPHONE SUPPORT
// ===============================

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


    recognition.onresult =
        function (event) {

            questionBox.value =
                event.results[0][0].transcript;

        };


    recognition.onerror =
        function (error) {

            console.error(
                "Microphone Error:",
                error
            );

        };


    recognition.start();

                }
