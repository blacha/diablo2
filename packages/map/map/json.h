#ifndef JSON_H
#define JSON_H

#include <stdint.h>

/** Really stupid JSON encoder which dumps to stdout/stderr */
void json_start();
void json_start(FILE* fp);

void json_comma();
void json_value(int value);
void json_key_raw(char *key);
void json_key_value(char *key, int value);
void json_key_value(char *key, unsigned int value);
void json_key_value(char *key, int64_t value);
void json_key_value(char *key, char *value);
void json_key_value(char* key, bool value);
void json_array_start(char *key);
void json_array_start();
void json_array_end();
void json_object_start();
void json_object_start(char *key);
void json_object_end();
void json_end();
void json_end(bool force);

#endif
