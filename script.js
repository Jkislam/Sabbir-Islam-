
// Mobile Navigation Toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times" aria-hidden="true"></i>' 
                : '<i class="fas fa-bars" aria-hidden="true"></i>';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(item => {
                    item.classList.remove('active');
                });
                link.classList.add('active');
            });
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active nav link based on scroll position
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Portfolio Filtering
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update ARIA attributes
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                const filterValue = button.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Announce filter change for screen readers
                const liveRegion = document.getElementById('filter-announcement') || (() => {
                    const region = document.createElement('div');
                    region.id = 'filter-announcement';
                    region.setAttribute('aria-live', 'polite');
                    region.setAttribute('aria-atomic', 'true');
                    region.style.position = 'absolute';
                    region.style.width = '1px';
                    region.style.height = '1px';
                    region.style.padding = '0';
                    region.style.margin = '-1px';
                    region.style.overflow = 'hidden';
                    region.style.clip = 'rect(0,0,0,0)';
                    region.style.whiteSpace = 'nowrap';
                    region.style.border = '0';
                    document.body.appendChild(region);
                    return region;
                })();
                
                const projectCount = document.querySelectorAll(`.portfolio-item${filterValue === 'all' ? '' : `[data-category="${filterValue}"]`}`).length;
                liveRegion.textContent = `Showing ${projectCount} ${filterValue === 'all' ? 'projects' : filterValue + ' projects'}`;
            });
        });
        
        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Simple form validation
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();
                
                if (!name || !email || !subject || !message) {
                    showFormMessage('Please fill in all required fields.', 'error');
                    return;
                }
                
                if (!validateEmail(email)) {
                    showFormMessage('Please enter a valid email address.', 'error');
                    return;
                }
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                try {
                    // In production, this would be a real fetch request
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.backgroundColor = '#10B981';
                    
                    showFormMessage('Thank you! I\'ll get back to you within 24 hours.', 'success');
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        contactForm.reset();
                    }, 3000);
                    
                } catch (error) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showFormMessage('Something went wrong. Please try again or email me directly.', 'error');
                }
            });
        }
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function showFormMessage(text, type) {
            // Remove existing messages
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) existingMessage.remove();
            
            const message = document.createElement('div');
            message.className = `form-message ${type}`;
            message.style.cssText = `
                background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                text-align: center;
            `;
            message.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;
            
            contactForm.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }
        
        // Add intersection observer for animations
        const skillCards = document.querySelectorAll('.skill-card');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Initialize animations and SEO enhancements
        document.addEventListener('DOMContentLoaded', () => {
            // Animate elements on scroll
            skillCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
            
            // Set initial active nav link
            document.querySelector('.nav-links a[href="#home"]').classList.add('active');
            
            // Add loading="lazy" to images (for when you add real images)
            document.querySelectorAll('img').forEach(img => {
                img.setAttribute('loading', 'lazy');
            });
            
            // Update copyright year
            const yearSpan = document.querySelector('#current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
            
            // Log page view for analytics (in production, you'd use Google Analytics)
            console.log('Portfolio page loaded - SEO optimized version');
        });
        
        // Performance optimization: Preload critical resources
        const preloadFonts = document.createElement('link');
        preloadFonts.rel = 'preload';
        preloadFonts.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
        preloadFonts.as = 'style';
        document.head.appendChild(preloadFonts);
