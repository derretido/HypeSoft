import axios from 'axios';
import keycloak from '../keycloak'; // Importa a instância do Keycloak para usar o token de autenticação

export const api = axios.create({
    baseURL: 'http://localhost:5031/api', 
});
    

api.interceptors.request.use(async (config) => {
    if (keycloak.token) {
    // Adiciona o cabeçalho "Authorization: Bearer <TOKEN>"
    config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});