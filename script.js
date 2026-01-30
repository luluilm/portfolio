// Toggle Dark Mode
function toggleMode() {
  // Toggle 'dark' class on the html element for Tailwind
  document.documentElement.classList.toggle('dark');
  updaterToggleButtonText();
}

function updaterToggleButtonText() {
  const toggleBtn = document.querySelector('.toggle-mode');
  const isDark = document.documentElement.classList.contains('dark');

  if (isDark) {
    toggleBtn.textContent = 'Light Mode';
    // Optional: Save preference to localStorage
    localStorage.setItem('theme', 'dark');
  } else {
    toggleBtn.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'light');
  }
}

// Check for saved user preference or system preference on load
window.onload = function () {
  // Check local storage or system preference
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  updaterToggleButtonText();

  // Initialize Intersection Observer for scroll animations
  setupScrollObserver();

};

function setupScrollObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });

  setupFooterObserver();
}

function setupFooterObserver() {
  const header = document.getElementById('main-header');
  const footer = document.querySelector('footer');

  if (!header || !footer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If footer is appearing in viewport, hide header
      if (entry.isIntersecting) {
        header.classList.add('-translate-y-full');
      } else {
        // If footer leaves viewport (scrolling up), show header
        header.classList.remove('-translate-y-full');
      }
    });
  }, {
    root: null,
    threshold: 0.1 // Trigger when small part of footer is visible
  });

  observer.observe(footer);
}

/* ===========================
   Typed.js Initialization
   =========================== */
var typed = new Typed('#typed-output', {
  strings: ['Information Technology Student', 'Content Creator', 'Front-End Developer', 'Social Media Specialist'],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 2000,
  loop: true
});

