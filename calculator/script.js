// Calculator JavaScript
class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');
        
        if (currentOperandElement) {
            currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        }
        
        if (previousOperandElement) {
            if (this.operation != null) {
                previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
            } else {
                previousOperandElement.textContent = '';
            }
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Button click functions
function appendNumber(number) {
    calculator.appendNumber(number);
    calculator.updateDisplay();
    addButtonEffect(event);
}

function chooseOperation(operation) {
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
    addButtonEffect(event);
}

function calculate() {
    calculator.calculate();
    calculator.updateDisplay();
    addButtonEffect(event);
}

function clearAll() {
    calculator.clear();
    calculator.updateDisplay();
    addButtonEffect(event);
}

function deleteLast() {
    calculator.delete();
    calculator.updateDisplay();
    addButtonEffect(event);
}

function toggleSign() {
    calculator.toggleSign();
    calculator.updateDisplay();
    addButtonEffect(event);
}

function appendDecimal() {
    calculator.appendNumber('.');
    calculator.updateDisplay();
    addButtonEffect(event);
}

// Button effect function
function addButtonEffect(event) {
    if (event && event.target) {
        const button = event.target.closest('.btn');
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }
    }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Number keys
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    }
    
    // Decimal point
    if (key === '.') {
        appendDecimal();
    }
    
    // Operators
    if (key === '+') {
        chooseOperation('+');
    }
    if (key === '-') {
        chooseOperation('-');
    }
    if (key === '*') {
        chooseOperation('×');
    }
    if (key === '/') {
        event.preventDefault();
        chooseOperation('÷');
    }
    
    // Enter or equals
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    
    // Backspace
    if (key === 'Backspace') {
        deleteLast();
    }
    
    // Escape or clear
    if (key === 'Escape') {
        clearAll();
    }
    
    // Plus/minus
    if (key === '±') {
        toggleSign();
    }
});

// Add click effects to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            addButtonEffect(event);
        });
        
        // Add ripple effect
        button.addEventListener('mousedown', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.animation = 'ripple 0.6s linear';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize display
calculator.updateDisplay();

// Add some fun animations
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to calculator container
    const container = document.querySelector('.calculator-container');
    if (container) {
        container.style.animation = 'float 6s ease-in-out infinite';
    }
    
    // Add floating animation CSS
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(floatStyle);
    
    // Add particle effect
    createParticles();
});

// Particle effect
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${5 + Math.random() * 10}s linear infinite`;
        particleContainer.appendChild(particle);
    }
    
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
} 