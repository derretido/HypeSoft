import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import keycloak from './keycloak' 

// Inicializa o Keycloak antes de renderizar o React
keycloak.init({ 
  onLoad: 'login-required', // Redireciona para o login se não estiver autenticado
  checkLoginIframe: false 
}).then((authenticated) => {
  if (authenticated) {
    // Só renderiza o App se o usuário estiver logado com sucesso
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App keycloak={keycloak} />
      </StrictMode>,
    )
  }
}).catch((err) => {
  console.error("Falha ao inicializar o Keycloak:", err);
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Erro ao carregar sistema de autenticação. Verifique o console.</div>';
});