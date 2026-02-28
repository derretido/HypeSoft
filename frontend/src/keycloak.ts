import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'hypesoft',
    clientId: 'hypesoft-web',
});

export default keycloak;