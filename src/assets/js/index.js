document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé");

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    console.log("Formulaire trouvé :", loginForm !== null);
    console.log("Message d'erreur trouvé :", loginError !== null);

    // Vérifier si l'utilisateur est déjà connecté
    function checkLoggedIn() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = localStorage.getItem('userData');

        console.log("État de connexion :", isLoggedIn);
        console.log("Données utilisateur présentes :", userData !== null);

        if (isLoggedIn && userData) {
            console.log("Redirection vers home.html");
            window.location.href = './home.html';
            return true;
        }
        return false;
    }

    // Vérifier le statut de connexion au chargement de la page
    const alreadyLoggedIn = checkLoggedIn();
    console.log("Déjà connecté :", alreadyLoggedIn);

    // Gérer la soumission du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            console.log("Formulaire soumis");
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');

            console.log("Champ email trouvé :", email !== null);
            console.log("Champ password trouvé :", password !== null);

            const emailValue = email ? email.value : "";
            const passwordValue = password ? password.value : "";

            console.log("Email saisi :", emailValue);
            console.log("API Electron disponible :", typeof window.electronAPI !== 'undefined');

            // Vérifier que l'API Electron est disponible
            if (typeof window.electronAPI === 'undefined' || typeof window.electronAPI.login !== 'function') {
                console.error("API Electron non disponible");
                if (loginError) {
                    loginError.textContent = "Erreur technique: API non disponible";
                    loginError.style.display = 'block';
                }
                return;
            }

            try {
                // Appel à l'API d'authentification
                window.electronAPI.login(emailValue, passwordValue);

                window.electronAPI.onLoginResult((result) => {
                    console.log("Résultat de connexion reçu", result);

                    if (result.success) {
                        console.log("Connexion réussie");

                        // Stocker les informations de connexion
                        localStorage.setItem('isLoggedIn', 'true');

                        // Stocker les données utilisateur
                        const userData = {
                            prenom: result.prenom || 'Utilisateur',
                            nom: result.nom || '',
                            email: emailValue,
                            role: result.role || 'Utilisateur'
                        };

                        localStorage.setItem('userData', JSON.stringify(userData));
                        console.log("Données utilisateur stockées:", userData);

                        // Stocker le token si disponible
                        if (result.token) {
                            localStorage.setItem('userToken', result.token);
                        }

                        // Masquer le message d'erreur
                        if (loginError) {
                            loginError.style.display = 'none';
                        }

                        // Rediriger vers la page d'accueil
                        console.log("Redirection vers home.html");
                        window.location.href = './home.html';
                    } else {
                        console.log("Échec de la connexion");
                        if (loginError) {
                            loginError.style.display = 'block';
                        }
                    }
                });
            } catch (err) {
                console.error("Erreur lors de la tentative de connexion:", err);
                if (loginError) {
                    loginError.textContent = "Erreur technique: " + err.message;
                    loginError.style.display = 'block';
                }
            }
        });
    } else {
        console.error("Formulaire de connexion non trouvé");
    }
});