# build environment
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json first for better Docker layer caching
COPY package.json package-lock.json* ./
RUN npm cache clean --force
RUN npm install --force

# Copy shared-types from parent directory
# Note: This requires building from the parent directory context
COPY ./shared-types ./shared-types

# Copy frontend source code
COPY . .

# Build the application
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public /home/www/static

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 5000