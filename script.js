let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    // Fetch questions from JSON file
    fetch('quiz_questions.json') // Make sure the JSON file is in the same directory as this HTML
        .then(response => response.json())
        .then(data => {
            startQuizApp(data);
        })
        .catch(error => console.error('Error loading questions:', error));

    function startQuizApp(questions) {
        selectedQuestions = getRandomQuestions(questions, 70); // Select 10 random questions

        document.getElementById('startButton').addEventListener('click', startQuiz);
        document.getElementById('stopButton').addEventListener('click', submitQuiz);

        function startQuiz() {
            document.getElementById('startContainer').classList.add('d-none');
            document.getElementById('quizContainer').classList.remove('d-none');
            startTimer(20 * 60); // 20 minutes
            showQuestion();
        }

        function startTimer(duration) {
            let time = duration;
            timer = setInterval(() => {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                if (--time < 0) {
                    clearInterval(timer);
                    submitQuiz();
                }
            }, 1000);
        }

        function showQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        submitQuiz();
        return;
    }

    const question = selectedQuestions[currentQuestionIndex];

    // Update question text
    document.getElementById('question').textContent = question.question;

    // Update question counter
    const questionCounter = document.getElementById('questionCounter');
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;

    // Render options
    const options = document.getElementById('options');
    options.innerHTML = '';
    question.options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'btn btn-outline-secondary option-button';
        button.onclick = () => checkAnswer(option, button);
        options.appendChild(button);
    });
}


        function checkAnswer(selectedOption, button) {
            const question = selectedQuestions[currentQuestionIndex];
            if (selectedOption === question.answer) {
                score++;
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 1000);
        }

        function submitQuiz() {
            clearInterval(timer);
            document.getElementById('quizContainer').classList.add('d-none');
            const percentage = Math.round((score / selectedQuestions.length) * 100);
            document.getElementById('result').innerHTML = `
                <p>Your score is <strong>${score}</strong> out of <strong>${selectedQuestions.length}</strong>.</p>
                <p>That's <strong>${percentage}%</strong>!</p>
            `;
            document.getElementById('resultContainer').classList.remove('d-none');
        }

        function getRandomQuestions(questions, num) {
            const shuffled = questions.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(num, questions.length));
        }
    }