FROM node:22-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
# RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache \
    fontconfig \
    ttf-liberation \
    ttf-dejavu \
    font-noto \
    font-noto-georgian \
    font-awesome \
    pango \
    cairo
COPY utils/media/assets/fonts/ /usr/share/fonts/custom/
RUN chmod -R 644 /usr/share/fonts/custom/ && \
    fc-cache -f -v
COPY . /app
CMD ["node", "index"]