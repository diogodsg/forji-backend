FROM node:18 AS builder

WORKDIR "/forge-backend"

COPY . ./

RUN npm install --force

RUN npm run build build

RUN npm install --production --force

FROM node:18 AS production

WORKDIR "/forge-backend"

COPY --from=builder /forge-backend/package.json ./package.json
# COPY --from=builder /forge-backend/package-lock.json ./package-lock.json
COPY --from=builder /forge-backend/dist ./dist
COPY --from=builder /forge-backend/node_modules ./node_modules

EXPOSE 12954

CMD ["sh", "-c", "yarn start:prod"]
