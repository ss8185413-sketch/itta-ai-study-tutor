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

    if (data.answer) {
        answer.innerText = data.answer;
    } else {
        answer.innerText = "Sorry, I couldn't get an answer.";
    }

} catch (error) {
    console.error(error);
    answer.innerText =
        "Server is not connected yet. Please try again later.";
}

}
