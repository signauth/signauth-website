#!/usr/bin/env bash

docker run -it --rm \
  --name signauth-cc-dev \
  -p 6969 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/signauth-cc \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=signauth.cc.localhost,www.signauth.cc.localhost \
  -w /usr/src/app node:carbon npm run start
