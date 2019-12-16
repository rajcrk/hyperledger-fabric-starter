#!/bin/bash
set -e
# checking if docker is installed on the system
_=$(command -v docker);
if [ "$?" != "0" ]; then
  printf -- 'You dont seem to have Docker installed.\n';
  printf -- 'Get it: https://www.docker.com/community-edition\n';
  printf -- 'Exiting with code 127...\n';
  exit 127;
fi;

sudo chmod 777 -R data/
sudo chmod 777 -R src/common/config/
sudo rm -rf src/common/config/creds

echo "##########################################################"
echo "######  removing all up fabric network containers ########"
echo "##########################################################"
pushd ../first-network
./byfn.sh -m down
popd
echo finished removing all up fabric network containers

printf -- '+ sleep 10s';
sleep 10

pushd ../fabric-network
./startFabric.sh
popd
echo Finished Setting up the Fabric Network

docker-compose down
docker-compose -f docker-compose.yml up -d

printf -- 'sleep 5s';
sleep 5
printf -- 'bat-web-service http://localhost:3006/api/ \n';
printf -- '\n';
exit 0;