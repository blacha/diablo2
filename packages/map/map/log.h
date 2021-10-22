#ifndef LOG_H__
#define LOG_H__

#include "json.h"

enum
{
    LOG_TRACE = 10,
    LOG_DEBUG = 20,
    LOG_INFO = 30,
    LOG_WARN = 40,
    LOG_ERROR = 50,
    LOG_FATAL = 60
};

#define log_trace(...) log_log(LOG_TRACE, __FILE__, __LINE__, __VA_ARGS__)
#define log_debug(...) log_log(LOG_DEBUG, __FILE__, __LINE__, __VA_ARGS__)
#define log_info(...) log_log(LOG_INFO, __FILE__, __LINE__, __VA_ARGS__)
#define log_warn(...) log_log(LOG_WARN, __FILE__, __LINE__, __VA_ARGS__)
#define log_error(...) log_log(LOG_ERROR, __FILE__, __LINE__, __VA_ARGS__)
#define log_fatal(...) log_log(LOG_FATAL, __FILE__, __LINE__, __VA_ARGS__)
#define log_log(level, file, line, ...) ({ log_process(level, file, line, __VA_ARGS__, NULL); })


struct log_obj *lk_i(const char *key, int value);
struct log_obj *lk_ui(const char *key, unsigned int value);
struct log_obj *lk_s(const char *key, const char *value);
struct log_obj *lk_b(const char *key, bool value);


/** Set the current logging level */
void log_level(int logLevel);
/** Log a message */
void log_process(int level, const char *fileName, int line, const char *msg, ...);
/** Get the current time in milliseconds */
int64_t currentTimeMillis();

#endif