async function loadQuizzes() {
    const res = await fetch('http://localhost:3000/api/quizzes');
    const quizzes = await res.json();
    const quizList = document.getElementById('quizList');

    quizzes.forEach((quiz) => {
        const btn = document.createElement('button');
        btn.textContent = quiz.title;
        btn.onclick = () => startQuiz(quiz);
        quizList.appendChild(btn);
    });
}

function startQuiz(quiz) {
    let currentQuestion = 0;
    let score = 0;

    const quizArea = document.getElementById('quizArea');
    quizArea.style.display = 'block';
    quizArea.innerHTML = '';

    function showQuestion() {
        const q = quiz.questions[currentQuestion];
        quizArea.innerHTML = `
            <h2>${q.question}</h2>
            ${q.options.map((opt, i) => `
                <label><input type="radio" name="option" value="${i+1}"> ${opt}</label><br>
            `).join('')}
            <br>
            <button id="nextBtn">Next</button>
        `;

        document.getElementById('nextBtn').onclick = () => {
            const selected = document.querySelector('input[name="option"]:checked');
            if (selected) {
                const answerCorrect = parseInt(selected.value) === q.answer;
                if (answerCorrect) {
                    score++;
                    showFeedback('Correct!', '#28a745');
                } else {
                    showFeedback(`Incorrect! Correct answer: ${q.options[q.answer - 1]}`, '#dc3545');
                }

                currentQuestion++;
                setTimeout(() => {
                    if (currentQuestion < quiz.questions.length) {
                        showQuestion();
                    } else {
                        quizArea.innerHTML = `
                            <div class="feedback">Quiz Finished!</div>
                            <h3>Your Score: ${score} / ${quiz.questions.length}</h3>
                        `;
                    }
                }, 2000); // Delay before showing next question
            } else {
                alert('Please select an option.');
            }
        }
    }

    function showFeedback(message, color) {
        const feedback = document.createElement('div');
        feedback.classList.add('feedback');
        feedback.textContent = message;
        feedback.style.color = color;
        quizArea.appendChild(feedback);
    }

    showQuestion();
}

window.onload = loadQuizzes;
