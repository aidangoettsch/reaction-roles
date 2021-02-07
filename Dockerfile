FROM node:15.8.0-alpine3.12

USER root
WORKDIR /home/app
COPY . /home/app/
RUN npm i -g pnpm
RUN pnpm i

ENTRYPOINT [ "node" ]
CMD [ "/home/app/build/bot.js" ]
