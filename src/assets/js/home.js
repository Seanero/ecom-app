document.addEventListener('DOMContentLoaded', function() {
    // Toggle menu fonctionnalité
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    navbarToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
    });

    // Détecter la page active pour la mettre en surbrillance
    const currentPage = window.location.pathname.split("/").pop();
    const menuButtons = document.querySelectorAll('.navbar-menu button');

    menuButtons.forEach(button => {
        const parentLink = button.closest('a');
        if (parentLink && parentLink.getAttribute('href') === currentPage) {
            button.classList.add('active');
        }
    });

    // Gestion du bouton quitter avec l'API Electron
    const quitButton = document.getElementById('button-fermer');
    if (quitButton) {
        quitButton.addEventListener('click', function() {
            // Utiliser l'API exposée via contextBridge
            window.electronAPI.closeApp();
        });
    }
});