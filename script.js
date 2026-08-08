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


