// Arithmetic Functions

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {

    if (b === 0) {
        return "division by 0";
    }

    return a/b;
}

function percentage(a) {
    return a/100;
}



function operate(op, x, y) {
    switch(op) {
        case '+':
            return add(x, y);
        case '-':
            return subtract(x, y);
        case '*':
            return multiply(x, y);
        case '/':
            return divide(x, y);
        case '%':
            return percentage(x);
    }
}

const display = document.querySelector("#display");


function undo(str, n) {

    if (calc.ansOnDisplay && !calc.initialState) {
        clearDisplay(false);
        return "0";
    }
    
    
    if (str.length === 1 || calc.error) {
        clearDisplay(false);
        return "0";
        // return str.substr(0, str.length - n);
    }  

    if (str.at(-1) === "s") {
        return str.substring(0, str.length - 3);
    }
    const regEx = /\d/;
    
    const char = str.at(-1);
    if (regEx.test(char)) {
        let c = str.at(-2);
        calc.leadingZero = !/\d\./.test(c);
        if (calc.leadingZero) {
            switch(c) {
                case "\u{002b}":
                    calc.previousOp = "ad";
                    calc.enteringNumber = false;
                    break;
                case "-":
                case "\u{2212}":
                    calc.previousOp = "su";
                    calc.enteringNumber = (c === "-");
                    break;
                case "\u{00d7}":
                    calc.previousOp = "mu";
                    calc.enteringNumber = false;
                    break;
                case "\u{00f7}":
                    calc.previousOp = "di";
                    calc.enteringNumber = false;
                    break;

            }
        }
    }
    else if (char === "\u{002e}") {
        console.log("decimal deleted");
        calc.decimalPresent = false;
        let c = str.at(-2);
        console.log(c);
        let postOp = false;
        calc.leadingZero =
            /[1-9]/.test(c) ? false :
            (/[\u{002b}\u{2212}\u{00d7}\u{00f7}-]/u.test(c)) ? true :
            (c === 0) ? 
            (str.length >= 3 ? postOp = !/\d/.test(str.at(-3)) : true) : false;
            // Might need to account for "X." case when X=0.
            if (postOp) {
                console.log("worked");
                switch(str.at(-3)) {
                    case "\u{002b}":
                        calc.previousOp = "ad";
                        calc.enteringNumber = false;
                        break;
                    case "-":
                    case "\u{2212}":
                        calc.previousOp = "su";
                        calc.enteringNumber = (str.at(-3) === "-");
                        break;
                    case "\u{00d7}":
                        calc.previousOp = "mu";
                        calc.enteringNumber = false;
                        break;
                    case "\u{00f7}":
                        calc.previousOp = "di";
                        calc.enteringNumber = false;
                        break;
                }
            }
            else if (calc.leadingZero) {
                console.log("nothing before decimal");
                
                switch(c) {
                    case "\u{002b}":
                        calc.previousOp = "ad";
                        calc.enteringNumber = false;
                        break;
                    case "-":
                    case "\u{2212}":
                        calc.previousOp = "su";
                        calc.enteringNumber = (c === "-");
                        break;
                    case "\u{00d7}":
                        calc.previousOp = "mu";
                        calc.enteringNumber = false;
                        break;
                    case "\u{00f7}":
                        calc.previousOp = "di";
                        calc.enteringNumber = false;
                        break;
                    }
                    console.log(calc.previousOp);
            }
    }
    
    else if (/[\u{002b}\u{2212}\u{00d7}\u{00f7}-]/u.test(char)) {
        console.log("abc");
        switch(char) {
            case "-":
                calc.enteringNumber = false;
                calc.previousOp = (str.at(-2) === "\u{00d7}") ? "mu" : "di";
                break;
            default:
                // calc.enteringNumber = true;
                calc.previousOp = "none";

        }
    }


    return str.substr(0, str.length - n);
}

function enteredDigit(event) {
    let input = event.target.textContent;
    let className = event.target.className;
    let id = event.target.id;
    if (!event.isTrusted) {
        input = event.digit;
        className = (input === "\u{002e}") ? "inputs" : "digit";
        id = "decimal";
    }

    if (className === "digit") {
        if (calc.error) {
            clearDisplay(false);
        }

        if (display.textContent.at(-1) === "s") {
            display.textContent += "\u{00d7}";
            calc.ansOnDisplay = false;
        }

        else if (calc.ansOnDisplay) {
            const tempAns = calc.ans;
            clearDisplay(false);
            calc.ans = tempAns;
        }


        if (calc.leadingZero) {
            // if (display.textContent === "-" && event.target.textContent === "0") {
            //     display.textContent += "0";
            //     return;
            // }
            if (display.textContent.at(-1) === "\u{0025}") {
                display.textContent += "\u{00d7}";
                // calc.previousOp = "mu";
                calc.initialState = false;

            }
            switch (input) {
                case "0":
                    display.textContent += (calc.previousOp === "none") ? 
                        "": "0";
                    break;
                default:
                    calc.leadingZero = false;
                    display.textContent = (calc.initialState) ?
                    input :
                        display.textContent + input;
                    calc.initialState = false;
            }
            calc.enteringNumber = true;
            calc.previousOp = "none";
            return;
        }
        calc.previousOp = "none";
        display.textContent += input;
    }
    else if (id === "decimal") {
        if (calc.decimalPresent || display.textContent.at(-1) === "\u{0025}") return;
        else {
            if (display.textContent.at(-1) === "s") {
                display.textContent += "\u{00d7}";
            }
            display.textContent += ".";
            calc.decimalPresent = true;
            calc.leadingZero = false;
            calc.initialState = false;
            calc.enteringNumber = true;
            calc.previousOp = "none";
        }
    }

}

function enteredOperator(event) {
    let input = event.target.textContent;
    let className = event.target.className;
    let id = event.target.id;
    if (!event.isTrusted) {
        input = event.operator;
        className = "operation";
        id = event.opID;
    }

    event.preventDefault();
    if (calc.initialState) {
        if (id === "su") {
            display.textContent = "-";
            calc.initialState = false;
            calc.enteringNumber = true;
            calc.previousOp = "su";
            calc.error = false;
        }
        return;
    }
    else if (calc.ansOnDisplay) {
        calc.ansOnDisplay = false;
    }

    if (className != "operation") return;
  
    if (calc.previousOp === "none") {
        display.textContent += input;
        calc.previousOp = id;
        calc.enteringNumber = false;
        calc.leadingZero = true;
        calc.decimalPresent = false;
        return;
    }

    if (calc.enteringNumber) return;

    switch (calc.previousOp) {
        case "mu":
        case "di":
            calc.enteringNumber = (id === "su");
        default:
            display.textContent = !calc.enteringNumber ?
                (undo(display.textContent, 1) + input) :
                display.textContent + "-";
            calc.previousOp = id;
    }
}

function clearDisplay(warning) {
    if (warning != false) {
        if (!confirm("Are you sure you want to clear the display?"))
            return;
    }
    display.textContent = "0";
    calc.initialState = true;
    calc.leadingZero = true;
    calc.previousOp = "none";
    // calc.ans = 0;
    calc.ansOnDisplay = false;
    calc.decimalPresent = false;
    calc.enteringNumber = true;
    calc.error = false;
    calc.errorMsg = "";
}

function evaluate(expression) {
    let sums = expression.split("\u{002b}");
    let sumVals = [];
    let diffVals = [];
    sums.forEach(exp => {
        let diff = exp.split("\u{2212}");
        sumVals.push(diff[0]);
        if (diff.length > 1) {
            for (let i = 1; i < diff.length; ++i) {
                diffVals.push(`-${diff[i]}`);
            }
        }
    });
    
    sums = sumVals.concat(diffVals);
    console.log(sums);

    let MulAndDiv = function(strX) {
        let strY = strX.replace(/%/g, "\u{00d7}0.01");

        if (calc.ans < 0) {
            console.log(strY);
            strY = strY.replace(/[-\u{2212}]Ans/g, -1*calc.ans);
            console.log(strY);
        }

        strY = strY.replace(/Ans/g, calc.ans);
        let vals = strY.split("\u{00d7}");
        let prodVals = [];
        let divisors = [];
        
        for (let i = 0; i < vals.length; ++i) {
            let divVals = vals[i].split("\u{00f7}");
            prodVals.push(divVals[0]);
            for (let j = 1; j < divVals.length; ++j) {
                divisors.push(divVals[j]);
            }
        }

        let numerator = prodVals.reduce((result, x) => {
            return multiply(result, Number.parseFloat(x));
        }, 1);
        
        let denominator = divisors.reduce((result, x) => {
            return multiply(result, Number.parseFloat(x));
        }, 1);

        if (isNaN(numerator) || isNaN(denominator)) {
            return calcError("Error");
        }
        else if (!denominator) {
            
            return calcError("Error: division by 0");
        }

        return divide(numerator, denominator);
        
    }

    
    const terms = sums.map(MulAndDiv);
    if (calc.error) return calc.errorMsg;
    
    result = terms.reduce((accum, x) => add(accum, x), 0);

    calc.ans = result;
    calc.ansOnDisplay = true;
    calc.enteringNumber = true;
    calc.previousOp = "none";
    
    console.log(calc.ans);
    return result;
}

function calcError(msg) {
    calc.initialState = true;
    calc.ansOnDisplay = false;    
    calc.leadingZero = true;
    calc.enteringNumber = true;
    calc.decimalPresent = false;
    calc.previousOp = "none";
    calc.error = true;
    calc.errorMsg = msg;
    // display.textContent = msg ? msg : "Error";
}


const calc = {
    initialState: true,
    ans: 0,
    ansOnDisplay: false,
    leadingZero: true,
    enteringNumber: true,
    decimalPresent: false,
    previousOp: "none",
    error: false,
    errorMsg: "",
}

const digits = document.querySelector(".digits");
digits.addEventListener("click", enteredDigit);

const operators = document.querySelector(".operations");
operators.addEventListener("click", enteredOperator);

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", clearDisplay);

const evaluateBtn = document.querySelector("#equals");
evaluateBtn.addEventListener("click", () => {
    display.textContent = evaluate(display.textContent);
});

const undoBtn = document.querySelector("#undo");
undoBtn.addEventListener("click", () => display.textContent = undo(display.textContent, 1));

const ansBtn = document.querySelector("#ans");
ansBtn.addEventListener("click", () => {
    // console.log(calc.previousOp);
    if (calc.initialState) {
        display.textContent = "Ans";
        calc.initialState = false;
        // calc.ansOnDisplay = true;
    }
    else if (calc.previousOp != "none") display.textContent += "Ans";
    else display.textContent += "\u{00d7}" + "Ans";
    calc.previousOp = "none";
    calc.decimalPresent = false;
    calc.enteringNumber = true;
});

const percentBtn = document.querySelector("#pct");
percentBtn.addEventListener("click", (event) => {
    if (calc.previousOp != "none") return;
    display.textContent += "\u{0025}";
    calc.leadingZero = true;
    calc.ansOnDisplay = false;
    
});

document.addEventListener("keydown", (event) => {
    const calcInput = new Event("click");

    if (/[\d\.]/.test(event.key) && event.key.length === 1) { 
        calcInput.digit = event.key;
        digits.dispatchEvent(calcInput);
        return;
    }

    else if (/[+\-\*\/]/.test(event.key)) {
        switch (event.key) {
            case "+":
                calcInput.operator = "\u{002b}";
                calcInput.opID = "ad";
                break;
            case "-":
                calcInput.operator = "\u{2212}";
                calcInput.opID = "su";
                break;
            case "*":
                calcInput.operator = "\u{00d7}";
                calcInput.opID = "mu";
                break;
            case "/":
                calcInput.opID = "di";
                calcInput.operator = "\u{00f7}";
        }
        operators.dispatchEvent(calcInput);
        return;
    }

    else if (event.key === "%") {
        percentBtn.dispatchEvent(calcInput);
        return;
    }
    else {

        switch (event.code) {
            case "KeyA":
                ansBtn.dispatchEvent(calcInput);
                return;
            case "Backspace":
                undoBtn.dispatchEvent(calcInput);
                return;
            case "Equal":
            case "Enter":
                evaluateBtn.dispatchEvent(calcInput);
                return;
            
        }
        return;
    }


});