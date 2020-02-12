#!/usr/bin/env bash

#
# Copyright (c) 2019 WiteSand Systems Inc. All rights reserved.
#

#fail on error
set -ex

FORCE=false
PUSH=false

while getopts ":f:p:" opt; do
  case $opt in
    f) FORCE="$OPTARG"
    ;;
    p) PUSH="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

msg_done() {
  echo "Dashboard build is DONE."
}

ROOT=$(dirname "${BASH_SOURCE[0]}")
cd "$ROOT" || exit 1

# using pre-build docker image
SHA=$(find ../controller/ddN *.sh src \
	-type f -print0 | sort -z | xargs -0 shasum | shasum | cut -c1-12)
IMAGE=docker.dev.ws:5000/dashboard
echo "Processing $IMAGE:$SHA ..."
docker pull $IMAGE:"$SHA" || :
if [[ "$(docker images -q $IMAGE:"$SHA" 2> /dev/null)" != "" ]]; then
  if [[ "$FORCE" != true ]]; then
	   msg_done $IMAGE:"$SHA"
  fi
  echo "Forcing rebuild ..."
fi

BLDIMAGE=docker.dev.ws:5000/dashboard-build:$(shasum < aio/develop/Dockerfile | cut -c1-12)
# try to pull image first
if [[ "$(docker images -q "${BLDIMAGE}" 2> /dev/null)" == "" ]]; then
  docker pull "${BLDIMAGE}" || :
fi
if [[ "$(docker images -q "${BLDIMAGE}" 2> /dev/null)" == "" ]]; then
  docker build -t "${BLDIMAGE}" -f aio/develop/Dockerfile .
  if [[ "$PUSH" = true ]]; then
    docker push "$BLDIMAGE"
    echo "Pushded $BLDIMAGE"
  fi
fi
PKGDIR=/tmp/$(whoami)/PKGS
mkdir -p ${PKGDIR}
chmod 777 ${PKGDIR}
BLDCONTAINER=docker.dev.ws:5000/build:v0.6

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DASHBOARD_REL_PATH=$(basename  ${SCRIPT_DIR})

docker run -e GOPRIVATE=github.com/witesand/* -e HOME=/root -u $(id -u):$(id -g) --rm -v ${PKGDIR}:/root/go/pkg:cached -v "$(dirname "$(pwd)")":/root/go/src/github.com/witesand:cached -w /root/go/src/github.com/witesand/${DASHBOARD_REL_PATH} ${BLDCONTAINER} ./scripts/generate-groups.sh "deepcopy,client,informer,lister" github.com/witesand/${DASHBOARD_REL_PATH}/src/app/backend/plugin/client github.com/witesand/${DASHBOARD_REL_PATH}/src/app/backend/plugin   apis:v1alpha1  --go-header-file ./aio/scripts/license-header.go.txt --output-base ../../.. --go-header-file ./scripts/custom.txt

PKGDIR=/tmp/$(whoami)/PKGS1
mkdir -p ${PKGDIR}
chmod 777 ${PKGDIR}
docker run -v ${PKGDIR}:/root/go/pkg:cached --rm -v "$(dirname "$(pwd)")":/root/go/src/github.com/witesand -w /root/go/src/github.com/witesand/"$(basename "$(pwd)")"  "${BLDIMAGE}" ./aio/scripts/build.sh

cd dist/amd64 && docker build -t $IMAGE:"$SHA" -t $IMAGE:latest . && cd -
# tag for internally use
docker tag $IMAGE:latest dashboard:latest
if [[ "$PUSH" = true ]]; then
	  docker push $IMAGE:latest
	  docker push $IMAGE:"$SHA"
	  echo "Pushded $IMAGE:$SHA"
fi
msg_done ""
