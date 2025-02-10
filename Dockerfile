FROM node:22-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
RUN apk add --no-cache python3 py3-pip
COPY . /app
CMD ["node", "index"]