FROM ruby:latest

RUN apt-get update && apt-get install -y nodejs build-essential
RUN gem install bundler rails

ONBUILD COPY app /opt/app

WORKDIR /opt/app

ONBUILD RUN bundle install
ONBUILD RUN rails db:migrate
ONBUILD RUN rails db:setup

# # RUN dependencies
# # cpy app rails /opt/app
# # on build install gems / migrations-pop:db
# RUN bundle config --global frozen 1

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# ONBUILD COPY Gemfile /usr/src/app/
# ONBUILD COPY Gemfile.lock /usr/src/app/
# ONBUILD RUN bundle install

# ONBUILD COPY . /usr/src/app

# RUN apt-get update && apt-get install -y nodejs --no-install-recommends && rm -rf /var/lib/apt/lists/*
# RUN apt-get update && apt-get install -y mysql-client postgresql-client sqlite3 --no-install-recommends && rm -rf /var/lib/apt/lists/*

# # CMD ["rails", "server", "-b", "0.0.0.0"]
