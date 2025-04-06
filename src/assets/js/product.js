// src/assets/js/product.js
document.addEventListener('DOMContentLoaded', function() {
    // Définir les variables pour les modals
    const modals = {
        ajouter: document.getElementById('modal-ajouter'),
        modifier: document.getElementById('modal-modifier'),
        supprimer: document.getElementById('modal-supprimer')
    };

    // Charger les produits depuis l'API
    loadProducts();

    // Charger les catégories pour les sélecteurs
    loadCategories();

    // Fonction pour charger les produits depuis l'API
    async function loadProducts() {
        try {
            const result = await window.electronAPI.getAllProducts();

            if (result.success) {
                displayProducts(result.data);
            } else {
                alert('Erreur lors du chargement des produits: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur de chargement des produits:', error);
            alert('Erreur de chargement des produits');
        }
    }

    // Fonction pour charger les catégories
    async function loadCategories() {
        try {
            const result = await window.electronAPI.getAllCategories();

            if (result.success) {
                populateCategorySelects(result.data);
            } else {
                console.error('Erreur lors du chargement des catégories:', result.error);
            }
        } catch (error) {
            console.error('Erreur de chargement des catégories:', error);
        }
    }

    // Fonction pour remplir les sélecteurs de catégories
    function populateCategorySelects(categories) {
        const selects = [
            document.getElementById('categorie'),
            document.getElementById('edit-categorie')
        ];

        selects.forEach(select => {
            if (select) {
                // Garder seulement l'option vide
                select.innerHTML = '<option value="">Sélectionner une catégorie</option>';

                // Ajouter les catégories
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.nom;
                    select.appendChild(option);
                });
            }
        });
    }

    // Fonction pour afficher les produits dans le tableau
    function displayProducts(products) {
        const tableBody = document.querySelector('.products-table tbody');
        if (!tableBody) return;

        // Vider le tableau
        tableBody.innerHTML = '';

        // Mettre à jour le compteur
        const productsCount = document.querySelector('.products-count');
        if (productsCount) {
            productsCount.textContent = `${products.length} produits`;
        }

        // Remplir le tableau avec les données
        products.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-row', product.id);

            // Déterminer le statut de stock
            let stockStatus = 'status-out-of-stock';
            if (product.stock > 10) {
                stockStatus = 'status-in-stock';
            } else if (product.stock > 0) {
                stockStatus = 'status-low-stock';
            }

            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <div class="product-image">
                        <img src="${product.imageUrl || 'https://via.placeholder.com/150x100?text=Produit'}" alt="${product.nom}">
                    </div>
                </td>
                <td class="product-name">${product.nom}</td>
                <td>
                    <span class="status-badge ${stockStatus}">${product.stock}</span>
                </td>
                <td class="product-price">${product.prix} €</td>
                <td class="product-category">${product.category?.nom || 'Non catégorisé'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${product.id}">
                            <span>✏️</span> Modifier
                        </button>
                        <button class="action-btn delete-btn" data-id="${product.id}">
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

    // Attacher les événements aux boutons
    function attachButtonEvents() {
        // Boutons d'édition sur chaque ligne
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const productId = this.getAttribute('data-id');
                await openEditModal(productId);
            });
        });

        // Boutons de suppression sur chaque ligne
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                openDeleteModal(productId);
            });
        });
    }

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

    // Fonction pour ouvrir le modal de modification
    async function openEditModal(productId) {
        try {
            // Récupérer les détails du produit depuis l'API
            const result = await window.electronAPI.getProductById(productId);

            if (!result.success) {
                alert('Erreur lors de la récupération du produit: ' + result.error);
                return;
            }

            const product = result.data;

            document.getElementById('edit-id').value = product.id;
            document.getElementById('edit-nom').value = product.nom;
            document.getElementById('edit-description').value = product.description || '';
            document.getElementById('edit-prix').value = product.prix;
            document.getElementById('edit-stock').value = product.stock;
            document.getElementById('edit-categorie').value = product.categoryId || '';

            // Afficher l'image si disponible
            const imagePreviewEdit = document.getElementById('preview-edit-img');
            const uploadPlaceholderEdit = document.getElementById('upload-placeholder-edit');
            const removeImageBtnEdit = document.getElementById('remove-image-edit');

            if (product.imageUrl && imagePreviewEdit) {
                imagePreviewEdit.src = product.imageUrl;
                imagePreviewEdit.style.display = 'block';

                if (uploadPlaceholderEdit) {
                    uploadPlaceholderEdit.style.display = 'none';
                }

                if (removeImageBtnEdit) {
                    removeImageBtnEdit.style.display = 'block';
                }
            }

            // Afficher le modal
            if (modals.modifier) {
                modals.modifier.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
            alert('Erreur lors de la récupération du produit');
        }
    }

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
    async function handleAddProduct() {
        const form = document.getElementById('add-product-form');
        if (!form) return;

        const formData = new FormData(form);

        // Convertir les données du formulaire en objet
        const productData = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'image' || (key === 'image' && value.size > 0)) {
                if (key === 'prix') {
                    productData[key] = parseFloat(value);
                } else if (key === 'stock') {
                    productData[key] = parseInt(value);
                } else {
                    productData[key] = value;
                }
            }
        }

        // Si une image a été choisie, la convertir en base64 pour l'API
        if (formData.get('image') && formData.get('image').size > 0) {
            const imageFile = formData.get('image');
            try {
                const base64Image = await fileToBase64(imageFile);
                productData.imageBase64 = base64Image;
            } catch (error) {
                console.error('Erreur lors de la conversion de l\'image:', error);
            }
        }

        try {
            const result = await window.electronAPI.createProduct(productData);

            if (result.success) {
                alert('Produit ajouté avec succès !');
                // Recharger les produits
                loadProducts();
            } else {
                alert('Erreur lors de l\'ajout: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Erreur lors de l\'ajout du produit');
        }

        // Réinitialiser le formulaire
        resetAddForm();

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour convertir un fichier en base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Fonction pour traiter la modification d'un produit
    async function handleUpdateProduct() {
        const form = document.getElementById('edit-product-form');
        if (!form) return;

        const formData = new FormData(form);

        // Convertir les données du formulaire en objet
        const productData = {
            id: formData.get('edit-id'),
            nom: formData.get('edit-nom'),
            description: formData.get('edit-description'),
            prix: parseFloat(formData.get('edit-prix')),
            stock: parseInt(formData.get('edit-stock')),
            categoryId: formData.get('edit-categorie')
        };

        // Si une nouvelle image a été choisie, la convertir en base64 pour l'API
        if (formData.get('edit-image') && formData.get('edit-image').size > 0) {
            const imageFile = formData.get('edit-image');
            try {
                const base64Image = await fileToBase64(imageFile);
                productData.imageBase64 = base64Image;
            } catch (error) {
                console.error('Erreur lors de la conversion de l\'image:', error);
            }
        }

        try {
            // Comme votre API ne semble pas avoir d'endpoint spécifique pour mettre à jour,
            // on utilise le même endpoint que pour la création
            const result = await window.electronAPI.createProduct(productData);

            if (result.success) {
                alert('Produit mis à jour avec succès !');
                // Recharger les produits
                loadProducts();
            } else {
                alert('Erreur lors de la mise à jour: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            alert('Erreur lors de la mise à jour du produit');
        }

        // Fermer le modal
        closeAllModals();
    }

    // Fonction pour traiter la suppression d'un produit
    async function handleDeleteProduct() {
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        if (!confirmDeleteBtn) return;

        const productId = confirmDeleteBtn.getAttribute('data-id');

        try {
            const result = await window.electronAPI.deleteProduct(productId);

            if (result.success) {
                alert('Produit supprimé avec succès !');
                // Recharger les produits
                loadProducts();
            } else {
                alert('Erreur lors de la suppression: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            alert('Erreur lors de la suppression du produit');
        }

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
});