document.addEventListener('DOMContentLoaded', function() {
    // Définir les variables pour les modals et les boutons
    const modals = {
        ajouter: document.getElementById('modal-ajouter'),
        modifier: document.getElementById('modal-modifier'),
        supprimer: document.getElementById('modal-supprimer')
    };

    const buttons = {
        edit: document.querySelectorAll('.edit-btn'),
        delete: document.querySelectorAll('.delete-btn')
    };

    // Fonction pour ouvrir le modal d'ajout
    function openAddModal() {
        // Réinitialiser le formulaire
        resetAddForm();

        // Afficher le modal
        if (modals.ajouter) {
            modals.ajouter.style.display = 'block';
        }
    }

    // Utiliser la délégation d'événements pour les boutons principaux
    document.addEventListener('click', function(event) {
        // Bouton Ajouter
        if (event.target.id === 'button-ajouter' || event.target.closest('#button-ajouter')) {
            openAddModal();
        }

        // Bouton Retour
        if (event.target.id === 'button-retour' || event.target.closest('#button-retour')) {
            window.location.href = 'home.html';
        }
    });

    // Boutons d'édition sur chaque ligne
    buttons.edit.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            const rowElement = document.querySelector(`tr[data-row="${categoryId}"]`);

            if (!rowElement) {
                console.error("Impossible de trouver la ligne de la catégorie:", categoryId);
                return;
            }

            // Récupération des données de la catégorie
            const categoryData = {
                nom: rowElement.querySelector('.category-name').textContent,
                description: rowElement.querySelector('.category-description').textContent
            };

            document.getElementById('edit-id').value = categoryId;

            // Remplir le formulaire d'édition
            document.getElementById('edit-nom').value = categoryData.nom;
            document.getElementById('edit-description').value = categoryData.description;

            // Afficher le modal
            modals.modifier.style.display = 'block';
        });
    });

    // Fonction pour ouvrir le modal de suppression
    function openDeleteModal(categoryId) {
        try {
            const row = document.querySelector(`tr[data-row="${categoryId}"]`);
            if (row) {
                const categoryName = row.querySelector('.category-name').textContent;

                // Mettre à jour le texte de confirmation
                const deleteCategoryNameElement = document.getElementById('delete-category-name');
                if (deleteCategoryNameElement) {
                    deleteCategoryNameElement.textContent = categoryName;
                }

                // Stocker l'ID pour l'utiliser lors de la confirmation
                const confirmDeleteBtn = document.getElementById('confirm-delete');
                if (confirmDeleteBtn) {
                    confirmDeleteBtn.setAttribute('data-id', categoryId);
                }

                // Afficher le modal de suppression
                if (modals.supprimer) {
                    modals.supprimer.style.display = 'block';
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom de la catégorie:", error);
            return;
        }
    }

    // Utiliser la délégation d'événements pour les boutons de suppression
    document.addEventListener('click', function(event) {
        // Vérifier si l'élément cliqué ou un de ses parents est un bouton de suppression
        const deleteButton = event.target.closest('.delete-btn');
        if (deleteButton) {
            const categoryId = deleteButton.getAttribute('data-id');
            if (categoryId) {
                openDeleteModal(categoryId);
            }
        }
    });

    // Fonction pour fermer tous les modals et réinitialiser les états
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Fermer les modals avec les boutons de fermeture
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Fermer en cliquant en dehors du modal
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });

    // Fonction pour réinitialiser le formulaire d'ajout
    function resetAddForm() {
        const form = document.getElementById('add-category-form');
        if (form) form.reset();
    }

    // Fonction pour traiter l'ajout d'une catégorie
    function handleAddCategory() {
        const form = document.getElementById('add-category-form');
        if (!form) return;

        const formData = new FormData(form);

        // Dans une application réelle, vous enverriez ces données au backend
        console.log('Formulaire prêt à être envoyé');

        // Pour afficher les paires clé/valeur du FormData
        const categoryData = {};
        for (let [key, value] of formData.entries()) {
            categoryData[key] = value;
        }
        console.log('Données de la nouvelle catégorie:', categoryData);

        // Réinitialiser le formulaire
        resetAddForm();

        // Simulation d'ajout réussi
        alert('Catégorie ajoutée avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la modification d'une catégorie
    function handleUpdateCategory() {
        const form = document.getElementById('edit-category-form');
        if (!form) return;

        const formData = new FormData(form);

        // Dans une application réelle, vous enverriez ces données au backend
        console.log('Formulaire de modification prêt à être envoyé');

        // Pour afficher les paires clé/valeur du FormData
        const categoryData = {};
        for (let [key, value] of formData.entries()) {
            categoryData[key] = value;
        }
        console.log('Données mises à jour:', categoryData);

        // Simulation de mise à jour réussie
        alert('Catégorie mise à jour avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la suppression d'une catégorie
    function handleDeleteCategory() {
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        if (!confirmDeleteBtn) return;

        const categoryId = confirmDeleteBtn.getAttribute('data-id');
        console.log('Suppression de la catégorie ID:', categoryId);

        // Simulation de suppression réussie
        alert('Catégorie supprimée avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Attacher les gestionnaires d'événements
    document.addEventListener('click', function(event) {
        // Utilisation de la délégation d'événements pour éviter les problèmes de réattachement
        if (event.target.id === 'save-category' || event.target.closest('#save-category')) {
            handleAddCategory();
        }

        if (event.target.id === 'update-category' || event.target.closest('#update-category')) {
            handleUpdateCategory();
        }

        if (event.target.id === 'confirm-delete' || event.target.closest('#confirm-delete')) {
            handleDeleteCategory();
        }
    });
});