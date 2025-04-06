// src/utils/api/api.js
const API_CONFIG = {
    BASE_URL: 'http://fr0-games-001.palmasys.fr:25637',

    ENDPOINTS: {
        USER: {
            LOGIN: '/users/login',
            REGISTER: '/users/register',
            ME: '/users/me',
            EDIT: '/users/edit',
            LOGOUT: '/users/logout'
        },
        CATEGORY: {
            GET_ALL: '/category/getAll',
            CREATE: '/category/create',
            DELETE: '/category/delete'
        },
        PRODUCT: {
            GET_ALL: '/product/getAll',
            GET_BY_ID: '/product/get', // On ajoutera l'ID quand nécessaire
            CREATE: '/product/create',
            DELETE: '/product/delete'
        }
    },

    buildUrl: function(endpoint) {
        return this.BASE_URL + endpoint;
    },

    buildUrlWithId: function(baseEndpoint, id) {
        return this.BASE_URL + baseEndpoint + '/' + id;
    }
};

module.exports = API_CONFIG;