#!/bin/bash

DIR="$(dirname "${BASH_SOURCE[0]}")"

OS=""
ARCH=""

case $(uname -m) in
  arm64)    ARCH="arm64" ;;
  aarch64)  ARCH="arm64" ;;
  x86_64)   ARCH="amd64" ;;
  *)        ARCH=""
esac

if [ "$ARCH" = "" ] ; then
  echo "Cross-platform Fixie Wrench launcher expected arm64, aarch64, or x86_64. For other architectures, you can build from source: https://github.com/usefixie/fixie-wrench"
  exit 1
fi

case "$OSTYPE" in
  darwin*)  OS="macos" ;; 
  linux*)   OS="linux" ;;
  msys*)    OS="windows" ;;
  cygwin*)  OS="windows" ;;
  *)        OS=""
esac

if [ "$OS" = "windows" ] ; then
  echo "Cross-platform Fixie Wrench launcher does not currently support Windows, but you can download a prebuilt binary for Windows: https://github.com/usefixie/fixie-wrench"
  exit 1
elif [ "$OS" = "" ] ; then
  echo "Unsupported OS, but you may be able to build Fixie Wrench from source for your platform: https://github.com/usefixie/fixie-wrench"
  exit 1
fi

FIXIE_BINARY="$DIR/fixie-wrench-$OS-$ARCH"

while $FIXIE_BINARY $@ ; ((ret=$?)) ;do
  if [ $? -eq 1 ]; then
    echo "Fixie-wrench exited with status 1. Restarting..."
  else
    break
  fi
done
