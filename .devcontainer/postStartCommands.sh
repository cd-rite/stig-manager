#!/bin/bash

echo $CODESPACE_NAME
echo $GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
echo $MY_CONTAINER_VAR2
echo $STIGMAN_CLIENT_OIDC_PROVIDER

docker run --name stig-manager-auth -d --rm -p 8080:8080 -p 8443:8443 -e KC_PROXY=edge -e KC_HOSTNAME_URL=https://$CODESPACE_NAME-8080.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN/ -e KC_HOSTNAME_ADMIN_URL=https://$CODESPACE_NAME-8080.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN/ nuwcdivnpt/stig-manager-auth

docker run --name stig-manager-db -d --rm -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=stigman -e MYSQL_USER=stigman -e MYSQL_PASSWORD=stigman  mysql:8 --innodb-buffer-pool-size=512M --sort_buffer_size=100M

(cd api/source && npm ci)