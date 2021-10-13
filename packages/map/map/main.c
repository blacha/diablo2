#include <unistd.h>
#include <stdarg.h>

#include <iostream>

#include "log.h"
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
    if (strncmp(prefix, search_string, strlen(search_string)) == 0) return 1;
    return 0;
}

char *CliUsage = "d2-map.exe [D2 Game Path] [--seed :MapSeed] [--difficulty :difficulty] [--level :levelCode] [-v]";


int main(int argc, char *argv[]) {
    if (argc < 1) {
        printf(CliUsage);
        return 1;
    }
    char *gameFolder;
    int argSeed = -1;
    int argMapId = -1;
    int argDifficulty = -1;
    for (int i = 0; i < argc; i++) {
        char* arg = argv[i];
        if (starts_with(arg, "--seed") || starts_with(arg, "-s")) {
            argSeed = atoi(argv[++i]);
        } else if (starts_with(arg, "--difficulty") || starts_with(arg, "-d")) {
            argDifficulty = atoi(argv[++i]);
        } else if (starts_with(arg, "--level") || starts_with(arg, "-l")) {
            argMapId = atoi(argv[++i]);
        } else if (starts_with(arg, "-v")) {
            log_level(LOG_TRACE);
        } else {
            gameFolder = arg;
        }
    }
    if (!gameFolder) {
        printf(CliUsage);
        return 1;
    }

    log_info("Map:Init", lk_s("version", GIT_VERSION), lk_s("hash", GIT_HASH));

    int64_t initStartTime = currentTimeMillis();
    d2_game_init(gameFolder);
    int64_t duration = currentTimeMillis() - initStartTime;
    log_info("Map:Init:Done", lk_s("version", GIT_VERSION), lk_s("hash", GIT_HASH), lk_i("duration", duration));


    /** Seed/Diff has been passed in just generate the map that is required */
    if (argSeed > 0 && argDifficulty != -1) {
        int64_t totalTime = currentTimeMillis();

        if (argMapId > -1) {
            int64_t startTime = currentTimeMillis();
            d2_dump_map(argSeed, argDifficulty, argMapId);
            int64_t duration = currentTimeMillis() - startTime;
            log_debug("Map:Generation", lk_i("seed", argSeed), lk_i("difficulty", argDifficulty), lk_i("mapId", argMapId), lk_i("duration", duration));

        } else {
            for (int mapId = 0; mapId < 200; mapId++) {
                int64_t startTime = currentTimeMillis();
                int res = d2_dump_map(argSeed, argDifficulty, mapId);
                if (res == 1) continue; // Failed to generate the map

                int64_t currentTime = currentTimeMillis();
                int64_t duration = currentTime - startTime;
                startTime = currentTime;
                log_trace("Map:Generation", lk_i("seed", argSeed), lk_i("difficulty", argDifficulty), lk_i("mapId", mapId), lk_i("duration", duration), lk_i("res", res));
            }
        }
        int64_t duration = currentTimeMillis() - totalTime;
        log_info("Map:Generation:Done", lk_i("duration", duration));
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
