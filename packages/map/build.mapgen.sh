#!/bin/bash
mkdir bin -p

GIT_VERSION=$(git describe --abbrev=4 --dirty --always --tags)
GIT_HASH=$(git rev-parse HEAD)

i686-w64-mingw32-g++ -o bin/d2-map.exe \
    -Wno-write-strings \
    -static-libgcc -static-libstdc++ \
    -DGIT_VERSION=\"${GIT_VERSION}\" \
    -DGIT_HASH=\"${GIT_HASH}\" \
    map/json.c map/log.c map/map.c map/offset.c map/d2_client.c map/main.c 
echo $(date --iso-8601=seconds) "Build done" $GIT_VERSION