FROM ubuntu:latest

RUN apt-get update -yq && apt-get upgrade -yq && \
    apt-get install -yq curl git ssh sshpass
RUN apt-get -q -y install nodejs npm build-essential
RUN ln -s "$(which nodejs)" /usr/bin/node
RUN npm install -g npm bower grunt-cli gulp

# copy app and install deps
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --save

EXPOSE 3000
CMD [ "npm", "start" ]