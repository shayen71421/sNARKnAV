let userPosition;
let destinationPosition;
let currentStepIndex = 0;
const steps = [];
const directionDisplay = document.getElementById("direction-display");
const nextStepButton = document.getElementById("nextStepButton");
const startJourneyButton = document.getElementById("startJourneyButton");
const toChoice = document.getElementById("to-choice"); 
const toInput = document.getElementById("to-input"); 
let speaking = false; 

function initLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setInitialPosition, handleLocationError);
    } else {
        directionDisplay.innerHTML = "Geolocation is not supported by this browser.";
        speak("Geolocation is not supported by this browser.");
    }
}

function setInitialPosition(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}

function toggleInput() {
    if (toChoice.value === "current") {
        toInput.style.display = "none"; 
    } else {
        toInput.style.display = "block"; 
    }
}

function setupDestination() {
    toggleInput(); 

    const toChoiceValue = toChoice.value;

    if (toChoiceValue === "current") {
        destinationPosition = userPosition;
    } else if (toChoiceValue === "coordinates") {
        const coords = toInput.value.split(',').map(s => s.trim());

        
        if (coords.length !== 2 || !isValidCoordinates(coords[0], coords[1])) {
            const errorMessage = "Please enter valid numeric coordinates (latitude, longitude)!";
            const insultMessage = "Seriously? You can't even type numbers correctly? Come on, get it together!";
            directionDisplay.innerHTML = `${errorMessage}<br>${insultMessage}`;
            speak(`${errorMessage} ${insultMessage}`);
            return;
        }

        destinationPosition = { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
    }

    startJourney(); 
}

function isValidCoordinates(lat, lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    return !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
}

function startJourney() {
    if (currentStepIndex === 0) {
        calculateSteps();
        navigator.geolocation.watchPosition(updateUserPosition, handleLocationError);
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
        `Turn 90 degrees clockwise and go ${getRandomDistance()}... you absolute twat.`,
        `Turn 180 degrees and continue ${getRandomDistance()}... you absolute muppet.`,
        `Veer left and go ${getRandomDistance()}... have you lost your bloody mind?`,
        `Squint and turn at the next molecule and move ${getRandomDistance()}... if you can see it, you donut!`,
        `Twist your body and take a leap ${getRandomDistance()}... it's not a bloody dance-off!`,
        `Do a little jig and turn ${getRandomDistance()}... who taught you to navigate, a monkey?`,
    ];
    return Array.from({ length: numSteps }, (_, i) => ({
        instructions: stepMessages[Math.floor(Math.random() * stepMessages.length)],
        reachedDestination: i === numSteps - 1
    }));
}

function showNextStep() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                if (currentStepIndex >= steps.length) {
                    directionDisplay.innerHTML = "You have arrived! End of this absurd journey!";
                    speak("You have arrived! End of this absurd journey!", () => {
                        
                        const rewardMessage = "Here is your reward!";
                        speak(rewardMessage, () => {
                            setTimeout(() => {
                                window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                            }, 2000);
                        });
                    });
                    nextStepButton.style.display = "none";
                    return;
                }

                const currentStep = steps[currentStepIndex];
                directionDisplay.innerHTML = currentStep.instructions;

                speak(currentStep.instructions);
                currentStepIndex++;
            },
            error => {
                handleLocationError(error);
                stopJourneyDueToLocationError();
            }
        );
    } else {
        directionDisplay.innerHTML = "Geolocation is not supported by this browser.";
        speak("Geolocation is not supported by this browser.");
    }
}

function stopJourneyDueToLocationError() {
    directionDisplay.innerHTML = "Location access is disabled. Please enable location to continue.";
    speak("Location access is disabled. Please enable location to continue.");
    nextStepButton.style.display = "none";
    startJourneyButton.innerText = "Resume Journey";
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
                "Whoa there! That’s not where you’re supposed to go! Did you forget your glasses, you twat?",
                "Oops! Did you just turn left when I said right? Are you even listening, you idiot?",
                "That’s not the way! It’s like trying to find a needle in a haystack, you muppet!",
                "Did you just take a vacation? Because that’s not the right path, you donut!",
            ];
            const randomMessage = wrongTurnMessages[Math.floor(Math.random() * wrongTurnMessages.length)];
            directionDisplay.innerHTML += `<br>${randomMessage}`;

            speak(randomMessage, () => {
                const correctiveMessages = [
                    "Now, turn around and try again! It's not rocket science, you numpty!",
                    "Seriously? It's like you're trying to find your way in a bloody funhouse!",
                    "Try again, it's not that difficult! I believe in you... barely.",
                ];
                const randomCorrectiveMessage = correctiveMessages[Math.floor(Math.random() * correctiveMessages.length)];
                directionDisplay.innerHTML += `<br>${randomCorrectiveMessage}`;
                speak(randomCorrectiveMessage, showNextStep);
            });
        } else {
            showNextStep();
        }
    } else {
        directionDisplay.innerHTML = "No steps to check! Please start your journey.";
    }
}

function checkDirectionLogic(instruction) {
    return Math.random() > 0.5;
}

function reportBug() {
    window.location.href = "https://www.youtube.com/watch?v=bhVf2bHJu5Q";
}

function speak(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1;
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

function handleLocationError(error) {
    const message = "Turn that thing on, you moron!";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            directionDisplay.innerHTML = message;
            speak(message);
            break;
        case error.POSITION_UNAVAILABLE:
            directionDisplay.innerHTML = "Location information is unavailable.";
            speak("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            directionDisplay.innerHTML = "The request to get user location timed out.";
            speak("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            directionDisplay.innerHTML = "An unknown error occurred.";
            speak("An unknown error occurred.");
            break;
    }
}

function getRandomDistance() {
    const distances = ["10 football fields", "3 Innovas", "5 Olympic pools", "1 Twin Tower", "7 sports grounds"];
    return distances[Math.floor(Math.random() * distances.length)];
}
