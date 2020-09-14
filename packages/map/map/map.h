#ifndef _Map_h__
#define _Map_h__

int map_max_x();
int map_max_y();

int map_offset(int x, int y);
int map_value(int x, int y);
void map_set(int x, int y, int value);
void map_reset();

#endif
