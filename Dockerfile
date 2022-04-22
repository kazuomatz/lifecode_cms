FROM ruby:2.6.5
ENV LANG C.UTF-8

EXPOSE 3000 1234 26162

RUN rm -f /etc/localtime
RUN ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN apt-get update -qq && \
apt-get install -y lsb-release && \
apt remove -y libmariadb-dev-compat libmariadb-dev && \
apt-get install -y build-essential  nodejs  unzip imagemagick graphicsmagick-libmagick-dev-compat mecab libmecab-dev mecab-ipadic-utf8 poppler-utils
WORKDIR /

RUN wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-common_8.0.18-1debian10_amd64.deb \
    https://dev.mysql.com/get/Downloads/MySQL-8.0/libmysqlclient21_8.0.18-1debian10_amd64.deb \
    https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-client-core_8.0.18-1debian10_amd64.deb \
    https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-client_8.0.18-1debian10_amd64.deb \
    https://dev.mysql.com/get/Downloads/MySQL-8.0/libmysqlclient-dev_8.0.18-1debian10_amd64.deb

RUN dpkg -i mysql-common_8.0.18-1debian10_amd64.deb \
    libmysqlclient21_8.0.18-1debian10_amd64.deb \
    mysql-community-client-core_8.0.18-1debian10_amd64.deb \
    mysql-community-client_8.0.18-1debian10_amd64.deb \
    libmysqlclient-dev_8.0.18-1debian10_amd64.deb

# install nodejs
ENV NODE_VERSION 10.15.1
RUN curl --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" > /tmp/node.tar.xz && \
  tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 && \
  ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
  rm /tmp/node.tar.xz

# install yarn
ENV YARN_VERSION 1.13.0
RUN curl -L --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" > /tmp/yarn.tar.gz && \
  tar -xzf /tmp/yarn.tar.gz -C /opt && \
  ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn && \
  ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg && \
  rm /tmp/yarn.tar.gz

ENV NODE_ROOT /app
WORKDIR $NODE_ROOT
RUN mkdir -p $NODE_ROOT
ADD package.json $NODE_ROOT
ADD yarn.lock $NODE_ROOT
RUN yarn install

ENV RAILS_ROOT /app
RUN mkdir -p $RAILS_ROOT

WORKDIR $RAILS_ROOT

ENV RAILS_ENV='development'
ENV RACK_ENV='development'
RUN gem install bundler:2.0.1

#RUN mkdir gem
#COPY gem/ruby-debug-ide-0.8.0.beta3.gem  gem/ruby-debug-ide-0.8.0.beta3.gem
#RUN gem install gem/ruby-debug-ide-0.8.0.beta3.gem

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install

ADD . /app
RUN mkdir -p tmp/sockets
RUN mkdir -p /var/lib/mysql
RUN touch tmp/sockets/puma.sock
RUN mkdir -p tmp/pids
