// Function to load quizzes from the server and display them in the list
async function loadQuizzes() {
    const res = await fetch('http://localhost:3000/api/quizzes');
    const quizzes = await res.json();
    const quizList = document.getElementById('quizList');

    // Clear any existing quizzes in the list
    quizList.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.classList.add('quiz-item');
        quizItem.innerHTML = `
            <h3>${quiz.title}</h3>
            <button onclick="deleteQuiz('${quiz._id}')">Delete Quiz</button> <!-- Pass _id as string -->
        `;
        quizList.appendChild(quizItem);
    });
}

// Function to delete a quiz based on its _id
async function deleteQuiz(quizId) {
    console.log("Attempting to delete quiz with ID:", quizId); // Log the quiz ID

    if (confirm("Are you sure you want to delete this quiz?")) {
        try {
            const res = await fetch(`http://localhost:3000/api/quizzes/${quizId}`, {
                method: 'DELETE',
            });

            // Check the response
            if (res.ok) {
                alert('Quiz deleted successfully!');
                window.location.reload(); // Reload the page to refresh the quiz list
            } else {
                const errorText = await res.text();
                console.log("Error response from server:", errorText);  // Log the error response from server
                alert('Failed to delete quiz');
            }
        } catch (error) {
            console.error("Error during delete request:", error);
            alert('Failed to delete quiz');
        }
    }
}

// Load quizzes when the page loads
window.onload = loadQuizzes;
