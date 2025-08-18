// BMI Calculator JavaScript
class BMICalculator {
    constructor() {
        this.height = 0;
        this.weight = 0;
        this.bmi = 0;
        this.category = '';
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.heightInput = document.getElementById('height');
        this.heightFtInput = document.getElementById('height-ft');
        this.heightInInput = document.getElementById('height-in');
        this.heightFtInGroup = document.getElementById('height-ft-in-group');
        this.weightInput = document.getElementById('weight');
        this.heightUnit = document.getElementById('height-unit');
        this.weightUnit = document.getElementById('weight-unit');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.resultsContent = document.getElementById('results-content');
    }

    addEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculateBMI());
        this.resetBtn.addEventListener('click', () => this.resetForm());
        
        // Add input validation
        this.heightInput.addEventListener('input', (e) => this.validateInput(e));
        if (this.heightFtInput && this.heightInInput) {
            this.heightFtInput.addEventListener('input', (e) => this.validateInput(e));
            this.heightInInput.addEventListener('input', (e) => this.validateInput(e));
        }
        this.weightInput.addEventListener('input', (e) => this.validateInput(e));
        
        // Add unit change listeners
        this.heightUnit.addEventListener('change', () => {
            this.updatePlaceholders();
            this.toggleHeightInputs();
        });
        this.weightUnit.addEventListener('change', () => this.updatePlaceholders());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.calculateBMI();
            }
        });
        // Initial toggle
        this.toggleHeightInputs();
    }

    toggleHeightInputs() {
        if (this.heightUnit.value === 'ft') {
            this.heightInput.style.display = 'none';
            this.heightFtInGroup.style.display = '';
        } else {
            this.heightInput.style.display = '';
            this.heightFtInGroup.style.display = 'none';
        }
    }

    validateInput(event) {
        const value = event.target.value;
        const numericValue = parseFloat(value);
        
        if (value && (numericValue < 0 || isNaN(numericValue))) {
            event.target.value = '';
            this.showNotification('Please enter a valid positive number', 'error');
        }
    }

    updatePlaceholders() {
        const heightPlaceholders = {
            'cm': 'Enter height in cm',
            'ft': 'Enter height in ft',
            'm': 'Enter height in m'
        };
        
        const weightPlaceholders = {
            'kg': 'Enter weight in kg',
            'lbs': 'Enter weight in lbs'
        };
        
        this.heightInput.placeholder = heightPlaceholders[this.heightUnit.value];
        this.weightInput.placeholder = weightPlaceholders[this.weightUnit.value];
    }

    convertToMetric() {
        let heightInMeters = 0;
        let weightInKg = 0;
        
        // Convert height to meters
        switch (this.heightUnit.value) {
            case 'cm':
                heightInMeters = this.height / 100;
                break;
            case 'ft':
                // Use feet/inch fields
                const ft = parseFloat(this.heightFtInput.value) || 0;
                const inch = parseFloat(this.heightInInput.value) || 0;
                heightInMeters = ((ft * 12) + inch) * 0.0254;
                break;
            case 'm':
                heightInMeters = this.height;
                break;
        }
        
        // Convert weight to kg
        switch (this.weightUnit.value) {
            case 'kg':
                weightInKg = this.weight;
                break;
            case 'lbs':
                weightInKg = this.weight * 0.453592;
                break;
        }
        
        return { heightInMeters, weightInKg };
    }

    calculateBMI() {
        // Get input values
        if (this.heightUnit.value === 'ft') {
            // Use feet/inch fields
            const ft = parseFloat(this.heightFtInput.value);
            const inch = parseFloat(this.heightInInput.value);
            if ((isNaN(ft) || ft < 0) && (isNaN(inch) || inch < 0)) {
                this.showNotification('Please enter height in feet and/or inches', 'error');
                return;
            }
            this.height = ((ft || 0) * 12) + (inch || 0); // store total inches for display
        } else {
            this.height = parseFloat(this.heightInput.value);
        }
        this.weight = parseFloat(this.weightInput.value);
        
        // Validate inputs
        if ((this.heightUnit.value === 'ft' && (!this.heightFtInput.value && !this.heightInInput.value)) || !this.weight) {
            this.showNotification('Please enter both height and weight', 'error');
            return;
        }
        
        if ((this.heightUnit.value !== 'ft' && (!this.height || this.height <= 0)) || this.weight <= 0) {
            this.showNotification('Height and weight must be positive numbers', 'error');
            return;
        }
        
        // Convert to metric units
        const { heightInMeters, weightInKg } = this.convertToMetric();
        
        // Calculate BMI
        this.bmi = weightInKg / (heightInMeters * heightInMeters);
        
        // Determine category
        this.category = this.getBMICategory(this.bmi);
        
        // Display results
        this.displayResults();
        
        // Add success animation
        this.addSuccessAnimation();
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) {
            return 'underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            return 'normal';
        } else if (bmi >= 25 && bmi < 30) {
            return 'overweight';
        } else {
            return 'obese';
        }
    }

    getCategoryDescription(category) {
        const descriptions = {
            underweight: 'Your BMI indicates you are underweight. Consider consulting with a healthcare professional about healthy ways to gain weight.',
            normal: 'Congratulations! Your BMI is within the healthy range. Keep maintaining your healthy lifestyle.',
            overweight: 'Your BMI indicates you are overweight. Consider lifestyle changes like diet and exercise to improve your health.',
            obese: 'Your BMI indicates obesity. It\'s important to consult with a healthcare professional for guidance on weight management.'
        };
        return descriptions[category] || '';
    }

    displayResults() {
        let heightDisplay = '';
        if (this.heightUnit.value === 'ft') {
            const ft = parseFloat(this.heightFtInput.value) || 0;
            const inch = parseFloat(this.heightInInput.value) || 0;
            heightDisplay = `${ft} ft ${inch} in`;
        } else {
            heightDisplay = `${this.height} ${this.heightUnit.value}`;
        }
        const resultHTML = `
            <div class="bmi-result">
                <div class="bmi-value">${this.bmi.toFixed(1)}</div>
                <div class="bmi-category ${this.category}">${this.category.charAt(0).toUpperCase() + this.category.slice(1)}</div>
                <div class="bmi-description">${this.getCategoryDescription(this.category)}</div>
                <div class="bmi-details mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Your Measurements:</h4>
                    <p class="text-gray-600">Height: ${heightDisplay}</p>
                    <p class="text-gray-600">Weight: ${this.weight} ${this.weightUnit.value}</p>
                </div>
            </div>
        `;
        
        this.resultsContent.innerHTML = resultHTML;
        
        // Add animation
        const resultElement = this.resultsContent.querySelector('.bmi-result');
        resultElement.style.animation = 'fadeInScale 0.6s ease-out';
    }

    resetForm() {
        this.heightInput.value = '';
        if (this.heightFtInput && this.heightInInput) {
            this.heightFtInput.value = '';
            this.heightInInput.value = '';
        }
        this.weightInput.value = '';
        this.heightUnit.value = 'cm';
        this.weightUnit.value = 'kg';
        this.toggleHeightInputs();
        this.resultsContent.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">Enter your measurements to see your BMI results</p>
            </div>
        `;
        
        // Reset button animation
        this.addResetAnimation();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    addSuccessAnimation() {
        // Add emoji rain effect based on BMI category
        this.createEmojiRain(this.category);
        // Add button success animation
        this.calculateBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        setTimeout(() => {
            this.calculateBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }, 1000);
    }

    createEmojiRain(category) {
        // Emoji sets for each BMI category
        const emojiSets = {
            underweight: ['😅', '🥲', '🦴', '😬'],
            normal: ['😃', '🥳', '😎', '💪', '🎉'],
            overweight: ['😂', '😅', '🍔', '🍟', '😋'],
            obese: ['😱', '🐷', '😳', '🥵', '🍕']
        };
        const emojis = emojiSets[category] || ['🎉'];
        for (let i = 0; i < 40; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.fontSize = `${28 + Math.random() * 16}px`;
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.top = '-40px';
            emoji.style.pointerEvents = 'none';
            emoji.style.zIndex = '1000';
            emoji.style.opacity = 0.95;
            emoji.style.animation = `emojiRainFall ${2 + Math.random() * 2}s linear forwards`;
            document.body.appendChild(emoji);
            setTimeout(() => {
                document.body.removeChild(emoji);
            }, 4000);
        }
        // Add emoji rain animation CSS if not present
        if (!document.querySelector('#emoji-rain-style')) {
            const style = document.createElement('style');
            style.id = 'emoji-rain-style';
            style.textContent = `
                @keyframes emojiRainFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addResetAnimation() {
        this.resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.resetBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bmiCalculator = new BMICalculator();
    
    // Add floating animation to cards
    const cards = document.querySelectorAll('.calculator-card, .results-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effects to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add tip card animations
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add input focus effects
    const inputs = document.querySelectorAll('.form-input, .unit-select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add particle background effect
    createParticleBackground();
});

// Particle background effect
function createParticleBackground() {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${10 + Math.random() * 20}s linear infinite`;
        
        particleContainer.appendChild(particle);
    }
    
    // Add particle animation CSS
    if (!document.querySelector('#particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
} 