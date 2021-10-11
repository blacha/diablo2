#include "d2_ptrs.h"
#include "d2_version.h"

Act* d2common_load_act(D2Version gameVersion, int actId, int seed, int difficulty) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_LoadAct(actId, seed, TRUE, FALSE, difficulty, (DWORD)NULL, 1, D2CLIENT_Pod_LoadAct_1, D2CLIENT_Pod_LoadAct_2);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_LoadAct(actId, seed, TRUE, FALSE, difficulty, (DWORD)NULL, 1, D2CLIENT_Pd2_LoadAct_1, D2CLIENT_Pd2_LoadAct_2);
    return NULL;
}

LevelTxt* d2common_get_level_text(D2Version gameVersion, int levelCode) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_GetLevelText(levelCode);
    if (gameVersion == VersionProjectDiablo2) return  D2COMMON_Pd2_GetLevelText(levelCode);
    return NULL;
}

void d2common_init_level(D2Version gameVersion, Level* pLevel) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_InitLevel(pLevel);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_InitLevel(pLevel);
}

void d2common_add_room_data(D2Version gameVersion, Act* pAct, Level* pLevel, Room2* pRoom2) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
}

void d2common_remove_room_data(D2Version gameVersion, Act* pAct, Level* pLevel, Room2* pRoom2) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_AddRoomData(pAct, pLevel->dwLevelNo, pRoom2->dwPosX, pRoom2->dwPosY, NULL);
}

Level* d2common_get_level(D2Version gameVersion, ActMisc *misc, DWORD levelCode) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_GetLevel(misc, levelCode);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_GetLevel(misc, levelCode);
    return NULL;
}

ObjectTxt* d2common_get_object_txt(D2Version gameVersion, DWORD dwTxtFileNo) {
    if (gameVersion == VersionPathOfDiablo) return D2COMMON_Pod_GetObjectTxt(dwTxtFileNo);
    if (gameVersion == VersionProjectDiablo2) return D2COMMON_Pd2_GetObjectTxt(dwTxtFileNo);
    return NULL;
}
