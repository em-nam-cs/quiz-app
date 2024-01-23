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
@last_updated January 18, 2024
 */

/**
 * @TODO figure out shuffled questions without needing global
 */


const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerBtns = document.getElementById('answer-btns');
const questionCounterElement = document.getElementById('question-counter');
const scoreElement = document.getElementById('score');
const percentageBarContainer = document.getElementById('percentage-bar-container');
const statsContainer = document.getElementById('stats-container');
const scoreStatElement = document.getElementById('score-stat');
const percentStatElement = document.getElementById('percentage-stat');

startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', setNextQuestion);


let shuffledQuestions, currQuestionIndex, score;



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
    score = 0;
    displayScore();
    setNextQuestion();
    document.body.removeEventListener('keydown', checkEnterKeyForStart);
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
    statsContainer.classList.add('hide');
    
    while(answerBtns.firstChild){
        answerBtns.removeChild(answerBtns.firstChild);
    }
    while(percentageBarContainer.firstChild){
        percentageBarContainer.removeChild(percentageBarContainer.firstChild);
    }
    clearStatus(document.body);
    document.body.removeEventListener('keydown', checkEnterKeyForNext);
}


/**
@TODO after last question, display stats
need to write HTML to hold text - table? just place above where the question 
container would normally display

option to restart the game, control (start btn should already exist)
 */
function endGame(){

    questionContainer.classList.add('hide');
    questionCounterElement.classList.add('hide');

    startBtn.textContent = 'RESTART';
    startBtn.classList.remove('hide');
    document.body.addEventListener('keydown', checkEnterKeyForStart);

    displayStats();
}

function displayStats(){
    statsContainer.classList.remove('hide');
    scoreStatElement.textContent = `Overall Score: ${score}`;
    percentStatElement.textContent = `Percentage Correct: ${score/currQuestionIndex}%`;
    createPercentageBar();
}


function createPercentageBar(){
    console.log(`per bar ${currQuestionIndex}`);
    for (let i = 0; i < currQuestionIndex; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        if (score > i){
            block.classList.add('correct');
        } else {
            block.classList.add('wrong');
        }

        percentageBarContainer.appendChild(block);
    }
}






/**
@brief displays the questions and creates answer buttons for each
    answer available for the given question, 

@param currQ is one of the question objects in the questions array based on the 
    current question index counter
 */
function showQuestion(currQ){
    questionElement.textContent = currQ.question;

    questionCounterElement.classList.remove('hide');
    questionCounterElement.textContent = `Q #${currQuestionIndex + 1}`;

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
    this.classList.add('selected');

    if (userCorrect){
        score++;
    }

    setStatusClass(document.body, userCorrect);
    Array.from(answerBtns.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct);
    });

    if (currQuestionIndex < shuffledQuestions.length){
        nextBtn.classList.remove('hide');
        document.body.addEventListener('keydown', checkEnterKeyForNext);
    } else {
        endGame();
    }

    //disable answer buttons after one is selected
    for (let i = 0; i < answerBtns.children.length; i++){
        answerBtns.children[i].disabled = true;
    }

    displayScore();
}

/**
 * @brief shows the current score
 */
function displayScore(){
    scoreElement.classList.remove('hide');
    scoreElement.textContent = `Score: ${score}`;
}


/**
 * @brief function to advance the question if "enter" key was pressed down

 * @param event captures the event that triggered so can check which keydown
 */
function checkEnterKeyForNext(event){
    if (event.key === "Enter") {
        setNextQuestion();
    }
}

/**
 * @brief function to advance the question if "enter" key was pressed down

 * @param event captures the event that triggered so can check which keydown
 */
function checkEnterKeyForStart(event){
    if (event.key === "Enter") {
        startGame();
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
    // {
    //     question: 'what is 2 + 2?',
    //     answers: [
    //         {text: '4', correct: true},
    //         {text: '22', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'what is 2 + 10?',
    //     answers: [
    //         {text: '12', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'What is a grown up puppy?',
    //     answers: [
    //         {text: 'dog', correct: true},
    //         {text: 'cat', correct: false},
    //         {text: 'turtle', correct: false},
    //         {text: 'duck', correct: false}
    //     ]
    // }, 
    {
        question: 'What is a baby dog?',
        answers: [
            {text: 'puppy', correct: true},
            {text: 'guppy', correct: false},
            {text: 'cat', correct: false},
            {text: 'kitten', correct: false}
        ]
    }, 
    {
        question: 'What was the color of the start button?',
        answers: [
            {text: 'yellow', correct: false},
            {text: 'red', correct: false},
            {text: 'blue', correct: true}
        ]
    }, 
    {
        question: 'How much wood could a woodchuck chuck?',
        answers: [
            {text: 'if a woodchuck could chuck wood', correct: true},
            {text: 'wrong', correct: false},
            {text: 'no', correct: false},
            {text: "don't pick me", correct: false}
        ]
    }
    // {
    //     question: 'what is 2 + 1?',
    //     answers: [
    //         {text: '3', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'what is 22 + 10?',
    //     answers: [
    //         {text: '32', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'what is 2 * 10?',
    //     answers: [
    //         {text: '20', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'what is 2 + 0?',
    //     answers: [
    //         {text: '2', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }, 
    // {
    //     question: 'What is the longest answer',
    //     answers: [
    //         {text: 'this is a super long answer and just to test the wrapping', correct: true},
    //         {text: '22', correct: false},
    //         {text: '0', correct: false},
    //         {text: '15', correct: false}
    //     ]
    // }
]

