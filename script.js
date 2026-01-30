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
   Tic Tac Toe Game Logic
   =========================== */
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const statusDisplay = document.querySelector('#status');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('#reset-btn');

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.style.color = currentPlayer === 'X' ? 'var(--primary)' : 'var(--secondary)'; // Optional dynamic coloring
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.textContent = `Player X's Turn`;
  cells.forEach(cell => {
    cell.textContent = "";
  });
}

if (cells.length > 0) {
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', handleRestartGame);
}
