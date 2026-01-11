// Theme Toggle Module
(function() {
    const STORAGE_KEY = 'theme';
    const LIGHT = 'light';

    // Apply saved theme immediately (before DOM fully loads)
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === LIGHT) {
        document.documentElement.setAttribute('data-theme', LIGHT);
    }

    function toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === LIGHT) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', LIGHT);
            localStorage.setItem(STORAGE_KEY, LIGHT);
        }
    }

    // Set up toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }
    });
})();
