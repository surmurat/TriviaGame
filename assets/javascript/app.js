var game = {
    timer: null,
    timeMax: 0,
    timePassed: 0,
    questions: [
        { question: 'Which of these kills its victims by constriction?', answers: ['Andalucia', 'Anaconda', 'Andypandy', 'Annerobinson'], correctAnswer: 1 },
        { question: 'Which of these would a film actor like to receive?', answers: ['Oliver', 'Oscar', 'Oliphant', 'Osbert'], correctAnswer: 1 },
        { question: 'In which country would you expect to be greeted with the word "bonjour"?', answers: ['Italy', 'France', 'Spain', 'Wales'], correctAnswer: 1 },
        { question: 'What name is given to the person who traditionally attends the groom on his wedding day?', answers: ['Best man', 'Top man', 'Old man', 'First man'], correctAnswer: 0 },
        { question: 'Which word follows "North" and "South" to give the names of two continents?', answers: ['Africa', 'Asia', 'America', 'Australia'], correctAnswer: 2 },
        { question: 'Which country is not an island?', answers: ['Cuba', 'Madagascar', 'Jamaica', 'Germany'], correctAnswer: 3 },
    ],
    selectedQuestion: null,
    askedQuestions: [],
    questionElement: null,
    answerElement: null,
    backgroundSound: null,
    correctSound: null,
    wrongSound: null,


    startTimer: function () {
        if(this.timer !== null){

            game.stopTimer();

        }
        this.timePassed = 0;
        this.timeMax = 30;
        this.timer = setInterval(game.timerTick, 1000);
        document.getElementById('clock').style.width = '100%';
        document.getElementById('clock').innerHTML = this.timeMax;

    },
    stopTimer: function () {
        clearInterval(this.timer);
    },
    timerTick: function () {
        if (game.timeMax - game.timePassed <= 0) {
            game.stopTimer();
            game.gameLost();
        }
        var percent = game.timePassed / game.timeMax * 100;
        document.getElementById('clock').style.width = (100 - percent) + '%';
        document.getElementById('clock').innerHTML = game.timeMax - game.timePassed;
        game.timePassed++;
    },
    selectQuestion: function () {
        if (this.questions.length === this.askedQuestions.length) {
            // there are no more question left.
            this.gameWon();
        }
        else {
            this.selectedQuestion = null;

            while (this.selectedQuestion === null) {
                var questionIndex = Math.floor(Math.random() * this.questions.length);
                if (this.askedQuestions.indexOf(questionIndex) === -1) {
                    this.selectedQuestion = this.questions[questionIndex];
                    this.askedQuestions.push(questionIndex);
                }
            }

            this.questionElement.innerHTML = this.selectedQuestion.question;
            this.startTimer();

            while (this.answerElement.firstChild) {
                this.answerElement.removeChild(this.answerElement.firstChild);
            }

            var karisikCevaplar = Array.from(this.selectedQuestion.answers);
            karisikCevaplar.sort(function (a, b) { return 0.5 - Math.random() });
            for (var i = 0; i < karisikCevaplar.length; i++) {
                var list = document.createElement('li');
                list.classList.add('col-5', 'rounded', 'text-white');
                list.innerHTML = karisikCevaplar[i];
                list.onclick = function () {
                    //check the answer
                    game.checkAnswer(this.innerHTML);
                };
                this.answerElement.appendChild(list);
            }

        }
    },

    checkAnswer: function (answer) {
        for (var i = 0; i < this.answerElement.childElementCount; i++) {
            var element = this.answerElement.children[i];
            element.onclick = null;
            if(answer === element.innerHTML)
            {
                element.classList.add('chosenAnswer');
            }
            
        }
        if (this.selectedQuestion.correctAnswer === this.selectedQuestion.answers.indexOf(answer)) {
            //the answer is correct
            console.log("correct");
            this.stopTimer();
            setTimeout(function(){
                game.correctSound.play();
                var correctAnswer = game.selectedQuestion.answers[game.selectedQuestion.correctAnswer];
                for(var i = 0; i < game.answerElement.childElementCount; i++){
                    if(game.answerElement.children[i].innerHTML === correctAnswer){
                        game.answerElement.children[i].classList.add('correctAnswer');
                    }
                }
                setTimeout(function(){
                    game.selectQuestion();
                }, 3000);
            }, 1500);
        }
        else {
            //the answer is wrong
            console.log("wrong");
            this.stopTimer();

            setTimeout(function(){
                game.wrongSound.play();
                var correctAnswer = game.selectedQuestion.answers[game.selectedQuestion.correctAnswer];
                for(var i = 0; i < game.answerElement.childElementCount; i++){
                    if(game.answerElement.children[i].innerHTML === correctAnswer){
                        game.answerElement.children[i].classList.add('correctAnswer');
                    }
                }

                setTimeout(function(){
                    game.gameLost();
                }, 3000);
            }, 1500);
        }
    },

    gameWon: function(){
        document.getElementById('gameScreen').classList.add('d-none');
        document.getElementById('wonScreen').classList.remove('d-none');
        this.backgroundSound.pause();


    },

    gameLost: function(){
        document.getElementById('gameScreen').classList.add('d-none');
        document.getElementById('failedScreen').classList.remove('d-none');
        this.backgroundSound.pause();

    },

    play: function(){
        document.getElementById('startScreen').classList.add('d-none');
        document.getElementById('gameScreen').classList.remove('d-none');
        this.selectQuestion();
        this.backgroundSound.play();

    },

    init: function () {
        this.questionElement = document.getElementById('fragen');
        this.answerElement = document.getElementById('answers');
        this.backgroundSound = document.getElementById('backgroundSound');
        this.wrongSound = document.getElementById('wrongAnswerSound');
        this.correctSound = document.getElementById('correctAnswerSound');
        document.getElementById('startButton').onclick = function(){

            game.play();

        };

    }
};

window.onload = function () {
    game.init();
}

//game.startTimer();