#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0) && pwd)

export START_RAILS_COMMAND="rm -f /app/tmp/pids/server.pid;"
# debugモードに切り替える設定
if [ "$DEBUG_MODE" = "1" ] ; then
  # debug mode
  START_RAILS_COMMAND="${START_RAILS_COMMAND} rdebug-ide --debug --host 0.0.0.0 --port 1234 -- /usr/local/bundle/bin/bundle exec rails s -p 3000 -b 0.0.0.0"
else
  # normal mode
  START_RAILS_COMMAND="${START_RAILS_COMMAND} bundle exec rails s -b '0.0.0.0'"
fi
YML_FILE=$SCRIPT_DIR/docker-compose.yml

docker-compose -f $YML_FILE $* 