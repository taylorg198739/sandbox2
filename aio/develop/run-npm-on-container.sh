#!/bin/bash

# Copyright 2019 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This runs npm commands for dashboard in container.
#
# To run dashboard on container, simply run `run-npm-command.sh`.
# To run npm command in container, set K8S_DASHBOARD_NPM_CMD variable
# like "run check" or run like `run-npm-command.sh run check`.

set -x

export K8S_DASHBOARD_BIND_ADDRESS="0.0.0.0"
KUBE_DASHBOARD_APISERVER_HOST="http://ec2-54-241-135-160.us-west-1.compute.amazonaws.com:8081"
if [[ "$OSTYPE" == "darwin"* ]]; then
    KUBE_DASHBOARD_APISERVER_HOST="http://host.docker.internal:8081"
fi
export KUBE_DASHBOARD_APISERVER_HOST

CD="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# User and group ID to execute commands.
LOCAL_UID=$(id -u)
LOCAL_GID=$(id -g)

# K8S_DASHBOARD_NPM_CMD will be passed into container and will be used
# by run-npm-command.sh on container. Then the shell sciprt will run `npm`
# command with K8S_DASHBOAD_NPM_CMD.
# But if K8S_DASHBOARD_CMD is set, the command in K8S_DASHBOARD_CMD will be
# executed instead of `npm ${K8S_DASHBOARD_NPM_CMD}`.
K8S_DASHBOARD_NPM_CMD=$*

# kubeconfig for dashboard.
# This will be mounted and certain npm command can modify it,
# so this should not be set for original kubeconfig.
# Set defult as kubeconfig made by `npm run cluster:start`.
if [[ -n "${K8S_DASHBOARD_KUBECONFIG}" ]] ; then
  K8S_OWN_CLUSTER=true
else
  touch ${DIR}/../../kind.kubeconfig
  K8S_DASHBOARD_KUBECONFIG=$(pwd ${DIR}/../../)/kind.kubeconfig
fi

# Bind addres for dashboard
K8S_DASHBOARD_BIND_ADDRESS=${K8S_DASHBOARD_BIND_ADDRESS:-"0.0.0.0"}

# Metrics Scraper sidecar host for dashboard
K8S_DASHBOARD_SIDECAR_HOST=${K8S_DASHBOARD_SIDECAR_HOST:-"http://localhost:8000"}
if [[ "$OSTYPE" == "darwin"* ]]; then
    K8S_DASHBOARD_SIDECAR_HOST=${K8S_DASHBOARD_SIDECAR_HOST:-"http://host.docker.internal:8000"}
fi

# Port for dashboard (frontend)
K8S_DASHBOARD_PORT=${K8S_DASHBOARD_PORT:-"8080"}

# Debugging port for dashboard (backend)
K8S_DASHBOARD_DEBUG_PORT=${K8S_DASHBOARD_DEBUG_PORT:-"2345"}

# Build and run container for dashboard
DASHBOARD_IMAGE_NAME=${K8S_DASHBOARD_CONTAINER_NAME:-"k8s-dashboard-dev-image"}
K8S_DASHBOARD_SRC=${K8S_DASHBOARD_SRC:-"${CD}"}
K8S_WS_SRC=$(realpath ${K8S_DASHBOARD_SRC}/..)
K8S_DASHBOARD_CONTAINER_NAME=${K8S_DASHBOARD_CONTAINER_NAME:-"k8s-dashboard-dev"}
K8S_DASHBOARD_SRC_ON_CONTAINER=/root/go/src/github.com/witesand/sandbox2
K8S_WS_SRC_ON_CONTAINER=/root/go/src/github.com/witesand

echo "Remove existing container ${K8S_DASHBOARD_CONTAINER_NAME}"
docker rm -f ${K8S_DASHBOARD_CONTAINER_NAME}

# Always test if the image is up-to-date. If nothing has changed since last build,
# it'll just use the already-built image
echo "Start building container image for development"
docker build -t ${DASHBOARD_IMAGE_NAME} -f ${DIR}/Dockerfile ${DIR}/../../

# Run dashboard container for development and expose necessary ports automatically.
echo "Run container for development"
docker run --rm \
  -v `pwd`/..:/root/go/src/github.com/witesand \
  -w /root/go/src/github.com/witesand/sandbox2 \
  -ti ${DASHBOARD_IMAGE_NAME} \
  bash ./pre_build.sh

DOCKER_RUN_OPTS="--rm -it --name=${K8S_DASHBOARD_CONTAINER_NAME}"
DOCKER_RUN_OPTS+=" --cap-add=SYS_PTRACE"
DOCKER_RUN_OPTS+=" --tmpfs=`pwd`/node_modules:exec,gid=500,uid=500"
DOCKER_RUN_OPTS+=" -v ${K8S_WS_SRC}:${K8S_WS_SRC_ON_CONTAINER}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_NPM_CMD=${K8S_DASHBOARD_NPM_CMD}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_CMD=${K8S_DASHBOARD_CMD}"
DOCKER_RUN_OPTS+=" -e K8S_OWN_CLUSTER=${K8S_OWN_CLUSTER}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_BIND_ADDRESS=${K8S_DASHBOARD_BIND_ADDRESS}"
DOCKER_RUN_OPTS+=" -e KUBE_DASHBOARD_APISERVER_HOST=${KUBE_DASHBOARD_APISERVER_HOST}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_SIDECAR_HOST=${K8S_DASHBOARD_SIDECAR_HOST}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_PORT=${K8S_DASHBOARD_PORT}"
DOCKER_RUN_OPTS+=" -e K8S_DASHBOARD_DEBUG=${K8S_DASHBOARD_DEBUG}"
DOCKER_RUN_OPTS+=" -p 80:${K8S_DASHBOARD_PORT}"
DOCKER_RUN_OPTS+=" -e LOCAL_GID=${LOCAL_GID} -e LOCAL_UID=${LOCAL_UID}"
DOCKER_RUN_OPTS+=" -p ${K8S_DASHBOARD_DEBUG_PORT}:${K8S_DASHBOARD_DEBUG_PORT}"
DOCKER_RUN_OPTS+=" -w /root/go/src/github.com/witesand/sandbox2"

if [[ "$OSTYPE" != "darwin"* ]]; then
    DOCKER_RUN_OPTS+=" --net=host"
fi

docker run ${DOCKER_RUN_OPTS}  ${DASHBOARD_IMAGE_NAME}
