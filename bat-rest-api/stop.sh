#!/bin/sh
set -e
# checking if docker is installed on the system
_=$(command -v docker);
if [ "$?" != "0" ]; then
  printf -- 'You dont seem to have Docker installed.\n';
  printf -- 'Get it: https://www.docker.com/community-edition\n';
  printf -- 'Exiting with code 127...\n';
  exit 127;
fi;

docker-compose -f docker-compose.yml down