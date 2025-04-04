// Fonction appelée lors de la soumission du formulaire
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("OUIIII")

    // Envoyer les informations de connexion au processus principal via IPC
    window.electronAPI.login(email, password);
});

// Écouter les réponses du processus principal