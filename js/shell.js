// Mobile nav + sidebar active state
(function () {
    function init() {
        const toggle = document.querySelector('.nav-toggle');
        const sidebar = document.getElementById('sidebar');

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 1024) {
                        sidebar.classList.remove('open');
                    }
                });
            });
        }

        // Highlight sidebar link for current section on scroll (homepage only)
        const sections = document.querySelectorAll('[data-section]');
        const navLinks = document.querySelectorAll('.sidebar-link[data-section]');

        if (sections.length && navLinks.length) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            navLinks.forEach((link) => {
                                link.classList.toggle('active', link.dataset.section === id);
                            });
                        }
                    });
                },
                { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
            );

            sections.forEach((section) => observer.observe(section));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
