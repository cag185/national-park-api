# syntax=docker/dockerfile:1
FROM node:lts-alpine

WORKDIR /app

COPY . .

# Install all deps (not just prod), so prisma can generate client
RUN yarn install && npx prisma generate

EXPOSE 3000

CMD ["node", "./bin/www"]
