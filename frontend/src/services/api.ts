import axios from "axios";
import keycloak from "../keycloak";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
    async (config) => {
    if (!keycloak.authenticated) return config;

    try {
        await keycloak.updateToken(30);
    } catch (error) {
        console.error("Erro ao renovar token:", error);
        keycloak.login();
        return Promise.reject(error);
    }

    if (keycloak.token) {
      // ✅ não sobrescreve headers, só seta
        config.headers = config.headers ?? {};
        (config.headers as any)["Authorization"] = `Bearer ${keycloak.token}`;
    }

    return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
    if (error.response?.status === 401) {
        console.warn("Token expirado ou inválido. Redirecionando para login...");
        keycloak.login();
    }
    return Promise.reject(error);
    }
);