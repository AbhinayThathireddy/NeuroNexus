function addQuestion() {
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
        <input type="text" placeholder="Enter Question" class="question"><br>
        <input type="text" placeholder="Option 1" class="option"><br>
        <input type="text" placeholder="Option 2" class="option"><br>
        <input type="text" placeholder="Option 3" class="option"><br>
        <input type="text" placeholder="Option 4" class="option"><br>
        <input type="number" placeholder="Correct Option (1-4)" class="answer"><br><br>
    `;
    document.getElementById('questions').appendChild(questionDiv);
}

async function saveQuiz() {
    const quizTitle = document.getElementById('quizTitle').value;
    const questionElements = document.querySelectorAll('#questions > div');

    const quiz = {
        title: quizTitle,
        questions: []
    };

    questionElements.forEach(div => {
        const question = div.querySelector('.question').value;
        const options = div.querySelectorAll('.option');
        const answer = parseInt(div.querySelector('.answer').value);

        quiz.questions.push({
            question,
            options: Array.from(options).map(opt => opt.value),
            answer
        });
    });

    const res = await fetch('http://localhost:3000/api/quizzes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
    });

    const data = await res.json();
    alert('Quiz Saved Successfully!');
    window.location.href = 'index.html';
}
