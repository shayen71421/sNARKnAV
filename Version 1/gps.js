let userPosition;
let destinationPosition;
let currentStepIndex = 0;
const steps = [];
const directionDisplay = document.getElementById("direction-display");
const nextStepButton = document.getElementById("nextStepButton");
const startJourneyButton = document.querySelector("button[onclick='startJourney()']");
let speaking = false;

function initLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setInitialPosition, showError);
    } else {
        directionDisplay.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function setInitialPosition(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    setupDestination();
}

function toggleInput(type) {
    const select = document.getElementById(`${type}-choice`);
    const input = document.getElementById(`${type}-input`);
    input.hidden = select.value === "current";
}

function setupDestination() {
    const toChoice = document.getElementById("to-choice").value;
    const toInput = document.getElementById("to-input").value;

    if (toChoice === "current") {
        destinationPosition = userPosition;
    } else if (toChoice === "coordinates") {
        const coords = toInput.split(',').map(Number);
        destinationPosition = { lat: coords[0], lng: coords[1] };
    }

    startJourney();
}

function startJourney() {
    if (currentStepIndex === 0) {
        calculateSteps();
        navigator.geolocation.watchPosition(updateUserPosition, showError);
        nextStepButton.style.display = "inline-block";
    } else {
        resetJourney();
    }
}

function resetJourney() {
    currentStepIndex = 0;
    steps.length = 0;
    directionDisplay.innerHTML = "Press Start to Begin Your Journey";
    startJourneyButton.innerText = "Start a New Journey";
    nextStepButton.style.display = "none";
    nextStepButton.disabled = false;
}

function calculateSteps() {
    steps.push(...generateRandomSteps(userPosition, destinationPosition, 10));
    showNextStep();
}

function generateRandomSteps(start, end, numSteps) {
    const stepMessages = [
        `Turn 90 degrees clockwise and go ${getRandomDistance()}... the distance of three Innovas.`,
        `Turn 180 degrees and continue ${getRandomDistance()}... about two Twin Towers high.`,
        `Veer left and go ${getRandomDistance()}... about 10 football fields.`,
        `Squint and turn at the next molecule and move ${getRandomDistance()}... if you can see it!`,
        `Twist your body and take a leap ${getRandomDistance()}... like you're in a dance-off!`,
        `Do a little jig and turn ${getRandomDistance()}... I hope you're feeling funky!`,
    ];
    return Array.from({ length: numSteps }, (_, i) => ({
        instructions: stepMessages[Math.floor(Math.random() * stepMessages.length)],
        reachedDestination: i === numSteps - 1
    }));
}

function showNextStep() {
    if (currentStepIndex >= steps.length) {
        directionDisplay.innerHTML = "You have arrived! End of this absurd journey!";
        speak("You have arrived! End of this absurd journey!");
        nextStepButton.style.display = "none";
        return;
    }

    const currentStep = steps[currentStepIndex];
    directionDisplay.innerHTML = currentStep.instructions;

    // Speak the instruction
    speak(currentStep.instructions);
    currentStepIndex++;
}

function updateUserPosition(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}

function checkDirection() {
    if (currentStepIndex > 0) {
        const currentStep = steps[currentStepIndex - 1];

        
        const isCorrectDirection = checkDirectionLogic(currentStep.instructions);

        if (!isCorrectDirection) {
            const wrongTurnMessages = [
                "Whoa there! That’s not where you’re supposed to go! Did you forget your glasses?",
                "Oops! Did you just turn left when I said right? Come on, it’s not that hard!",
                "That’s not the way! It’s like trying to find a needle in a haystack!",
                "Did you just take a vacation? Because that’s not the right path!",
                "You’ve gone off course! It’s like trying to bake a cake without a recipe!",
                "Wrong way! I thought we were going to the moon, not Mars!",
                "That’s a bold choice! But not the right one! Maybe next time?",
            ];
            const randomMessage = wrongTurnMessages[Math.floor(Math.random() * wrongTurnMessages.length)];
            directionDisplay.innerHTML += `<br>${randomMessage}`;

            
            speak(randomMessage, () => {
                
                const correctiveMessages = [
                    "Now, turn around and try again! It's not rocket science!",
                    "Seriously? It's like you're trying to find your way in a funhouse!",
                    "Try again, it's not that difficult! I believe in you!",
                    "Come on, let’s get back on track. This isn’t a scavenger hunt!",
                    "I thought you were better than this! Time to refocus!",
                    "Let's not make this a habit! Just follow the directions!",
                    "Alright, enough playing around! Let's get back to the path!",
                    "Take a deep breath and let’s try this again!"
                ];
                const randomCorrectiveMessage = correctiveMessages[Math.floor(Math.random() * correctiveMessages.length)];
                directionDisplay.innerHTML += `<br>${randomCorrectiveMessage}`;
                speak(randomCorrectiveMessage, () => {
                    
                    showNextStep();
                });
            });
        } else {
            showNextStep();
        }
    }
}

function checkDirectionLogic(instruction) {
    
    return Math.random() > 0.5;
}

function speak(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.onend = () => {
        speaking = false;
        nextStepButton.disabled = false;
        if (callback) callback();
    };

    
    if (speaking) {
        
        window.speechSynthesis.cancel();
    }
    speaking = true;
    nextStepButton.disabled = true;
    window.speechSynthesis.speak(speech);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            directionDisplay.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            directionDisplay.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            directionDisplay.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            directionDisplay.innerHTML = "An unknown error occurred.";
            break;
    }
}

function getRandomDistance() {
    const units = ["meters", "kilometers", "miles", "steps"];
    const unit = units[Math.floor(Math.random() * units.length)];
    const distance = (Math.random() * 100 + 1).toFixed(1);
    return `${distance} ${unit}`;
}

nextStepButton.addEventListener('click', checkDirection);
