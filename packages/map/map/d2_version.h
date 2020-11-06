#include <stdio.h>
#include <windows.h>

#ifndef D2_VERSION_H
#define D2_VERSION_H
#include "log.h"

enum D2Version {
    VersionUnknown,
    VersionPathOfDiablo,
    VersionProjectDiablo2
};

CHAR* Path_PathOfDiablo = (CHAR*)"Path of Diablo";
CHAR* Path_ProjectDiablo2 = (CHAR*)"ProjectD2";

/** Convert the D2Version to the path that the files are normally located in */
char* game_version_path(D2Version version) {
    if (version == VersionPathOfDiablo) return Path_PathOfDiablo;
    if (version == VersionProjectDiablo2) return Path_ProjectDiablo2;
    return NULL;
}

char* game_version_name(D2Version version) {
    return game_version_path(version);
}

/** Determine if a a version of the game exists in the path by checking for Game.exe */
bool game_version_exists(char* folderName, D2Version version) {
    char gamePathExe[MAX_PATH];
    char* gamePath = game_version_path(version);
    if (gamePath == NULL) return false;

    sprintf(gamePathExe, "%s/%s/game.exe", folderName, gamePath);

    std::ifstream ifs(gamePathExe, std::ifstream::in);
    bool found = !ifs;
    ifs.close();
    log_trace("CheckGamePath", lk_b("exists", !found), lk_s("game", gamePathExe)); //, , );
    return !found;
}

/** Attempt to determine which mod is installed */
D2Version game_version(char* folderName) {
    if (game_version_exists(folderName, VersionPathOfDiablo)) return VersionPathOfDiablo;
    if (game_version_exists(folderName, VersionProjectDiablo2)) return VersionProjectDiablo2;
    return VersionUnknown;
}
#endif