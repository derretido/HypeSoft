# 🚀 Projeto Hypesoft – Desafio Técnico

## ✨ Introdução

Antes de falar da parte técnica, quero começar dizendo que estou muito feliz por ter participado deste projeto tão desafiador. Desde já, agradeço a oportunidade de fazer parte deste processo seletivo. Sinto que estou no caminho certo para conquistar minha primeira oportunidade como Desenvolvedor Jr.

Esse desafio foi um verdadeiro misto de altos e baixos — um grande quebra-cabeça técnico para mim. Foram **5 dias intensos** construindo praticamente tudo do zero, desenvolvendo no VSCode com apoio de IA integrada, pesquisando bastante, estudando documentação oficial e aprendendo na prática para conseguir concluir um projeto completo como este.

Ao final, sinto que evoluí não apenas tecnicamente, mas também na forma de raciocinar, investigar problemas e estruturar soluções. Espero sinceramente que gostem do resultado. Agradeço novamente pela oportunidade.

---

# 📌 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico e representa **5 dias intensos de construção prática**, resolução de problemas reais e evolução arquitetural.

Mais do que um CRUD, a aplicação evoluiu para um sistema completo com:

- 🔐 Autenticação corporativa via Keycloak  
- 🏗️ Arquitetura baseada em Clean Architecture  
- 🗄️ Persistência com MongoDB  
- ⚡ Backend em .NET 9  
- 🌐 Frontend em React + Vite + Tailwind  
- 🐳 Ambiente 100% containerizado com Docker  

---

# 🏗️ Arquitetura do Sistema

O projeto foi estruturado seguindo os princípios da **Clean Architecture**, dividido em quatro camadas:

- API  
- Application  
- Domain  
- Infrastructure  

### 🎯 Benefícios dessa abordagem

- Separação clara de responsabilidades  
- Baixo acoplamento  
- Alta manutenibilidade  
- Facilidade para testes e evolução futura  

---

# ⚙️ Stack Tecnológica

## 🔹 Backend

- .NET 9  
- MediatR  
- MongoDB Driver  
- JWT Authentication  
- Swagger  
- Keycloak  

## 🔹 Frontend

- React  
- Vite  
- Axios  
- Tailwind CSS  
- Lucide React  

## 🔹 Infraestrutura

- Docker  
- Docker Compose  
- MongoDB  
- Keycloak  
- Mongo Express (porta 8081)  

---

# 🔐 Autenticação e Segurança

O sistema utiliza **Keycloak** para autenticação corporativa com:

- Realm importado automaticamente via JSON  
- Controle de acesso baseado em Roles:
  - Admin  
  - Viewer  
- JWT validado no backend  
- Refresh automático de token no frontend  
- CORS configurado corretamente para múltiplas portas (3000 e 5173)  

---

# 🗄️ Persistência de Dados

**Banco:** MongoDB  

- Padronização de GUID com `GuidRepresentation.Standard`  
- Correção de inconsistências entre:
  - `id` vs `Id`
  - `products` vs `Products`
  - `categories` vs `Categories`

Foi realizado saneamento completo do banco durante o desenvolvimento para evitar conflitos de serialização.

---

# 🧠 Problemas Técnicos Superados

Durante o desenvolvimento enfrentei e resolvi:

- ❌ Conflitos de UUID Legacy vs Standard  
- ❌ Erro 401 (Audience e Scope no Keycloak)  
- ❌ Erro 500 por métodos não implementados  
- ❌ Erros de CORS ao mudar porta (5173 → 3000)  
- ❌ Conflitos de serialização de GUID  
- ❌ Problemas de import de Realm incompatível entre versões do Keycloak  
- ❌ Falhas de Healthcheck impedindo containers de subir  
- ❌ Impacto de CPU na inicialização do Keycloak  

Cada erro foi analisado tecnicamente até a raiz do problema.

---

# 🖥️ Teste em Dois Ambientes Diferentes

Um ponto extremamente importante do projeto foi a validação em dois computadores distintos.

## 🖥️ Máquina 1

- 8 CPUs  
- Subida rápida dos containers  
- Keycloak inicializando sem gargalo  

## 💻 Máquina 2 (ambiente “cru”)

- 2 CPUs  
- Subida significativamente mais lenta  
- Alto consumo de CPU pelo Keycloak  
- Necessidade de ajuste de memória Java  

### 🎯 Conclusão Técnica

A aplicação é funcional em ambos ambientes, porém o tempo de inicialização é diretamente impactado pela quantidade de CPUs disponíveis, principalmente pelo processo de bootstrap do Keycloak (Quarkus + Liquibase + Infinispan).

Isso demonstra:

- Entendimento de impacto de infraestrutura  
- Teste real de portabilidade  
- Validação prática de ambiente corporativo  

---

# 🌐 Comunicação Frontend ↔ Backend

- Axios configurado com interceptor para refresh automático de token  
- Header `Authorization: Bearer`  
- CORS corretamente configurado no backend  

Testes realizados via:

- Swagger  
- Curl  
- Postman  
- Navegador  

---

# 📊 Funcionalidades Implementadas

- ✔ CRUD completo de Produtos  
- ✔ CRUD completo de Categorias  
- ✔ Dashboard com métricas  
- ✔ Alerta visual para estoque baixo  
- ✔ Controle de acesso por role  
- ✔ Validação de dados no frontend  
- ✔ Persistência estável no MongoDB  
- ✔ Ambiente totalmente dockerizado  

---

# 🐳 Execução do Projeto

```bash
git clone <repo>
cd HypeSoft
docker compose up -d --build

## 🔗 URLs de Acesso

- **Frontend:** http://localhost:3000  
- **API:** http://localhost:5000  
- **Swagger:** http://localhost:5000/swagger  
- **Keycloak:** http://localhost:8080  
- **Mongo Express:** http://localhost:8081  

---

# 🧩 Decisões Técnicas Estratégicas

## 🎨 Por que Tailwind?

- Build enxuto  
- Alta velocidade de prototipação  
- CSS não utilizado removido automaticamente  

## 🔐 Por que controle de role no frontend?

- Melhor UX  
- Evita erros 403 desnecessários  
- Interface mais inteligente  

## 🏗️ Por que Clean Architecture?

- Escalabilidade  
- Testabilidade  
- Organização profissional  

## 🔄 Por que importar Realm via JSON?

- Garantia de portabilidade  
- Ambiente replicável em qualquer máquina  
- Elimina dependência de configuração manual  

---

# 📈 Evolução do Projeto

O sistema começou como um CRUD simples e evoluiu para uma aplicação com características corporativas reais:

- Autenticação centralizada  
- Controle de acesso  
- Integração com Docker  
- Validação em múltiplos ambientes  
- Testes de infraestrutura  
- Resolução de problemas de produção simulados  

---

# 🎯 Conclusão

Este projeto foi um divisor de águas no meu aprendizado.

Mais do que implementar funcionalidades, aprendi a:

- Investigar problemas reais  
- Entender infraestrutura  
- Corrigir conflitos de versão  
- Trabalhar com autenticação corporativa  
- Validar ambiente em múltiplas máquinas  
- Pensar como desenvolvedor de produto, não apenas codificador  

Foi um grande quebra-cabeça técnico — e cada peça resolvida contribuiu diretamente para minha evolução como desenvolvedor.