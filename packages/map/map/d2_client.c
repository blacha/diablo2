
#include <stdio.h>
#include <windows.h>

#include <fstream>
#include <iostream>
#include <string>

#include "d2_ptrs.h"
#include "d2_structs.h"
#include "d2_version.h"
#include "d2data/d2_game_object.h"
#include "d2data/d2_npc_type.h"
#include "d2data/d2_level.h"
#include "json.h"
#include "log.h"
#include "map.h"
#include "offset.h"
#include "d2_client_version.h"

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

D2Version gameVersion = VersionUnknown;

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

// bool isPathOfDiablo = false;
void d2_game_init_pod() {
    *p_STORM_Pod_MPQHashTable = (DWORD)NULL;
    D2Client.dwInit = 1;
    D2Client.fpInit = (DWORD)D2ClientInterface;

    log_trace("Init:Dll", lk_s("dll", "Fog.dll"));
    FOG_10021("D2");
    FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
    FOG_10101(1, 0);
    FOG_10089(1);
    if (!FOG_10218()) {
        log_error("Init:Dll:Failed", lk_s("dll", "Fog.dll"));
        ExitProcess(1);
    }
    log_debug("Init:Dll:Done", lk_s("dll", "Fog.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Win.dll"));
    if (!D2WIN_10174() || !D2WIN_10072((DWORD)NULL, (DWORD)NULL, (DWORD)NULL, &D2Client)) {
        log_error("Init:Dll:Failed", lk_s("dll", "D2Win.dll"));
        ExitProcess(1);
    }
    log_debug("Init:Dll:Done", lk_s("dll", "D2Win.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Lang.dll"));
    D2LANG_10009(0, "ENG", 0);
    log_debug("Init:Dll:Done", lk_s("dll", "D2Lang.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Client.dll"));
    D2COMMON_Pod_InitDataTables(0, 0, 0);
    D2CLIENT_Pod_InitGameMisc();
    log_debug("Init:Dll:Done", lk_s("dll", "D2Client.dll"));
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

    log_trace("Init:Dll", lk_s("dll", "Fog.dll"));
    FOG_10021("D2");
    FOG_10019(DIABLO_2, (DWORD)ExceptionHandler, DIABLO_2_VERSION, 1);
    FOG_10101(1, 0);
    FOG_10089(1);

    if (!FOG_10218()) {
        log_error("Init:Dll:Failed", lk_s("dll", "Fog.dll"));
        ExitProcess(1);
    }
    log_debug("Init:Dll:Done", lk_s("dll", "Fog.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Win.dll"));
    if (!D2WIN_10086() || !D2WIN_10005((DWORD)NULL, (DWORD)NULL, (DWORD)NULL, &D2Client)) {
        log_error("InitFailed", lk_s("dll", "D2Win.dll"));
        ExitProcess(1);
    }
    log_debug("Init:Dll:Done", lk_s("dll", "D2Win.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Lang.dll"));
    D2LANG_10008(0, "ENG", 0);
    log_debug("Init:Dll:Done", lk_s("dll", "D2Lang.dll"));

    log_trace("Init:Dll", lk_s("dll", "D2Client.dll"));
    D2COMMON_Pd2_InitDataTables(0, 0, 0);
    D2CLIENT_Pd2_InitGameMisc();
    log_debug("Init:Dll:Done", lk_s("dll", "D2Client.dll"));
}

void d2_game_init(char *folderName) {
    log_debug("Init:Dll", lk_s("path", folderName));

    gameVersion = game_version(folderName);
    if (gameVersion == VersionUnknown) {
        log_error("Init:Failed:UnknownGameVersion", lk_s("path", folderName));
        ExitProcess(1);
    }

    char *gamePath = game_version_path(gameVersion);
    if (gamePath == NULL) {
        log_error("Init:Failed:UnknownGamePath", lk_s("path", folderName), lk_s("version", game_version_path(gameVersion)));
        ExitProcess(1);
    }


    LPCTSTR keyName = TEXT("SOFTWARE\\Blizzard Entertainment\\Diablo II");
    HKEY hKey;
    LONG openRes = RegOpenKeyEx(HKEY_CURRENT_USER, keyName, 0, KEY_ALL_ACCESS, &hKey);

    if (openRes == ERROR_SUCCESS) {
        log_trace("Registry:Opened");
    } else {
        log_error("Registry:Failed:Open");
        ExitProcess(1);
    }

    LPCTSTR value = TEXT("InstallPath");
    LPCTSTR data = folderName;
    LONG setRes = RegSetValueEx(hKey, value, 0, REG_SZ, (LPBYTE)data, strlen(data) + 1);
    log_info("Registry:InstallPath", lk_s("value", folderName));
    RegCloseKey(hKey);

    sprintf_s(D2_DIR, sizeof(D2_DIR), "%s/%s", folderName, game_version_path(gameVersion));
    log_info("Init:Game", lk_s("version", game_version_path(gameVersion)), lk_s("path", D2_DIR));
    memset(&D2Client, (DWORD)NULL, sizeof(d2client_struct));
    SetCurrentDirectory(D2_DIR);

    DefineOffsets();
    log_debug("Init:Offsets:Defined");

    if (gameVersion == VersionPathOfDiablo) {
        d2_game_init_pod();
    } else if (gameVersion == VersionProjectDiablo2 || gameVersion == VersionDiablo2) {
        d2_game_init_pd2();
    } else {
        log_error("Init:Failed:GameInit", lk_s("path", D2_DIR));
        ExitProcess(1);
    }

    SetCurrentDirectory(folderName);
    return;
}

Level *__fastcall d2_get_level(ActMisc *misc, DWORD levelCode) {
    LevelTxt *levelData = d2common_get_level_text(gameVersion, levelCode); 
    if (!levelData) return NULL;

    for (Level *pLevel = misc->pLevelFirst; pLevel; pLevel = pLevel->pNextLevel) {
        if (!pLevel) break;
        if (pLevel->dwLevelNo == levelCode) return pLevel;
    }

    return d2common_get_level(gameVersion, misc, levelCode);
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
    return "object";
}

char *get_object_class(int code, char* name, int operateFn) {
    switch (operateFn){
        case 1: return "casket";
        case 2: return "shrine";
        case 3: return "urn";

        case 5: return "barrel";
        case 7: return "barrel-exploding";
        case 14: return "bolder";
        case 19: return "rack-armor";
        case 20: return "rack-weapon";
        case 22: return "well";
        case 23: return "waypoint";
        case 68: return "urn-evil";
        case 30: return "chest-exploding";
        case 40:
        case 41:
        case 59:
        case 58:
        case 4: 
            return "chest";
        case 8: 
        case 18:
        case 29:
            return "door";
        /** Diablo Seals */
        case 54:
        case 52:
        case 55:
        case 56:
        /** Trist stones */
        case 9:

        /* complelling orb */
        case 53:
        /* Horiadric orifice */
        case 25:
        /* Sewer Lever */
        case 45:
        // /* Hell forge */
        case 49:
        /** Tome */
        case 28:
        /** Sun altar */
        case 24: 
            return "quest";
    }

    if (code == 580 || code == 581) return "chest-super";
    return NULL;
}

bool is_good_exit(Act *pAct, Level *pLevel, int exitId) {
    // Act 1
    // BloodMoor -> Den of evil
    if (pLevel->dwLevelNo == AreaLevel::BloodMoor && exitId == AreaLevel::DenOfEvil) return true;

    // Tamoe Highlands -> Pit
    if (pLevel->dwLevelNo == AreaLevel::TamoeHighland && exitId == AreaLevel::PitLevel1) return true;
    // Black Forest -> ForgottenTower
    if (pLevel->dwLevelNo == AreaLevel::BlackMarsh && exitId == AreaLevel::ForgottenTower) return true;

    // Act 2
    // Correct tomb
    if (exitId == pAct->pMisc->dwStaffTombLevel) return true;
    // Staff Components
    if (pLevel->dwLevelNo == AreaLevel::FarOasis && exitId == AreaLevel::MaggotLairLevel1) return true;
    if (pLevel->dwLevelNo == AreaLevel::ValleyOfSnakes && exitId == AreaLevel::ClawViperTempleLevel1) return true;
    if (pLevel->dwLevelNo == AreaLevel::RockyWaste && exitId == AreaLevel::StonyTombLevel1) return true;

    // Ancient tunnels
    if (pLevel->dwLevelNo == AreaLevel::LostCity && exitId == AreaLevel::AncientTunnels) return true;

    // Act 3
    // Parts
    if (pLevel->dwLevelNo == AreaLevel::SpiderForest && exitId == AreaLevel::SpiderCavern) return true;
    if (pLevel->dwLevelNo == AreaLevel::FlayerJungle && exitId == AreaLevel::FlayerDungeonLevel1) return true;

    // Kurast -> RuinedTemple 
    if (pLevel->dwLevelNo == AreaLevel::KurastBazaar && exitId == AreaLevel::RuinedTemple) return true;

    // Act 5
    // Crystaline passage -> Frozen River
    if (pLevel->dwLevelNo == AreaLevel::CrystallinePassage && exitId == AreaLevel::FrozenRiver) return true;

    return false;
}

int dump_objects(Act *pAct, Level *pLevel, Room2 *pRoom2) {
    int offsetX = pLevel->dwPosX * 5;
    int offsetY = pLevel->dwPosY * 5;

    int roomOffsetX = pRoom2->dwPosX * 5 - offsetX;
    int roomOffsetY = pRoom2->dwPosY * 5 - offsetY;

    for (PresetUnit *pPresetUnit = pRoom2->pPreset; pPresetUnit; pPresetUnit = pPresetUnit->pPresetNext) {
        char *objectType = NULL;
        char *objectName = NULL;
        char *objectClass = NULL;
        bool isGoodExit = false;
        int operateFn = -1;

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
                ObjectTxt *txt = d2common_get_object_txt(gameVersion, pPresetUnit->dwTxtFileNo);
                objectName = txt->szName;
                if (txt->nSelectable0) operateFn = txt->nOperateFn;
            }
            objectClass = get_object_class(pPresetUnit->dwTxtFileNo, objectName, operateFn);
        } else if (pPresetUnit->dwType == UNIT_TYPE_TILE) {
            for (RoomTile *pRoomTile = pRoom2->pRoomTiles; pRoomTile; pRoomTile = pRoomTile->pNext) {
                if (*pRoomTile->nNum == pPresetUnit->dwTxtFileNo) {
                    objectId = pRoomTile->pRoom2->pLevel->dwLevelNo;
                    if (is_good_exit(pAct, pLevel, objectId)) isGoodExit = true;
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
            if (operateFn > -1) json_key_value("op", operateFn);
            if (isGoodExit) json_key_value("isGoodExit", true);
            if (objectClass) json_key_value("class", objectClass);
            json_object_end();
        }
    }
    return 0;
}

void dump_map_collision(int width, int height) {
    int maxY = map_max_y();
    int maxX = map_max_x();
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

            if (outputCount == 0 && last == ' ') fprintf(stderr, "-1, ");

            json_value(count);

            outputCount++;
            count = 1;
            last = mapVal;
        }

        // if (maxX < width) 
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
    LevelTxt *levelData = d2common_get_level_text(gameVersion, levelCode); 
    if (!levelData) return 1;

    if (gameVersion == VersionPathOfDiablo) {
        switch (levelCode) {
            // Why are these levels broken?
            case 20:
            case 59:
            case 63:
            case 99:
                return 1;
        }
    } else if (gameVersion == VersionProjectDiablo2) {
        switch(levelCode) {
            case 150:
                return 1;
        }
    } 

    int actId = get_act(levelCode);
    Act *pAct = d2common_load_act(gameVersion, actId, seed, difficulty); 
    if (!pAct) return 1;

    Level *pLevel = d2_get_level(pAct->pMisc, levelCode);  // Loading Town Level
    if (!pLevel) return 1;

    char *levelName = levelData->szName;
    if (!pLevel) {
        log_warn("Map:SkippingLevel:FailedLoading", lk_i("mapId", levelCode), lk_s("mapName", levelName));
        return 1;
    }

    if (!pLevel->pRoom2First) d2common_init_level(gameVersion, pLevel); 
    if (!pLevel->pRoom2First) {
        log_warn("Map:SkippingLevel:FailedRoomLoading", lk_i("mapId", levelCode), lk_s("mapName", levelName));
        return 1;
    }

    int originX = pLevel->dwPosX * 5;
    int originY = pLevel->dwPosY * 5;

    int mapWidth = pLevel->dwSizeX * 5;
    int mapHeight = pLevel->dwSizeY * 5;

    log_trace("MapInit", lk_i("actId", actId), lk_i("mapId", levelCode), lk_s("mapName", levelName), lk_i("originY", originY), lk_i("originX", originX), lk_i("width", mapWidth), lk_i("height", mapHeight));
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
        BOOL bAdded = !pRoom2->pRoom1;

        if (bAdded) d2common_add_room_data(gameVersion, pAct, pLevel, pRoom2);
        dump_objects(pAct, pLevel, pRoom2);

        if (pRoom2->pRoom1) add_collision_data(pRoom2->pRoom1->Coll, originX, originY);
        if (bAdded) d2common_remove_room_data(gameVersion, pAct, pLevel, pRoom2);
    }

    json_array_end();
    json_array_start("map");
    dump_map_collision(mapWidth, mapHeight);
    json_array_end();
    json_end();
    return 0;
}
