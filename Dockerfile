FROM node:15.8.0-alpine3.12

USER root
RUN npm i -g pnpm
RUN apk add --no-cache python3 make g++
WORKDIR /home/app
COPY . /home/app/
RUN pnpm i
RUN pnpm build

ENTRYPOINT [ "node" ]
CMD [ "/home/app/build/bot.js" ]
