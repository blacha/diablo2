
#include "d2_structs.h"

#ifdef _DEFINE_VARS

enum {
    DLLNO_D2CLIENT,
    DLLNO_D2COMMON,
    DLLNO_D2GFX,
    DLLNO_D2LANG,
    DLLNO_D2WIN,
    DLLNO_D2NET,
    DLLNO_D2GAME,
    DLLNO_D2LAUNCH,
    DLLNO_FOG,
    DLLNO_BNCLIENT,
    DLLNO_STORM,
    DLLNO_D2CMP,
    DLLNO_D2MULTI,
    DLLNO_D2SOUND
};

#define DLLOFFSET(a1, b1) ((DLLNO_##a1) | ((b1) << 8))
#define FUNCPTR(d1, v1, t1, t2, o1) \
    typedef t1 d1##_##v1##_t t2;    \
    d1##_##v1##_t *d1##_##v1 = (d1##_##v1##_t *)DLLOFFSET(d1, o1);
#define VARPTR(d1, v1, t1, o1) \
    typedef t1 d1##_##v1##_t;  \
    d1##_##v1##_t *p_##d1##_##v1 = (d1##_##v1##_t *)DLLOFFSET(d1, o1);
#define ASMPTR(d1, v1, o1) DWORD d1##_##v1 = DLLOFFSET(d1, o1);

#else

#define FUNCPTR(d1, v1, t1, t2, o1) \
    typedef t1 d1##_##v1##_t t2;    \
    extern "C" d1##_##v1##_t *d1##_##v1;
#define VARPTR(d1, v1, t1, o1) \
    typedef t1 d1##_##v1##_t;  \
    extern d1##_##v1##_t *p_##d1##_##v1;
#define ASMPTR(d1, v1, o1) extern DWORD d1##_##v1;

#endif

FUNCPTR(FOG, 10021, VOID __fastcall, (CHAR * szProg), -10021)                                                        // 1.13d
FUNCPTR(FOG, 10019, DWORD __fastcall, (CHAR * szAppName, DWORD pExceptionHandler, CHAR *szTitle, DWORD _1), -10019)  //1.13d
FUNCPTR(FOG, 10101, DWORD __fastcall, (DWORD _1, DWORD _2), -10101)                                                  // 1.13d
FUNCPTR(FOG, 10089, DWORD __fastcall, (DWORD _1), -10089)                                                            // 1.13d
FUNCPTR(FOG, 10218, DWORD __fastcall, (VOID), -10218)                                                                // 1.13d
FUNCPTR(FOG, WriteLogFile, DWORD __cdecl, (char *szFormat), -10029)                                                  // 1.13d

FUNCPTR(D2COMMON, GetObjectTxt, ObjectTxt *__stdcall, (DWORD objno), 0x1ADC0)
// FUNCPTR(D2CLIENT, GetMonsterTxt, MonsterTxt *__fastcall, (DWORD monno), 0x1434) // Broken
// FUNCPTR(D2CLIENT, GetMonsterTxt, MonsterTxt *__fastcall, (DWORD monno), 0x1390) // Broken Updated
// FUNCPTR(D2CLIENT, GetMonsterTxt, MonsterTxt *__fastcall, (DWORD monno), 0x1230) // Updated 1.13c

FUNCPTR(D2CLIENT, GetMonsterOwner, DWORD __fastcall, (DWORD nMonsterId), 0x8E3D0)

FUNCPTR(D2CLIENT, InitGameMisc_I, VOID __stdcall, (DWORD Dummy1, DWORD Dummy2, DWORD Dummy3), 0x4559B)  //  1.13d
VARPTR(STORM, MPQHashTable, DWORD, 0x52A60)                                                             // 1.13d
ASMPTR(D2CLIENT, LoadAct_1, 0x737F0)                                                                    // 1.13d
ASMPTR(D2CLIENT, LoadAct_2, 0x2B420)                                                                    // 1.13d
// ASMPTR(D2CLIENT, LoadAct_1, 0x62AAE) // Updated 1.13c
// ASMPTR(D2CLIENT, LoadAct_2, 0x62760) // Updated 1.13c
FUNCPTR(D2COMMON, AddRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), 0x24990)     // 1.13d
FUNCPTR(D2COMMON, RemoveRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), 0x24930)  // 1.13d
FUNCPTR(D2COMMON, GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo), 0x6D440)                               // Orig 1.13d
// FUNCPTR(D2COMMON, GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo),  -10207) // SemiWorks
// FUNCPTR(D2COMMON, GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo),  -11020) // ??
// FUNCPTR(D2COMMON, GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo),  -10283) // ??							 // 1.13d
// 1.13d
FUNCPTR(D2COMMON, GetLevelText, LevelTxt *__stdcall, (DWORD levelno), 0x30CA0)

FUNCPTR(D2COMMON, InitLevel, void __stdcall, (Level * pLevel), 0x6DDF0)                                                                                                               // 1.13d
FUNCPTR(D2COMMON, LoadAct, Act *__stdcall, (DWORD ActNumber, DWORD MapId, DWORD Unk, DWORD Unk_2, DWORD Unk_3, DWORD Unk_4, DWORD TownLevelId, DWORD Func_1, DWORD Func_2), 0x24810)  // 1.13d
FUNCPTR(D2COMMON, UnloadAct, VOID __stdcall, (Act * pAct), 0x24590)

FUNCPTR(D2LANG, 10009, DWORD __fastcall, (DWORD _1, CHAR *_2, DWORD _3), -10009)  //  1.13d
FUNCPTR(D2LANG, GetLocaleText, wchar_t *__fastcall, (WORD nLocaleTxtNo), 0x98A0)
FUNCPTR(D2COMMON, InitDataTables, DWORD __stdcall, (DWORD _1, DWORD _2, DWORD _3), -10081)  //  1.13d

FUNCPTR(D2WIN, 10174, DWORD __fastcall, (VOID), -10174)                                                      //  1.13d
FUNCPTR(D2WIN, 10072, DWORD __fastcall, (DWORD _1, DWORD _2, DWORD _3, d2client_struct *pD2Client), -10072)  //1.13d

#define _D2PTRS_START FOG_10021
#define _D2PTRS_END D2WIN_10072

// #ifdef _DEFINE_VARS
// #else

// #endif
