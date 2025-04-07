// src/assets/js/categories.js
document.addEventListener('DOMContentLoaded', function() {
    // Définir les variables pour les modals et les boutons
    const modals = {
        ajouter: document.getElementById('modal-ajouter'),
        modifier: document.getElementById('modal-modifier'),
        supprimer: document.getElementById('modal-supprimer')
    };

    // Charger les catégories depuis l'API
    loadCategories();

    // Fonction pour charger les catégories depuis l'API
    async function loadCategories() {
        try {
            const result = await window.electronAPI.getAllCategory();

            if (result.success) {
                displayCategories(result.data);
            } else {
                alert('Erreur lors du chargement des catégories: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur de chargement des catégories:', error);
            alert('Erreur de chargement des catégories');
        }
    }

    // Fonction pour afficher les catégories dans le tableau
    function displayCategories(categories) {
        const tableBody = document.querySelector('.categories-table tbody');
        if (!tableBody) return;

        // Vider le tableau
        tableBody.innerHTML = '';

        // Mettre à jour le compteur
        const categoriesCount = document.querySelector('.categories-count');
        if (categoriesCount) {
            categoriesCount.textContent = `${categories.length} catégories`;
        }

        // Remplir le tableau avec les données
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.setAttribute('data-row', category.id);

            row.innerHTML = `
                <td>${category._id}</td>
                <td class="category-name">${category.name}</td>
                <td class="category-description">${category.slug || ''}</td>
                <td><span class="badge badge-primary">${category.productCount || 0}</span></td>
                <td>${formatDate(category.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${category._id}">
                            <span>✏️</span> Modifier
                        </button>
                        <button class="action-btn delete-btn" data-id="${category._id}">
                            <span>🗑️</span> Supprimer
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Réattacher les événements aux nouveaux boutons
        attachButtonEvents();
    }

    // Formatter la date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    // Fonction pour ouvrir le modal d'ajout
    function openAddModal() {
        // Réinitialiser le formulaire
        resetAddForm();

        // Afficher le modal
        if (modals.ajouter) {
            modals.ajouter.style.display = 'block';
        }
    }

    // Attacher les événements aux boutons
    function attachButtonEvents() {
        // Boutons d'édition sur chaque ligne
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                openEditModal(categoryId);
            });
        });

        // Boutons de suppression sur chaque ligne
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                openDeleteModal(categoryId);
            });
        });
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

    // Fonction pour ouvrir le modal de modification
    function openEditModal(categoryId) {
        const rowElement = document.querySelector(`tr[data-row="${categoryId}"]`);

        if (!rowElement) {
            console.error("Impossible de trouver la ligne de la catégorie:", categoryId);
            return;
        }

        // Récupération des données de la catégorie
        const categoryData = {
            id: categoryId,
            nom: rowElement.querySelector('.category-name').textContent,
            description: rowElement.querySelector('.category-description').textContent
        };

        document.getElementById('edit-id').value = categoryId;

        // Remplir le formulaire d'édition
        document.getElementById('edit-nom').value = categoryData.nom;
        document.getElementById('edit-description').value = categoryData.description;

        // Afficher le modal
        modals.modifier.style.display = 'block';
    }

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
    async function handleAddCategory() {
        const form = document.getElementById('add-category-form');
        if (!form) return;

        const formData = new FormData(form);

        // Convertir FormData en objet simple
        const categoryData = {};
        for (let [key, value] of formData.entries()) {
            categoryData[key] = value;
        }

        try {
            const result = await window.electronAPI.createCategory(categoryData);

            if (result.success) {
                alert('Catégorie ajoutée avec succès !');
                // Recharger les catégories
                loadCategories();
            } else {
                alert('Erreur lors de l\'ajout: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
            alert('Erreur lors de l\'ajout de la catégorie');
        }

        // Réinitialiser le formulaire
        resetAddForm();

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la modification d'une catégorie
    async function handleUpdateCategory() {
        const form = document.getElementById('edit-category-form');
        if (!form) return;

        const formData = new FormData(form);

        // Convertir FormData en objet simple
        const categoryData = {
            id: formData.get('edit-id'),
            nom: formData.get('edit-nom'),
            description: formData.get('edit-description')
        };

        try {
            // Adapter cette fonction selon votre API
            // Comme votre API ne semble pas avoir d'endpoint spécifique pour mettre à jour,
            // vous devrez peut-être utiliser le même endpoint que la création
            const result = await window.electronAPI.createCategory(categoryData);

            if (result.success) {
                alert('Catégorie mise à jour avec succès !');
                // Recharger les catégories
                loadCategories();
            } else {
                alert('Erreur lors de la mise à jour: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
            alert('Erreur lors de la mise à jour de la catégorie');
        }

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la suppression d'une catégorie
    async function handleDeleteCategory() {
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        if (!confirmDeleteBtn) return;

        const categoryId = confirmDeleteBtn.getAttribute('data-id');

        try {
            const result = await window.electronAPI.deleteCategory(categoryId);

            if (result.success) {
                alert('Catégorie supprimée avec succès !');
                // Recharger les catégories
                loadCategories();
            } else {
                alert('Erreur lors de la suppression: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            alert('Erreur lors de la suppression de la catégorie');
        }

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