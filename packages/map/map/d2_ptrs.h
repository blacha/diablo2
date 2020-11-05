
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

// Shared between versions
FUNCPTR(FOG, 10021, VOID __fastcall, (CHAR * szProg), -10021)
FUNCPTR(D2COMMON,     LoadAct, Act *__stdcall, (DWORD ActNumber, DWORD MapId, DWORD Unk, DWORD Unk_2, DWORD Unk_3, DWORD Unk_4, DWORD TownLevelId, DWORD Func_1, DWORD Func_2), 0x24810)  // 1.13d

FUNCPTR(FOG, 10019, DWORD __fastcall, (CHAR * szAppName, DWORD pExceptionHandler, CHAR *szTitle, DWORD _1), -10019)
FUNCPTR(FOG, 10101, DWORD __fastcall, (DWORD _1, DWORD _2), -10101)
FUNCPTR(FOG, 10089, DWORD __fastcall, (DWORD _1), -10089)
FUNCPTR(FOG, 10218, DWORD __fastcall, (VOID), -10218)

// Path of diablo specific
FUNCPTR(D2CLIENT, Pod_InitGameMisc_I, VOID __stdcall, (DWORD Dummy1, DWORD Dummy2, DWORD Dummy3), 0x4454B)
VARPTR(STORM, Pod_MPQHashTable, DWORD, 0x52A60)
ASMPTR(D2CLIENT, Pod_LoadAct_1, 0x737F0)
ASMPTR(D2CLIENT, Pod_LoadAct_2, 0x2B420)

FUNCPTR(D2COMMON, Pod_AddRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), 0x24990)
FUNCPTR(D2COMMON, Pod_RemoveRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), 0x24930)
FUNCPTR(D2COMMON, Pod_GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo), 0x6D440)
FUNCPTR(D2COMMON, Pod_InitDataTables, DWORD __stdcall, (DWORD _1, DWORD _2, DWORD _3), -10081)  //  1.13d

FUNCPTR(D2COMMON, Pod_InitLevel, void __stdcall, (Level * pLevel), 0x6DDF0)
FUNCPTR(D2COMMON, Pod_LoadAct, Act *__stdcall, (DWORD ActNumber, DWORD MapId, DWORD Unk, DWORD Unk_2, DWORD Unk_3, DWORD Unk_4, DWORD TownLevelId, DWORD Func_1, DWORD Func_2), 0x24810)

FUNCPTR(D2COMMON, Pod_UnloadAct, VOID __stdcall, (Act * pAct), 0x24590)
FUNCPTR(D2COMMON, Pod_GetLevelText, LevelTxt *__stdcall, (DWORD levelno), 0x30CA0)
FUNCPTR(D2COMMON, Pod_GetObjectTxt, ObjectTxt *__stdcall, (DWORD objno), 0x1ADC0)


FUNCPTR(D2COMMON, 10081, DWORD __stdcall, (DWORD _1, DWORD _2, DWORD _3), -10081)
FUNCPTR(D2LANG, 10009, DWORD __fastcall, (DWORD _1, CHAR *_2, DWORD _3), -10009)
FUNCPTR(D2WIN, 10174, DWORD __fastcall, (VOID), -10174)
FUNCPTR(D2WIN, 10072, DWORD __fastcall, (DWORD _1, DWORD _2, DWORD _3, d2client_struct *pD2Client), -10072) 


// Project Diablo 2 Specific
FUNCPTR(D2CLIENT, Pd2_InitGameMisc_I, VOID __stdcall, (DWORD Dummy1, DWORD Dummy2, DWORD Dummy3), 0x4454B)
VARPTR(STORM, Pd2_MPQHashTable, DWORD, 0x53120)
ASMPTR(D2CLIENT, Pd2_LoadAct_1, 0x62AA0)
ASMPTR(D2CLIENT, Pd2_LoadAct_2, 0x62760)

FUNCPTR(D2COMMON, Pd2_AddRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), -10401)
FUNCPTR(D2COMMON, Pd2_RemoveRoomData, void __stdcall, (Act * ptAct, int LevelId, int Xpos, int Ypos, Room1 *pRoom), -11099)
FUNCPTR(D2COMMON, Pd2_GetLevel, Level *__fastcall, (ActMisc * pMisc, DWORD dwLevelNo), -10207)
FUNCPTR(D2COMMON, Pd2_InitLevel, void __stdcall, (Level * pLevel), -10322)
FUNCPTR(D2COMMON, Pd2_LoadAct, Act *__stdcall, (DWORD ActNumber, DWORD MapId, DWORD Unk, DWORD Unk_2, DWORD Unk_3, DWORD Unk_4, DWORD TownLevelId, DWORD Func_1, DWORD Func_2), 0x3CB30)
FUNCPTR(D2COMMON, Pd2_UnloadAct, VOID __stdcall, (Act * pAct), -10868)

FUNCPTR(D2COMMON, Pd2_GetLevelText, LevelTxt *__stdcall, (DWORD levelno), -10014)
FUNCPTR(D2COMMON, Pd2_GetObjectTxt, ObjectTxt *__stdcall, (DWORD objno), -10688)
FUNCPTR(D2COMMON, Pd2_InitDataTables, DWORD __stdcall, (DWORD _1, DWORD _2, DWORD _3), -10943)  //  1.13d


FUNCPTR(D2WIN, 10086, DWORD __fastcall, (VOID), -10086)
FUNCPTR(D2WIN, 10005, DWORD __fastcall, (DWORD _1, DWORD _2, DWORD _3, d2client_struct *pD2Client), -10005)
FUNCPTR(D2LANG, 10008, DWORD __fastcall, (DWORD _1, CHAR *_2, DWORD _3), -10008)
FUNCPTR(D2COMMON, 10943, DWORD __stdcall, (DWORD _1, DWORD _2, DWORD _3), -10943)


// Pod => PD2
// InitA D2Lang.10009   -> D2Lang.10008
// InitA D2Win.10174    -> D2Win.10086
// InitB D2WIN.10072    -> D2WIN.10005
//

#define _D2PTRS_START FOG_10021
#define _D2PTRS_END D2COMMON_10943

// #ifdef _DEFINE_VARS
// #else

// #endif
