Projeto HYPESOFT – Minha Jornada em 5 Dias

Antes de falar da parte técnica, eu quero começar dizendo que estou muito feliz em fazer parte desse projeto tão legal e desafiador. Desde já, agradeço a oportunidade de estar participando desse processo seletivo. Sinto que estou no caminho certo para conquistar minha primeira oportunidade como Desenvolvedor Jr.

Esse desafio foi um verdadeiro misto de altos e baixos — um quebra-cabeça gigante para mim. Foram 5 dias intensos construindo tudo praticamente do zero, desenvolvendo totalmente no VSCode com IA integrada, fazendo muitas pesquisas, estudando documentação e aprendendo na prática para conseguir concluir um projeto completo como esse. No final, sinto que evoluí muito como desenvolvedor. Espero sinceramente que gostem do resultado. Agradeço novamente pela oportunidade.

🏗️ Estruturação e Base do Projeto

No primeiro dia, configurei todo o ambiente utilizando Docker, criando o docker-compose.yml para integrar os serviços com o MongoDB e o Keycloak.

Estruturei o sistema em quatro camadas seguindo os princípios de Clean Architecture:

API

Application

Domain

Infrastructure

Essa separação garantiu organização, baixo acoplamento e facilidade de manutenção.

Também implementei as entidades Produto e Categoria, iniciando as regras de negócio, incluindo a lógica de alerta para estoque baixo (menos de 10 unidades). Realizei ainda a integração completa com o MongoDB para persistência dos dados.

Inicialmente comecei a migração para o .NET 10, porém enfrentei erros relacionados ao pacote Microsoft.EntityFrameworkCore.MongoDB. Como solução estratégica, migrei o projeto para o .NET 9, resolvendo os conflitos de NuGet e permitindo seguir o desenvolvimento sem bloqueios.

⚙️Estabilização da Arquitetura e Integrações

No segundo dia, finalizei a estabilização da arquitetura, resolvendo problemas de referências circulares e organizando corretamente as responsabilidades entre as camadas.

Corrigi a persistência com o MongoDB:

Ajustei a connection string

Configurei a serialização de GUID

Padronizei o uso de GuidRepresentation.Standard

Registrei corretamente o AppDb no container de dependências

Também realizei um saneamento completo do banco utilizando o MongoDB Compass (Drop Collection) para remover dados antigos que estavam causando conflitos.

🔌 Integração com MediatR

Configurei o Program.cs para reconhecer todos os Handlers (Create, Update e GetAll), permitindo que a API deixasse de acessar o banco diretamente e passasse a utilizar um padrão desacoplado via MediatR.

Organizei a injeção de dependência:

IMongoClient como Singleton

IProductRepository como Scoped

Isso garantiu resolução correta das dependências por requisição.

As rotas passaram a funcionar corretamente, retornando 200 OK, e o Swagger ficou ativo para testes na porta 5031.

🌐 Comunicação Frontend e Backend

Configurei o CORS com a política AllowReactApp, resolvendo o bloqueio do navegador e permitindo que o frontend em React consumisse a API sem problemas.

No frontend (React + Vite), fiz uma limpeza removendo componentes e ícones não utilizados, eliminando warnings e deixando o código mais leve. Ajustei também as rotas de consumo da API para que o dashboard exibisse corretamente os produtos.

🛠️ Problemas Técnicos Superados

Durante esse processo, enfrentei desafios importantes:

O erro de FileNotFound do MongoDB (a famosa “DLL fantasma”)

Conflito de UUID entre formatos Legacy e Standard

Conversão de System.Guid para string dentro dos Handlers

Inconsistências entre id e Id (CamelCase vs PascalCase)

Cada um desses pontos exigiu análise, testes e estudo — e foram fundamentais para consolidar a estabilidade do sistema.

🔄 Consolidação e UX Moderna

No terceiro dia, destravei definitivamente as funcionalidades de Create e Update, limpando referências ambíguas do MediatR.

Também unifiquei Commands e Handlers, deixando a estrutura mais simples, coesa e fácil de manter no longo prazo.

No frontend, implementei:

Lógica visual de alerta para estoque baixo

Melhorias na experiência do usuário

Interface refinada inspirada em layouts modernos (padrão Dribbble)

Utilizei Tailwind CSS para garantir uma interface responsiva, limpa e consistente.

🔐 Evolução para um Sistema Corporativo

O projeto evoluiu de um simples CRUD para uma aplicação com características corporativas:

Dashboard com métricas (Total de Itens, Valor de Estoque, Alertas)

CRUD completo em tempo real

Integração com autenticação via Keycloak

Controle de acesso baseado em Roles (Admin e Viewer)

Validações no frontend para melhorar performance e experiência

🧠 Tomada de Decisões Técnicas Durante a Jornada

Durante o desenvolvimento, algo que foi essencial não foi apenas fazer funcionar, mas entender por que cada escolha estava sendo feita. Em vários momentos existiam caminhos diferentes, e cada decisão foi tomada pensando em desempenho, organização, escalabilidade e principalmente experiência do usuário.

🎨 Por que Tailwind CSS e não CSS puro?

Decisão: Utilizar classes utilitárias diretamente no HTML.

Motivo: O Tailwind permitiu uma prototipagem muito mais rápida e consistente. Além disso, ele remove automaticamente CSS não utilizado no build final, deixando a aplicação mais leve do que bibliotecas mais pesadas como Bootstrap. Isso me permitiu focar mais na lógica do sistema sem perder qualidade visual.

🔐 Por que Roles (Admin/Viewer) no Frontend?

Decisão: Esconder botões e bloquear funções com base no token.

Motivo: Experiência do usuário. Não faz sentido permitir que um usuário clique em “Excluir” para depois receber um erro 403 Forbidden. Ao controlar isso no frontend, evitei frustração e deixei a interface mais inteligente e profissional.

🧩 Por que usar React.Fragment na tabela?

Decisão: Utilizar **<React.Fragment>** para envolver múltiplas linhas.

Motivo: Estrutura HTML válida. Uma **<table>** não aceita **<div>** diretamente entre **<tr>**. O Fragment permitiu que cada produto ocupasse duas linhas (dados principais e descrição expandida) sem quebrar o layout ou gerar erro estrutural.

🎯 Por que Lucide React para ícones?

Decisão: Utilizar uma biblioteca de ícones vetoriais leves.

Motivo: Os ícones são leves, altamente customizáveis e passam uma sensação mais profissional. Ícones como o de alerta para estoque baixo ajudam o usuário a identificar problemas visualmente muito mais rápido do que apenas texto.

⚡ Por que validar valores negativos no Frontend?

Decisão: Bloquear preços menores que zero antes de enviar para a API.

Motivo: Redução de carga no servidor e resposta imediata ao usuário. Embora o backend também valide, impedir o erro antes da requisição economiza processamento e melhora a experiência.

🏗️ Por que Clean Architecture e unificação de Commands/Handlers?

Decisão: Separar responsabilidades em camadas (Domain, Application, Infrastructure e API) e unificar Commands com seus respectivos Handlers.

Motivo: Manutenibilidade e escalabilidade. Essa organização evita acoplamento excessivo, facilita testes e permite que o sistema cresça de forma estruturada. A unificação também reduziu ambiguidade no MediatR e deixou o código mais claro.

🎯 Conclusão

Concluir esse projeto foi uma experiência extremamente desafiadora e transformadora para mim. Foram cinco dias intensos de construção, testes, erros, ajustes e muito aprendizado prático. Cada problema resolvido — seja de arquitetura, integração, autenticação ou banco de dados — contribuiu diretamente para o meu amadurecimento técnico.

Esse desafio realmente foi um grande quebra-cabeça, com momentos de frustração e momentos de conquista, mas justamente por isso ele se tornou tão valioso. Sinto que, ao finalizar o projeto, evoluí não apenas na parte técnica, mas também na forma de raciocinar, investigar problemas e estruturar soluções de maneira mais profissional.