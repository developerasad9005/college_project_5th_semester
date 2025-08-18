// Age Calculator JavaScript
class AgeCalculator {
    constructor() {
        this.birthDate = null;
        this.currentDate = new Date();
        this.initializeElements();
        this.addEventListeners();
        this.setMaxDate();
    }

    initializeElements() {
        this.birthDateInput = document.getElementById('birth-date');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.resultsContent = document.getElementById('results-content');
        this.ageBreakdown = document.getElementById('age-breakdown');
        this.birthdayCountdown = document.getElementById('birthday-countdown');
        
        // Breakdown elements
        this.yearsValue = document.getElementById('years-value');
        this.monthsValue = document.getElementById('months-value');
        this.daysValue = document.getElementById('days-value');
        this.hoursValue = document.getElementById('hours-value');
        
        // Countdown elements
        this.countdownDays = document.getElementById('countdown-days');
        this.countdownHours = document.getElementById('countdown-hours');
        this.countdownMinutes = document.getElementById('countdown-minutes');
        this.countdownSeconds = document.getElementById('countdown-seconds');
    }

    addEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculateAge());
        this.resetBtn.addEventListener('click', () => this.resetForm());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.calculateAge();
            }
        });
        
        // Add input change listener
        this.birthDateInput.addEventListener('change', () => {
            this.validateDate();
        });
    }

    setMaxDate() {
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        this.birthDateInput.max = maxDate;
    }

    validateDate() {
        const selectedDate = new Date(this.birthDateInput.value);
        const today = new Date();
        
        if (selectedDate > today) {
            this.showNotification('Birth date cannot be in the future', 'error');
            this.birthDateInput.value = '';
            return false;
        }
        
        return true;
    }

    calculateAge() {
        if (!this.birthDateInput.value) {
            this.showNotification('Please select your birth date', 'error');
            return;
        }
        
        if (!this.validateDate()) {
            return;
        }
        
        this.birthDate = new Date(this.birthDateInput.value);
        this.currentDate = new Date();
        
        const ageData = this.getAgeData();
        this.displayResults(ageData);
        this.updateBreakdown(ageData);
        this.startCountdown();
        
        // Show sections
        this.ageBreakdown.style.display = 'block';
        this.birthdayCountdown.style.display = 'block';
        
        // Add success animation
        this.addSuccessAnimation();
    }

    getAgeData() {
        const diffTime = this.currentDate - this.birthDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffSeconds = Math.floor(diffTime / 1000);
        
        // Calculate years, months, and days
        const years = this.calculateYears();
        const months = this.calculateMonths();
        const days = this.calculateDays();
        
        return {
            years,
            months,
            days,
            totalDays: diffDays,
            totalHours: diffHours,
            totalMinutes: diffMinutes,
            totalSeconds: diffSeconds
        };
    }

    calculateYears() {
        let years = this.currentDate.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = this.currentDate.getMonth() - this.birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && this.currentDate.getDate() < this.birthDate.getDate())) {
            years--;
        }
        
        return years;
    }

    calculateMonths() {
        let months = this.currentDate.getMonth() - this.birthDate.getMonth();
        if (months < 0) {
            months += 12;
        }
        
        if (this.currentDate.getDate() < this.birthDate.getDate()) {
            months--;
            if (months < 0) {
                months = 11;
            }
        }
        
        return months;
    }

    calculateDays() {
        const currentDay = this.currentDate.getDate();
        const birthDay = this.birthDate.getDate();
        
        if (currentDay >= birthDay) {
            return currentDay - birthDay;
        } else {
            const lastMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
            return lastMonth.getDate() - birthDay + currentDay;
        }
    }

    displayResults(ageData) {
        const resultHTML = `
            <div class="age-result">
                <div class="age-value">${ageData.years}</div>
                <div class="age-description">
                    <p class="mb-2">You are <strong>${ageData.years} years, ${ageData.months} months, and ${ageData.days} days</strong> old.</p>
                    <p class="text-sm text-gray-500">That's approximately:</p>
                    <ul class="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• ${ageData.totalDays.toLocaleString()} days</li>
                        <li>• ${ageData.totalHours.toLocaleString()} hours</li>
                        <li>• ${ageData.totalMinutes.toLocaleString()} minutes</li>
                        <li>• ${ageData.totalSeconds.toLocaleString()} seconds</li>
                    </ul>
                </div>
                <div id="bengali-fun-message" class="mt-8"></div>
            </div>
        `;
        this.resultsContent.innerHTML = resultHTML;
        // Add animation
        const resultElement = this.resultsContent.querySelector('.age-result');
        resultElement.style.animation = 'fadeInScale 0.6s ease-out';

        // Bengali fun message logic (inside results box)
        const msgDiv = document.getElementById('bengali-fun-message');
        let msg = '';
        let btn = '';
        let isThirtyPlus = false;
        if (ageData.years < 18) {
            msg = `<div class='font-baloo fun-animate text-pink-700 text-lg'>👶 বাবু মন দিয়ে পড়াশুনা কর, মেয়ের পাল্লায় পড়িও না!</div><div class='font-baloo fun-animate text-pink-600 mt-2'>আর মেয়েরা সে কিন্তু তোমাকে অনেক বোঝানোর চেষ্টা করবে, ভুল করেও তার কথা বিশ্বাস করিও না!</div>`;
        } else if (ageData.years >= 18 && ageData.years <= 21) {
            msg = `<div class='font-baloo fun-animate text-pink-700 text-lg'>⏳ ছেলেরা,আর কিছুদিন অপেক্ষা কর, তোমার জন্য রাজকন্যা অপেক্ষা করছে!</div><div class='font-baloo fun-animate text-pink-600 mt-2'>যদি তুমি প্রোগ্রামার হতে পার, তাই শেখায় মন দাও, মেয়েদের অভিনয়ে না!</div><div class='font-baloo fun-animate text-pink-600 mt-2'>✋আর মেয়েরা তোমরা রান্নায় মন দেও টিকটক এ না!</div>`;
        } else if (ageData.years >= 22 && ageData.years < 30) {
            msg = `<div class='font-baloo fun-animate text-pink-700 text-lg'>💍 বয়স তো হয়ে গেছে, বিয়ে টা করে ফেল!</div>`;
            btn = `<button id='yes-btn' class='mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg font-bold shadow fun-animate hover:bg-pink-700 transition'>বিয়ে করেছি!🙂</button><div id='yes-msg' class='mt-3 font-baloo text-green-600 font-bold'></div>`;
        } else if (ageData.years >= 30) {
            msg = `<div class='font-baloo fun-animate text-pink-700 text-lg'>😅 নাহ, তোমার দ্বারা হবেনা, বুড়ো হয়ে গেছো এখনো বিয়ের নাম নেই!</div><div class='font-baloo fun-animate text-pink-600 mt-2'>আর যদি বিয়ে করেই থাকো, তাহলে নিচের বাটনে চাপ দাও!</div>`;
            btn = `<button id='yes-btn' class='mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg font-bold shadow fun-animate hover:bg-pink-700 transition'>বিয়ে করেছি!🙂</button><div id='yes-msg' class='mt-3 font-baloo text-green-600 font-bold'></div>`;
            isThirtyPlus = true;
        } else {
            msg = `<div class='font-baloo fun-animate text-pink-700 text-lg'>🤔 বয়সটা ঠিকঠাক দাও তো!</div>`;
        }
        msgDiv.innerHTML = `${msg}${btn}`;
        // Yes button event
        const yesBtn = document.getElementById('yes-btn');
        if (yesBtn) {
            yesBtn.onclick = function() {
                if (isThirtyPlus) {
                    document.getElementById('yes-msg').innerHTML = "🎉 Congratulations! সকিনার নানু/নানি!👴👵";
                } else {
                    document.getElementById('yes-msg').innerHTML = "🎉 Congratulations  জরিনার আব্বু/আম্মু!🧑‍🦳👩‍🦳";
                }
            };
        }
    }

    updateBreakdown(ageData) {
        // Animate the values
        this.animateValue(this.yearsValue, ageData.years);
        this.animateValue(this.monthsValue, ageData.totalDays / 30.44);
        this.animateValue(this.daysValue, ageData.totalDays);
        this.animateValue(this.hoursValue, ageData.totalHours);
    }

    animateValue(element, targetValue) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (targetValue - startValue) * this.easeOutQuart(progress);
            
            if (targetValue >= 1000) {
                element.textContent = Math.floor(currentValue).toLocaleString();
            } else {
                element.textContent = currentValue.toFixed(1);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    startCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date();
        const nextBirthday = this.getNextBirthday();
        const diff = nextBirthday - now;
        
        if (diff <= 0) {
            // Birthday is today!
            this.countdownDays.textContent = '0';
            this.countdownHours.textContent = '0';
            this.countdownMinutes.textContent = '0';
            this.countdownSeconds.textContent = '0';
            
            // Add birthday celebration
            this.celebrateBirthday();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.countdownDays.textContent = days;
        this.countdownHours.textContent = hours;
        this.countdownMinutes.textContent = minutes;
        this.countdownSeconds.textContent = seconds;
    }

    getNextBirthday() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const birthMonth = this.birthDate.getMonth();
        const birthDay = this.birthDate.getDate();
        
        let nextBirthday = new Date(currentYear, birthMonth, birthDay);
        
        if (nextBirthday < now) {
            nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
        }
        
        return nextBirthday;
    }

    celebrateBirthday() {
        // Create birthday celebration effect
        this.createBirthdayConfetti();
        this.showNotification('🎉 Happy Birthday! 🎉', 'success');
    }

    createBirthdayConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = `birthdayConfetti ${3 + Math.random() * 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 5000);
        }
        
        // Add birthday confetti animation CSS
        if (!document.querySelector('#birthday-confetti-style')) {
            const style = document.createElement('style');
            style.id = 'birthday-confetti-style';
            style.textContent = `
                @keyframes birthdayConfetti {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    resetForm() {
        this.birthDateInput.value = '';
        this.resultsContent.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-clock text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">Enter your birth date to see your age details</p>
            </div>
        `;
        this.ageBreakdown.style.display = 'none';
        this.birthdayCountdown.style.display = 'none';
        // Reset button animation
        this.addResetAnimation();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'error' ? 'fa-exclamation-triangle' : 
                    type === 'success' ? 'fa-check-circle' : 
                    'fa-info-circle'
                } mr-2"></i>
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
        // Add confetti effect
        this.createConfetti();
        
        // Add button success animation
        this.calculateBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        setTimeout(() => {
            this.calculateBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }, 1000);
    }

    addResetAnimation() {
        this.resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.resetBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 4000);
        }
        
        // Add confetti animation CSS
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ageCalculator = new AgeCalculator();
    
    // Add floating animation to cards
    const cards = document.querySelectorAll('.calculator-card, .results-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effects to breakdown cards
    const breakdownCards = document.querySelectorAll('.breakdown-card');
    breakdownCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add milestone card animations
    const milestoneCards = document.querySelectorAll('.milestone-card');
    milestoneCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add fact card animations
    const factCards = document.querySelectorAll('.fact-card');
    factCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add input focus effects
    const inputs = document.querySelectorAll('.form-input');
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