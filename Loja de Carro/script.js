// Inicializar Ícones do Lucide
lucide.createIcons();

// Elementos para troca de tema (Dark Mode / Light Mode)
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const htmlElement = document.documentElement;

function updateIcons(isDark) {
  if (isDark) {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

// Handler de clique no botão de tema
themeToggleBtn.addEventListener('click', () => {
  const isDark = htmlElement.classList.contains('dark');
  if (isDark) {
    htmlElement.classList.remove('dark');
    htmlElement.classList.add('light');
    localStorage.setItem('theme', 'light');
    updateIcons(false);
  } else {
    htmlElement.classList.remove('light');
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    updateIcons(true);
  }
});

// Estado inicial dos ícones
updateIcons(htmlElement.classList.contains('dark'));

// Função de filtragem de carros por categoria
function filterCars(category, event) {
  const cards = document.querySelectorAll('.car-card');
  const buttons = document.querySelectorAll('.filter-btn');

  // Atualizar o estilo visual dos botões
  buttons.forEach(btn => {
    btn.classList.remove('bg-porsche-red', 'text-white');
    btn.classList.add('bg-slate-800', 'light:bg-white', 'text-slate-300', 'light:text-slate-700');
  });

  if (event) {
    event.currentTarget.classList.remove('bg-slate-800', 'light:bg-white', 'text-slate-300', 'light:text-slate-700');
    event.currentTarget.classList.add('bg-porsche-red', 'text-white');
  }

  // Ocultar/Exibir os cards
  cards.forEach(card => {
    if (category === 'todos' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Simulação de envio do formulário de Test Drive
function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById('testDriveForm').reset();
  const successMsg = document.getElementById('formSuccess');
  successMsg.classList.remove('hidden');
  setTimeout(() => {
    successMsg.classList.add('hidden');
  }, 5000);
}