


#ifndef LOG_H
#define LOG_H
#include <unistd.h>
#include <stdio.h>
#include <sys/time.h>
#include "json.h"


enum { LOG_TRACE = 10,
       LOG_DEBUG = 20,
       LOG_INFO = 30,
       LOG_WARN = 40,
       LOG_ERROR = 50,
       LOG_FATAL = 60 };

int LogLevel = LOG_TRACE;

#define log_trace(...) log_log(LOG_TRACE, __FILE__, __LINE__, __VA_ARGS__)
#define log_debug(...) log_log(LOG_DEBUG, __FILE__, __LINE__, __VA_ARGS__)
#define log_info(...) log_log(LOG_INFO, __FILE__, __LINE__, __VA_ARGS__)
#define log_warn(...) log_log(LOG_WARN, __FILE__, __LINE__, __VA_ARGS__)
#define log_error(...) log_log(LOG_ERROR, __FILE__, __LINE__, __VA_ARGS__)
#define log_fatal(...) log_log(LOG_FATAL, __FILE__, __LINE__, __VA_ARGS__)
#define log_log(level, file, line, ...) ({ log_process(level, file, line, __VA_ARGS__, NULL); })

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

struct log_obj {
    uint8_t type;
    char* key;
    union {
        int int_val;
        char* char_val;
    };
} log_obj;

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
    char source[MAX_PATH];
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

#endif