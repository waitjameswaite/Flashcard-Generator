var inquirer = require("inquirer");
var flashcards = require("./flashcards.json");
var flashcardsPoInt = require("./flashcardsPoInt.json");
var flashcardsMin = require("./flashcardsMin.json");
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var fs = require("fs");

var pickedCard;
var revealedCard;
var choosenQuiz;
var count = 0;
var correct = 0;
var incorrect = 0;

function initialLaunch() {
	inquirer.prompt([
		{
			type: "list",
			message: "Which quiz would you like to take?",
			choices: ["Conceptual", "PostInternet", "Minimalism"],
			name: "launchOptions"
		}
	]).then(function (answer) {

		switch (answer.launchOptions) {

			case 'Conceptual':
				console.log("You have choosen the Conceptual Art Quiz");
				choosenQuiz = flashcards;
				askFlashCard();
				break;
			case 'PostInternet':
				console.log("You have choosen the Post-Internet Art Quiz");
				choosenQuiz = flashcardsPoInt;
				askFlashCard();
				break;
			case 'Minimalism':
				console.log("You have choosen the Minimalism Art Quiz");
				choosenQuiz = flashcardsMin;
				askFlashCard();
				break;
			default:
				console.log("Unrecognized input, try again.");
		}

	});
}

initialLaunch();


function getFlashCard(card) {
	if (card.type === "BasicCard") {
		pickedCard = new BasicCard(card.front, card.back);
		return pickedCard.front;
	} else if (card.type === "ClozeCard") {
		pickedCard = new ClozeCard(card.text, card.cloze);
		return pickedCard.clozeRemoved();
	}
}

function askFlashCard() {
	if (count < choosenQuiz.length) {
		revealedCard = getFlashCard(choosenQuiz[count]);
		inquirer.prompt([
			{
				type: "input",
				message: revealedCard,
				name: "question"
			}
		]).then(function (answer) {
			if (answer.question === choosenQuiz[count].back || answer.question === choosenQuiz[count].cloze) {
				console.log("Correct!");
				correct++;
			} else {
				if (pickedCard.front !== undefined) {
					console.log("Incorrect. The correct answer is " + choosenQuiz[count].back + ".");
				} else {
					console.log("Incorrect. The correct answer is " + choosenQuiz[count].cloze + ".");
				}
				incorrect++;
			}
			count++;
			askFlashCard();
		});
	} else {
		// console.log("You've gone through all the flashcards and got " + percentCorrect + "%.");
		count = 0;
		// correct = 0;
		// incorrect = 0;
	}
}

// askFlashCard();