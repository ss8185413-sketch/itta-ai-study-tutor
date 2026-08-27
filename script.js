/* =========================================================
   ITTA LEARN
   MAIN JAVASCRIPT
========================================================= */

const exams = {
  SSC: "ssc_questions.json",
  UPSC: "upsc_questions.json",
  Bank: "bank_questions.json",
  WBP: "wbp_questions.json",
  "Kolkata Police": "kolkata_police_questions.json",
  Railway: "railway_questions.json",
  WBCS: "wbcs_questions.json",
  "WBPSC Clerkship": "wbpsc_clerkship_questions.json"
};

let questionData = {};
let currentExam = "";
let currentPart = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;


/* =========================================================
   SAFE ELEMENT HELPER
========================================================= */

function $(id) {
  return document.getElementById(id);
}


/* =========================================================
   LOAD QUESTION FILE
========================================================= */

async function loadExamQuestions(examName) {

  const file = exams[examName];

  if (!file) {
    throw new Error("Question file not found for " + examName);
  }

  const response = await fetch(file, {
    cache: "no-cache"
  });

  if (!response.ok) {
    throw new Error(
      "Could not load " + file
    );
  }

  const data = await response.json();

  questionData[examName] = data;

  return data;
}


/* =========================================================
   NORMALIZE PART DATA
   Supports:
   - parts
   - parts_data
   - part1
   - Part 1
   - Part_1
   - part-1
========================================================= */

function getParts(data) {

  if (!data) {
    return {};
  }

  if (Array.isArray(data)) {
    const result = {};

    data.forEach((item, index) => {
      result["Part " + (index + 1)] = item;
    });

    return result;
  }


  if (Array.isArray(data.parts)) {

    const result = {};

    data.parts.forEach((item, index) => {

      const partName =
        item.part ||
        item.name ||
        item.title ||
        "Part " + (index + 1);

      result[normalizePartName(partName)] = item;
    });

    return result;
  }


  if (Array.isArray(data.parts_data)) {

    const result = {};

    data.parts_data.forEach((item, index) => {

      const partName =
        item.part ||
        item.name ||
        item.title ||
        "Part " + (index + 1);

      result[normalizePartName(partName)] = item;
    });

    return result;
  }


  const result = {};

  Object.keys(data).forEach(key => {

    if (
      /^part[\s_-]*\d+$/i.test(key)
    ) {
      result[normalizePartName(key)] = data[key];
    }

  });

  return result;
}


/* =========================================================
   NORMALIZE PART NAME
========================================================= */

function normalizePartName(name) {

  const text = String(name)
    .trim()
    .replace(/_/g, " ")
    .replace(/-/g, " ");

  const match =
    text.match(/part\s*(\d+)/i);

  if (match) {
    return "Part " + match[1];
  }

  return text;
}


/* =========================================================
   GET QUESTIONS FROM PART
========================================================= */

function getQuestionsFromPart(part) {

  if (!part) {
    return [];
  }

  if (Array.isArray(part)) {
    return part;
  }

  if (Array.isArray(part.questions)) {
    return part.questions;
  }

  if (Array.isArray(part.data)) {
    return part.data;
  }

  if (Array.isArray(part.mcqs)) {
    return part.mcqs;
  }

  return [];
}


/* =========================================================
   NORMALIZE QUESTION
========================================================= */

function normalizeQuestion(q) {

  if (!q || typeof q !== "object") {
    return null;
  }

  const question =
    q.question ||
    q.question_text ||
    q.q ||
    q.text ||
    "";

  const options =
    q.options ||
    q.choices ||
    q.answers ||
    [];

  let answer =
    q.answer ??
    q.correct_answer ??
    q.correctAnswer ??
    q.correct ??
    "";

  return {
    question: String(question),
    options: Array.isArray(options)
      ? options
      : [],
    answer: answer,
    explanation:
      q.explanation ||
      q.solution ||
      ""
  };
}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  const arr = [...array];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [
      arr[i],
      arr[j]
    ] = [
      arr[j],
      arr[i]
    ];
  }

  return arr;
}


/* =========================================================
   LOAD PART
========================================================= */

async function loadPart(
  examName,
  partName
) {

  currentExam = examName;
  currentPart = partName;

  try {

    showMessage(
      "Loading questions..."
    );

    let data =
      questionData[examName];

    if (!data) {
      data =
        await loadExamQuestions(examName);
    }

    const parts =
      getParts(data);

    const normalized =
      normalizePartName(partName);

    const part =
      parts[normalized];

    if (!part) {

      showMessage(
        `${examName} ${normalized} questions are not available.`
      );

      currentQuestions = [];

      return;
    }

    const questions =
      getQuestionsFromPart(part)
        .map(normalizeQuestion)
        .filter(q =>
          q &&
          q.question &&
          q.options.length > 0
        );

    if (!questions.length) {

      showMessage(
        "No questions found in this Part."
      );

      currentQuestions = [];

      return;
    }

    currentQuestions =
      shuffle(questions);

    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    showQuestion();

  } catch (error) {

    console.error(error);

    showMessage(
      "Unable to load questions. Please try again."
    );
  }
}


/* =========================================================
   SHOW QUESTION
========================================================= */

function showQuestion() {

  const area =
    $("questionArea");

  if (!area) {
    return;
  }

  if (
    !currentQuestions.length ||
    currentQuestionIndex >=
      currentQuestions.length
  ) {

    showResult();

    return;
  }

  const q =
    currentQuestions[
      currentQuestionIndex
    ];

  selectedAnswer = null;

  area.innerHTML = "";

  const number =
    document.createElement("div");

  number.className =
    "question-number";

  number.textContent =
    `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

  area.appendChild(number);


  const question =
    document.createElement("div");

  question.className =
    "question-text";

  question.textContent =
    q.question;

  area.appendChild(question);


  const options =
    document.createElement("div");

  options.className =
    "options";

  q.options.forEach(
    (option, index) => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "option";

      button.textContent =
        option;

      button.addEventListener(
        "click",
        () => selectAnswer(
          index,
          option
        )
      );

      options.appendChild(button);
    }
  );

  area.appendChild(options);


  const nextBtn =
    document.createElement("button");

  nextBtn.type = "button";

  nextBtn.id =
    "nextQuestionBtn";

  nextBtn.textContent =
    currentQuestionIndex ===
    currentQuestions.length - 1
      ? "Submit Test"
      : "Next Question";

  nextBtn.addEventListener(
    "click",
    nextQuestion
  );

  area.appendChild(nextBtn);
}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(
  index,
  value
) {

  selectedAnswer = {
    index: index,
    value: value
  };

  const buttons =
    document.querySelectorAll(
      ".option"
    );

  buttons.forEach(
    (button, i) => {

      button.classList.toggle(
        "selected",
        i === index
      );
    }
  );
}


/* =========================================================
   CHECK ANSWER
========================================================= */

function isCorrectAnswer(
  question,
  selected
) {

  if (!question) {
    return false;
  }

  const correct =
    question.answer;

  if (
    typeof correct === "number"
  ) {
    return selected.index === correct;
  }

  const correctText =
    String(correct)
      .trim()
      .toLowerCase();

  const selectedText =
    String(selected.value)
      .trim()
      .toLowerCase();

  if (
    correctText ===
    selectedText
  ) {
    return true;
  }

  const letterMatch =
    correctText.match(
      /^[a-d]$/i
    );

  if (letterMatch) {

    const correctIndex =
      "abcd".indexOf(
        letterMatch[0].toLowerCase()
      );

    return (
      selected.index ===
      correctIndex
    );
  }

  return false;
}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

  if (!selectedAnswer) {

    alert(
      "Please select an answer first."
    );

    return;
  }

  const q =
    currentQuestions[
      currentQuestionIndex
    ];

  if (
    isCorrectAnswer(
      q,
      selectedAnswer
    )
  ) {
    score++;
  }

  currentQuestionIndex++;

  showQuestion();
}


/* =========================================================
   RESULT
========================================================= */

function showResult() {

  const area =
    $("questionArea");

  if (!area) {
    return;
  }

  const total =
    currentQuestions.length;

  const percentage =
    total
      ? Math.round(
          (score / total) * 100
        )
      : 0;

  area.innerHTML = `
    <div class="result-box">
      <h3>Test Completed</h3>
      <div class="result-score">
        ${score} / ${total}
      </div>
      <p>
        Score: ${percentage}%
      </p>
      <button
        type="button"
        id="restartTestBtn">
        Restart Test
      </button>
    </div>
  `;

  const restart =
    $("restartTestBtn");

  if (restart) {

    restart.addEventListener(
      "click",
      () => loadPart(
        currentExam,
        currentPart
      )
    );
  }
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message) {

  const area =
    $("questionArea");

  if (!area) {
    return;
  }

  area.innerHTML = `
    <div class="status">
      ${escapeHtml(message)}
    </div>
  `;
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(text) {

  return String(text)
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
   EXAM SELECTION
========================================================= */

async function selectExam(
  examName
) {

  currentExam =
    examName;

  try {

    let data =
      questionData[examName];

    if (!data) {
      data =
        await loadExamQuestions(
          examName
        );
    }

    renderPartButtons(data);

  } catch (error) {

    console.error(error);

    showMessage(
      "Unable to load this exam."
    );
  }
}


/* =========================================================
   RENDER PART BUTTONS
========================================================= */

function renderPartButtons(
  data
) {

  const container =
    $("partGrid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const parts =
    getParts(data);

  const names =
    Object.keys(parts)
      .sort(
        (a, b) => {
          const na =
            parseInt(
              a.replace(/\D/g, "")
            ) || 0;

          const nb =
            parseInt(
              b.replace(/\D/g, "")
            ) || 0;

          return na - nb;
        }
      );

  names.forEach(
    partName => {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "part-btn";

      button.textContent =
        partName;

      button.addEventListener(
        "click",
        () => loadPart(
          currentExam,
          partName
        )
      );

      container.appendChild(
        button
      );
    }
  );
   }/* =========================================================
   AI TUTOR
========================================================= */

async function askTutor() {

  const input =
    $("questionInput");

  const answerBox =
    $("answerBox");

  if (!input || !answerBox) {
    return;
  }

  const question =
    input.value.trim();

  if (!question) {

    answerBox.textContent =
      "Please enter a question first.";

    return;
  }

  answerBox.innerHTML =
    `<div class="loading">Thinking</div>`;

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

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "AI request failed"
      );
    }

    answerBox.innerHTML = "";

    const answer =
      document.createElement("div");

    answer.textContent =
      data.answer ||
      "No answer received.";

    answerBox.appendChild(
      answer
    );


    /* =====================================================
       AI GENERATED SVG DIAGRAM
    ===================================================== */

    if (data.diagram) {

      const diagramBox =
        document.createElement("div");

      diagramBox.className =
        "answer-diagram";

      diagramBox.innerHTML =
        data.diagram;

      answerBox.appendChild(
        diagramBox
      );
    }

  } catch (error) {

    console.error(error);

    answerBox.textContent =
      "AI service is temporarily unavailable. Please try again.";
  }
}


/* =========================================================
   MICROPHONE / VOICE INPUT
========================================================= */

let recognition = null;
let isListening = false;

function startMic() {

  const input =
    $("questionInput");

  if (!input) {
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

  if (!recognition) {

    recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-IN";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.onstart =
      () => {

        isListening = true;

        const mic =
          $("micBtn");

        if (mic) {
          mic.textContent =
            "🔴 Listening...";
        }
      };


    recognition.onresult =
      event => {

        const transcript =
          event.results[0][0].transcript;

        input.value =
          transcript;
      };


    recognition.onerror =
      event => {

        console.error(
          "Speech recognition error:",
          event.error
        );
      };


    recognition.onend =
      () => {

        isListening = false;

        const mic =
          $("micBtn");

        if (mic) {
          mic.textContent =
            "🎙️";
        }
      };
  }

  if (isListening) {

    recognition.stop();

    return;
  }

  recognition.start();
}


/* =========================================================
   ENTER KEY FOR AI
========================================================= */

function setupAI() {

  const input =
    $("questionInput");

  const askBtn =
    $("askBtn");

  const micBtn =
    $("micBtn");

  if (askBtn) {

    askBtn.addEventListener(
      "click",
      askTutor
    );
  }

  if (micBtn) {

    micBtn.addEventListener(
      "click",
      startMic
    );
  }

  if (input) {

    input.addEventListener(
      "keydown",
      event => {

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
}


/* =========================================================
   EXAM BUTTON SETUP
========================================================= */

function setupExamButtons() {

  document
    .querySelectorAll(
      "[data-exam]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const exam =
            button.dataset.exam;

          selectExam(exam);
        }
      );
    });
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeApp() {

  setupAI();

  setupExamButtons();

  const firstExam =
    Object.keys(exams)[0];

  if (firstExam) {

    selectExam(
      firstExam
    );
  }
}


/* =========================================================
   GLOBAL FUNCTIONS
   Supports HTML onclick=""
========================================================= */

window.askTutor =
  askTutor;

window.startMic =
  startMic;

window.selectExam =
  selectExam;

window.loadPart =
  loadPart;

window.nextQuestion =
  nextQuestion;


/* =========================================================
   START APP
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();
             }
