document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginModal = document.getElementById('loginModal');
    const showLoginBtn = document.getElementById('showLoginBtn');

    // Vérifier si l'utilisateur est déjà connecté
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = './home.html';
    }

    // Afficher le modal de connexion
    if (showLoginBtn && loginModal) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });

        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // Gestion du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                loginError.textContent = "Veuillez remplir tous les champs";
                loginError.style.display = 'block';
                return;
            }

            try {
                const result = await window.electronAPI.login(email, password);

                console.log("TEST", await window.electronAPI.login(email, password))

                if (result.success) {
                    // Stocker les informations utilisateur
                    const userData = {
                        prenom: result.userData.user.firstname || 'Utilisateur',
                        nom: result.userData.user.lastname || '',
                        email: result.userData.user.email || email,
                        role: result.userData.user.role || 'Utilisateur'
                    };

                    // Enregistrer dans le localStorage
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('isLoggedIn', 'true');

                    // Redirection vers la page d'accueil
                    window.location.href = './home.html';
                } else {
                    // Afficher l'erreur
                    loginError.textContent = result.error || "Identifiants incorrects";
                    loginError.style.display = 'block';
                }
            } catch (error) {
                loginError.textContent = "Une erreur est survenue";
                loginError.style.display = 'block';
            }
        });
    }
});