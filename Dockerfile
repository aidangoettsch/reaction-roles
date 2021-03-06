FROM node:15.8.0-alpine3.12

USER root
RUN npm i -g pnpm typescript
RUN apk add --no-cache python3 make g++
WORKDIR /home/app
COPY package.json /home/app/
COPY pnpm-lock.yaml /home/app/
RUN pnpm i
COPY . /home/app/
RUN pnpm build

ENTRYPOINT [ "node" ]
CMD [ "/home/app/build/bot.js" ]
