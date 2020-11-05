
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
char D2_DIR[MAX_PATH] = "";
CHAR *DIABLO_2 = (CHAR *)"Diablo II";
CHAR *DIABLO_2_VERSION = (CHAR *)"v1.xy";

CHAR *PATH_OF_DIABLO = "Path of Diablo";
CHAR *PROJECT_DIABLO = "ProjectD2";

DWORD D2ClientInterface(VOID) {
    return D2Client.dwInit;
}

VOID __stdcall ExceptionHandler(VOID) {
    fprintf(stderr, "\n] We got a big Error here! [\n");
    ExitProcess(0);
}

/** If this value changes, update __asm JMP */
int D2CLIENT_Pod_InitGameMisc_I_P = 0x6faf559b;
void /* __declspec(naked) */ D2CLIENT_Pod_InitGameMisc() {
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

bool isPathOfDiablo = false;
void d2_game_init_pod() {
    *p_STORM_Pod_MPQHashTable = (DWORD)NULL;
    D2Client.dwInit = 1;
    D2Client.fpInit = (DWORD)D2ClientInterface;

    fprintf(stderr, "Init Fog.dll");
    FOG_10021("D2");
    FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
    FOG_10101(1, 0);
    FOG_10089(1);
    if (!FOG_10218()) {
        fprintf(stderr, "\nUnable to load FOG_10218\n");
        ExitProcess(1);
    }
    fprintf(stderr, " - Done\n");
    fprintf(stderr, "Init D2Win.dll");

    if (!D2WIN_10174() || !D2WIN_10072((DWORD)NULL, (DWORD)NULL, (DWORD)NULL, &D2Client)) {
        fprintf(stderr, "\n Failed to load Diablo2 MPQ\n");
        ExitProcess(1);
    }
    fprintf(stderr, " - Done\n");

    fprintf(stderr, "Init D2Lang.dll");
    D2LANG_10009(0, "ENG", 0);
    fprintf(stderr, " - Done\n");

    fprintf(stderr, "Init D2Client.dll");
    D2COMMON_Pod_InitDataTables(0,0,0);
    D2CLIENT_Pod_InitGameMisc();
    fprintf(stderr, " - Done\n");
}

int D2CLIENT_Pd2_InitGameMisc_I_P = 0x6faf454b;
void /* __declspec(naked) */ D2CLIENT_Pd2_InitGameMisc() {
    __asm(
        "MOVL %EBP, %ESP\n"
        "POPL %EBP\n"
        ".intel_syntax noprefix\n"
        "PUSH ECX\n"
        "PUSH EBP\n"
        "PUSH ESI\n"
        "PUSH EDI\n"
        ".att_syntax prefix\n"
        "JMP 0x6faf454b\n"  // Magic Jump
        "PUSHL %EBP\n");
}
bool isProjectDiablo2 = false;
void d2_game_init_pd2() {
    *p_STORM_Pd2_MPQHashTable = (DWORD)NULL;
    D2Client.dwInit = 1;
    D2Client.fpInit = (DWORD)D2ClientInterface;

    fprintf(stderr, "Init Fog.dll");
    FOG_10021("D2");
    FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
    FOG_10101(1, 0);
    FOG_10089(1);
    if (!FOG_10218()) {
        fprintf(stderr, "\nUnable to load FOG_10218\n");
        ExitProcess(1);
    }
    fprintf(stderr, " - Done\n");

    fprintf(stderr, "Init D2Win.dll");
    if (!D2WIN_10086() || !D2WIN_10005((DWORD)NULL, (DWORD)NULL, (DWORD)NULL, &D2Client)) {
        fprintf(stderr, "\n Failed to load Diablo2 MPQ\n");
        ExitProcess(1);
    }
    fprintf(stderr, " - Done\n");

    fprintf(stderr, "Init D2Lang.dll");
    D2LANG_10008(0, "ENG", 0);
    fprintf(stderr, " - Done\n");

    fprintf(stderr, "Init D2Client.dll");
    D2COMMON_Pd2_InitDataTables(0,0,0);
    D2CLIENT_Pd2_InitGameMisc();
    fprintf(stderr, " - Done\n");
}

void d2_game_init(char *folderName) {
    isPathOfDiablo = strstr(folderName, PATH_OF_DIABLO) != NULL;
    isProjectDiablo2 = strstr(folderName, PROJECT_DIABLO) != NULL;

    fprintf(stderr, "InitGame %s isPathOfDiablo:%s isProjectDiablo2:%s \n",
            folderName,
            isPathOfDiablo ? "true" : "false",
            isProjectDiablo2 ? "true" : "false");
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

    fprintf(stderr, "SetDir: %s \n", D2_DIR);
    memset(&D2Client, (DWORD)NULL, sizeof(d2client_struct));
    SetCurrentDirectory(D2_DIR);

    DefineOffsets();
    fprintf(stderr, "Offsets defined.\n");

    if (isPathOfDiablo) {
        d2_game_init_pod();
    } else if (isProjectDiablo2) {
        d2_game_init_pd2();
    } else {
        fprintf(stderr, "Unknown game type: %s \n", D2_DIR);
        ExitProcess(1);
    }
    SetCurrentDirectory(folderName);
    return;
}

Level *__fastcall d2_get_level(ActMisc *misc, DWORD levelCode) {
    LevelTxt *levelData = isPathOfDiablo ? D2COMMON_Pod_GetLevelText(levelCode) : D2COMMON_Pd2_GetLevelText(levelCode);
    if (!levelData) return NULL;

    for (Level *pLevel = misc->pLevelFirst; pLevel; pLevel = pLevel->pNextLevel) {
        if (!pLevel) break;
        if (pLevel->dwLevelNo == levelCode) return pLevel;
    }

    if (isPathOfDiablo) return D2COMMON_Pod_GetLevel(misc, levelCode);
    return D2COMMON_Pd2_GetLevel(misc, levelCode);
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
                ObjectTxt *txt = isPathOfDiablo ? D2COMMON_Pod_GetObjectTxt(pPresetUnit->dwTxtFileNo) : D2COMMON_Pd2_GetObjectTxt(pPresetUnit->dwTxtFileNo);
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
/** Get the correct Act for a level */
int get_act(int levelCode) {
    if (levelCode < 40) return 0;
    if (levelCode < 75) return 1;
    if (levelCode < 103) return 2;
    if (levelCode < 109) return 3;
    if (levelCode < 200) return 4;
    return -1;
}
int d2_dump_map(int seed, int difficulty, int levelCode) {
    switch (levelCode) {
        // Why are these levels broken?
        case 20:
        case 59:
        case 63:
        case 99:
            return 1;
    }
    int actId = get_act(levelCode);
    printf("LoadAct seed:%d, difficulty: %d, levelCode: %d\n", seed, difficulty, levelCode);
    printf("LoadAct--Start %d D2COMMON_LoadAct:0x%x D2COMMON_Pod_LoadAct:0x%x  D2CLIENT_Pod_LoadAct_1:0x%x D2CLIENT_Pod_LoadAct_2:0x%x\n", isPathOfDiablo, D2COMMON_LoadAct, D2COMMON_Pod_LoadAct, D2CLIENT_Pod_LoadAct_1,D2CLIENT_Pod_LoadAct_2 );

    Act *pAct = isPathOfDiablo ? D2COMMON_Pod_LoadAct(actId, seed, TRUE, FALSE, difficulty, (DWORD)NULL, 1, D2CLIENT_Pod_LoadAct_1, D2CLIENT_Pod_LoadAct_2) : D2COMMON_Pd2_LoadAct(actId, seed, TRUE, FALSE, difficulty, (DWORD)NULL, 1, D2CLIENT_Pd2_LoadAct_1, D2CLIENT_Pd2_LoadAct_2);
    printf("LoadAct\n");
    if (!pAct) return 1;

    LevelTxt *levelData = isPathOfDiablo ? D2COMMON_Pod_GetLevelText(levelCode) : D2COMMON_Pd2_GetLevelText(levelCode);
    if (!levelData) return 1;

    Level *pLevel = d2_get_level(pAct->pMisc, levelCode);  // Loading Town Level
    if (!pLevel) return 1;

    char *levelName = isPathOfDiablo ? D2COMMON_Pod_GetLevelText(levelCode)->szName : D2COMMON_Pd2_GetLevelText(levelCode)->szName;
    if (!pLevel) {
        fprintf(stderr, "Skipping level %d %s\n", levelCode, levelName);
        return 1;
    }

    if (!pLevel->pRoom2First) isPathOfDiablo ? D2COMMON_Pod_InitLevel(pLevel) : D2COMMON_Pd2_InitLevel(pLevel);
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
            if (isPathOfDiablo) D2COMMON_Pod_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
            if (isProjectDiablo2) D2COMMON_Pd2_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
        }

        dump_objects(pAct, pLevel, pRoom2);

        if (pRoom2->pRoom1) add_collision_data(pRoom2->pRoom1->Coll, originX, originY);
        if (bAdded) {
            if (isPathOfDiablo) D2COMMON_Pod_RemoveRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
            if (isProjectDiablo2) D2COMMON_Pd2_RemoveRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
        }
    }

    json_array_end();
    json_array_start("map");
    dump_map_collision(mapWidth, mapHeight);
    json_array_end();
    json_end();
    return 0;
}
