# @diablo2/map 

Diablo 2 Map generator for v1.13c

## Command line

```
Usage:
    d2-map.exe [D2 Game Path] [options]

Options:
    --seed [-s]          Map Seed
    --difficulty [-d]    Game Difficulty [0: Normal, 1: Nightmare, 2: Hell]
    --act [-a]           Dump a specific act [0: ActI, 1: ActII, 2: ActIII, 3: ActIV, 4: Act5]
    --map [-m]           Dump a specific Map [0: Rogue Encampment ...]
    --verbose [-v]       Increase logging level

Examples:

    # Dump ActI from Normal mode for seed 1122334 
    d2-map.exe /home/diablo2 --seed 1122334 --difficulty 0 --act 0

    # Dump all acts from Hell mode for seed 1122334 
    d2-map.exe /home/diablo2 --seed 1122334 --difficulty 2
```

```typescript
{
    /** Level code */
    "id": 74,
    /** Name given back by diablo2 client */
    "name": "Arcane Sanctuary",
    /** how far offset this map is from the top left of the game world */
    "offset": {
        "x": 25000,
        "y": 5000
    },
    /** Dimensions of the map */
    "size": {
        "width": 1000,
        "height": 1000
    },
    /** Important objects / NPCs found in this level */
    "objects": [
        {"id": 53, "type": "exit", "x": 137, "y": 0, "name": "Palace Cellar Level 2" },
        {"id": 250, "type": "npc", "x": 440, "y": 20, "name": "The Summoner"},
        {"id": 371, "type": "npc", "x": 458, "y": 203, "name": "Lightning Spire"},
        {"id": 305, "type": "object", "x": 237, "y": 401, "name": "teleportation pad", "op": 27}
        {"id": 402, "type": "object", "x": 449, "y": 449, "name": "Waypoint", "op": 23},
        {"id": 298, "type": "object", "x": 427, "y": 426, "name": "portal", "op": 34}
    ],
    /** Map Collision data */
    "map": [
        // Map data for x offset 0 - Using run length encoding
        [1, 149] // 1 pixel of collision, 149 pixels of open space, 150 - map.size.width pixels of collision
    ]
}
```
### Map Data

Collision maps are encoded using a simple run length encoding to save on space

Given this small map
```
[1,5,1],
[2,3,2],
[1,5,1]
```

It would generate the following word where `X` is collision and `.` is open space
```
X.....X
XX...XX
X.....X
```

A simple rendering engine could be using a `HTMLCanvas`'s `ctx.fillRect(x, y, width, height)` function to draw one row at a time

```typescript
for (let y = 0; y < map.length; y++){
    let x = 0;
    let fill = true;
    for (const offset of row) {
        if (fill) ctx.fillRect(x, y, offset, 1, "black");
        x = x + offset;
        fill = !fill
    }
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

`curl localhost:8899/v1/map/:seed/:difficulty/:act.json`

e.g. `curl localhost:8899/v1/map/0x3607656c/Normal/ActI.json`

Numbers can be used for Act/Difficulty instead

Act 1 in Normal
```
/v1/map/0x3607656c/0/0.json
```

Act 5 in Hell
```
/v1/map/0x3607656c/2/4.json
```

### Server Images

The map server can also generate images

`curl localhost:8899/v1/map/:seed/:difficulty/:level.png`

Tower cellar level 3 in hell
```
http://localhost:8899/v1/map/0xff00ff/Hell/23.png
```


### Multiple processes

The server can control multiple map processes, when starting the server the `$DIABLO2_CLUSTER_SIZE` environment variable controls how many map processes to start.


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