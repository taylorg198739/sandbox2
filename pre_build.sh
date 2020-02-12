#!/usr/bin/env bash

#
# Copyright (c) 2019 WiteSand Systems Inc. All rights reserved.
#

ROOT=$(dirname "${BASH_SOURCE[0]}")
cd ${ROOT}

if [ -f pre_build.done ]; then
	exit 0
fi
rm -rf vendor/github.com/gogo
mkdir -p vendor/github.com/gogo
cp -r /go/src/github.com/gogo/protobuf vendor/github.com/gogo/protobuf
rm -rf vendor/k8s.io
mkdir -p vendor/k8s.io
cp -r ../apiserver/staging/src/k8s.io vendor
./aio/scripts/update-codegen.sh
if [ $? -eq 0 ]; then
	touch pre_build.done
fi
