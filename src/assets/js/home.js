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

    // --- Nouvelles fonctionnalités pour le profil utilisateur ---

    // Vérifier si l'utilisateur est connecté
    function checkLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
            window.location.href = './index.html';
            return false;
        }

        // Afficher les informations de l'utilisateur
        displayUserInfo(userData);
        return true;
    }

    // Afficher les informations de l'utilisateur dans le dropdown
    function displayUserInfo(userData) {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const userFullName = document.getElementById('user-full-name');
        const userEmail = document.getElementById('user-email');

        // Initiales pour l'avatar
        if (userData.prenom && userData.nom) {
            userAvatar.textContent = userData.prenom.charAt(0) + userData.nom.charAt(0);
        }

        // Nom complet pour le bouton
        if (userName) {
            userName.textContent = userData.prenom + ' ' + userData.nom;
        }

        // Rôle
        if (userRole) {
            userRole.textContent = userData.role || 'Utilisateur';
        }

        // Dropdown détails
        if (userFullName) {
            userFullName.textContent = userData.prenom + ' ' + userData.nom;
        }

        if (userEmail) {
            userEmail.textContent = userData.email || '';
        }
    }

    // Toggle du dropdown utilisateur
    const userProfileButton = document.getElementById('user-profile-button');
    const userDropdown = document.getElementById('user-dropdown');

    if (userProfileButton) {
        userProfileButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userProfileButton.classList.toggle('active');
            userDropdown.classList.toggle('active');
        });

        // Fermer le dropdown quand on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userProfileButton.contains(e.target)) {
                userProfileButton.classList.remove('active');
                userDropdown.classList.remove('active');
            }
        });
    }

    // Gérer la déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Effacer les données utilisateur
            localStorage.removeItem('userData');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userToken');

            // Rediriger vers la page de connexion
            window.location.href = './index.html';
        });
    }

    // Vérifier si l'utilisateur est connecté au chargement
    checkLoggedIn();
});