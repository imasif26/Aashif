document.addEventListener('DOMContentLoaded', () => {

    // 1. Spotlight Hover Effect for Glass Panels
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Scroll Reveal Animation using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If this section has counters, trigger them
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0 && !entry.target.classList.contains('counted')) {
                    startCounters(counters);
                    entry.target.classList.add('counted');
                }
                
                // Optional: unobserve if you only want the animation to happen once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // 3. Animated Number Counters
    const startCounters = (counters) => {
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / target));
            
            const updateCounter = () => {
                const current = +counter.innerText.replace(/,/g, '');
                let increment = target / 50; 
                if (increment < 1) increment = 1;

                if (current < target) {
                    counter.innerText = Math.ceil(current + increment).toLocaleString();
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            
            updateCounter();
        });
    };

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // 5. Parallax Background Effect
    const glowBg = document.querySelector('.glow-bg');
    if (glowBg) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                glowBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            });
        });
    }

    // 6. Staggered Reveals for Grids
    const staggerGrids = document.querySelectorAll('.grid-3, .cert-grid, .testimonials-grid');
    staggerGrids.forEach(grid => {
        const children = Array.from(grid.children);
        children.forEach((child, index) => {
            const staggerDelay = (index % 4) + 1;
            child.classList.add(`stagger-${staggerDelay}`);
            if (!child.classList.contains('reveal')) {
                child.classList.add('reveal');
                observer.observe(child);
            }
        });
    });

    // 7. Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
});
