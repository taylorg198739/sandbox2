#!/usr/bin/env bash

# Copyright 2017 The Kubernetes Authors.
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

set -o errexit
set -o nounset
set -o pipefail

SCRIPT_ROOT=$(dirname "${BASH_SOURCE[0]}")/../..
CODEGEN_PKG=vendor/k8s.io/code-generator
echo $SCRIPT_ROOT

mkdir -p /root/go/src/k8s.io/code-generator/hack
echo "// Copyright (c) 2019 WiteSand Systems Inc. All rights reserved." > /root/go/src/k8s.io/code-generator/hack/boilerplate.go.txt
"${CODEGEN_PKG}"/generate-groups.sh "deepcopy,client,informer,lister" \
  github.com/kubernetes/dashboard/src/app/backend/plugin/client github.com/kubernetes/dashboard/src/app/backend/plugin \
  apis:v1alpha1 \
  --go-header-file "${SCRIPT_ROOT}"/aio/scripts/license-header.go.txt \
  --output-base "$(dirname "${BASH_SOURCE[0]}")/.."
"${CODEGEN_PKG}"/generate-groups.sh all \
  ./vendor/k8s.io/client-go/kubernetes \
  ../apiserver/pkg/apis  \
  ../apiserver/pkg/apis  \
  witesand:v1

# Remove old generated client
rm -rf ./src/app/backend/plugin/client
# Move generated deepcopy funcs and client
mv "$(dirname "${BASH_SOURCE[0]}")"/../github.com/kubernetes/dashboard/src/app/backend/plugin/apis/v1alpha1/zz_generated.deepcopy.go ./src/app/backend/plugin/apis/v1alpha1
mv "$(dirname "${BASH_SOURCE[0]}")"/../github.com/kubernetes/dashboard/src/app/backend/plugin/client ./src/app/backend/plugin
# Remove empty directory
rm -rf ./aio/github.com
