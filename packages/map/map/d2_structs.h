#ifndef _D2STRUCTS_H
#define _D2STRUCTS_H

#include <windows.h>

struct UnitAny;
struct Room1;
struct Room2;
struct Level;
struct Act;
struct ActMisc;
struct RosterUnit;
struct OverheadMsg;

#pragma pack(push)
#pragma pack(1)

struct d2client_struct  //Updated 1.13
{
    DWORD dwInit;        //0x00
    BYTE _1[0x20D - 4];  //0x04
    DWORD fpInit;        //0x20D
};

#pragma pack(pop)

struct InventoryInfo  // Should be same in 1.13
{
    int nLocation;
    int nMaxXCells;
    int nMaxYCells;
};

struct CollMap {        //1.13?
    DWORD dwPosGameX;   //0x00
    DWORD dwPosGameY;   //0x04
    DWORD dwSizeGameX;  //0x08
    DWORD dwSizeGameY;  //0x0C
    DWORD dwPosRoomX;   //0x10
    DWORD dwPosRoomY;   //0x14
    DWORD dwSizeRoomX;  //0x18
    DWORD dwSizeRoomY;  //0x1C
    WORD *pMapStart;    //0x20
    WORD *pMapEnd;      //0x22
};

struct LevelTxt {
    DWORD dwLevelNo;            //0x00
    DWORD _1[60];               //0x04
    BYTE _2;                    //0xF4
    char szName[40];            //0xF5
    char szEntranceText[40];    //0x11D
    char szLevelDesc[41];       //0x145
    wchar_t wName[40];          //0x16E
    wchar_t wEntranceText[40];  //0x1BE
    BYTE nObjGroup[8];          //0x196
    BYTE nObjPrb[8];            //0x19E
};

#pragma pack(push)
#pragma pack(1)

//1.13c - RoomTile - McGod
struct RoomTile {
    Room2 *pRoom2;    //0x00
    RoomTile *pNext;  //0x04
    DWORD _2[2];      //0x08
    DWORD *nNum;      //0x10
};

struct QuestInfo {  //1.13?
    void *pBuffer;  //0x00
    DWORD _1;       //0x04
};

struct Waypoint {  //1.13?
    BYTE flags;    //0x00
};

struct PlayerData {                //1.13?
    char szName[0x10];             //0x00
    QuestInfo *pNormalQuest;       //0x10
    QuestInfo *pNightmareQuest;    //0x14
    QuestInfo *pHellQuest;         //0x18
    Waypoint *pNormalWaypoint;     //0x1c
    Waypoint *pNightmareWaypoint;  //0x20
    Waypoint *pHellWaypoint;       //0x24
};

//1.13c - PresetUnit - McGod
struct PresetUnit {
    DWORD _1;                 //0x00
    DWORD dwTxtFileNo;        //0x04
    DWORD dwPosX;             //0x08
    PresetUnit *pPresetNext;  //0x0C
    DWORD _3;                 //0x10
    DWORD dwType;             //0x14
    DWORD dwPosY;             //0x18
};

// //1.13c - Level - McGod
// struct Level {
// 	DWORD dwDrlgType;			//0x00 1 - maze, 2 - preset, 3 - wilderness
// 	DWORD dwLevelFlags;			//0x04
// 	DWORD _1[2];				//0x08
// 	Room2* pRoom2First;			//0x10
// 	union {
// 		LvlMazeTxt* pMazeTxt;    		//     for dwDrlgType == 1 (RANDOM MAZE)
// 		PresetData* pPreset;			//     for dwDrlgType == 2 (PRESET MAP)
// 		WildernessData* pWilderness;	//     for dwDrlgType == 3 (RANDOM AREA WITH PRESET SIZE)
// 	}; // 0x14
// 	DWORD _2;					//0x18
// 	DWORD dwPosX;				//0x1C
// 	DWORD dwPosY;				//0x20
// 	DWORD dwSizeX;				//0x24
// 	DWORD dwSizeY;				//0x28
// 	DWORD _3[96];				//0x2C
// 	Level* pNextLevel;			//0x1AC
// 	DWORD _4;					//0x1B0
// 	ActMisc* pMisc;				//0x1B4
// 	DWORD _5[2];				//0x1B8
// 	DWORD dwLevelType;			//0x1C0
// 	D2Seed hSeed;				//0x1C4
// 	LevelPreset* pLevelPresets;	//0x1CC
// 	DWORD dwLevelNo;			//0x1D0
// 	DWORD _6[3];				//0x1D4
// 	union {
// 		DWORD RoomCenterX[9];
// 		DWORD WarpX[9];
// 	};							//0x1E0
// 	union {
// 		DWORD RoomCenterY[9];
// 		DWORD WarpY[9];
// 	};							//0x204
// 	DWORD dwRoomEntries;		//0x228
// 	DWORD _7;					//0x22C
// };

struct Level {
    DWORD _1[4];         //0x00
    Room2 *pRoom2First;  //0x10
    DWORD _2[2];         //0x14
    DWORD dwPosX;        //0x1C
    DWORD dwPosY;        //0x20
    DWORD dwSizeX;       //0x24
    DWORD dwSizeY;       //0x28
    DWORD _3[96];        //0x2C
    Level *pNextLevel;   //0x1AC
    DWORD _4;            //0x1B0
    ActMisc *pMisc;      //0x1B4
    DWORD _5[6];         //0x1BC
    DWORD dwLevelNo;     //0x1D0
};

//1.13c - Room2 - McGod
struct Room2 {
    DWORD _1[2];           //0x00
    Room2 **pRoom2Near;    //0x08
    DWORD _2[6];           //0x0C
    Room2 *pRoom2Next;     //0x24
    DWORD dwRoomFlags;     //0x28
    DWORD dwRoomsNear;     //0x2C
    Room1 *pRoom1;         //0x30
    DWORD dwPosX;          //0x34
    DWORD dwPosY;          //0x38
    DWORD dwSizeX;         //0x3C
    DWORD dwSizeY;         //0x40
    DWORD _3;              //0x44
    DWORD dwPresetType;    //0x48
    RoomTile *pRoomTiles;  //0x4C
    DWORD _4[2];           //0x50
    Level *pLevel;         //0x58
    PresetUnit *pPreset;   //0x5C
};

#pragma pack(pop)

//1.13c - Room1 - McGod
struct Room1 {
    Room1 **pRoomsNear;   //0x00
    DWORD _1[3];          //0x04
    Room2 *pRoom2;        //0x10
    DWORD _2[3];          //0x14
    CollMap *Coll;        //0x20
    DWORD dwRoomsNear;    //0x24
    DWORD _3[9];          //0x28
    DWORD dwPosX;         //0x4C
    DWORD dwPosY;         //0x50
    DWORD dwSizeX;        //0x54
    DWORD dwSizeY;        //0x58
    DWORD _4[6];          //0x5C
    UnitAny *pUnitFirst;  //0x74
    DWORD _5;             //0x78
    Room1 *pRoomNext;     //0x7C
};

//1.13c - ActMisc - McGod
struct ActMisc {
    DWORD _1[37];            //0x00
    DWORD dwStaffTombLevel;  //0x94
    DWORD _2[245];           //0x98
    Act *pAct;               //0x46C
    DWORD _3[3];             //0x470
    Level *pLevelFirst;      //0x47C
};

//1.13c - Act - McGod
struct Act {
    DWORD _1[3];      //0x00
    DWORD dwMapSeed;  //0x0C
    Room1 *pRoom1;    //0x10
    DWORD dwAct;      //0x14
    DWORD _2[12];     //0x18
    ActMisc *pMisc;   //0x48
};

struct Path {              //1.13?
    WORD xOffset;          //0x00
    WORD xPos;             //0x02
    WORD yOffset;          //0x04
    WORD yPos;             //0x06
    DWORD _1[2];           //0x08
    WORD xTarget;          //0x10
    WORD yTarget;          //0x12
    DWORD _2[2];           //0x14
    Room1 *pRoom1;         //0x1C
    Room1 *pRoomUnk;       //0x20
    DWORD _3[3];           //0x24
    UnitAny *pUnit;        //0x30
    DWORD dwFlags;         //0x34
    DWORD _4;              //0x38
    DWORD dwPathType;      //0x3C
    DWORD dwPrevPathType;  //0x40
    DWORD dwUnitSize;      //0x44
    DWORD _5[4];           //0x48
    UnitAny *pTargetUnit;  //0x58
    DWORD dwTargetType;    //0x5C
    DWORD dwTargetId;      //0x60
    BYTE bDirection;       //0x64
};

struct ItemPath {  //1.13?
    DWORD _1[3];   //0x00
    DWORD dwPosX;  //0x0C
    DWORD dwPosY;  //0x10
                   //Use Path for the rest
};

struct Stat {           //1.13?
    WORD wSubIndex;     //0x00
    WORD wStatIndex;    //0x02
    DWORD dwStatValue;  //0x04
};

struct StatList {      //1.13?
    DWORD _1[9];       //0x00
    Stat *pStat;       //0x24
    WORD wStatCount1;  //0x28
    WORD wStatCount2;  //0x2A
    DWORD _2[2];       //0x2C
    BYTE *_3;          //0x34
    DWORD _4;          //0x38
    StatList *pNext;   //0x3C
};

struct Inventory1 {        //1.13?
    DWORD dwSignature;     //0x00
    BYTE *bGame1C;         //0x04
    UnitAny *pOwner;       //0x08
    UnitAny *pFirstItem;   //0x0C
    UnitAny *pLastItem;    //0x10
    DWORD _1[2];           //0x14
    DWORD dwLeftItemUid;   //0x1C
    UnitAny *pCursorItem;  //0x20
    DWORD dwOwnerId;       //0x24
    DWORD dwItemCount;     //0x28
};

struct Light {            //1.13?
    DWORD _1[3];          //0x00
    DWORD dwType;         //0x0C
    DWORD _2[7];          //0x10
    DWORD dwStaticValid;  //0x2C
    int *pnStaticMap;     //0x30
};

struct SkillInfo {  //1.13?
    WORD wSkillId;  //0x00
};

struct Skill {              //1.13?
    SkillInfo *pSkillInfo;  //0x00
    Skill *pNextSkill;      //0x04
    DWORD _1[8];            //0x08
    DWORD dwSkillLevel;     //0x28
    DWORD _2[2];            //0x2C
    DWORD dwFlags;          //0x30
};

struct Info {            //1.13?
    BYTE *pGame1C;       //0x00
    Skill *pFirstSkill;  //0x04
    Skill *pLeftSkill;   //0x08
    Skill *pRightSkill;  //0x0C
};

struct ItemData {                 //1.13?
    DWORD dwQuality;              //0x00
    DWORD _1[2];                  //0x04
    DWORD dwItemFlags;            //0x0C 1 = Owned by player, 0xFFFFFFFF = Not owned
    DWORD _2[2];                  //0x10
    DWORD dwFlags;                //0x18
    DWORD _3[3];                  //0x1C
    DWORD dwQuality2;             //0x28
    DWORD dwItemLevel;            //0x2C
    DWORD _4[2];                  //0x30
    WORD wPrefix;                 //0x38
    WORD _5[2];                   //0x3A
    WORD wSuffix;                 //0x3E
    DWORD _6;                     //0x40
    BYTE BodyLocation;            //0x44
    BYTE ItemLocation;            //0x45 Non-body/belt location (Body/Belt == 0xFF)
    BYTE _7;                      //0x46
    WORD _8;                      //0x47
    DWORD _9[4];                  //0x48
    Inventory1 *pOwnerInventory;  //0x5C
    DWORD _10;                    //0x60
    UnitAny *pNextInvItem;        //0x64
    BYTE _11;                     //0x68
    BYTE NodePage;                //0x69 Actual location, this is the most reliable by far
    WORD _12;                     //0x6A
    DWORD _13[6];                 //0x6C
    UnitAny *pOwner;              //0x84
};

struct MonsterData {  //1.13
    BYTE _1[22];      //0x00
    struct
    {
        BYTE fUnk : 1;
        BYTE fNormal : 1;
        BYTE fChamp : 1;
        BYTE fBoss : 1;
        BYTE fMinion : 1;
    };                   //0x16
    BYTE _2[5];          //[6]
    BYTE anEnchants[9];  //0x1C
    WORD wUniqueNo;      //0x26
    DWORD _5;            //0x28
    struct
    {
        wchar_t wName[28];
    };  //0x2C
};

struct MonsterTxt {
    BYTE _1[0x6];       //0x00
    WORD nLocaleTxtNo;  //0x06
    WORD flag;          //0x08
    WORD _1a;           //0x0A
    union {
        DWORD flag1;  //0x0C
        struct
        {
            BYTE flag1a;     //0x0C
            BYTE flag1b;     //0x0D
            BYTE flag1c[2];  //0x0E
        };
    };
    BYTE _2[0x22];               //0x10
    WORD velocity;               //0x32
    BYTE _2a[0x52];              //0x34
    WORD tcs[3][4];              //0x86
    BYTE _2b[0x52];              //0x9E
    wchar_t szDescriptor[0x3c];  //0xF0
    BYTE _3[0x1a0];              //0x12C
};

struct ObjectTxt {          //1.13?
    char szName[0x40];      //0x00
    wchar_t wszName[0x40];  //0x40
    BYTE _1[4];             //0xC0
    BYTE nSelectable0;      //0xC4
    BYTE _2[0x87];          //0xC5
    BYTE nOrientation;      //0x14C
    BYTE _2b[0x19];         //0x14D
    BYTE nSubClass;         //0x166
    BYTE _3[0x11];          //0x167
    BYTE nParm0;            //0x178
    BYTE _4[0x39];          //0x179
    BYTE nPopulateFn;       //0x1B2
    BYTE nOperateFn;        //0x1B3
    BYTE _5[8];             //0x1B4
    DWORD nAutoMap;         //0x1BB
};

struct ObjectData {      //1.13?
    ObjectTxt *pTxt;     //0x00
    DWORD Type;          //0x04 (0x0F would be a Exp Shrine)
    DWORD _1[8];         //0x08
    char szOwner[0x10];  //0x28
};

struct ObjectPath {  //1.13?
    Room1 *pRoom1;   //0x00
    DWORD _1[2];     //0x04
    DWORD dwPosX;    //0x0C
    DWORD dwPosY;    //0x10
                     //Leaving rest undefined, use Path
};

struct UnitAny {        //1.13?
    DWORD dwType;       //0x00
    DWORD dwTxtFileNo;  //0x04
    DWORD _1;           //0x08
    DWORD dwUnitId;     //0x0C
    DWORD dwMode;       //0x10
    union {
        PlayerData *pPlayerData;
        ItemData *pItemData;
        MonsterData *pMonsterData;
        ObjectData *pObjectData;
        //TileData *pTileData doesn't appear to exist anymore
    };                //0x14
    DWORD dwAct;      //0x18
    Act *pAct;        //0x1C
    DWORD dwSeed[2];  //0x20
    DWORD _2;         //0x28
    union {
        Path *pPath;
        ItemPath *pItemPath;
        ObjectPath *pObjectPath;
    };                       //0x2C
    DWORD _3[5];             //0x30
    DWORD dwGfxFrame;        //0x44
    DWORD dwFrameRemain;     //0x48
    WORD wFrameRate;         //0x4C
    WORD _4;                 //0x4E
    BYTE *pGfxUnk;           //0x50
    DWORD *pGfxInfo;         //0x54
    DWORD _5;                //0x58
    StatList *pStats;        //0x5C
    Inventory1 *pInventory;  //0x60
    Light *ptLight;          //0x64
    DWORD _6[9];             //0x68
    WORD wX;                 //0x8C
    WORD wY;                 //0x8E
    DWORD _7;                //0x90
    DWORD dwOwnerType;       //0x94
    DWORD dwOwnerId;         //0x98
    DWORD _8[2];             //0x9C
    OverheadMsg *pOMsg;      //0xA4
    Info *pInfo;             //0xA8
    DWORD _9[6];             //0xAC
    DWORD dwFlags;           //0xC4
    DWORD dwFlags2;          //0xC8
    DWORD _10[5];            //0xCC
    UnitAny *pChangedNext;   //0xE0
    UnitAny *pRoomNext;      //0xE4
    UnitAny *pListNext;      //0xE8 -> 0xD8
};

#pragma pack(push)
#pragma pack(1)

typedef struct
{
    DWORD dwNPCClassId;
    DWORD dwEntryAmount;
    WORD wEntryId1;
    WORD wEntryId2;
    WORD wEntryId3;
    WORD wEntryId4;
    WORD _1;
    DWORD dwEntryFunc1;
    DWORD dwEntryFunc2;
    DWORD dwEntryFunc3;
    DWORD dwEntryFunc4;
    BYTE _2[5];
} NPCMenu;

struct OverheadMsg {
    DWORD _1;
    DWORD dwTrigger;
    DWORD _2[2];
    CHAR Msg[232];
};

#pragma pack(pop)

struct D2MSG {
    HWND myHWND;
    char lpBuf[256];
};

struct InventoryLayout {
    BYTE SlotWidth;
    BYTE SlotHeight;
    BYTE unk1;
    BYTE unk2;
    DWORD Left;
    DWORD Right;
    DWORD Top;
    DWORD Bottom;
    BYTE SlotPixelWidth;
    BYTE SlotPixelHeight;
};

struct MpqTable {
};

struct sgptDataTable {
    MpqTable *pPlayerClass;
    DWORD dwPlayerClassRecords;
    MpqTable *pBodyLocs;
    DWORD dwBodyLocsRecords;
    MpqTable *pStorePage;
    DWORD dwStorePageRecords;
    MpqTable *pElemTypes;
};

#endif

/*
struct Room2 {
	DWORD _1[2];
	Room2 **pRoom2Near;
	DWORD _2[2];

	Level* pLevel;					//0x00
	DWORD _1;						//0x04
	DWORD dwRoomsNear;				//0x08
	RoomTile* pRoomTiles;			//0x0C
	Room2 **pRoom2Near;				//0x10
	DWORD _3[6];					//0x14
	DWORD dwPosX;					//0x2C
	DWORD dwPosY;					//0x30
	DWORD dwSizeX;					//0x34
	DWORD dwSizeY;					//0x38
	DWORD *pType2Info;				//0x3C
	DWORD _4[0x20];					//0x40
	DWORD dwPresetType;				//0xC0
	PresetUnit*	pPreset;			//0xC4
	DWORD _5[0x3];					//0xC8
	Room2* pRoom2Next;				//0xD4
	Room1* pRoom1;					//0xD8
};
*/
/*struct Room1 {
	Room1 **pRoomsNear;				//0x00
	DWORD _1[3];					//0x04
	DWORD dwSeed[2];				//0x0C
	DWORD _2;						//0x14
	DWORD dwXStart;					//0x18
	DWORD dwYStart;					//0x1C
	DWORD dwXSize;					//0x20
	DWORD dwYSize;					//0x24
	DWORD _3[0x4];					//0x28
	Room1* pRoomNext;				//0x38
	DWORD _4;						//0x3C
	UnitAny* pUnitFirst;			//0x40
	DWORD _5[3];					//0x44
	CollMap* Coll;					//0x50
	DWORD _6[0x7];					//0x54
	Room2* pRoom2;					//0x70
	DWORD _7;						//0x74
	DWORD dwRoomsNear;				//0x78
	}
	*/
