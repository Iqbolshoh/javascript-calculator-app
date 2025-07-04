
const historyBtn = document.querySelector('.history-btn');
const historyPanel = document.querySelector('.history-panel');
const closeHistoryBtn = document.querySelector('.close-history');
const clearHistoryBtn = document.querySelector('.clear-history');
const historyItems = document.querySelector('.history-items');
const previousOperand = document.querySelector('.previous-operand');
const currentOperand = document.querySelector('.current-operand');
const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const percentButton = document.querySelector('.percent');

let calculationHistory = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

function initCalculator() {
    currentOperand.textContent = '0';
    updateHistoryDisplay();
}

historyBtn.addEventListener('click', () => historyPanel.classList.add('active'));
closeHistoryBtn.addEventListener('click', () => historyPanel.classList.remove('active'));

clearHistoryBtn.addEventListener('click', () => {
    calculationHistory = [];
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
});

function updateHistoryDisplay() {
    historyItems.innerHTML = calculationHistory.length
        ? ''
        : '<div class="no-history"><i class="fas fa-info-circle"></i> No calculations yet</div>';

    calculationHistory.slice().reverse().forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        historyItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            </div>
            <button class="delete-history-item" data-index="${calculationHistory.length - 1 - index}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        historyItem.querySelector('.history-item-content').addEventListener('click', () => {
            previousOperand.textContent = item.expression;
            currentOperand.textContent = item.result;
            historyPanel.classList.remove('active');
        });

        historyItem.querySelector('.delete-history-item').addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            calculationHistory.splice(index, 1);
            localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
            updateHistoryDisplay();
        });

        historyItems.appendChild(historyItem);
    });
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === '.' && currentOperand.textContent.includes('.')) return;
        currentOperand.textContent = currentOperand.textContent === '0' && value !== '.'
            ? value
            : currentOperand.textContent + value;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lastChar = currentOperand.textContent.slice(-1);
        const operator = button.textContent;
        if (currentOperand.textContent === '') return;
        currentOperand.textContent = isOperator(lastChar)
            ? currentOperand.textContent.slice(0, -1) + operator
            : currentOperand.textContent + operator;
    });
});

function isOperator(char) {
    return ['+', '-', '×', '÷'].includes(char);
}

clearButton.addEventListener('click', () => {
    previousOperand.textContent = '';
    currentOperand.textContent = '0';
});

backspaceButton.addEventListener('click', () => {
    currentOperand.textContent = currentOperand.textContent.slice(0, -1) || '0';
});

percentButton.addEventListener('click', () => {
    const value = currentOperand.textContent;
    if (value && !isNaN(value)) currentOperand.textContent = parseFloat(value) / 100;
});

equalsButton.addEventListener('click', () => {
    const expression = currentOperand.textContent;
    if (!expression) return;

    try {
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));

        calculationHistory.push({ expression, result });
        if (calculationHistory.length > 20) calculationHistory.shift();

        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        previousOperand.textContent = expression;
        currentOperand.textContent = result;
        updateHistoryDisplay();
    } catch {
        currentOperand.textContent = 'Error';
    }
});

initCalculator();
