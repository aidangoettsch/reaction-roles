FROM node:15.8.0-alpine3.12

USER root
RUN groupadd -r app && useradd --no-log-init -r -g app app
WORKDIR /home/app
COPY . /home/app/
RUN npm i -g pnpm
RUN pnpm i

USER app
ENTRYPOINT [ "node" ]
CMD [ "/home/app/build/bot.js" ]
