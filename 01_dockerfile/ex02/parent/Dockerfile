FROM ruby:latest

RUN apt-get update && apt-get install -y nodejs build-essential
RUN gem install bundler rails

ONBUILD COPY app /opt/app

WORKDIR /opt/app   

ONBUILD RUN bundle install
ONBUILD RUN rails db:migrate
ONBUILD RUN rails db:setup

# docker build -t ft-rails:on-build .