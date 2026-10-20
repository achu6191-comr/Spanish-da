
/* ==========================================
   ¿QUIÉN FUE? — SPANISH DETECTIVE GAME
   Four challenges | 100 points total
========================================== */

const $ = (id) => document.getElementById(id);

let scores = {
    cipher: 0,
    vocabulary: 0,
    code: 0,
    culture: 0
};

let solved = {
    cipher: false,
    vocabulary: false,
    code: false,
    culture: false
};

const MAX_SCORE = 100;

function totalScore() {
    return Object.values(scores).reduce((sum, value) => sum + value, 0);
}

function updateScore() {
    const total = totalScore();
    $("top-score").textContent = `Score: ${total} / ${MAX_SCORE}`;
    $("final-score").textContent = `${total} / ${MAX_SCORE}`;
    $("progress-fill").style.width = `${total}%`;
    $("score-progress").setAttribute("aria-valuenow", total);

    const completed = Object.values(solved).filter(Boolean).length;

    if (completed === 4) {
        $("result-message").textContent =
            total >= 80
                ? "¡Excelente, detective! You have mastered the investigation!"
                : total >= 50
                    ? "¡Buen trabajo! You solved the case challenges. Keep practising Spanish!"
                    : "¡Caso cerrado! You finished the investigation. Replay to improve your score.";
    } else {
        $("result-message").textContent =
            `${completed} of 4 challenges completed. Keep investigating!`;
    }
}

function showFeedback(id, message, success) {
    const element = $(id);
    element.textContent = message;
    element.style.color = success ? "#78e0a3" : "#ff9292";
}

function showHint(buttonId, hintId) {
    $(buttonId).addEventListener("click", () => {
        $(hintId).hidden = false;
        $(buttonId).textContent = "Hint Revealed";
    });
}

/* ------------------------------------------
   CHALLENGE 1 — TRANSLATION
   Maximum: 20 points
------------------------------------------ */

$("cipher-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (solved.cipher) return;

    const answer = $("cipher-answer").value;

    if (answer === "correct") {
        scores.cipher = 20;
        solved.cipher = true;

        showFeedback(
            "cipher-feedback",
            "¡Correcto! The note says: Don't look where it shone; look where it is preserved. +20 points!",
            true
        );

        $("cipher-answer").disabled = true;
        $("cipher-form").querySelector("button[type='submit']").disabled = true;
        updateScore();
    } else {
        showFeedback(
            "cipher-feedback",
            "¡Incorrecto! Read the note again. What does 'se conserva' mean?",
            false
        );
    }
});

showHint("hint-button", "hint-text");

/* ------------------------------------------
   CHALLENGE 2 — VOCABULARY
   10 questions, 3 points each = 30 points
------------------------------------------ */

const vocabulary = [
    { word: "la huella", meaning: "the footprint / trace" },
    { word: "la coartada", meaning: "the alibi" },
    { word: "el sospechoso", meaning: "the suspect" },
    { word: "la prueba", meaning: "the evidence" },
    { word: "el robo", meaning: "the theft" },
    { word: "la llave", meaning: "the key" },
    { word: "la puerta", meaning: "the door" },
    { word: "el testigo", meaning: "the witness" },
    { word: "la pista", meaning: "the clue" },
    { word: "el tesoro", meaning: "the treasure" }
];

const vocabularyContainer = $("vocabulary-questions");

vocabulary.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "vocab-question";

    const label = document.createElement("label");
    label.htmlFor = `vocab-${index}`;
    label.textContent = `${index + 1}. ${item.word}`;

    const select = document.createElement("select");
    select.id = `vocab-${index}`;
    select.required = true;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose the meaning...";
    select.appendChild(placeholder);

    // Every question contains the correct answer and three distractors.
    const options = [
        item.meaning,
        ...vocabulary
            .filter((other) => other.meaning !== item.meaning)
            .map((other) => other.meaning)
            .slice((index * 2) % 6, ((index * 2) % 6) + 3)
    ];

    // Keep the four options unique and shuffle them.
    const uniqueOptions = [...new Set(options)];
    uniqueOptions.sort(() => Math.random() - 0.5);

    uniqueOptions.forEach((meaning) => {
        const option = document.createElement("option");
        option.value = meaning;
        option.textContent = meaning;
        select.appendChild(option);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    vocabularyContainer.appendChild(wrapper);
});

$("vocabulary-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (solved.vocabulary) return;

    let correct = 0;

    vocabulary.forEach((item, index) => {
        if ($(`vocab-${index}`).value === item.meaning) {
            correct++;
        }
    });

    scores.vocabulary = correct * 3;
    solved.vocabulary = true;

    showFeedback(
        "vocab-feedback",
        `You matched ${correct} out of 10 words. You earned ${scores.vocabulary}/30 points. ${correct === 10 ? "¡Perfecto!" : "Review the meanings and replay to improve."}`,
        correct === 10
    );

    vocabulary.forEach((_, index) => {
        $(`vocab-${index}`).disabled = true;
    });

    $("vocabulary-form").querySelector("button[type='submit']").disabled = true;
    updateScore();
});

showHint("vocab-hint-button", "vocab-hint");

/* ------------------------------------------
   CHALLENGE 3 — LETTER CIPHER
   Maximum: 25 points
------------------------------------------ */

// E V J D B shifted backward becomes D U I C A.
// Correct the clue so it decodes to C A S A (house).
// C A S A shifted forward by one becomes D B T B.

$("code-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (solved.code) return;

    const answer = $("code-answer").value
        .trim()
        .toLocaleLowerCase("es");

    if (answer === "casa") {
        scores.code = 25;
        solved.code = true;

        showFeedback(
            "code-feedback",
            "¡Descifrado! CASA means HOUSE. The clue points to a building. +25 points!",
            true
        );

        $("code-answer").disabled = true;
        $("code-form").querySelector("button[type='submit']").disabled = true;
        updateScore();
    } else {
        showFeedback(
            "code-feedback",
            "Not quite! Move each encrypted letter one place backward in the alphabet.",
            false
        );
    }
});

showHint("code-hint-button", "code-hint");

/* ------------------------------------------
   CHALLENGE 4 — COLOMBIAN CULTURE
   Five questions, 5 points each = 25 points
------------------------------------------ */

const cultureAnswers = {
    culture1: "spanish",
    culture2: "gold",
    culture3: "muisca",
    culture4: "heritage",
    culture5: "goldpiece"
};

$("culture-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (solved.culture) return;

    let correct = 0;

    Object.entries(cultureAnswers).forEach(([id, expected]) => {
        if ($(id).value === expected) {
            correct++;
        }
    });

    scores.culture = correct * 5;
    solved.culture = true;

    showFeedback(
        "culture-feedback",
        `${correct}/5 correct. You earned ${scores.culture}/25 points. Learn more about Colombia's heritage using the research links below.`,
        correct === 5
    );

    Object.keys(cultureAnswers).forEach((id) => {
        $(id).disabled = true;
    });

    $("culture-form").querySelector("button[type='submit']").disabled = true;
    updateScore();
});

showHint("culture-hint-button", "culture-hint");

/* ------------------------------------------
   REPLAY
------------------------------------------ */

$("replay-button").addEventListener("click", () => {
    window.location.reload();
});

updateScore();
