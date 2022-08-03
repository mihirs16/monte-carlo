#!/bin/sh

# install certbot
apk add --update python3 py3-pip
apk add certbot
pip install certbot-nginx

# generate ssl certificate
certbot --non-interactive --nginx -d monteapi.mihirsingh.dev -m mihirs16@gmail.com --agree-tos
certbot renew --dry-run

