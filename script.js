document.addEventListener('DOMContentLoaded', () => {

    // 1. Cursor Ring (decorative overlay only — never hides the native cursor)
    const cursorRing = document.querySelector('.cursor-ring');
    if (cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorRing.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorRing.classList.add('is-visible');
            });
        });

        document.addEventListener('mouseleave', () => cursorRing.classList.remove('is-visible'));

        const activeTargets = document.querySelectorAll(
            'a, button, .btn-primary, .btn-secondary, .prod-btn, .case-study-card, .mobile-nav-toggle'
        );
        activeTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
        });

        const readonlyTarget = document.querySelector('.wf-execution-log');
        if (readonlyTarget) {
            readonlyTarget.addEventListener('mouseenter', () => cursorRing.classList.add('is-readonly'));
            readonlyTarget.addEventListener('mouseleave', () => cursorRing.classList.remove('is-readonly'));
        }
    }

    // 2. Spotlight Hover Effect for Glass Panels
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

    // 3. Scroll Reveal Animation using IntersectionObserver
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

    // 4. Animated Number Counters
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

    // 5. Smooth scrolling for anchor links
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
    // 6. Parallax Background Effect
    const glowBg = document.querySelector('.glow-bg');
    if (glowBg) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                glowBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            });
        });
    }

    // 7. Staggered Reveals for Grids
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

    // 8. Mobile Navigation Toggle
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
