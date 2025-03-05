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
        return "Error: division by 0";
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

// let expression = "";

function undo(str, n) {
    return str.substr(0, str.length - n);
}

function enteredDigit(event) {
    event.preventDefault();
    if (event.target.className === "digit") {
        if (calc.ansOnDisplay) {
            const tempAns = calc.ans;
            clearDisplay(false);
            calc.ans = tempAns;
        }


        if (calc.leadingZero) {
            if (display.textContent === "-" && event.target.textContent === "0") {
                clearDisplay(false);
                return;
            }
            switch (event.target.textContent) {
                case "0":
                    display.textContent += (calc.previousOp === "none") ? "" : "0";
                    break;
                default:
                    calc.leadingZero = false;
                    display.textContent = (calc.previousOp === "none") ?
                        (undo(display.textContent, 1) + event.target.textContent) :
                        display.textContent + event.target.textContent;
                    calc.initialState = false;
            }
            calc.previousOp = "none";
            return;
        }
        calc.previousOp = "none";
        display.textContent += event.target.textContent;
    }
    else if (event.target.id === "decimal") {
        if (calc.decimalPresent) return;
        else {
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
    event.preventDefault();
    if (calc.initialState) {
        if (event.target.id === "su") {
            display.textContent = "-";
            calc.initialState = false;
            calc.enteringNumber = true;
            calc.previousOp = "su";
        }
        return;
    }
    else if (calc.ansOnDisplay) {
        calc.ansOnDisplay = false;
    }

    if (event.target.className != "operation") return;
    

    if (calc.previousOp === "none") {
        display.textContent += event.target.textContent;
        calc.previousOp = event.target.id;
        calc.enteringNumber = false;
        calc.leadingZero = true;
        calc.decimalPresent = false;
        return;
    }

    if (calc.enteringNumber) return;

    switch (calc.previousOp) {
        case "mu":
        case "di":
            calc.enteringNumber = (event.target.id === "su");
        default:
            display.textContent = !calc.enteringNumber ?
                (undo(display.textContent, 1) + event.target.textContent) :
                display.textContent + "-";
            calc.previousOp = event.target.id;
    }




}

// const digits = document.querySelectorAll(".digit");
const digits = document.querySelector(".digits");
digits.addEventListener("click", enteredDigit);

const operators = document.querySelector(".operations");
operators.addEventListener("click", enteredOperator);

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", clearDisplay);

function clearDisplay(warning) {
    if (warning != false) {
        if (!confirm("Are you sure you want to clear the display?"))
            return;
    }
    display.textContent = "0";
    calc.initialState = true;
    calc.leadingZero = true;
    calc.previousOp = "none";
    calc.ans = 0;
    calc.ansOnDisplay = false;
    calc.decimalPresent = false;
    calc.enteringNumber = true;
}

const evaluateBtn = document.querySelector("#equals");
evaluateBtn.addEventListener("click", () => {
    display.textContent = evaluate(display.textContent);
});

function evaluate(expression) {
    let sums = expression.split("\u{002b}");
    // console.log(sums);
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
        let vals = strX.split("\u{00d7}");
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

        // console.log(`num: ${numerator}\ndenom: ${denominator}`);

        // console.log(`prodVals: ${prodVals}\ndivisors: ${divisors}`);
        // console.log(typeof numerator);

        return divide(numerator, denominator);
        
    }

    const terms = sums.map(MulAndDiv);
    
    result = terms.reduce((accum, x) => add(accum, x), 0);

    calc.ans = result;
    calc.ansOnDisplay = true;
    calc.enteringNumber = true;
    

    return result;
}

const ansBtn = document.querySelector("#ans");
ansBtn.addEventListener("click", () => {
    if (calc.enteringNumber) display.textContent += calc.ans;
});

const calc = {
    initialState: true,
    ans: 0,
    ansOnDisplay: false,

    leadingZero: true,

    enteringNumber: true,
    decimalPresent: false,

    previousOp: "none",
}
