# @diablo2/map 

Diablo 2 Map generator for v1.14 or v1.13c

Most of the work is done inside `d2_client.c` this includes the D2 Game client init as well as exporting everything to json.

## Usage

```
wine bin/d2-map.exe :PathToDiablo2 --seed 10 --level 1 --difficulty 0

# [  1] DumpMap   offset: 5800x5640       size: 280x200 'Rogue Encampment'
```

```typescript
{
    /** Level code */
    "id": 1,
    /** Name given back by diablo2 client */
    "name": "Rogue Encampment",
    /** how far offset this map is from the top left of the game world */
    "offset": {
        "x": 5800,
        "y": 5640
    },
    /** Dimensions of the map */
    "size": {
        "width": 280,
        "height": 200
    },
    /** Important objects / NPCs found in this level */
    "objects": [
        {"id":119, "type":"object", "x":84, "y":69, "name":"Waypoint"}
    ],
    /** Map Collision data */
    "map": [
        // Map data for x offset 0
        [1, 149] // 1 pixel of collision, 149 pixels of open space, 150 - map.size.width pixels of collision
    ]
}
```

## Getting started

### Installation
 - npm v16
 - yarn
 - docker

#### Diablo 2

This Map generation client can be used with

- Diablo 2 LOD 1.14d & ProjectD2
or 
- Diablo 2 LOD 1.13c 

### Building from docker image

This is the easiest method to get working:

```bash
docker pull blacha/diablo2
docker run -it -v "/E/Games/Diablo II":/app/game docker.io/blacha/diablo2:latest /bin/bash
wine regedit /app/d2.install.reg
wine bin/d2-map.exe game --seed 10 --level 1 --difficulty 0
```
The last wine command should generate the JSON for one level, this is to test that it works.


### Building from source (windows)
From the source code folder:
Remember to change "/E/Games/Diablo II" in the below commands to your D2 installation folder.

```bash
yarn install
yarn build
cd packages/map
yarn bundle-server
yarn bundle-www
xcopy static dist\www
docker build . -t diablo2/map
docker run -it -v "/E/Games/Diablo II":/app/game diablo2/map /bin/bash
wine regedit /app/d2.install.reg
wine bin/d2-map.exe game --seed 10 --level 1 --difficulty 0
exit
```
The above wine command should generate the JSON for one level, this is to test that it works.
You can try using different seeds, levels and difficulties this way if you like.


### Starting the server
Now you run this server so you can send requests for seeds/difficulties to generate all the maps for that given seed:
```bash
docker run -v "/E/Games/Diablo II":/app/game -p 8899:8899 diablo2/map
```
or if you're using the public docker image:
```bash
docker run -v "/E/Games/Diablo II":/app/game -p 8899:8899 docker.io/blacha/diablo2:latest
```

Then you can do a simple curl command to generate:

`curl localhost:8899/v1/map/<seed>/<difficulty>.json`

e.g. `curl localhost:8899/v1/map/3607656c/0.json`

### Troubleshooting:

* `/bin/sh: 1: ./build.mapgen.sh: not found`
 
I had this issue and I suspect it was windows removing the 'executable' permissions from this bash script.
I worked around it by making this change to the `Dockerfile`:

Replaced the line
```
RUN ./build.mapgen.sh
```
with (the contents of build.mapgen.sh)
```
RUN mkdir bin -p
RUN i686-w64-mingw32-g++ -o bin/d2-map.exe \
    -Wno-write-strings \
    -static-libgcc -static-libstdc++ \
    map/json.c map/map.c map/offset.c map/d2_client.c map/main.c 
RUN echo $(date --iso-8601=seconds) "Build done"
```  



## Fixing offsets

When the diablo 2game client update the offsets need to call change

Inside `d2_ptrs.h` is a list of offsets needed to initialize the game

The easiest way to trace the initialization steps is to run Diablo inside of wine with `WINEDEBUG=+snoop` this logs every external call made by the initialization of the game.


```bash
export WINEDEBUG=+snoop
wine Game.exe 2> snoop.log
```

This generates a massive log file however inside are common call patterns

Here is the function call for Fog_10021 this can be used to trace the initialization
```
0024:CALL Fog.10021(<unknown, check return>) ret=0040829b
...
0024:RET  Fog.10021() retval=00000028 ret=0040829b
```

Which relates to the `FUNCPTR` in `d2_ptrs.h`
```c++
FUNCPTR(FOG, 10021, VOID __fastcall, (CHAR * szProg), -10021)
```

The initialization of D2 always starts with a few Fog.dll calls followed by two 
D2Win.dll calls 

```c++
// d2_client.c
FOG_10021("D2");
FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
FOG_10101(1, 0);
FOG_10089(1);
if (!FOG_10218()) {
    log_error("InitFailed", lk_s("dll", "Fog.dll"));
    ExitProcess(1);
}
```

Looking for the final `RET Fog.10218` will generally show on the next line the first `D2Win.dll` CAll

```log
0024:CALL Fog.10218(<unknown, check return>) ret=00407636
0024:RET  Fog.10218() retval=00000001 ret=00407636
0024:CALL D2Win.10086(<unknown, check return>) ret=00407644
...
0024:RET  D2Win.10086() retval=00000001 ret=00407644
0024:CALL D2Win.10005(<unknown, check return>) ret=00407659
```

So in this client the first D2Win calls are `D2Win_10086` and `D2Win_10005`