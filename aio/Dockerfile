# Copyright (c) 2019 WiteSand Systems Inc. All rights reserved.

FROM alpine:3.10

RUN echo http://linux1.dev.ws/alpine/v3.10/main > /etc/apk/repositories
RUN echo http://linux1.dev.ws/alpine/v3.10/community >> /etc/apk/repositories
RUN apk add --no-cache busybox-extras curl bash


# Add all files from current working directory to the root of the image, i.e., copy dist directory
# layout to the root directory.
ADD . /

# The port that the application listens on.
EXPOSE 80 8443
ENTRYPOINT ["/dashboard", "--insecure-bind-address=0.0.0.0", "--bind-address=0.0.0.0", "--enable-skip-login"]
