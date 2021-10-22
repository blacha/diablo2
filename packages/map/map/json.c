#include <windows.h>
#include <inttypes.h>
#include <iostream>

FILE* jsonFp;
/**
 * Toggle these lines to enable/dissable printing of the JSON data to the console 
 */
#define JSON_PRINT(...) fprintf(jsonFp, __VA_ARGS__)
// #define JSON_PRINT(...)

bool json_comma_enabled = false;

void json_start() {
    jsonFp = stdout;
    JSON_PRINT("\n{");
}
void json_start(FILE* fp) {
    jsonFp = fp;
    JSON_PRINT("\n{");
}
void json_comma() {
    if (json_comma_enabled) {
        JSON_PRINT(", ");
    }
    json_comma_enabled = true;
}
void json_value(int value) {
    json_comma();
    JSON_PRINT("%d", value);
}
void json_key_raw(char *key) {
    JSON_PRINT("\"%s\":", key);
}
void json_key_value(char *key, int value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("%d", value);
}
void json_key_value(char *key, unsigned int value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("%u", value);
}
void json_key_value(char *key, int64_t value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("%" PRId64 "", value);
}
void json_key_value(char *key, char *value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("\"%s\"", value);
}
void json_key_value(char *key, bool value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("%s", value ? "true" : "false");
}

void json_array_start() {
    json_comma();
    json_comma_enabled = false;
    JSON_PRINT("[");
}
void json_array_start(char *key) {
    json_comma();
    json_key_raw(key);
    json_comma_enabled = false;
    JSON_PRINT("[");
}
void json_array_end() {
    JSON_PRINT("]");
    json_comma_enabled = true;
}

void json_object_start() {
    json_comma();
    JSON_PRINT("{");
    json_comma_enabled = false;
}
void json_object_start(char *key) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("{");
    json_comma_enabled = false;
}
void json_object_end() {
    JSON_PRINT("}");
    json_comma_enabled = true;
}

void json_end(bool force) {
    JSON_PRINT("}");
    json_comma_enabled = false;
    if (force) JSON_PRINT("\n");
    fflush(jsonFp);
}

void json_end() {
    json_end(true);
}