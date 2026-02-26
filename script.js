// State Management
let currentInput = '0';
let previousInput = '';
let operator = null;
let history = JSON.parse(localStorage.getItem('calc-history')) || [];

const currentOpText = document.getElementById('current-op');
const prevOpText = document.getElementById('prev-op');
const previewText = document.getElementById('preview');
const historyList = document.getElementById('history-list');

// Initialize
window.onload = () => {
    document.getElementById('loader').style.display = 'none';
    updateDisplay();
    renderHistory();
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
};

// Core Logic
function appendNumber(number) {
    if (currentInput === '0' && number !== '.') currentInput = '';
    if (number === '.' && currentInput.includes('.')) return;
    currentInput += number;
    updateDisplay();
    calculatePreview();
}

function appendOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') compute();
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': 
            computation = current === 0 ? "Error" : prev / current; 
            break;
        case '%': computation = prev % current; break;
        default: return;
    }

    addToHistory(`${previousInput} ${operator} ${currentInput} = ${computation}`);
    currentInput = computation.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}

// Advanced Features
function specialFunc(type) {
    let val = parseFloat(currentInput);
    switch(type) {
        case 'sqrt': currentInput = Math.sqrt(val).toFixed(4); break;
        case 'pow2': currentInput = Math.pow(val, 2); break;
        case 'random': currentInput = Math.floor(Math.random() * 100); break;
    }
    updateDisplay();
}

// Theme Management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function updateDisplay() {
    currentOpText.innerText = currentInput;
    prevOpText.innerText = operator ? `${previousInput} ${operator}` : '';
}

function calculatePreview() {
    if (operator && currentInput !== '') {
        try {
            const res = eval(`${previousInput}${operator}${currentInput}`);
            previewText.innerText = `= ${res}`;
        } catch { previewText.innerText = ''; }
    } else { previewText.innerText = ''; }
}

// History
function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) history.pop();
    localStorage.setItem('calc-history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

// Keyboard Support
window.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearAll();
    if (['+', '-', '*', '/', '%'].includes(e.key)) appendOperator(e.key);
});

function toggleAdvanced() {
    document.getElementById('advanced-panel').classList.toggle('hidden');
}