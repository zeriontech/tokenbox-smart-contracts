#!/bin/bash
list_descendants () {
  local children=$(ps -o pid= --ppid "$1")

  for pid in $children
  do
    list_descendants "$pid"
  done

  echo "$children"
}

shutdown() {
  kill $(list_descendants $$) &> /dev/null
}

./serve/run_node.sh &> /dev/null  &
yarn run truffle migrate --reset --compile-all
yarn run truffle test ./test/owned.js ./test/tokenbox_token.js ./test/distribution.js
shutdown &> /dev/null
trap 'shutdown' SIGINT SIGTERM EXIT
