
#include <stdio.h>
#include <windows.h>

#include <fstream>
#include <iostream>
#include <string>

#include "d2_ptrs.h"
#include "d2_structs.h"
#include "d2data/d2_game_object.h"
#include "d2data/d2_npc_type.h"
#include "json.h"
#include "map.h"
#include "offset.h"

#define UNIT_TYPE_PLAYER 0
#define UNIT_TYPE_NPC 1
#define UNIT_TYPE_OBJECT 2
#define UNIT_TYPE_MISSILE 3
#define UNIT_TYPE_ITEM 4
#define UNIT_TYPE_TILE 5

d2client_struct D2Client;
char D2_DIR[MAX_PATH] = "game/Path of Diablo";

DWORD D2ClientInterface(VOID) {
    return D2Client.dwInit;
}

VOID __stdcall ExceptionHandler(VOID) {
    fprintf(stderr, "\n] We got a big Error here! [\n");
    ExitProcess(0);
}

/** If this value changes, update __asm JMP */
int D2CLIENT_InitGameMisc_I_P = 0x6faf559b;
void /* __declspec(naked) */ D2CLIENT_InitGameMisc() {
    __asm(
        "MOVL %EBP, %ESP\n"
        "POPL %EBP\n"
        ".intel_syntax noprefix\n"
        "PUSH ECX\n"
        "PUSH EBP\n"
        "PUSH ESI\n"
        "PUSH EDI\n"
        ".att_syntax prefix\n"
        "JMP 0x6faf559b\n"  // Magic Jump
        "PUSHL %EBP\n");
}

CHAR *DIABLO_2 = (CHAR *)"Diablo II";
CHAR *DIABLO_2_VERSION = (CHAR *)"v1.xy";

int d2_game_init(char *folderName) {
    fprintf(stderr, "InitGame %s\n", folderName);
    sprintf_s(D2_DIR, sizeof(D2_DIR), "%s\\", folderName);

    char GAME[MAX_PATH] = "";
    sprintf_s(GAME, sizeof(GAME), "%s\\game.exe", folderName);
    std::ifstream ifs(GAME, std::ifstream::in);
    if (!ifs) {
        fprintf(stderr, "Cannot find Game.exe in '%s'\n", folderName);
        exit(1);
    }
    ifs.close();

    CHAR szPath[MAX_PATH] = {0};
    GetCurrentDirectory(MAX_PATH, szPath);

    fprintf(stderr, "SetDir, %s \n", D2_DIR);
    SetCurrentDirectory("game/Path of Diablo");
    memset(&D2Client, (DWORD)NULL, sizeof(d2client_struct));

    DefineOffsets();
    // fprintf(stderr,"Offsets defined.\n");
    DWORD dwFogBase = (DWORD)GetModuleHandle("FOG.dll") + 0x2505C;            //updated 1.13d
    DWORD dwStormBase = (DWORD)GetModuleHandle("Storm.dll") + 0x43230;        //updated 1.13d
    DWORD dwD2ClientBase = (DWORD)GetModuleHandle("D2CLIENT.dll") + 0xCFFA4;  //updated 1.13d
    DWORD dwD2Common = (DWORD)GetModuleHandle("D2COMMON.dll") + 0x8D11C;      //updated 1.13d

    DWORD dwOld;
    *p_STORM_MPQHashTable = (DWORD)NULL;

    D2Client.dwInit = 1;
    D2Client.fpInit = (DWORD)D2ClientInterface;

    fprintf(stderr, "FOG_10021 - ");
    FOG_10021(DIABLO_2);
    fprintf(stderr, "Done\n");

    fprintf(stderr, "FOG_10019 - ");
    FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
    fprintf(stderr, "Done\n");

    fprintf(stderr, "FOG_10101 - ");
    FOG_10101(1, 0);
    fprintf(stderr, "Done\n");

    fprintf(stderr, "FOG_10089 - ");
    FOG_10089(1);
    fprintf(stderr, "Done\n");

    fprintf(stderr, "FOG_10218 - ");
    DWORD fog10218 = FOG_10218();
    fprintf(stderr, "Done (%d)\n", fog10218);

    if (!fog10218) {
        fprintf(stderr, "Unable to load FOG_10218\n");
        return 1;
    }

    fprintf(stderr, "D2WIN_10174 - ");
    DWORD win10174 = D2WIN_10174();
    if (!win10174) {
        fprintf(stderr, "Unable to load MPQ Files\n");
        return 1;
    }
    fprintf(stderr, "Done (%d)\n", win10174);

    fprintf(stderr, "D2WIN_10072 - ");
    DWORD win10072 = D2WIN_10072((DWORD)NULL, (DWORD)NULL, (DWORD)NULL, &D2Client);
    fprintf(stderr, "Done (%d)\n", win10072);
    if (!win10072) {
        fprintf(stderr, "Unable to load MPQ Files\n");
        return 1;
    }

    fprintf(stderr, "D2LANG_10009 - ");
    D2LANG_10009(0, (CHAR *)"ENG", 0);
    fprintf(stderr, "Done\n");

    fprintf(stderr, "D2COMMON_InitDataTables - ");
    DWORD initDataTables = D2COMMON_InitDataTables(0, 0, 0);
    fprintf(stderr, "Done (%d)\n", initDataTables);
    if (!initDataTables) {
        fprintf(stderr, "Unable to init datatables");
        return 1;
    }

    if ((int)D2CLIENT_InitGameMisc_I != D2CLIENT_InitGameMisc_I_P) {
        fprintf(stderr, "D2Client_InitGameMisc has changed to 0x%x\n", D2CLIENT_InitGameMisc_I);
        exit(1);
    }

    fprintf(stderr, "D2CLIENT_InitGameMisc - Jump: (0x%x) ", D2CLIENT_InitGameMisc_I);
    D2CLIENT_InitGameMisc();
    fprintf(stderr, "Done\n");

    SetCurrentDirectory(folderName);
    return 0;
}

Level *__fastcall d2_get_level(ActMisc *misc, DWORD levelCode) {
    LevelTxt *levelData = D2COMMON_GetLevelText(levelCode);
    if (!levelData) return NULL;

    for (Level *pLevel = misc->pLevelFirst; pLevel; pLevel = pLevel->pNextLevel) {
        if (!pLevel) break;
        if (pLevel->dwLevelNo == levelCode) return pLevel;
    }

    return D2COMMON_GetLevel(misc, levelCode);
}

void add_collision_data(CollMap *pCol, int originX, int originY) {
    if (pCol == NULL) return;

    int x = pCol->dwPosGameX - originX;
    int y = pCol->dwPosGameY - originY;
    int cx = pCol->dwSizeGameX;
    int cy = pCol->dwSizeGameY;

    int nLimitX = x + cx;
    int nLimitY = y + cy;

    WORD *p = pCol->pMapStart;
    for (int j = y; j < nLimitY; j++) {
        for (int i = x; i < nLimitX; i++) {
            int pVal = *p;
            if (pVal == 1024) pVal = 1;
            map_set(i, j, pVal);
            p++;
        }
    }
}

char *get_object_type(int code) {
    if (object_is_useless(code)) return NULL;
    if (object_is_door(code)) return NULL;
    return "object";
}

int dump_objects(Act *pAct, Level *pLevel, Room2 *pRoom2) {
    int offsetX = pLevel->dwPosX * 5;
    int offsetY = pLevel->dwPosY * 5;

    int roomOffsetX = pRoom2->dwPosX * 5 - offsetX;
    int roomOffsetY = pRoom2->dwPosY * 5 - offsetY;

    for (PresetUnit *pPresetUnit = pRoom2->pPreset; pPresetUnit; pPresetUnit = pPresetUnit->pPresetNext) {
        char *objectType = NULL;
        char *objectName = NULL;

        int objectId = -1;

        int coordX = roomOffsetX + pPresetUnit->dwPosX;
        int coordY = roomOffsetY + pPresetUnit->dwPosY;

        if (pPresetUnit->dwType == UNIT_TYPE_NPC) {
            if (npc_is_useless(pPresetUnit->dwTxtFileNo)) continue;
            objectType = "npc";
            objectId = pPresetUnit->dwTxtFileNo;

        } else if (pPresetUnit->dwType == UNIT_TYPE_OBJECT) {
            objectType = get_object_type(pPresetUnit->dwTxtFileNo);
            if (!objectType) continue;
            objectId = pPresetUnit->dwTxtFileNo;
            if (pPresetUnit->dwTxtFileNo < 580) {
                ObjectTxt *txt = D2COMMON_GetObjectTxt(pPresetUnit->dwTxtFileNo);
                if (strcmp(txt->szName, "Dummy") == 0 ||
                    strcmp(txt->szName, "dummy") == 0 ||
                    strcmp(txt->szName, "fire") == 0) {
                    continue;
                }
                objectName = txt->szName;
            }
        } else if (pPresetUnit->dwType == UNIT_TYPE_TILE) {
            for (RoomTile *pRoomTile = pRoom2->pRoomTiles; pRoomTile; pRoomTile = pRoomTile->pNext) {
                if (*pRoomTile->nNum == pPresetUnit->dwTxtFileNo) {
                    objectId = pRoomTile->pRoom2->pLevel->dwLevelNo;
                    objectType = "exit";
                }
            }
        }

        if (objectType) {
            json_object_start();
            json_key_value("id", objectId);
            json_key_value("type", objectType);
            json_key_value("x", coordX);
            json_key_value("y", coordY);
            if (objectName) json_key_value("name", objectName);
            json_object_end();
        }
    }
    return 0;
}

void dump_map_collision(int width, int height) {
    int maxY = map_max_y();
    for (int y = 0; y <= maxY; y++) {
        json_array_start();
        char last = 'X';
        int count = 0;
        int outputCount = 0;
        for (int x = 0; x < width; x++) {
            char mapVal = map_value(x, y) % 2 ? 'X' : ' ';
            if (mapVal == last) {
                count++;
                continue;
            }

            if (outputCount == 0 && last == ' ') {
                fprintf(stderr, "-1, ");
            }

            json_value(count);

            outputCount++;
            count = 1;
            last = mapVal;
        }
        json_array_end();
    }
}

int d2_dump_map(Act *pAct, int levelCode) {
    if (!pAct) return 1;

    Level *pLevel = d2_get_level(pAct->pMisc, levelCode);  // Loading Town Level
    if (!pLevel) return 1;

    char *levelName = D2COMMON_GetLevelText(levelCode)->szName;
    if (!pLevel) {
        fprintf(stderr, "Skipping level %d %s\n", levelCode, levelName);
        return 1;
    }

    if (!pLevel->pRoom2First) D2COMMON_InitLevel(pLevel);
    if (!pLevel->pRoom2First) {
        fprintf(stderr, "Failed to D2COMMON_InitLevel:%d\n", levelCode);
        return 1;
    }

    int originX = pLevel->dwPosX * 5;
    int originY = pLevel->dwPosY * 5;

    int mapWidth = pLevel->dwSizeX * 5;
    int mapHeight = pLevel->dwSizeY * 5;

    // fprintf(stderr, "[%3d] DumpMap\toffset: %dx%d\tsize: %dx%d '%s'\n", levelCode, originX, originY, mapWidth, mapHeight, levelName);
    map_reset();

    // Start JSON DUMP
    json_start();
    json_key_value("type", "map");
    json_key_value("id", levelCode);
    json_key_value("name", levelName);

    json_object_start("offset");
    json_key_value("x", originX);
    json_key_value("y", originY);
    json_object_end();

    json_object_start("size");
    json_key_value("width", mapWidth);
    json_key_value("height", mapHeight);
    json_object_end();

    json_array_start("objects");

    for (Room2 *pRoom2 = pLevel->pRoom2First; pRoom2; pRoom2 = pRoom2->pRoom2Next) {
        BOOL bAdded = FALSE;

        if (!pRoom2->pRoom1) {
            bAdded = TRUE;
            D2COMMON_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
        }

        dump_objects(pAct, pLevel, pRoom2);

        if (pRoom2->pRoom1) add_collision_data(pRoom2->pRoom1->Coll, originX, originY);
        if (bAdded) D2COMMON_RemoveRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
    }

    json_array_end();
    json_array_start("map");
    dump_map_collision(mapWidth, mapHeight);
    json_array_end();
    json_end();
    return 0;
}
