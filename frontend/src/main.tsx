import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import keycloak from "./keycloak";

// Deixa o HTML mais limpo e evita "styles used before declaration"
function showOverlay(type: "loading" | "error", message?: string) {
  const root = document.getElementById("root");
  if (!root) return;

  if (type === "loading") {
    root.innerHTML = `
      <div class="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div class="flex flex-col items-center gap-4">
          <div class="spinner"></div>
          <p class="text-slate-700 text-sm">Carregando autenticação...</p>
        </div>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div class="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h1 class="text-lg font-semibold text-red-600">Erro ao iniciar autenticação</h1>
        <p class="mt-2 text-sm text-slate-700">${message ?? "Verifique o console e o Keycloak."}</p>
        <button
          class="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          onclick="window.location.reload()"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  `;
}

showOverlay("loading");

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    if (!authenticated) {
      showOverlay("error", "Não autenticado. Tente recarregar.");
      return;
    }

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App keycloak={keycloak} />
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error("Falha ao inicializar o Keycloak:", err);
    showOverlay("error", "Falha ao iniciar o Keycloak. Verifique se o Keycloak está no ar (porta 8080).");
  });