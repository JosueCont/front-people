# ==== CONFIGURE =====
FROM node:16-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
# ==== BUILD =====
RUN yarn
# RUN npm install --silent
COPY . /app
RUN yarn build
# ==== RUN =======
# ENV NODE_ENV production
EXPOSE 3006
ENTRYPOINT ["yarn", "dev" ]
