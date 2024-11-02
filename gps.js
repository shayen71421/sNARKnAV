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
        directionDisplay.innerHTML = "Are you still using Internet Explorer?";
        speak("Are you still using Internet Explorer?");
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
        `Turn 90 degrees clockwise and stumble ${getRandomDistance()}... like you just downed a shot of regret!`,
        `Spin 180 degrees and lurch ${getRandomDistance()}... as if you're trying to find your way out of a bad decision!`,
        `Veer left and crawl ${getRandomDistance()}... because walking is too advanced for you!`,
        `Squint and stagger at the next corner, moving ${getRandomDistance()}... like you’re dodging responsibilities!`,
        `Twist your body and flop ${getRandomDistance()}... like you just fell off the last brain cell you had!`,
        `Do a ridiculous little jig and shuffle ${getRandomDistance()}... if you're trying to impress absolutely no one!`,
        `Wobble like a drunken giraffe and lurch ${getRandomDistance()}... because even gravity’s giving up on you!`,
        `Stumble backward ${getRandomDistance()}... because forward is just too ambitious!`,
        `Try to walk straight for ${getRandomDistance()}... but knowing you, you’ll probably end up in a wall!`,
        `Crouch down and roll ${getRandomDistance()}... because standing up is too much effort!`,
        `Pretend you’re a model and strut ${getRandomDistance()}... except nobody’s watching and nobody cares!`,
        `Do a pirouette and end up ${getRandomDistance()}... like a circus act gone horribly wrong!`,
        `Flap your arms like a chicken and scuttle ${getRandomDistance()}... because why not make it more ridiculous?`,
        `Leap in the air and land ${getRandomDistance()}... like you’re trying to escape your own life!`,
        `Take a step forward, then immediately trip ${getRandomDistance()}... because coordination isn't in your skill set!`,
        `Shuffle sideways ${getRandomDistance()}... as if you're avoiding a conversation you don't want to have!`,
        `Do a slow-motion sprint ${getRandomDistance()}... to reflect how slowly your brain processes information!`,
        `Twist and shout ${getRandomDistance()}... because yelling is the only way to get your point across!`,
        `Dodge imaginary lasers and move ${getRandomDistance()}... like your life depends on it—spoiler alert: it doesn’t!`,
        `Take a wild guess and walk ${getRandomDistance()}... because logic is clearly not your strong suit!`,
        `Leap around like a frog and hop ${getRandomDistance()}... because, honestly, it’s more graceful than you!`,
        `Mosey along ${getRandomDistance()}... like you just realized life isn’t a race, and you’re still losing!`,
        `Turn like you’re in a horror movie and sprint ${getRandomDistance()}... because even your instincts know better!`,
        `Bend over and crawl ${getRandomDistance()}... as if trying to pick up the pieces of your dignity!`,
        `Slide to the left ${getRandomDistance()}... because that’s the only direction you’re ever good at!`,
        `Flop around like a fish out of water and move ${getRandomDistance()}... because coordination is a foreign concept to you!`,
        `Walk backward ${getRandomDistance()}... since you’re clearly more comfortable living in the past!`,
        `Tumble and roll ${getRandomDistance()}... like you just found out your life is a joke!`,
        `Skip awkwardly ${getRandomDistance()}... as if you're trying to make your exit less painful!`,
        `Pretend to be a sloth and move ${getRandomDistance()}... because at this point, that’s your spirit animal!`,
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
                                window.location.href = "https://www.youtube.com/watch?v=mx86-rTclzA";
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
                "Lost again? Maybe it’s time to upgrade your sense of direction.",
                "Did you really think this was the right way?",
                "Nice try, but no… you’re nowhere near it.",
                "Well, that was a bold turn. Boldly wrong.",
                "Not quite there, are we? Shocking.",
                "Congratulations! You've found... absolutely nothing.",
                "If only you’d followed the map. Oh, wait.",
                "Let me guess... this seemed like the right way?",
                "You’ve really outdone yourself on getting lost this time.",
                "Well done! You've reached... the middle of nowhere.",
                "Maybe double-check before you decide to turn next time?",
                "Wow, you’re as far from the destination as possible!",
                "I’d say 'almost there,' but we both know that’s not true.",
                "You keep this up, and we might need a compass.",
                "I’d give you directions, but would you follow them?",
                "This must be your special shortcut to... nowhere.",
                "Trust me, even I’m confused with your route choices.",
                "I think you missed the sign that said ‘wrong way’ back there.",
                "Lost again? At this rate, we’ll need a survival kit.",
                "Are we just driving in circles now, or…?",
                "Nice scenic tour you’re giving yourself!",
                "You do know where you’re going, right? Just checking.",
                "If you’re trying to get lost, you’re doing great!",
                "Turning here, huh? Bold choice. Wrong, but bold.",
                "If only this app had a facepalm feature.",
                "Well, someone’s really committed to being off course!",
                "I’d say ‘good effort,’ but... we’re still lost.",
                "Ever thought about actually following directions?",
                "You’ve definitely found the longest route possible.",
                "Not sure where you’re going, but it’s clearly not here.",
            ];
            const randomMessage = wrongTurnMessages[Math.floor(Math.random() * wrongTurnMessages.length)];
            directionDisplay.innerHTML += `<br>${randomMessage}`;

            speak(randomMessage, () => {
                const correctiveMessages = [
                    "Now, turn around and try again! It's not rocket science, you numpty!",
                    "Seriously? It's like you're trying to find your way in a bloody funhouse!",
                    "Try again, it's not that difficult! I believe in you... barely.",
                    "Turn around and try again! You’re not auditioning for a reality show, mate!",
                    "What on earth are you doing? It’s like you’ve got a blindfold on!",
                    "Seriously? You’re taking the scenic route to nowhere! Get it together!",
                    "Come on! This isn’t a treasure hunt; just follow the bloody directions!",
                    "I thought you could handle this! Time to wake up and refocus!",
                    "Let’s not make this a habit! Just stick to the route—how hard can it be?",
                    "Alright, enough of this daftness! Get back on the right path!",
                    "Take a deep breath and let’s sort this mess out—if you’re capable!",
                    "What now? Did you decide to take a detour into stupidity?",
                    "Turn around! You’re going the wrong way like you’re lost in a fog!",
                    "Seriously? You’re heading into a dead end—are you even trying?",
                    "Get it together! You’re moving like you’re stuck in molasses!",
                    "This isn’t a game! Follow the instructions, or we’ll be here all day!",
                    "Turn back! You’re about as lost as a cat in a dog park!",
                    "Enough of this nonsense! Get back on track before I lose my patience!",
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
    const distances = ["10 football fields", "3 Innovas", "5 Olympic pools", "1 Twin Tower", "7 sports grounds","1 Sahrdaya","5 Vande Bharat","3 Nanos","1000 cockroaches","7000 A4 sheets","10 molecules","0.00000001 galaxy","3 black hole","10 golf poles"];
    return distances[Math.floor(Math.random() * distances.length)];
}
