FROM node:15.8.0-alpine3.12

USER root
RUN npm i -g pnpm
RUN apk update
RUN apk add python
WORKDIR /home/app
COPY . /home/app/
RUN pnpm i

ENTRYPOINT [ "node" ]
CMD [ "/home/app/build/bot.js" ]
