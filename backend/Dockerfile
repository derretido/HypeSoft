# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copia os arquivos .csproj mantendo a estrutura de pastas
COPY Hypesoft.API/Hypesoft.API.csproj ./Hypesoft.API/
COPY Hypesoft.Application/Hypesoft.Application.csproj ./Hypesoft.Application/
COPY Hypesoft.Domain/Hypesoft.Domain.csproj ./Hypesoft.Domain/
COPY Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj ./Hypesoft.Infrastructure/

# Restaura as dependências de cada projeto (mais robusto)
RUN dotnet restore Hypesoft.API/Hypesoft.API.csproj

# Copia todo o restante do código
COPY . .

# Compila e publica
RUN dotnet publish Hypesoft.API/Hypesoft.API.csproj -c Release -o /out

# Estágio Final (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .

# Configura a porta
ENV ASPNETCORE_URLS=http://+:5031
EXPOSE 5031

ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]