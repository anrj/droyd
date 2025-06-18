FROM node:22-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
# RUN apk add --no-cache python3 py3-pip
COPY utils/media/assets/fonts/ /usr/share/fonts/custom/
RUN fc-cache -fv
COPY . /app
CMD ["node", "index"]