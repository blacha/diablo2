# @diablo2

[![Build Status](https://github.com/blacha/diablo2/workflows/Build/badge.svg)](https://github.com/blacha/diablo2/actions)

Tools to work with diablo2 

- [bintools](./packages/bintools) - Binary parsers to read the `.bin` files
- [huffman](./packages/huffman) - Decompressor for network data
- [packets](./packages/packets) - Diablo2 network protocol
- [mpq](./packages/mpq) - MPQ reader / extractor
- [map](./packages/map) - Diablo2 map generation api (Docker based)
- [sniffer](./packages/sniffer) - Diablo2 network sniffer


## Packet sniffer

![Packet sniffer example](./assets/2021-03-21-packet-sniff-example.gif)


## Packet sniffing heads up display

Sniffs packets from the game client to create a overview of the world around.

![Hud example](./assets/2021-03-21-packet-hud.png)

1. Location of the summoner
2. Where a good item was drooped (Unique Frost burns)
3. Player Location
4. A collection of monsters
5. Way point

## Building


Building with yarn
```
yarn
yarn build
```