# ==== CONFIGURE =====
FROM node:16-alpine
WORKDIR /code
COPY ./package.json /code/
COPY ./patches /code/patches
# ==== BUILD =====
RUN yarn
ENV PATH /code/node_modules/.bin:$PATH
# RUN npm install --silent
COPY . /code/app/
WORKDIR /code/app/
RUN yarn build
# ==== RUN =======
# Ejecuta yarn start solo en un entorno de producción
CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then npm start; fi"]
