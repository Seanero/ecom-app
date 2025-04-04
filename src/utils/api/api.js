const API_CONFIG = {
    BASE_URL: 'http://fr0-games-001.palmasys.fr:25637',
    ENDPOINTS: {
        LOGIN: '/users/login',
        CATEGORIES: '/categories',
        PRODUCTS: '/products',
        USERS: '/users'
    },
    buildUrl: function(endpoint) {
        return this.BASE_URL + endpoint;
    },
    buildUrlWithId: function(endpoint, id) {
        return this.BASE_URL + endpoint + '/' + id;
    }
};
module.exports = API_CONFIG;