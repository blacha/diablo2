# @diablo2/map 

Diablo 2 Map generator

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


## Building

Everything needed to build and run this is provided inside the `./Dockerfile`

```
yarn bundle

docker build . -t diablo2/map

docker run -it -v /path/to/diablo2/game:/app/game diablo2/map /bin/bash

wine bin/d2-map.exe game --seed 10 --level 1 --difficulty 0
```

## Starting server

```
docker run -v /path/to/diablo2/game:/app/game -p 8899:8899 diablo2/map /bin/bash

curl localhost:8899/v1/maps/0x005/0.json
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