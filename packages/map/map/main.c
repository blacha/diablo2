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
        json_start();
        json_key_value("seed", argSeed);
        json_key_value("diff", argDifficulty);
        json_end();

        if (argLevelCode > -1) {
            d2_dump_map(argSeed, argDifficulty, argLevelCode);
        } else {
            for (int levelCode = 0; levelCode < 200; levelCode++) d2_dump_map(argSeed, argDifficulty, levelCode);
        }
        printf("\n");
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
            for (int levelCode = 0; levelCode < 200; levelCode++) d2_dump_map(seed, difficulty, levelCode);
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
        printf("\n");
    }

    return 0;
}
