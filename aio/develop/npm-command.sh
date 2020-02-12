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

# Run npm command if K8S_DASHBOARD_NPM_CMD is set,
# otherwise install and start dashboard.

echo "Start dashboard"
# echo "CREATED (touch-ed) /root/.kube/config"

NODE_OPTIONS=--max_old_space_size=4096 \
K8S_DASHBOARD_BIND_ADDRESS=0.0.0.0 \
K8S_DASHBOARD_CONTAINER=TRUE \
K8S_DASHBOARD_CMD= \
HOME=/root \
K8S_DASHBOARD_PORT=8080 \
K8S_DASHBOARD_DEBUG= \
K8S_OWN_CLUSTER= \
NG_CLI_ANALYTICS=false \
SHLVL=2 \
GIT_EDITOR=nano \
LOCAL_GID=0 \
GO111MODULE=on \
CHROME_BIN=/usr/bin/chromium \
K8S_DASHBOARD_NPM_CMD= \
PATH=/go/bin:/go/bin:/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
KUBE_DASHBOARD_APISERVER_HOST=http://ec2-54-241-135-160.us-west-1.compute.amazonaws.com:8081 \
GOPATH=/go \
K8S_DASHBOARD_SIDECAR_HOST=http://localhost:8000 \
npm start \
  --kubernetes-dashboard:bind_address=0.0.0.0 \
  --kubernetes-dashboard:sidecar_host=http://localhost:8000 \
  --kubernetes-dashboard:port=8080


