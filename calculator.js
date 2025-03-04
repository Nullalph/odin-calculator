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
evaluateBtn.addEventListener("click", () => evaluate(display.textContent));

function evaluate(expression) {
    const sums = expression.split("\u{002b}");
    console.log(sums);
    let sumVals = [];
    let diffVals = [];
    sums.forEach(exp => {
        let diff = exp.split("\u{2212}");
        sumVals.push(diff[0]);
        if (diff.length > 1) {
            for (let i = 1; i < diff.length; ++i) {
                diffVals.push(`-${diff[i]}`);
            }
            return false;
        }
        else {
            console.log("sum: " + sums);
            return true;
        }

    });
    
    console.log(sumVals);
    console.log(diffVals);

    
}

const calc = {
    initialState: true,
    ans: 0,
    ansOnDisplay: false,

    leadingZero: true,

    enteringNumber: true,
    decimalPresent: false,

    previousOp: "none",
}
