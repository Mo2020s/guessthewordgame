let gameName = "Guess the Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} By Moha <3 `;

let numberOfTries = 3;

let currentTry = 1;
let numberOfHints = 2;
let wordToGuess = "";
const words = ["Create", "Upload", "Download", "Install", "Animal", "Smash"];

let randnum = Math.floor(Math.random() * words.length);
wordToGuess = words[randnum].toLowerCase();
let numberOfLetters = words[randnum].length;

console.log("answer: " + wordToGuess);

let messageArea = document.querySelector(".message");

document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  const inputContainer = document.querySelector(".inputs");

  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i} </span>`;

    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }

    for (j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", 1);
      tryDiv.appendChild(input);
    }

    inputContainer.appendChild(tryDiv);
  }
  inputContainer.children[0].children[1].focus();

  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );

  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "ArrowLeft") {
        const previousInput = currentIndex - 1;
        if (previousInput >= 0) {
          inputs[previousInput].focus();
        }
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }
  if (successGuess) {
    messageArea.innerHTML = `You Win, The Word Is <span>${wordToGuess}</span>`;
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((ele) => {
      ele.classList.add("disabled-inputs");
      guessButton.disabled = true;
    });
    if (numberOfHints === 3) {
      messageArea.innerHTML = `<p>Congrats ! You Didn't Use Hints</p>`;
    }
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((ele) => {
      ele.disabled = true;
    });

    currentTry++;

    const nextTryIntputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    nextTryIntputs.forEach((ele) => {
      ele.disabled = false;
    });

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      // Disable Guess Button
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnaledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnaledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnaledInputs.length);
    const randomInput = emptyEnaledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const previousInputs = inputs[currentIndex - 1];
      currentInput.value = "";
      previousInputs.value = "";
      previousInputs.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);

window.onload = function () {
  generateInput();
};
