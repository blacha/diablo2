#include <unistd.h>

#include <iostream>

#include "d2_client.h"
#include "d2_ptrs.h"
#include "d2_structs.h"
#include "json.h"

#define INPUT_BUFFER 1024

const char COMMAND_EXIT[] = "$exit";
const char COMMAND_MAP[] = "$map";
const char COMMAND_DIFF[] = "$difficulty";
const char COMMAND_SEED[] = "$seed";

bool starts_with(const char *prefix, const char *search_string) {
    if (strncmp(prefix, search_string, strlen(search_string)) == 0)
        return 1;
    return 0;
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

void dump_map(int seed, int difficulty, int levelCode) {
    switch (levelCode) {
        // Why are levels broken?
        case 20:
        case 59:
        case 63:
        case 99:
            return;
    }
    int actId = get_act(levelCode);
    Act *pAct = D2COMMON_LoadAct(actId, seed, TRUE, FALSE, difficulty, (DWORD)NULL, 1, D2CLIENT_LoadAct_1, D2CLIENT_LoadAct_2);
    ;
    if (!pAct) return;

    LevelTxt *levelData = D2COMMON_GetLevelText(levelCode);
    if (!levelData) return;

    if (d2_dump_map(pAct, levelCode) == 1) printf("\tFailedToDump level:%d \n", levelCode);
}

/**
 * Dump all maps for a given map seed and difficulty
 * if a map code is provided only dump that code 
 */
void dump_all_maps(int seed, int difficulty) {
    // init_acts(seed, difficulty);
    for (int levelCode = 0; levelCode < 200; levelCode++) dump_map(seed, difficulty, levelCode);
}

char *CliUsage = "d2-map.exe [D2 Game Path] [--seed :MapSeed] [--difficulty :difficulty] [--level :levelCode]";

int main(int argc, char *argv[]) {
    if (argc < 1) {
        printf(CliUsage);
        return 1;
    }
    char *gameFolder;
    int argSeed = -1;
    int argLevelCode = -1;
    int argDifficulty = -1;
    for (int i = 0; i < argc; i++) {
        if (starts_with(argv[i], "--seed") || starts_with(argv[i], "-s")) {
            argSeed = atoi(argv[++i]);
        } else if (starts_with(argv[i], "--difficulty") || starts_with(argv[i], "-d")) {
            argDifficulty = atoi(argv[++i]);
        } else if (starts_with(argv[i], "--level") || starts_with(argv[i], "-l")) {
            argLevelCode = atoi(argv[++i]);
        } else {
            gameFolder = argv[i];
        }
    }
    if (!gameFolder) {
        printf(CliUsage);
        return 1;
    }

    d2_game_init(gameFolder);

    /** Seed/Diff has been passed in just generate the map that is required */
    if (argSeed > 0 && argDifficulty != -1) {
        fprintf(stderr, "Dumping Levels Seed: 0x%x Difficulty: %d", argSeed, argDifficulty);
        if (argLevelCode > -1) {
            fprintf(stderr, " level: %d", argLevelCode);
        }
        fprintf(stderr, "\n");
        json_start();
        json_key_value("seed", argSeed);
        json_key_value("diff", argDifficulty);
        json_end();

        if (argLevelCode > -1) {
            dump_map(argSeed, argDifficulty, argLevelCode);
        } else {
            dump_all_maps(argSeed, argDifficulty);
        }
        return 0;
    }

    /** Init the D2 client using the provided path */

    json_start();
    json_key_value("type", "init");
    json_end();
    char buffer[INPUT_BUFFER];

    int seed;
    int difficulty;
    int rtn;
    char c[INPUT_BUFFER];
    /** Read in seed/Difficulty then generate all the maps */
    while (fgets(buffer, INPUT_BUFFER, stdin) != NULL) {
        if (starts_with(buffer, COMMAND_EXIT) == 1) return 0;

        if (starts_with(buffer, COMMAND_MAP) == 1) {
            dump_all_maps(seed, difficulty);
            json_start();
            json_key_value("type", "done");
            json_end();
        } else if (starts_with(buffer, COMMAND_SEED) == 1) {
            rtn = sscanf(buffer, "%s %d", &c, &seed);
            json_start();
            json_key_value("type", "info");
            json_key_value("seed", seed);
            json_key_value("difficulty", difficulty);
            json_end();
        } else if (starts_with(buffer, COMMAND_DIFF) == 1) {
            rtn = sscanf(buffer, "%s %d", &c, &difficulty);
            json_start();
            json_key_value("type", "info");
            json_key_value("seed", seed);
            json_key_value("difficulty", difficulty);
            json_end();
        }
    }

    return 0;
}
