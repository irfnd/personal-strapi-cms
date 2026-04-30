# Stage 1: Build
FROM node:22-alpine AS build
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm ci
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build \
    && cd /opt && npm prune --omit=dev

# Stage 2: Production image
FROM node:22-alpine
RUN apk add --no-cache vips-dev curl

ENV NODE_ENV=production

WORKDIR /opt/app
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/app ./
ENV PATH=/opt/app/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
