# Diablo 2 Map generator

Most of the work is done inside `d2_client.c` this includes the D2 Game client init as well as exporting everything to json.



# TODO
My assembly knowldege is not very good and could not figure out how to JMP to the correct DLL offset, the address is hardcoded.

this can be changed in `d2_client.c`

```
int D2CLIENT_InitGameMisc_I_P = 0x6faf559b;
```
