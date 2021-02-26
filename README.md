# @diablo2

[![Build Status](https://github.com/blacha/diablo2/workflows/Build/badge.svg)](https://github.com/blacha/diablo2/actions)

Tools to work with diablo2 

- [bintools](./packages/bintools) - Binary parsers to read the `.bin` files
- [huffman](./packages/huffman) - Decompressor for network data
- [packets](./packages/packets) - Diablo2 network protocol
- [mpq](./packages/mpq) - MPQ reader / extractor
- [map](./packages/map) - Diablo2 map generation api (Docker based)
- [sniffer](./packages/sniffer) - Diablo2 network sniffer


## Building

`libpcap-dev` is required to build ,

```
sudo apt install libpcap-dev
```

Building with yarn
```
yarn
yarn build
```