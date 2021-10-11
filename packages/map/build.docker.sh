#!/bin/bash
GIT_VERSION=${GIT_VERSION:-$(git describe --abbrev=4 --dirty --always --tags)}
GIT_HASH=${GIT_HASH:-$(git rev-parse HEAD)}

docker build --build-arg GIT_HASH=$GIT_HASH --build-arg GIT_VERSION=$GIT_VERSION -t blacha/diablo2 .