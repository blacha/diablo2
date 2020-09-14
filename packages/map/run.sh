#!/bin/bash

export WINEPREFIX=$HOME/Games/d2/.prefix
export WINEARCH=win32
export WINEPATH=~/.local/share/lutris/runners/wine/tkg-4.0-x86_64/bin


$WINEPATH/wine bin/d2-map.exe $PWD/game