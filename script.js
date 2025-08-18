// WebCraft Pro - JavaScript Functionality

// Hero Image Slider Variables
let currentSlideIndex = 0;
let slideInterval;
let isUserInteracting = false;
const slideDuration = 5000; // 5 seconds per slide

// Hero Image Slider Functions
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    if (slides.length === 0) return;
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlideIndex = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
        showSlide(prevIndex);
    }
    
    // Start auto-play
    function startAutoPlay() {
        if (isUserInteracting) return;
        
        slideInterval = setInterval(() => {
            if (!isUserInteracting) {
                nextSlide();
            }
        }, slideDuration);
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            isUserInteracting = true;
            stopAutoPlay();
            
            // Resume auto-play after 3 seconds
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        });
    });
    
    // Event listeners for navigation arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            isUserInteracting = true;
            stopAutoPlay();
            
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            isUserInteracting = true;
            stopAutoPlay();
            
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        });
    }
    
    // Pause auto-play when user hovers over slider
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopAutoPlay();
        });
        
        heroSection.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startAutoPlay();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            isUserInteracting = true;
            stopAutoPlay();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            isUserInteracting = true;
            stopAutoPlay();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 3000);
        }
    });
    
    // Start auto-play when slider is visible
    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        });
    }, { threshold: 0.3 });
    
    sliderObserver.observe(heroSection);
    
    // Initialize first slide
    showSlide(0);
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Hero Image Slider
    initHeroSlider();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    // Only apply navbar scroll effect on the home page
    if (document.body.id === 'home-page') {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-black', 'shadow-lg');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('bg-black', 'shadow-lg');
                navbar.classList.add('bg-transparent');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .hero-content, .stats');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Form handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.card.bg-primary form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Blog search functionality
    const searchInput = document.querySelector('.join input[placeholder="Search articles..."]');
    const searchBtn = document.querySelector('.join button');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Simulate search
                showNotification(`Searching for: "${searchTerm}"`, 'info');
                // In a real application, you would filter articles here
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Service card interactions
    const serviceCards = document.querySelectorAll('#services .card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click handler for "Learn More" buttons
        const learnMoreBtn = this.querySelector('.btn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceTitle = this.closest('.card').querySelector('.card-title').textContent;
                showNotification(`Learn more about ${serviceTitle}`, 'info');
            });
        }
    });

    // Service Modal Functions
    function openServiceModal(serviceId) {
        const modal = document.getElementById(`${serviceId}-modal`);
        if (modal) {
            modal.showModal();
        }
    }

    // Make function globally available
    window.openServiceModal = openServiceModal;

    // Portfolio card interactions
    const portfolioCards = document.querySelectorAll('#portfolio .card');
    portfolioCards.forEach(card => {
        const viewProjectBtn = card.querySelector('.btn');
        if (viewProjectBtn) {
            viewProjectBtn.addEventListener('click', function(e) {
                // Check if this is an external link (has href attribute)
                if (this.hasAttribute('href') && this.getAttribute('href') !== '#') {
                    // Allow the link to work normally
                    return;
                }
                
                // Only prevent default for internal buttons
                e.preventDefault();
                const projectTitle = this.closest('.card').querySelector('.card-title').textContent;
                showNotification(`Viewing project: ${projectTitle}`, 'info');
            });
        }
    });

    // Blog article interactions
    const blogCards = document.querySelectorAll('.blog-card, article.card');
    blogCards.forEach(card => {
        const readMoreBtn = card.querySelector('.btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const articleTitle = this.closest('.card, article').querySelector('.card-title, h2, h3').textContent;
                showNotification(`Reading article: ${articleTitle}`, 'info');
            });
        }
    });

    // Category filtering (for blog)
    const categoryLinks = document.querySelectorAll('.card-body a[href="#"]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.split('(')[0].trim();
            showNotification(`Filtering by category: ${category}`, 'info');
        });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.footer a i');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.split('fa-')[1];
            showNotification(`Opening ${platform} profile`, 'info');
        });
    });

    // Theme toggle (if implemented)
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            showNotification(`Switched to ${newTheme} theme`, 'success');
        });
    }

    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fixed top-20 right-4 z-50 max-w-sm`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="btn btn-sm btn-circle" onclick="this.parentElement.remove()">✕</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-value');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                if (numericValue > 0) {
                    animateCounter(target, 0, numericValue, 2000);
                }
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const suffix = element.textContent.replace(/\d/g, '');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[src^="https://images.unsplash.com"]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.onload = function() {
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Mobile menu toggle enhancement
    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        const mobileMenuModal = document.getElementById('mobile-menu-modal');

        if (mobileMenuBtn && mobileMenuModal) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenuModal.showModal();
            });

            // Close modal when a menu item is clicked (for smooth scrolling links)
            const menuLinks = mobileMenuModal.querySelectorAll('.menu a[href^="#"]');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuModal.close();
                });
            });

            // Close modal when a calculator link is clicked
            const calculatorLinks = mobileMenuModal.querySelectorAll('.menu ul a');
            calculatorLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuModal.close();
                });
            });
        }
    }

    // Make the function globally available
    window.initializeMobileMenu = initializeMobileMenu;

    // Call it on DOMContentLoaded for the main page
    initializeMobileMenu();

    // Close mobile menu when clicking outside - DaisyUI dialog handles this automatically
    /*
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.querySelector('.btn')?.classList.remove('active');
            });
        }
    });
    */

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Handle scroll-based animations or effects here
        }, 100);
    });

    console.log('WebCraft Pro - Website loaded successfully! 🚀');
}); 