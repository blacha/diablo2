#!/bin/bash
mkdir bin -p
i686-w64-mingw32-g++ -o bin/d2-map.exe \
    -Wno-write-strings \
    -static-libgcc -static-libstdc++ \
    map/json.c map/log.c map/map.c map/offset.c map/d2_client.c map/main.c 
echo $(date --iso-8601=seconds) "Build done"