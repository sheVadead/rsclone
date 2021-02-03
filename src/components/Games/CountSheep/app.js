import ReverseTimer from '@helpers/ReverseTimer';
import ModalWindow from '../../Render/components/ModalWindow/app';
import Mixin from '../../../helpers/Mixin';
import './scss/style.scss';

export default class CountSheep {
  constructor(app, elements) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.elements = elements;
    this.gameElement = null;
    this.timer = new ReverseTimer();
    this.gameTime = 90;
    this.amountOfSheep = 0;
    this.amountOfCards = 30;
    this.minAmountOfCards = 4;
    this.maxAmountOfCards = 6;
    this.answers = [];
    this.livesCount = 3;
    this.score = 0;
    this.correctAnswers = 0;
    this.scoreStep = 20;
    this.scoreMultiplier = 1;
  }

  startGame() {
    this.resetFlags();
    console.log(`start: ${this.score}`);
    this.gameProgress();
    this.timer.startCount(this.gameTime, this.setTimeText.bind(this), this.gameEnd.bind(this));
    this.setScoreText(0);
    this.disableFinishBtn('on');
    document.body.classList.remove('game-button-finish-clicked');
  }

  resetFlags() {
    this.score = 0;
    this.scoreMultiplier = 1;
    this.correctAnswers = 0;
    this.minAmountOfCards = 4;
    this.maxAmountOfCards = 6;
    if (this.elements.stats.icons.children.length < 3) {
      this.elements.stats.icons.innerHTML = '';
      this.createLivesIcons();
    }
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  createLivesIcons() {
    for (let i = 0; i < this.livesCount; i += 1) {
      this.elements.stats.icons.appendChild(this.elements.templates.star.content.cloneNode(true));
    }
  }

  gameProgress() {
    setTimeout(() => {
      this.showCards();
    }, 1000);
    setTimeout(() => {
      this.showAnswers();
      this.setListenersForAnswers(); // the reason???
    }, 2500);
    console.log('gameProgress');
  }

  showCards() {
    this.gameElement.innerHTML = '';
    this.createFieldOfCards();
  }

  createFieldOfCards() {
    this.levelChanger();
    this.getAmountOfSheep(this.minAmountOfCards, this.maxAmountOfCards);
    const randomNumbers = this.getSortedRandomNumbers(this.amountOfCards, this.amountOfSheep);
    for (let i = 1; i < this.amountOfCards + 1; i += 1) {
      if (randomNumbers[randomNumbers.length - 1] === i) {
        this.gameElement.append(this.createCard(i, 'show'));
        randomNumbers.pop();
      } else {
        this.gameElement.append(this.createCard(i, 'hide'));
      }
    }
  }

  levelChanger() {
    if (this.correctAnswers >= 0 && this.correctAnswers < 3) {
      this.minAmountOfCards = 4;
      this.maxAmountOfCards = 6;
    } else if (this.correctAnswers >= 3 && this.correctAnswers < 6) {
      this.minAmountOfCards = 6;
      this.maxAmountOfCards = 8;
      this.scoreMultiplier = 1.5;
    } else if (this.correctAnswers >= 6 && this.correctAnswers < 9) {
      this.minAmountOfCards = 8;
      this.maxAmountOfCards = 10;
      this.scoreMultiplier = 1.7;
    } else if (this.correctAnswers >= 9 && this.correctAnswers < 12) {
      this.minAmountOfCards = 10;
      this.maxAmountOfCards = 12;
      this.scoreMultiplier = 2;
    } else if (this.correctAnswers >= 12 && this.correctAnswers < 16) {
      this.minAmountOfCards = 12;
      this.maxAmountOfCards = 14;
      this.scoreMultiplier = 2.2;
    } else if (this.correctAnswers >= 16 && this.correctAnswers < 24) {
      this.minAmountOfCards = 14;
      this.maxAmountOfCards = 16;
      this.scoreMultiplier = 2.5;
    } else if (this.correctAnswers >= 24 && this.correctAnswers < 30) {
      this.minAmountOfCards = 16;
      this.maxAmountOfCards = 18;
      this.scoreMultiplier = 2.7;
    } else {
      this.minAmountOfCards = 18;
      this.maxAmountOfCards = 20;
      this.scoreMultiplier = 3;
    }
  }

  getSortedRandomNumbers(lastNumberOfRange, amountOfNumbers) {
    const chosenNumbers = [];
    while (chosenNumbers.length < amountOfNumbers) {
      const n = Math.floor(Math.random() * lastNumberOfRange) + 1;
      if (chosenNumbers.indexOf(n) === -1) {
        chosenNumbers.push(n);
      }
    }
    return chosenNumbers.sort((a, b) => b - a);
  }

  getAmountOfSheep(min, max) {
    this.amountOfSheep = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.amountOfSheep;
  }

  createCard(currentNumber, status) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.number = currentNumber;
    if (status === 'hide') {
      card.style.visibility = 'hidden';
    }
    return card;
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'count-sheep');
    return game;
  }

  showAnswers() {
    this.gameElement.append(this.createAnswersBlock());
  }

  createAnswersBlock() {
    const answersBlock = document.createElement('div');
    answersBlock.classList.add('answers');
    this.getOptionsOfAnswers();
    this.shuffle(this.answers);
    let i = 0;
    while (i < 4) {
      const answersItem = document.createElement('button');
      answersItem.classList.add('answers__item');
      answersItem.innerText = this.answers[i];
      answersBlock.append(answersItem);
      i += 1;
    }
    return answersBlock;
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  getOptionsOfAnswers() {
    const wrongAnswers = [];
    this.answers = [];
    this.answers.push(this.amountOfSheep);
    wrongAnswers.push(this.amountOfSheep - 1);
    wrongAnswers.push(this.amountOfSheep - 2);
    wrongAnswers.push(this.amountOfSheep - 3);
    wrongAnswers.push(this.amountOfSheep + 1);
    wrongAnswers.push(this.amountOfSheep + 2);
    wrongAnswers.push(this.amountOfSheep + 3);

    for (let i = 0; (i < 3) && (i < wrongAnswers.length); i += 1) {
      const r = Math.floor(Math.random() * (wrongAnswers.length - i)) + i;
      const answer = wrongAnswers[r];
      wrongAnswers[r] = wrongAnswers[i];
      wrongAnswers[i] = answer;
      this.answers.push(answer);
    }
  }

  setListenersForAnswers() {
    this.elements.game.box.addEventListener('mousedown', (e) => {
      const userAnswer = e.target.closest('.answers__item');
      let numberOfUserAnswer;
      if (userAnswer) {
        numberOfUserAnswer = Number(userAnswer.textContent);
        this.checkAnswer(numberOfUserAnswer, userAnswer);
      }
    }, {once: true});
  }

  checkAnswer(userAnswer, userAnswerButton) {
    if (userAnswer === this.amountOfSheep) {
      this.$soundPlayer.playSound('pew');
      userAnswerButton.style.backgroundColor = '#21B3A9';
      this.score += +(this.scoreStep * this.scoreMultiplier).toFixed();
      this.setScoreText(this.score);
      this.correctAnswers += 1;
      this.gameProgress();
    } else {
      this.$soundPlayer.playSound('sheep');
      userAnswerButton.style.backgroundColor = '#EA6453';
      this.removeLife();
      this.gameProgress();
    }
  }

  removeLife() {
    const live = this.elements.stats.icons.querySelector('.game-status_custom');
    this.elements.stats.icons.removeChild(live);
    if (this.elements.stats.icons.children.length === 0) {
      this.timer.stopCount();
      this.gameEnd();
    }
  }

  gameEnd() {
    this.timer.stopCount();
    this.disableFinishBtn();
    this.showModalWindow();
    this.$soundPlayer.playSound('game-end');
    return Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.id,
      score: this.score,
    });
  }

  showModalWindow() {
    const modal = new ModalWindow(this.$app);
    modal.showModal({
      type: this.gameConfig.modalWindow.types.gameEnd,
      container: document.querySelector('#app'),
      text: {
        score: this.score,
        title: this.gameConfig.games.countSheep.name,
      },
      callback: {
        restart: () => this.startGame(),
      },
    });
  }

  setListeners() {
    this.elements.game.finishBtn.addEventListener('click', this.gameEnd.bind(this));
  }

  disableFinishBtn(mode = 'off') {
    this.elements.game.finishBtn.disabled = true;
    this.elements.game.finishBtn.classList.add('button_disabled');
    this.elements.game.finishBtn.style.cursor = 'default';
    if (mode === 'on') {
      this.elements.game.finishBtn.disabled = false;
      this.elements.game.finishBtn.classList.remove('button_disabled');
      this.elements.game.finishBtn.style.cursor = 'pointer';
    }
  }

  init() {
    this.gameElement = this.getGameNode();
    this.elements.game.box.append(this.gameElement);
    this.setListeners();
  }

  destroyGameInstance() {
    this.timer.stopCount();
    this.elements.stats.score.innerText = '';
    this.elements.stats.time.innerText = '';
    this.elements.stats.icons.innerText = '';
  }

  getGameInstance(root, elements) {
    const app = new CountSheep(root, elements);
    app.init();
    return app;
  }
}
