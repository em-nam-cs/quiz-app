/**
@brief a locally hosted quiz game that pulls questions and answers
    from a pre-defined array and will change the background color
    based on if the selected answer is correct or not. The background of
    each answer button will display if it is correct or wrong. Loops through the 
    questions in a random order. Does not keep score or allow users to change 
    answers. After selecting the next button, a new question will be showed.

@preconditions color vision to distinguish the red and green backgrounds
    which indicate correctness
@author Em Nam
@first_created January 16, 2024
@last_updated January 16, 2024
 */

/**
 * @TODO figure out shuffled questions without needing global
 */


const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerBtns = document.getElementById('answer-btns');

startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', setNextQuestion);

let shuffledQuestions, currQuestionIndex;

/**
@brief function to start the game called when start button clicked
    displays the HTML elements that hold the questions, 
    shuffles questions and starts the counting index to keep track of which 
    question is being asked, displays the first question
 */
function startGame(){
    startBtn.classList.add('hide');
    questionContainer.classList.remove('hide');
    nextBtn.classList.remove('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currQuestionIndex = 0;
    setNextQuestion();
}

/**
@brief displays the next question by first reseting the screen, 
    showing the question, and then incrementing the counter to keep track
    of asked questions
 */
function setNextQuestion(){
    resetState();
    showQuestion(shuffledQuestions[currQuestionIndex]);
    currQuestionIndex++;
}


/**
@brief clears the state of the HTML by hiding the next button, 
    removing the previous answer buttons, and resetting the background
    to the initial nuetral color
 */
function resetState(){
    nextBtn.classList.add('hide');
    while(answerBtns.firstChild){
        answerBtns.removeChild(answerBtns.firstChild);
    }
    clearStatus(document.body);
}

/**
@brief displays the questions and creates answer buttons for each
    answer available for the given question, 

@param currQ is one of the question objects in the questions array based on the 
    current question index counter
 */
function showQuestion(currQ){
    questionElement.textContent = currQ.question;

    for (let i = 0; i < currQ.answers.length; i++){
        const answer = currQ.answers[i]
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerBtns.appendChild(button);
    }
}


/**
@brief sets the background color of elements based on correctness
    the body background is based on if the user answered correctly,
    while the answer button backgrounds are based on their values if
    they are considered to be the correct/wrong answer

    Displays the next or restart button 
 */
function selectAnswer(){
    const userCorrect = this.dataset.correct;
    setStatusClass(document.body, userCorrect);

    Array.from(answerBtns.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct);
    });

    console.log(`index: ${currQuestionIndex}`);

    if (currQuestionIndex < shuffledQuestions.length){
        nextBtn.classList.remove('hide');
    } else {
        startBtn.textContent = 'RESTART';
        startBtn.classList.remove('hide');
    }

}

/**
@brief sets the class of an element to either correct or wrong based on
    the status
@param element HTML element that is having the class updated
@param status the status from data that indicates if it should be correct/wrong
 */
function setStatusClass(element, status){
    clearStatus(element);
    if (status){
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

/**
@brief clears the class of an element 

@param element HTML element that is having the class updated
 */
function clearStatus(element){
    element.classList.remove('correct');
    element.classList.remove('wrong');
}


/** Array of questions */
const questions = [
    {
        question: 'what is 2 + 2?',
        answers: [
            {text: '4', correct: true},
            {text: '22', correct: false}
        ]
    }, 
    {
        question: 'what is 2 + 10?',
        answers: [
            {text: '12', correct: true},
            {text: '22', correct: false},
            {text: '0', correct: false},
            {text: '15', correct: false}
        ]
    }, 
    {
        question: 'what is a grown up puppy',
        answers: [
            {text: 'dog', correct: true},
            {text: 'cat', correct: false},
            {text: 'turtle', correct: false},
            {text: 'duck', correct: false}
        ]
    }
]