FROM node:22-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
RUN apt update && apt install -y python3 python-is-python3 
COPY . /app
CMD ["node", "index"]