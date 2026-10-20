
const cipherForm = document.getElementById("cipher-form");
const cipherAnswer = document.getElementById("cipher-answer");
const cipherFeedback = document.getElementById("cipher-feedback");
const hintButton = document.getElementById("hint-button");
const hintText = document.getElementById("hint-text");
const scoreDisplay = document.getElementById("score");

let score = 0;
let solved = false;

// Check the player's answer
cipherForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Do not allow the same puzzle to score twice
    if (solved) {
        return;
    }

    const answer = cipherAnswer.value;

    if (answer === "correct") {
        score += 10;
        solved = true;

        cipherFeedback.textContent =
            "¡Correcto! You decoded the message. +10 points!";
        cipherFeedback.style.color = "#70e1a1";

        scoreDisplay.textContent = "Score: " + score;

        cipherAnswer.disabled = true;
        cipherForm.querySelector("button").disabled = true;
    } else if (answer === "") {
        cipherFeedback.textContent =
            "Choose an answer before submitting.";
        cipherFeedback.style.color = "#f1c875";
    } else {
        cipherFeedback.textContent =
            "Incorrecto! Try again and examine the Spanish words.";
        cipherFeedback.style.color = "#ff8585";
    }
});

// Reveal the hint
hintButton.addEventListener("click", function () {
    hintText.hidden = false;
    hintButton.textContent = "Hint Revealed";
});
