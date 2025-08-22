# Etapa 1: build
FROM node:18-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar resto del código y compilar
COPY . .
RUN pnpm run build

# Etapa 2: runtime
FROM node:18-alpine

# Instalar pnpm en runtime también
RUN npm install -g pnpm

WORKDIR /app

# Copiar node_modules y dist desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]
