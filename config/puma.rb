#!/usr/bin/env puma
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count
workers 1

environment 'production'
pidfile "#{Dir.pwd}/tmp/pids/puma.pid"
state_path "#{Dir.pwd}/tmp/pids/puma.state"

# The default is "tcp://0.0.0.0:9292".
#
bind 'tcp://0.0.0.0:3000'
# bind 'unix:///var/run/puma.sock'
bind "unix:///#{Dir.pwd}/tmp/sockets/puma.sock?umask=0111"
# bind 'ssl://127.0.0.1:9292?key=path_to_key&cert=path_to_cert'

preload_app!
