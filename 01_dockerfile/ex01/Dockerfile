FROM debian:latest

EXPOSE 9987
EXPOSE 30033
EXPOSE 10011

RUN apt-get update 
RUN apt-get install -y wget bzip2
RUN wget https://files.teamspeak-services.com/releases/server/3.7.1/teamspeak3-server_linux_amd64-3.7.1.tar.bz2
RUN tar -xjf teamspeak3-server_linux_amd64-3.7.1.tar.bz2
ENV TS3SERVER_LICENSE=accept
RUN useradd -d /teamspeak3-server_linux_amd64 toto
RUN chown -R toto:toto /teamspeak3-server_linux_amd64
USER toto

WORKDIR /teamspeak3-server_linux_amd64
ENTRYPOINT ./ts3server


# docker build -t <imageName> . 
# docker run --rm -it --publish=9987:9987/udp --publish=30033:30033/tcp --publish=10011:10011/tcp <imageName>