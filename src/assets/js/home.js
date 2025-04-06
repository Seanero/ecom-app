document.addEventListener('DOMContentLoaded', function() {
    // Vérification de l'authentification
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = './index.html';
        return;
    }

    // Récupération des données utilisateur
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Affichage des informations utilisateur
    displayUserInfo(userData);

    // Toggle pour le menu mobile
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }

    // Gestion du menu utilisateur
    const userProfileButton = document.getElementById('user-profile-button');
    const userDropdown = document.getElementById('user-dropdown');

    if (userProfileButton && userDropdown) {
        userProfileButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userProfileButton.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Gestion de la déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            await window.electronAPI.logout();
            localStorage.removeItem('userData');
            localStorage.removeItem('isLoggedIn');
            window.location.href = './index.html';
        });
    }

    // Gestion du bouton quitter
    const quitButton = document.getElementById('button-fermer');
    if (quitButton) {
        quitButton.addEventListener('click', function() {
            window.electronAPI.closeApp();
        });
    }

    // Affichage des informations utilisateur
    function displayUserInfo(userData) {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const userFullName = document.getElementById('user-full-name');
        const userEmail = document.getElementById('user-email');

        // Initiales pour l'avatar
        if (userAvatar && userData.prenom && userData.nom) {
            userAvatar.textContent = userData.prenom.charAt(0) + userData.nom.charAt(0);
        }

        // Autres informations
        if (userName) userName.textContent = `${userData.prenom} ${userData.nom}`;
        if (userRole) userRole.textContent = userData.role || 'Utilisateur';
        if (userFullName) userFullName.textContent = `${userData.prenom} ${userData.nom}`;
        if (userEmail) userEmail.textContent = userData.email || '';
    }
    console.log(userData)
});