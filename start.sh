#!/bin/sh

if [ "$DEBUG" = "true" ]; then
  echo "Starting with debugger enabled on port 9229..."
  exec node --inspect=0.0.0.0:9229 ./bin/www
else
  echo "Starting normally..."
  exec node ./bin/www
fi
