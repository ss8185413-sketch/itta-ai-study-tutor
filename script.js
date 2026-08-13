function checkAnswer(selectedAnswer) {
    const q = quizQuestions[currentQuestion];
    const quizBox = document.getElementById("quizBox");

    if (selectedAnswer === q.answer) {
        score++;
        quizBox.innerHTML += `
            <p>✅ Correct!</p>
        `;
    } else {
        quizBox.innerHTML += `
            <p>❌ Wrong!</p>
        `;
    }

    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 700);
            }
