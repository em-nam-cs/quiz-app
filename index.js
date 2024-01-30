/**
@brief a locally hosted quiz game that pulls questions and answers
    from a pre-defined array and will change the background color
    based on if the selected answer is correct or not. The background of
    each answer button will display if it is correct or wrong and the score will
    increment if user was correct. Loops through the 
    questions in a random order. Does not allow users to change 
    answers. After selecting the next button, a new question will be showed.
    After answering all of the questions or ending the game, the stats 
    for the attempt are displayed and the user is given the option to 
    restart the cards. 

@preconditions color vision to distinguish the red and green backgrounds
    which indicate correctness

@author Em Nam
@first_created January 16, 2024
@last_updated January 24, 2024
 */

/**
 * @TODO figure out shuffled questions without needing global
 @TODO figure out how to shuffle order of the answer btns
 */

const NUM_DECIMALS_DISP = 2;

const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
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
const quesetionCounterStatElement = document.getElementById('question-counter-stat');
const closeInstructionsBtn = document.getElementById('close-instructions-icon');
const showInstructionsBtn = document.getElementById('instructions-icon');
const instructionsBox = document.getElementsByClassName('instructions-container')[0];
const instructionsParent = document.getElementsByClassName('modal-content')[0];

window.onload = function(){
    startBtn.addEventListener('click', startGame);
    endBtn.addEventListener('click', endGame);
    nextBtn.addEventListener('click', setNextQuestion);
    showInstructionsBtn.addEventListener('click', toggleInstructions);
    closeInstructionsBtn.addEventListener('click', closeInstructions);
    document.addEventListener('click', closeInstructions);
}


let shuffledQuestions, currQuestionIndex, score;

/**
 * @brief opens or closes the instructions display
 */
function toggleInstructions(){
    if (instructionsBox.classList.contains('hide')){
        // instructionsBox.classList.remove('hide'); 
        showInstructions();
    } else {
        instructionsBox.classList.add('hide'); 
        document.body.classList.remove('clickable');
    }
}

/**
 * 
 * if conditions check that click is (outside of the instructions box and not the 
 * show instructions icon) or (the close instructions icon) and closes the display
 * @param {*} event 
 */

 //todo I could? just add the body's event listener when the dialog box pops up 
//  instead of needing this big conditional???
function closeInstructions(event){
    console.log(event.target);
    if ((instructionsBox !== event.target   
        && !instructionsBox.contains(event.target)
        && showInstructionsBtn !== event.target)    
        || event.target == closeInstructionsBtn){

        instructionsBox.classList.add('hide');
        document.body.classList.remove('clickable');
    }
}

function showInstructions(){
    instructionsBox.classList.remove('hide');
    document.body.classList.add('clickable');
}


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
    endBtn.classList.remove('hide');
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

    currQuestionIndex++;

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
@brief after last question, hide the questions and controls, set background
    to neutral, display stats, and offer the user the option to restart the deck
 */
function endGame(){

    questionContainer.classList.add('hide');
    questionCounterElement.classList.add('hide');
    scoreElement.classList.add('hide');
    endBtn.classList.add('hide');
    nextBtn.classList.add('hide');

    clearStatus(document.body);

    displayStats();

    startBtn.textContent = 'RESTART';
    startBtn.classList.remove('hide');
    document.body.addEventListener('keydown', checkEnterKeyForStart);
}


/**
 * @brief displays each stat based on the user's score and how many questions
        were answered
 */
function displayStats(){
    statsContainer.classList.remove('hide');
    scoreStatElement.textContent = `Overall Score: ${score}`;
    quesetionCounterStatElement.textContent = `Total Questions Answered: ${currQuestionIndex}`;
    percentStatElement.textContent = `Percentage Correct: ${((score/(currQuestionIndex)).toFixed(NUM_DECIMALS_DISP))*100}%`;
    createPercentageBar();
}



/**
 * @brief creates a block for each question that was answered and shades
        in a block green for each correct answer and a block red for each
        wrong answer
 */
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
        question: 'What is a grown up puppy?',
        answers: [
            {text: 'dog', correct: true},
            {text: 'cat', correct: false},
            {text: 'turtle', correct: false},
            {text: 'duck', correct: false}
        ]
    }, 
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

