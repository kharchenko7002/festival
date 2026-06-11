# Stage 1: build the React/Vite frontend
FROM node:22-alpine AS build

WORKDIR /build

COPY app/package*.json ./app/
RUN npm --prefix app ci

COPY app ./app
RUN npm --prefix app run build

# Stage 2: Express server that serves the build and the /api routes
FROM node:22-alpine

WORKDIR /app

# Backend dependencies (express)
COPY package*.json ./
RUN npm ci --omit=dev

# Backend source
COPY server ./server

# Read-only festival dataset (used by the backend for validation)
COPY app/src/data/datasett.json ./app/src/data/datasett.json

# Built frontend from stage 1
COPY --from=build /build/app/dist ./app/dist

ENV NODE_ENV=production
ENV PORT=80

# Express listens on port 80 inside the container, so the existing run command
# still works: docker run -d --name 2inf-festival-web -p 8080:80 ... 2inf-festival
EXPOSE 80

CMD ["node", "server/index.js"]
