# Creating multi-stage build for production
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN npm install -g node-gyp
RUN pnpm config set network-timeout 600000 --global \
    && pnpm install --frozen-lockfile --prod
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN pnpm build

# Creating final production image
FROM node:22-alpine
RUN apk add --no-cache vips-dev curl

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

ENV NODE_ENV=production

WORKDIR /opt/app
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/app ./
ENV PATH=/opt/app/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337

CMD ["pnpm", "start"]
