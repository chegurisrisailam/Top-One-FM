document.addEventListener('DOMContentLoaded', () => {

    /* ===== Navbar Active Link ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    /* ===== Counter Animation ===== */
    const counters = document.querySelectorAll('.count');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const triggerPoint = counters[0]?.closest('.stats-section').offsetTop - 200;
        if (window.scrollY >= triggerPoint) {
            countersStarted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const increment = target / 80;
                let current = 0;

                const update = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current) + '+';
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                update();
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    /* ===== Scroll Reveal ===== */
    const revealElements = document.querySelectorAll('.service-card, .stat-item, .hero-section > .container');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.service-card, .stat-item').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    /* ===== Contact Form (Web3Forms AJAX Submission) ===== */
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                btn.classList.remove('btn-warning');
                btn.classList.add('btn-success');

                showToast('Thank you! Your message has been received. We will get back to you shortly.', 'success');
                contactForm.reset();
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Unable to send message. Please check your internet connection.', 'error');
        } finally {
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-warning');
                btn.disabled = false;
            }, 3000);
        }
    });

    /* ===== Newsletter Form (Web3Forms AJAX Submission) ===== */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('newsletterBtn');
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        btn.disabled = true;

        const formData = new FormData(newsletterForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showToast('Thank you for subscribing to our newsletter!', 'success');
                newsletterForm.reset();
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Unable to submit. Please check your internet connection.', 'error');
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    });
}

    /* ===== Toast Notification ===== */
    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || (() => {
            const div = document.createElement('div');
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();

        const colors = {
            success: 'bg-success text-white',
            error: 'bg-danger text-white',
            info: 'bg-primary text-white',
        };

        const toast = document.createElement('div');
        toast.className = `toast align-items-center ${colors[type] || colors.info} border-0 show`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    /* ===== Back to Top Button ===== */
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== Smooth Navbar Scroll (fallback for older browsers) ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                /* Close mobile menu */
                const navbarCollapse = document.getElementById('navbarNav');
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
});
