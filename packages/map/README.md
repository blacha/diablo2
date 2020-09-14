# @diablo2/map 

Diablo 2 Map generator

Most of the work is done inside `d2_client.c` this includes the D2 Game client init as well as exporting everything to json.

## Usage

```
wine bin/d2-map.exe :PathToDiablo2 --seed 10 --level 1 --difficulty 0

# [  1] DumpMap   offset: 5800x5640       size: 280x200 'Rogue Encampment'
```

```json
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