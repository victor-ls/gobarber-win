FROM node:12.18.0
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . .
EXPOSE 3333
CMD ["yarn", "sequelize", "db:migrate" ]
CMD ["yarn", "dev"]

