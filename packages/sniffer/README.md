# Diablo2 Packet sniffer

Sniff diablo 2 packets,

This sniffer reads the `.bin` files to lookup item and monster information directly from the game.

It currently requires the `patch_d2.mpq` to be extracted to work

## PCAP
`pcap` is needed to run the sniffer, but is not included by default due to the complexity of building it

`libpcap-dev` is required to build ,

```
sudo apt install libpcap-dev
yarn add pcap
```


## Examples

### item tracker

Logs any item dropped onto the ground

```
scp Scepter { quality: 'Normal' }
qui Quilted Armor { quality: 'Normal', def: 10 }
```


### Npc Tracker

Track NPCs being created

```
Npc Foul Crow @ 5114,5113
Npc Foul Crow @ 5118,5113
Npc Foul Crow @ 5046,5224
Npc Foul Crow @ 5049,5220
Npc Foul Crow @ 5052,5225
Npc Foul Crow @ 5049,5223
```


# Usage

```
./d2-sniffer :networkAdapter :pathToGame

# Eg
./d2-sniffer eth0 "/home/foo/game/Diablo 2"
```