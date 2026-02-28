# Estágio de Build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O Vite compila para a pasta dist
RUN npm run build

# Estágio Final (Nginx)
FROM nginx:stable-alpine
# Copia os arquivos buildados do estágio anterior (pasta 'dist') para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]