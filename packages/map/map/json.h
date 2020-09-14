
/** Really stupid JSON encoder which dumps to stdout */
void json_start();
void json_comma();
void json_value(int value);
void json_key_raw(char *key);
void json_key_value(char *key, int value);
void json_key_value(char *key, char *value);
void json_array_start(char *key);
void json_array_start();
void json_array_end();
void json_object_start();
void json_object_start(char *key);
void json_object_end();
void json_end();
