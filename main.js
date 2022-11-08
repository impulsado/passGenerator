// GENERAL
import * as db from "./db.js";

console.clear();

const resultEl = document.getElementById('result');

const emailEl = document.getElementById('email');

const lengthEl = document.getElementById('slider');

const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numberEl = document.getElementById('number');
const symbolEl = document.getElementById("symbol");

const generateBtn = document.getElementById('generate');

const copyBtn = document.getElementById("copy-btn");

const resultContainer = document.querySelector('.result');

const copyInfo = document.querySelector('.result__info.right');
const copiedInfo = document.querySelector(".result__info.left");

let generatedPassword = false;


// SLIDER
const sliderProps = {
	fill: "#0B1EDF",
	background: "rgba(255, 255, 255, 0.214)",
};

const slider = document.querySelector(".range__slider");

const sliderValue = document.querySelector(".length__title");

slider.querySelector('input').addEventListener("input", event => {
	sliderValue.setAttribute("data-length", event.target.value);
	applyFill(event.target);
});

applyFill(slider.querySelector("input"));

function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
	slider.style.background = bg;
	sliderValue.setAttribute("data-length", slider.value);
}



// FUNCTIONS
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}

function getRandomSymbol() {
	const symbols = '~!@#$%^&*()_+{}":?><;.,';
	return symbols[Math.floor(Math.random() * symbols.length)];
}

function intInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// MOUSE 

resultContainer.addEventListener('mousemove', e => {
	resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};
	if(generatedPassword){
		copyBtn.style.opacity = '1';
		copyBtn.style.pointerEvents = 'all';
		copyBtn.style.setProperty('--x', `${e.x - resultContainerBound.left}px`);
		copyBtn.style.setProperty('--y', `${e.y - resultContainerBound.top}px`);
	}else {
		copyBtn.style.opacity = '0';
		copyBtn.style.pointerEvents = 'none';
	}
});


// RESIZE
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};

window.addEventListener('resize', e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
})

// PROGRAM
    // COPY BUTTON
copyBtn.addEventListener('click', () => {
	const textarea = document.createElement('textarea');
	const password = resultEl.innerText;
	if (!password || password == "CLICK GENERATE") {
		return;
	}
	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	textarea.remove();
	
	copyInfo.style.transform = "translateY(200%)";
	copyInfo.style.opacity = "0";
	copiedInfo.style.transform = "translatey(0%)";
	copiedInfo.style.opacity = "0.75";
});

    // GENERATE BUTTON
generateBtn.addEventListener("click", () => {
    if (emailEl.checked) {
        generatedPassword = true;
        resultEl.innerText = generateEmail();
        copyInfo.style.transform = 'translateY(0%)';
	    copyInfo.style.opacity = "0.75";
	    copiedInfo.style.transform = "translatey(200%)";
	    copiedInfo.style.opacity = "0";
    } 
    else {
        const length = +lengthEl.value;
	    const hasLower = lowercaseEl.checked;
	    const hasUpper = uppercaseEl.checked;
	    const hasNumber = numberEl.checked;
	    const hasSymbol = symbolEl.checked;
	    generatedPassword = true;
	    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
	    copyInfo.style.transform = 'translateY(0%)';
	    copyInfo.style.opacity = "0.75";
	    copiedInfo.style.transform = "translatey(200%)";
	    copiedInfo.style.opacity = "0";
    }
});

function generateEmail(){
    generatedEmail = ''
    var name1 = db.firstName;
    var name2 = db.lastName;
    var domains = db.domains;
  
    var firstName = (name1[intInRange(0, name1.length + 1)]);
    var lastName = (name2[intInRange(0, name2.length + 1)]);
    var domain = (domains[intInRange(0, domains.length)]);
    var randomNumber = intInRange(1,999);
    var generatedEmail = firstName + '.' + lastName.toLowerCase() + randomNumber + '@' + domain;

	console.log(generatedEmail);

  	return generatedEmail;
}

    // GENEATE PASSWORD
function generatePassword(length, lower, upper, number, symbol) {
	let generatedPassword = '';
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
	if (typesCount === 0) {
		return '';
	}
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	return generatedPassword.slice(0, length);
}

// CHECK BUTTONS
function disableOnlyCheckbox() {
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	
	totalChecked.forEach(el => {
        if (totalChecked.length == 1)  {
            el.disabled = true;
		}else {
			el.disabled = false;
		}
	})

}

// HIDE PASSWD SETTINGS
var toHide = document.getElementById('toHide');
[emailEl, uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
        if (emailEl.checked) {
            toHide.style.display = 'none';
        } else {
			toHide.style.display = 'block';
		}
		disableOnlyCheckbox()
	})
})