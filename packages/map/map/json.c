#include <windows.h>

#include <iostream>

/**
 * Toggle these lines to enable/dissable printing of the JSON data to the console 
 */
#define JSON_PRINT(...) printf(__VA_ARGS__)
// #define JSON_PRINT(...)

bool json_comma_enabled = false;

void json_start() {
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
void json_key_value(char *key, char *value) {
    json_comma();
    json_key_raw(key);
    JSON_PRINT("\"%s\"", value);
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
void json_end() {
    JSON_PRINT("}\n");
    json_comma_enabled = false;
}
