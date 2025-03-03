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

let expression = "";

function undo(str, n) {
    return str.substr(0, str.length - n);
}

function enteredDigit(event) {
    event.preventDefault();
    if (event.target.className === "digit") {
        if (calc.leadingZero) {
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
                display.textContent + event.target.textContent;
            calc.previousOp = event.target.id;
    }




}

// const digits = document.querySelectorAll(".digit");
const digits = document.querySelector(".digits");
digits.addEventListener("click", enteredDigit);

const operators = document.querySelector(".operations");
operators.addEventListener("click", enteredOperator);

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", (event) => {
    if (confirm("Are you sure you want to clear the display?")) {
        display.textContent = "0";
        calc.initialState = true;
        calc.leadingZero = true;
        calc.previousOp = "none";
        calc.ans = 0;
        calc.ansOnDisplay = false;
        calc.decimalPresent = false;
        calc.enteringNumber = true;
    }
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
