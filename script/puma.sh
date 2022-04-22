#!/bin/bash
# Sample for Amazon Linux2
NAME=puma
USER=ec2-user
APP_NAME=lifecode_cms
APP_DIR=/home/$USER/$APP_NAME
LOG_DIR=$APP_DIR/log
LOG_FILE=$APP_DIR/log/puma.log
ERROR_FILE=$APP_DIR/log/puma.err

TMP_DIR=$APP_DIR/tmp
PID_DIR=$TMP_DIR/pids
PID_FILE=$PID_DIR/puma.pid
HOME=/home/$USER
BUNDLE=/home/$USER/.rbenv/shims/bundle

start() {
  # echo "--------------------------------"
  # echo "Starting puma init script."
  # echo
  # echo "---init script config parameters---"
  # echo "USER= $USER"
  # echo "APP_NAME= $APP_NAME"
  # echo "APP_DIR= $APP_DIR"
  # echo "TMP_DIR= $TMP_DIR"
  # echo "PID_FILE= $PID_FILE"
  # echo "NODE_VERSION= $NODE_VERSION"
  # echo
  # echo "---context information---"
  # echo "pwd=" `pwd`
  # echo "NVM_VERSION=" `nvm --version`
  # echo "NODE_VERSION=" `node --version`
  # echo
  # echo "---start the service.---"
  sudo su $USER -c "cd $APP_DIR; $BUNDLE exec puma -e production -C config/puma.rb  1> $LOG_FILE  2> $ERROR_FILE"
}

stop() {
  echo "Stopping puma"
  if [ -e $PID_FILE ]; then
    kill -9 `cat $PID_FILE` || true
  fi
}

restart() {
  stop
  start $1
}

case "$1" in
  start)
    start $2
    ;;
  stop)
    stop
    ;;
  restart)
    restart $2
    ;;
  *)
    N=/etc/init.d/$NAME
    echo "Usage: $N {start|stop|restart}" >&2
    exit 1
    ;;
esac