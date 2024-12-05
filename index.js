// Sélection des éléments
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

// Fonction pour ouvrir la modal
function openModal() {
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Fonction pour fermer la modal
function closeModal() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// Ajout des événements
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);