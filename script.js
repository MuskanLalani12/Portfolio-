document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scroll ---
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = window.scrollY;
    });

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        body.classList.toggle('blur-content');
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('blur-content');
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // --- Mouse Move Glow Effect for Cards ---
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'block';
                    // Small timeout to allow display:block to apply before opacity transition if we added one
                    setTimeout(() => project.classList.remove('hidden'), 10);
                } else {
                    project.classList.add('hidden');
                    setTimeout(() => project.style.display = 'none', 300); // Wait for transition
                }
            });
        });
    });

    // --- Form Validation ---
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const inputs = form.querySelectorAll('input, textarea');

            inputs.forEach(input => {
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    errorMsg.style.display = 'block';
                } else {
                    input.classList.remove('error');
                    errorMsg.style.display = 'none';

                    // Basic email validation
                    if (input.type === 'email') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            errorMsg.innerText = "Please enter a valid email address";
                            errorMsg.style.display = 'block';
                        }
                    }
                }
            });

            if (isValid) {
                alert('Thanks for your message! This is a demo form.');
                form.reset();
            }
        });
    }
});
