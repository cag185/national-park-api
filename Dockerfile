# # syntax=docker/dockerfile:1
# FROM node:lts-alpine

# WORKDIR /app

# COPY . .

# # Install all deps (not just prod), so prisma can generate client
# RUN yarn install && npx prisma generate

# EXPOSE 3000

# EXPOSE 9229

# CMD ["node", "./bin/www"]

# syntax=docker/dockerfile:1
FROM node:lts-alpine

WORKDIR /app

COPY . .

# Install all dependencies including devDeps so prisma works
RUN yarn install && npx prisma generate

# Copy custom start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000
EXPOSE 9229

CMD ["/start.sh"]
