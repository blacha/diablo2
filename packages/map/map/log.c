#include <unistd.h>
#include <cstdlib>
#include <stdarg.h>
#include <stdio.h>
#include <sys/time.h>

#include "json.h"
#include "log.h"


struct log_obj
{
    uint8_t type;
    char *key;
    union
    {
        int int_val;
        char *char_val;
    };
} log_obj;
int LogLevel = LOG_TRACE;


int64_t currentTimeMillis() {
    struct timeval time;
    gettimeofday(&time, NULL);
    int64_t s1 = (int64_t)(time.tv_sec) * 1000;
    int64_t s2 = (time.tv_usec / 1000);
    return s1 + s2;
}

static enum {
    LOG_INT,
    LOG_STRING,
    LOG_BOOLEAN
} log_field_types;



static struct log_obj* log_field_new(const char* key) {
    struct log_obj* field = (struct log_obj*)malloc(sizeof(log_obj));
    memset(field, 0, sizeof(log_obj));
    field->key = (char*)malloc(strlen(key) + 1);
    strcpy(field->key, key);
    return field;
}

static void log_field_free(struct log_obj* sf) {
    if (sf == NULL) return;
    if (sf->key != NULL) free(sf->key);
    if ((sf->type == LOG_STRING) && (sf->char_val != NULL)) free(sf->char_val);
    free(sf);
}

struct log_obj* lk_i(const char* key, int value) {
    struct log_obj* field = log_field_new(key);
    field->type = LOG_INT;
    field->int_val = value;
    return field;
}
struct log_obj* lk_s(const char* key, const char* value) {
    struct log_obj* field = log_field_new(key);
    field->type = LOG_STRING;
    field->char_val = (char*)malloc(strlen(value) + 1);
    strcpy(field->char_val, value);
    return field;
}

struct log_obj* lk_b(const char* key, bool value) {
    if (value) return lk_s(key, "true");
    return lk_s(key, "false");
}

void log_process(int level, const char* fileName, int line, const char* msg, ...) {
    if (level < LogLevel) return;

    json_start(stdout);
    json_key_value("level", level);
    json_key_value("time", currentTimeMillis());
    char source[512];
    sprintf(source, "%s:%d", fileName, line);
    json_key_value("source", source);
    json_key_value("msg", (char*)msg);

    va_list ap;
    va_start(ap, msg);

    for (int i = 1;; i++) {
        struct log_obj* arg = va_arg(ap, struct log_obj*);
        if (arg == NULL) break;

        switch (arg->type) {
            case LOG_INT:
                json_key_value(arg->key, arg->int_val);
                break;
            case LOG_STRING:
                json_key_value(arg->key, arg->char_val);
                break;
        }
        log_field_free(arg);
    }

    json_end(false);
}