# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# 1. Copia o arquivo da solução (.sln) para a raiz do WORKDIR (/app)
COPY *.slnx .

# 2. Copia os arquivos .csproj mantendo a estrutura de pastas
COPY Hypesoft.API/*.csproj ./Hypesoft.API/
COPY Hypesoft.Application/*.csproj ./Hypesoft.Application/
COPY Hypesoft.Domain/*.csproj ./Hypesoft.Domain/
COPY Hypesoft.Infrastructure/*.csproj ./Hypesoft.Infrastructure/

# 3. Restaura as dependências (Agora o .sln está no lugar certo)
RUN dotnet restore

# 4. Copia todo o restante do código fonte
COPY . .

# 5. Compila e publica a API
RUN dotnet publish Hypesoft.API/Hypesoft.API.csproj -c Release -o /out

# Estágio Final (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .

# Configura a porta
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]