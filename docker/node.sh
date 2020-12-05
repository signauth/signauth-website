#!/usr/bin/env bash

docker stop signauth-cc
docker rm signauth-cc

docker run -d \
  --name signauth-cc \
  -p 6969 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/signauth-cc_app:/var/log/signauth-cc_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=signauth.cc,www.signauth.cc \
  -e LETSENCRYPT_HOST=signauth.cc,www.signauth.cc \
  -e LETSENCRYPT_EMAIL=signauth@sullo.co \
  -w /usr/src/app node:12.20.0-alpine3.10 npm run start
