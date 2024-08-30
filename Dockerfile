FROM node:latest

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

WORKDIR /usr/app

ENTRYPOINT ["/entrypoint.sh"]