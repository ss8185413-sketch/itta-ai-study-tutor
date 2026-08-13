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
