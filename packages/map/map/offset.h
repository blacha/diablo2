
#ifndef _OFFSET_H
#define _OFFSET_H

#include <windows.h>

void DefineOffsets();
DWORD GetDllOffset(int num);
DWORD GetDllOffset(char *DllName, int Offset);

#endif
