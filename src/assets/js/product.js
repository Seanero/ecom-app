document.addEventListener('DOMContentLoaded', function() {
    // Définir les variables manquantes
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
        const modalAjouter = document.getElementById('modal-ajouter');
        if (modalAjouter) {
            modalAjouter.style.display = 'block';
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
            const productId = this.getAttribute('data-id');
            const rowNumber = document.querySelector(`tr[data-row="${productId}"]`);

            if (!rowNumber) {
                console.error("Impossible de trouver la ligne du produit:", productId);
                return;
            }

            // Simulation de récupération des données du produit
            const productData = {
                nom: rowNumber.querySelector('.product-name').textContent,
                prix: parseFloat(rowNumber.querySelector('.product-price').textContent),
                stock: parseInt(rowNumber.querySelector('.status-badge').textContent),
                categorie: rowNumber.querySelector('.product-category').textContent,
                description: "Description détaillée du produit " + productId,
                imageUrl: rowNumber.querySelector('.product-image img').src
            };

            document.getElementById('edit-id').value = productId;

            // Afficher l'image dans l'aperçu
            const imagePreviewEdit = document.getElementById('preview-edit-img');
            const uploadPlaceholderEdit = document.getElementById('upload-placeholder-edit');
            const removeImageBtnEdit = document.getElementById('remove-image-edit');

            if (imagePreviewEdit) {
                imagePreviewEdit.src = productData.imageUrl;
                imagePreviewEdit.style.display = 'block';
            }

            if (uploadPlaceholderEdit) {
                uploadPlaceholderEdit.style.display = 'none';
            }

            if (removeImageBtnEdit) {
                removeImageBtnEdit.style.display = 'block';
            }

            // Remplir le formulaire d'édition
            document.getElementById('edit-nom').value = productData.nom;
            document.getElementById('edit-prix').value = productData.prix;
            document.getElementById('edit-stock').value = productData.stock;
            document.getElementById('edit-categorie').value = productData.categorie;
            document.getElementById('edit-description').value = productData.description;

            // Afficher le modal
            modals.modifier.style.display = 'block';
        });
    });

    // Fonction pour ouvrir le modal de suppression
    function openDeleteModal(productId) {
        try {
            const row = document.querySelector(`[data-row="${productId}"]`);
            if (row) {
                const productName = row.querySelector('.product-name').textContent;

                // Mettre à jour le texte de confirmation
                const deleteProductNameElement = document.getElementById('delete-product-name');
                if (deleteProductNameElement) {
                    deleteProductNameElement.textContent = productName;
                }

                // Stocker l'ID pour l'utiliser lors de la confirmation
                const confirmDeleteBtn = document.getElementById('confirm-delete');
                if (confirmDeleteBtn) {
                    confirmDeleteBtn.setAttribute('data-id', productId);
                }

                // Afficher le modal de suppression
                const modalSupprimer = document.getElementById('modal-supprimer');
                if (modalSupprimer) {
                    modalSupprimer.style.display = 'block';
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom du produit:", error);
            return;
        }
    }

    // Utiliser la délégation d'événements pour les boutons de suppression
    document.addEventListener('click', function(event) {
        // Vérifier si l'élément cliqué ou un de ses parents est un bouton de suppression
        const deleteButton = event.target.closest('.delete-btn');
        if (deleteButton) {
            const productId = deleteButton.getAttribute('data-id');
            if (productId) {
                openDeleteModal(productId);
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

    // Actions pour les boutons dans les modals
    // Gestion de l'upload d'image pour l'ajout
    const imageInputAdd = document.getElementById('image');
    const imagePreviewAdd = document.getElementById('preview-add-img');
    const uploadPlaceholderAdd = document.getElementById('upload-placeholder-add');
    const removeImageBtnAdd = document.getElementById('remove-image-add');
    const imagePreviewContainerAdd = document.getElementById('image-preview-add');

    // Gestion de l'upload d'image pour l'ajout
    if (imagePreviewContainerAdd) {
        imagePreviewContainerAdd.addEventListener('click', function() {
            if (imageInputAdd) imageInputAdd.click();
        });
    }

    if (imageInputAdd) {
        imageInputAdd.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    if (imagePreviewAdd) {
                        imagePreviewAdd.src = e.target.result;
                        imagePreviewAdd.style.display = 'block';
                    }
                    if (uploadPlaceholderAdd) uploadPlaceholderAdd.style.display = 'none';
                    if (removeImageBtnAdd) removeImageBtnAdd.style.display = 'block';
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (removeImageBtnAdd) {
        removeImageBtnAdd.addEventListener('click', function(e) {
            e.stopPropagation(); // Évite de déclencher le clic sur le conteneur
            if (imageInputAdd) imageInputAdd.value = '';
            if (imagePreviewAdd) {
                imagePreviewAdd.src = '';
                imagePreviewAdd.style.display = 'none';
            }
            if (uploadPlaceholderAdd) uploadPlaceholderAdd.style.display = 'flex';
            this.style.display = 'none';
        });
    }

    // Gestion de l'upload d'image pour la modification
    const imageInputEdit = document.getElementById('edit-image');
    const imagePreviewEdit = document.getElementById('preview-edit-img');
    const uploadPlaceholderEdit = document.getElementById('upload-placeholder-edit');
    const removeImageBtnEdit = document.getElementById('remove-image-edit');
    const imagePreviewContainerEdit = document.getElementById('image-preview-edit');

    if (imagePreviewContainerEdit) {
        imagePreviewContainerEdit.addEventListener('click', function() {
            if (imageInputEdit) imageInputEdit.click();
        });
    }

    if (imageInputEdit) {
        imageInputEdit.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    if (imagePreviewEdit) {
                        imagePreviewEdit.src = e.target.result;
                        imagePreviewEdit.style.display = 'block';
                    }
                    if (uploadPlaceholderEdit) uploadPlaceholderEdit.style.display = 'none';
                    if (removeImageBtnEdit) removeImageBtnEdit.style.display = 'block';
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (removeImageBtnEdit) {
        removeImageBtnEdit.addEventListener('click', function(e) {
            e.stopPropagation(); // Évite de déclencher le clic sur le conteneur
            if (imageInputEdit) imageInputEdit.value = '';
            if (imagePreviewEdit) {
                imagePreviewEdit.src = '';
                imagePreviewEdit.style.display = 'none';
            }
            if (uploadPlaceholderEdit) uploadPlaceholderEdit.style.display = 'flex';
            this.style.display = 'none';
        });
    }

    // Fonction pour réinitialiser le formulaire d'ajout
    function resetAddForm() {
        const form = document.getElementById('add-product-form');
        if (form) form.reset();

        const imagePreview = document.getElementById('preview-add-img');
        const uploadPlaceholder = document.getElementById('upload-placeholder-add');
        const removeImageBtn = document.getElementById('remove-image-add');

        if (imagePreview) imagePreview.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
        if (removeImageBtn) removeImageBtn.style.display = 'none';

        if (imagePreview) imagePreview.src = '';
    }

    // Fonction pour traiter l'ajout d'un produit
    function handleAddProduct() {
        const form = document.getElementById('add-product-form');
        if (!form) return;

        const formData = new FormData(form);

        // Dans une application réelle, vous enverriez ces données au backend
        console.log('Formulaire prêt à être envoyé avec image');

        // Pour afficher les paires clé/valeur du FormData (sauf l'image pour la lisibilité)
        const productData = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'image' || value.name) {
                productData[key] = key === 'image' ? value.name : value;
            }
        }
        console.log('Données du nouveau produit:', productData);

        // Réinitialiser le formulaire
        resetAddForm();

        // Simulation d'ajout réussi
        alert('Produit ajouté avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la modification d'un produit
    function handleUpdateProduct() {
        const form = document.getElementById('edit-product-form');
        if (!form) return;

        const formData = new FormData(form);

        // Dans une application réelle, vous enverriez ces données au backend
        console.log('Formulaire de modification prêt à être envoyé avec image');

        // Pour afficher les paires clé/valeur du FormData (sauf l'image pour la lisibilité)
        const productData = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'edit-image' || value.name) {
                productData[key] = key === 'edit-image' ? value.name : value;
            }
        }
        console.log('Données mises à jour:', productData);

        // Simulation de mise à jour réussie
        alert('Produit mis à jour avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la suppression d'un produit
    function handleDeleteProduct() {
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        if (!confirmDeleteBtn) return;

        const productId = confirmDeleteBtn.getAttribute('data-id');
        console.log('Suppression du produit ID:', productId);

        // Simulation de suppression réussie
        alert('Produit supprimé avec succès !');

        // Fermer le modal
        closeAllModals();
    }

    // Attacher les gestionnaires d'événements
    document.addEventListener('click', function(event) {
        // Utilisation de la délégation d'événements pour éviter les problèmes de réattachement
        if (event.target.id === 'save-product' || event.target.closest('#save-product')) {
            handleAddProduct();
        }

        if (event.target.id === 'update-product' || event.target.closest('#update-product')) {
            handleUpdateProduct();
        }

        if (event.target.id === 'confirm-delete' || event.target.closest('#confirm-delete')) {
            handleDeleteProduct();
        }
    });

    // Éviter le double gestionnaire d'événements
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        // Supprimer tout gestionnaire précédent
        confirmDeleteBtn.removeEventListener('click', handleDeleteProduct);
    }
});