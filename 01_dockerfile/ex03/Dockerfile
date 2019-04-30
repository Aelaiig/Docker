FROM ubuntu:16.04
# RUN apt-get update -q && apt-get -y upgrade\
#    && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
#      ca-certificates \
#      openssh-server \
#      curl \
#      postfix \
#      vim \
#      tzdata

EXPOSE 22 80 443

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ca-certificates openssh-server wget postfix tzdata libnss3-tools vim

WORKDIR /

RUN wget https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh 
RUN bash script.deb.sh 

WORKDIR /etc/ssl/certs/

RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.1.2/mkcert-v1.1.2-linux-amd64

RUN mv mkcert-v1.1.2-linux-amd64 mkcert
RUN chmod +x mkcert
RUN mv mkcert /usr/local/bin/
RUN mkcert -install
RUN mkcert localhost

RUN apt-get install -y gitlab-ce

COPY ./config/gitlab.rb /etc/gitlab/
COPY ./config/sshd_config /etc/ssh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD [ "bash", "/entrypoint.sh" ]

# docker build -t gitlab101 .
# docker run -it --rm --hostname localhost -p 80:80 -p 21:22 -p 443:443 --privileged gitlab101

# gcl https
# git -c  http.sslVerify=false clone https://localhost/root/<repo>.git
# git -c http.sslVerify=false pull/push

# gcl ssh
# cpy key into git lab : cat ~/.ssh/id_rsa.pub
# gcl ssh://git@localhost:21/root/<repo>.git
# Make sur your file ~/.ssh/known_hosts  don't know your host (here localhost)


