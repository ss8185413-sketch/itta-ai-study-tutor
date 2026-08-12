async function askTutor() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.innerText = "Please type a question first.";
        return;
    }

    answer.innerText = "Thinking... 🤖";

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

        if (data.answer) {
            answer.innerText = data.answer;
        } else {
            answer.innerText = "No answer received.";
        }

    } catch (error) {
        console.error("Error:", error);

        answer.innerText =
            "Could not connect to the server.";
    }
}


/* 🎙️ Voice Mic */
function startMic() {
    const question = document.getElementById("question");
    const micBtn = document.getElementById("micBtn");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported on this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.innerText = "🔴 Listening...";

    recognition.start();

    recognition.onresult = function(event) {
        question.value = event.results[0][0].transcript;
    };

    recognition.onerror = function() {
        micBtn.innerText = "🎙️";
        alert("Could not hear your voice. Please try again.");
    };

    recognition.onend = function() {
        micBtn.innerText = "🎙️";
    };
}


/* 🧠 Quiz */
function startQuiz() {
    const quizBox = document.getElementById("quizBox");

    quizBox.innerHTML = `
        <p><strong>Quiz is coming soon! 🚀</strong></p>
        <p>We will add the questions next.</p>
    `;
        }
