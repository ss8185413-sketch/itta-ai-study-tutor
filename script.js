function askTutor() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.innerText = "Please type a question first.";
        return;
    }

    answer.innerText = "Thinking... 🤖";

    setTimeout(() => {
        answer.innerText =
            "Itta AI: Your question is: " + question +
            "\n\nI am ready to help you study! 📚";
    }, 800);
}
