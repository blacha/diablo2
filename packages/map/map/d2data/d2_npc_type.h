#ifndef _NpcType_h__
#define _NpcType_h__

enum NpcCode {
    Skeleton = 0,
    Returned = 1,
    BoneWarrior = 2,
    BurningDead = 3,
    Horror = 4,
    Zombie = 5,
    HungryDead = 6,
    Ghoul = 7,
    DrownedCarcass = 8,
    PlagueBearer = 9,
    Afflicted = 10,
    Tainted = 11,
    Misshapen = 12,
    Disfigured = 13,
    Damned = 14,
    FoulCrow = 15,
    BloodHawk = 16,
    BlackRaptor = 17,
    CloudStalker = 18,
    Fallen = 19,
    Carver = 20,
    Devilkin = 21,
    DarkOne = 22,
    WarpedFallen = 23,
    Brute = 24,
    Yeti = 25,
    Crusher = 26,
    WailingBeast = 27,
    GargantuanBeast = 28,
    SandRaider = 29,
    Marauder = 30,
    Invader = 31,
    Infidel = 32,
    Assailant = 33,
    Gorgon = 34,   // Unused
    Gorgon2 = 35,  // Unused
    Gorgon3 = 36,  // Unused
    Gorgon4 = 37,  // Unused
    Ghost = 38,
    Wraith = 39,
    Specter = 40,
    Apparition = 41,
    DarkShape = 42,
    DarkHunter = 43,
    VileHunter = 44,
    DarkStalker = 45,
    BlackRogue = 46,
    FleshHunter = 47,
    DuneBeast = 48,
    RockDweller = 49,
    JungleHunter = 50,
    DoomApe = 51,
    TempleGuard = 52,
    MoonClan = 53,
    NightClan = 54,
    BloodClan = 55,
    HellClan = 56,
    DeathClan = 57,
    FallenShaman = 58,
    CarverShaman = 59,
    DevilkinShaman = 60,
    DarkShaman = 61,
    WarpedShaman = 62,
    QuillRat = 63,
    SpikeFiend = 64,
    ThornBeast = 65,
    RazorSpine = 66,
    JungleUrchin = 67,
    SandMaggot = 68,
    RockWorm = 69,
    Devourer = 70,
    GiantLamprey = 71,
    WorldKiller = 72,
    TombViper = 73,
    ClawViper = 74,
    Salamander = 75,
    PitViper = 76,
    SerpentMagus = 77,
    SandLeaper = 78,
    CaveLeaper = 79,
    TombCreeper = 80,
    TreeLurker = 81,
    RazorPitDemon = 82,
    Huntress = 83,
    SaberCat = 84,
    NightTiger = 85,
    HellCat = 86,
    Itchies = 87,
    BlackLocusts = 88,
    PlagueBugs = 89,
    HellSwarm = 90,
    DungSoldier = 91,
    SandWarrior = 92,
    Scarab = 93,
    SteelWeevil = 94,
    AlbinoRoach = 95,
    DriedCorpse = 96,
    Decayed = 97,
    Embalmed = 98,
    PreservedDead = 99,
    Cadaver = 100,
    HollowOne = 101,
    Guardian = 102,
    Unraveler = 103,
    HoradrimAncient = 104,
    BaalSubjectMummy = 105,
    ChaosHorde = 106,   // Unused
    ChaosHorde2 = 107,  // Unused
    ChaosHorde3 = 108,  // Unused
    ChaosHorde4 = 109,  // Unused
    CarrionBird = 110,
    UndeadScavenger = 111,
    HellBuzzard = 112,
    WingedNightmare = 113,
    Sucker = 114,
    Feeder = 115,
    BloodHook = 116,
    BloodWing = 117,
    Gloam = 118,
    SwampGhost = 119,
    BurningSoul = 120,
    BlackSoul = 121,
    Arach = 122,
    SandFisher = 123,
    PoisonSpinner = 124,
    FlameSpider = 125,
    SpiderMagus = 126,
    ThornedHulk = 127,
    BrambleHulk = 128,
    Thrasher = 129,
    Spikefist = 130,
    GhoulLord = 131,
    NightLord = 132,
    DarkLord = 133,
    BloodLord = 134,
    Banished = 135,
    DesertWing = 136,
    Fiend = 137,
    Gloombat = 138,
    BloodDiver = 139,
    DarkFamiliar = 140,
    RatMan = 141,
    Fetish = 142,
    Flayer = 143,
    SoulKiller = 144,
    StygianDoll = 145,
    DeckardCain = 146,
    Gheed = 147,
    Akara = 148,
    Chicken = 149,  // Dummy
    Kashya = 150,
    Rat = 151,         // Dummy
    Rogue = 152,       // Dummy
    HellMeteor = 153,  // Dummy
    Charsi = 154,
    Warriv = 155,
    Andariel = 156,
    Bird = 157,   // Dummy
    Bird2 = 158,  // Dummy
    Bat = 159,    // Dummy
    DarkRanger = 160,
    VileArcher = 161,
    DarkArcher = 162,
    BlackArcher = 163,
    FleshArcher = 164,
    DarkSpearwoman = 165,
    VileLancer = 166,
    DarkLancer = 167,
    BlackLancer = 168,
    FleshLancer = 169,
    SkeletonArcher = 170,
    ReturnedArcher = 171,
    BoneArcher = 172,
    BurningDeadArcher = 173,
    HorrorArcher = 174,
    Warriv2 = 175,
    Atma = 176,
    Drognan = 177,
    Fara = 178,
    Cow = 179,  // Dummy
    SandMaggotYoung = 180,
    RockWormYoung = 181,
    DevourerYoung = 182,
    GiantLampreyYoung = 183,
    WorldKillerYoung = 184,
    Camel = 185,  // Dummy
    Blunderbore = 186,
    Gorbelly = 187,
    Mauler = 188,
    Urdar = 189,
    SandMaggotEgg = 190,
    RockWormEgg = 191,
    DevourerEgg = 192,
    GiantLampreyEgg = 193,
    WorldKillerEgg = 194,
    Act2Male = 195,    // Dummy
    Act2Female = 196,  // Dummy
    Act2Child = 197,   // Dummy
    Greiz = 198,
    Elzix = 199,
    Geglash = 200,
    Jerhyn = 201,
    Lysander = 202,
    Act2Guard = 203,    // Dummy
    Act2Vendor = 204,   // Dummy
    Act2Vendor2 = 205,  // Dummy
    FoulCrowNest = 206,
    BloodHawkNest = 207,
    BlackVultureNest = 208,
    CloudStalkerNest = 209,
    Meshif = 210,
    Duriel = 211,
    UndeadRatMan = 212,       //Unused???
    UndeadFetish = 213,       //Unused???
    UndeadFlayer = 214,       //Unused???
    UndeadSoulKiller = 215,   //Unused???
    UndeadStygianDoll = 216,  //Unused???
    DarkGuard = 217,          // Unused
    DarkGuard2 = 218,         // Unused
    DarkGuard3 = 219,         // Unused
    DarkGuard4 = 220,         // Unused
    DarkGuard5 = 221,         // Unused
    BloodMage = 222,          // Unused
    BloodMage2 = 223,         // Unused
    BloodMage3 = 224,         // Unused
    BloodMage4 = 225,         // Unused
    BloodMage5 = 226,         // Unused
    Maggot = 227,
    MummyGenerator = 228,  //TEST: Sarcophagus
    Radament = 229,
    FireBeast = 230,       // Unused
    IceGlobe = 231,        // Unused
    LightningBeast = 232,  // Unused
    PoisonOrb = 233,       // Unused
    FlyingScimitar = 234,
    Zakarumite = 235,
    Faithful = 236,
    Zealot = 237,
    Sexton = 238,
    Cantor = 239,
    Heirophant = 240,
    Heirophant2 = 241,
    Mephisto = 242,
    Diablo = 243,
    DeckardCain2 = 244,
    DeckardCain3 = 245,
    DeckardCain4 = 246,
    SwampDweller = 247,
    BogCreature = 248,
    SlimePrince = 249,
    Summoner = 250,
    Tyrael = 251,
    Asheara = 252,
    Hratli = 253,
    Alkor = 254,
    Ormus = 255,
    Izual = 256,
    Halbu = 257,
    WaterWatcherLimb = 258,
    RiverStalkerLimb = 259,
    StygianWatcherLimb = 260,
    WaterWatcherHead = 261,
    RiverStalkerHead = 262,
    StygianWatcherHead = 263,
    Meshif2 = 264,
    DeckardCain5 = 265,
    Navi = 266,
    BloodRaven = 267,
    Bug = 268,       // Dummy
    Scorpion = 269,  // Dummy
    RogueScout = 270,
    Rogue2 = 271,  // Dummy
    Rogue3 = 272,  // Dummy
    GargoyleTrap = 273,
    ReturnedMage = 274,
    BoneMage = 275,
    BurningDeadMage = 276,
    HorrorMage = 277,
    RatManShaman = 278,
    FetishShaman = 279,
    FlayerShaman = 280,
    SoulKillerShaman = 281,
    StygianDollShaman = 282,
    Larva = 283,
    SandMaggotQueen = 284,
    RockWormQueen = 285,
    DevourerQueen = 286,
    GiantLampreyQueen = 287,
    WorldKillerQueen = 288,
    ClayGolem = 289,
    BloodGolem = 290,
    IronGolem = 291,
    FireGolem = 292,
    Familiar = 293,  // Dummy
    Act3Male = 294,  // Dummy
    NightMarauder = 295,
    Act3Female = 296,  // Dummy
    Natalya = 297,
    FleshSpawner = 298,
    StygianHag = 299,
    Grotesque = 300,
    FleshBeast = 301,
    StygianDog = 302,
    GrotesqueWyrm = 303,
    Groper = 304,
    Strangler = 305,
    StormCaster = 306,
    Corpulent = 307,
    CorpseSpitter = 308,
    MawFiend = 309,
    DoomKnight = 310,
    AbyssKnight = 311,
    OblivionKnight = 312,
    QuillBear = 313,
    SpikeGiant = 314,
    ThornBrute = 315,
    RazorBeast = 316,
    GiantUrchin = 317,
    Snake = 318,            // Dummy
    Parrot = 319,           // Dummy
    Fish = 320,             // Dummy
    EvilHole = 321,         // Dummy
    EvilHole2 = 322,        // Dummy
    EvilHole3 = 323,        // Dummy
    EvilHole4 = 324,        // Dummy
    EvilHole5 = 325,        // Dummy
    FireboltTrap = 326,     // A trap
    HorzMissileTrap = 327,  // A trap
    VertMissileTrap = 328,  // A trap
    PoisonCloudTrap = 329,  // A trap
    LightningTrap = 330,    // A trap
    Kaelan = 331,           // Act2Guard2
    InvisoSpawner = 332,    // Dummy
    DiabloClone = 333,      //Unused???
    SuckerNest = 334,
    FeederNest = 335,
    BloodHookNest = 336,
    BloodWingNest = 337,
    Guard = 338,        // Act2Hire
    MiniSpider = 339,   // Dummy
    BonePrison = 340,   //Unused???
    BonePrison2 = 341,  //Unused???
    BonePrison3 = 342,  //Unused???
    BonePrison4 = 343,  //Unused???
    BoneWall = 344,     // Dummy
    CouncilMember = 345,
    CouncilMember2 = 346,
    CouncilMember3 = 347,
    Turret = 348,
    Turret2 = 349,
    Turret3 = 350,
    Hydra = 351,
    Hydra2 = 352,
    Hydra3 = 353,
    MeleeTrap = 354,   // A trap
    SevenTombs = 355,  // Dummy
    Decoy = 356,
    Valkyrie = 357,
    Act2Guard3 = 358,  //Unused???
    IronWolf = 359,    // Act3Hire
    Balrog = 360,
    PitLord = 361,
    VenomLord = 362,
    NecroSkeleton = 363,
    NecroMage = 364,
    Griswold = 365,
    CompellingOrbNpc = 366,
    Tyrael2 = 367,
    DarkWanderer = 368,
    NovaTrap = 369,
    SpiritMummy = 370,  // Dummy
    LightningSpire = 371,
    FireTower = 372,
    Slinger = 373,
    SpearCat = 374,
    NightSlinger = 375,
    HellSlinger = 376,
    Act2Guard4 = 377,  // Dummy
    Act2Guard5 = 378,  // Dummy
    ReturnedMage2 = 379,
    BoneMage2 = 380,
    BaalColdMage = 381,
    HorrorMage2 = 382,
    ReturnedMage3 = 383,
    BoneMage3 = 384,
    BurningDeadMage2 = 385,
    HorrorMage3 = 386,
    ReturnedMage4 = 387,
    BoneMage4 = 388,
    BurningDeadMage3 = 389,
    HorrorMage4 = 390,
    HellBovine = 391,
    Window = 392,   // Dummy
    Window2 = 393,  // Dummy
    SpearCat2 = 394,
    NightSlinger2 = 395,
    RatMan2 = 396,
    Fetish2 = 397,
    Flayer2 = 398,
    SoulKiller2 = 399,
    StygianDoll2 = 400,
    MephistoSpirit = 401,  // Dummy
    TheSmith = 402,
    TrappedSoul = 403,
    TrappedSoul2 = 404,
    Jamella = 405,
    Izual2 = 406,
    RatMan3 = 407,
    Malachai = 408,
    Hephasto = 409,  // The Feature Creep ?!?

    // Expansion (Are We missing something here?  D2BS has a 410 that we DONT have)
    WakeOfDestruction = 410,
    ChargedBoltSentry = 411,
    LightningSentry = 412,
    BladeCreeper = 413,
    InvisiblePet = 414,  // Dummy ? Unused ?
    InfernoSentry = 415,
    DeathSentry = 416,
    ShadowWarrior = 417,
    ShadowMaster = 418,
    DruidHawk = 419,
    DruidSpiritWolf = 420,
    DruidFenris = 421,
    SpiritOfBarbs = 422,
    HeartOfWolverine = 423,
    OakSage = 424,
    DruidPlaguePoppy = 425,
    DruidCycleOfLife = 426,
    VineCreature = 427,
    DruidBear = 428,
    Eagle = 429,
    Wolf = 430,
    Bear = 431,
    BarricadeDoor = 432,
    BarricadeDoor2 = 433,
    PrisonDoor = 434,
    BarricadeTower = 435,
    RotWalker = 436,
    ReanimatedHorde = 437,
    ProwlingDead = 438,
    UnholyCorpse = 439,
    DefiledWarrior = 440,
    SiegeBeast = 441,
    CrushBiest = 442,
    BloodBringer = 443,
    GoreBearer = 444,
    DeamonSteed = 445,
    SnowYeti = 446,
    SnowYeti2 = 447,
    SnowYeti3 = 448,
    SnowYeti4 = 449,
    WolfRider = 450,
    WolfRider2 = 451,
    WolfRider3 = 452,
    MinionExp = 453,  // ??
    SlayerExp = 454,  // ??
    IceBoar = 455,
    FireBoar = 456,
    HellSpawn = 457,
    IceSpawn = 458,
    GreaterHellSpawn = 459,
    GreaterIceSpawn = 460,
    FanaticMinion = 461,
    BerserkSlayer = 462,
    ConsumedIceBoar = 463,
    ConsumedFireBoar = 464,
    FrenziedHellSpawn = 465,
    FrenziedIceSpawn = 466,
    InsaneHellSpawn = 467,
    InsaneIceSpawn = 468,
    SuccubusExp = 469,  // just Succubus ??
    VileTemptress = 470,
    StygianHarlot = 471,
    HellTemptress = 472,
    BloodTemptress = 473,
    Dominus = 474,
    VileWitch = 475,
    StygianFury = 476,
    BloodWitch = 477,
    HellWitch = 478,
    OverSeer = 479,
    Lasher = 480,
    OverLord = 481,
    BloodBoss = 482,
    HellWhip = 483,
    MinionSpawner = 484,
    MinionSlayerSpawner = 485,
    MinionBoarSpawner = 486,
    MinionBoarSpawner2 = 487,
    MinionSpawnSpawner = 488,
    MinionBoarSpawner3 = 489,
    MinionBoarSpawner4 = 490,
    MinionSpawnSpawner2 = 491,
    Imp = 492,
    Imp2 = 493,
    Imp3 = 494,
    Imp4 = 495,
    Imp5 = 496,
    CatapultS = 497,
    CatapultE = 498,
    CatapultSiege = 499,
    CatapultW = 500,
    FrozenHorror = 501,
    FrozenHorror2 = 502,
    FrozenHorror3 = 503,
    FrozenHorror4 = 504,
    FrozenHorror5 = 505,
    BloodLord2 = 506,
    BloodLord3 = 507,
    BloodLord4 = 508,
    BloodLord5 = 509,
    BloodLord6 = 510,
    Larzuk = 511,
    Drehya = 512,
    Malah = 513,
    NihlathakTown = 514,
    QualKehk = 515,
    CatapultSpotterS = 516,
    CatapultSpotterE = 517,
    CatapultSpotterSiege = 518,
    CatapultSpotterW = 519,
    DeckardCain6 = 520,
    Tyrael3 = 521,
    Act5Combatant = 522,
    Act5Combatant2 = 523,
    BarricadeWallRight = 524,
    BarricadeWallLeft = 525,
    Nihlathak = 526,
    Drehya2 = 527,
    EvilHut = 528,
    DeathMauler = 529,
    DeathMauler2 = 530,
    DeathMauler3 = 531,
    DeathMauler4 = 532,
    DeathMauler5 = 533,
    POW = 534,
    Act5Townguard = 535,
    Act5Townguard2 = 536,
    AncientStatue = 537,
    AncientStatueNpc2 = 538,
    AncientStatueNpc3 = 539,
    AncientBarbarian = 540,
    AncientBarbarian2 = 541,
    AncientBarbarian3 = 542,
    BaalThrone = 543,
    BaalCrab = 544,
    BaalTaunt = 545,
    PutridDefiler = 546,
    PutridDefiler2 = 547,
    PutridDefiler3 = 548,
    PutridDefiler4 = 549,
    PutridDefiler5 = 550,
    PainWorm = 551,
    PainWorm2 = 552,
    PainWorm3 = 553,
    PainWorm4 = 554,
    PainWorm5 = 555,
    Bunny = 556,
    CouncilMemberBall = 557,
    VenomLord2 = 558,
    BaalCrabToStairs = 559,
    Act5Hireling1Hand = 560,
    Act5Hireling2Hand = 561,
    BaalTentacle = 562,
    BaalTentacle2 = 563,
    BaalTentacle3 = 564,
    BaalTentacle4 = 565,
    BaalTentacle5 = 566,
    InjuredBarbarian = 567,
    InjuredBarbarian2 = 568,
    InjuredBarbarian3 = 569,
    BaalCrabClone = 570,
    BaalsMinion = 571,
    BaalsMinion2 = 572,
    BaalsMinion3 = 573,
    WorldstoneEffect = 574,  // D2BS stops here???
    BurningDeadArcher2 = 575,
    BoneArcher2 = 576,
    BurningDeadArcher3 = 577,
    ReturnedArcher2 = 578,
    HorrorArcher2 = 579,
    Afflicted2 = 580,
    Tainted2 = 581,
    Misshapen2 = 582,
    Disfigured2 = 583,
    Damned2 = 584,
    MoonClan2 = 585,
    NightClan2 = 586,
    HellClan2 = 587,
    BloodClan2 = 588,
    DeathClan2 = 589,
    FoulCrow2 = 590,
    BloodHawk2 = 591,
    BlackRaptor2 = 592,
    CloudStalker2 = 593,
    ClawViper2 = 594,
    PitViper2 = 595,
    Salamander2 = 596,
    TombViper2 = 597,
    SerpentMagus2 = 598,
    Marauder2 = 599,
    Infidel2 = 600,
    SandRaider2 = 601,
    Invader2 = 602,
    Assailant2 = 603,
    DeathMauler6 = 604,
    QuillRat2 = 605,
    SpikeFiend2 = 606,
    RazorSpine2 = 607,
    CarrionBird2 = 608,
    ThornedHulk2 = 609,
    Slinger2 = 610,
    Slinger3 = 611,
    Slinger4 = 612,
    VileArcher2 = 613,
    DarkArcher2 = 614,
    VileLancer2 = 615,
    DarkLancer2 = 616,
    BlackLancer2 = 617,
    Blunderbore2 = 618,
    Mauler2 = 619,
    ReturnedMage5 = 620,
    BurningDeadMage4 = 621,
    ReturnedMage6 = 622,
    HorrorMage5 = 623,
    BoneMage5 = 624,
    HorrorMage6 = 625,
    HorrorMage7 = 626,
    Huntress2 = 627,
    SaberCat2 = 628,
    CaveLeaper2 = 629,
    TombCreeper2 = 630,
    Ghost2 = 631,
    Wraith2 = 632,
    Specter2 = 633,
    SuccubusExp2 = 634,
    HellTemptress2 = 635,
    Dominus2 = 636,
    HellWitch2 = 637,
    VileWitch2 = 638,
    Gloam2 = 639,
    BlackSoul2 = 640,
    BurningSoul2 = 641,
    Carver2 = 642,
    Devilkin2 = 643,
    DarkOne2 = 644,
    CarverShaman2 = 645,
    DevilkinShaman2 = 646,
    DarkShaman2 = 647,
    BoneWarrior2 = 648,
    Returned2 = 649,
    Gloombat2 = 650,
    Fiend2 = 651,
    BloodLord7 = 652,
    BloodLord8 = 653,
    Scarab2 = 654,
    SteelWeevil2 = 655,
    Flayer3 = 656,
    StygianDoll3 = 657,
    SoulKiller3 = 658,
    Flayer4 = 659,
    StygianDoll4 = 660,
    SoulKiller4 = 661,
    FlayerShaman2 = 662,
    StygianDollShaman2 = 663,
    SoulKillerShaman2 = 664,
    TempleGuard2 = 665,
    TempleGuard3 = 666,
    Guardian2 = 667,
    Unraveler2 = 668,
    HoradrimAncient2 = 669,
    HoradrimAncient3 = 670,
    Zealot2 = 671,
    Zealot3 = 672,
    Heirophant3 = 673,
    Heirophant4 = 674,
    Grotesque2 = 675,
    FleshSpawner2 = 676,
    GrotesqueWyrm2 = 677,
    FleshBeast2 = 678,
    WorldKiller2 = 679,
    WorldKillerYoung2 = 680,
    WorldKillerEgg2 = 681,
    SlayerExp2 = 682,
    HellSpawn2 = 683,
    GreaterHellSpawn2 = 684,
    Arach2 = 685,
    Balrog2 = 686,
    PitLord2 = 687,
    Imp6 = 688,
    Imp7 = 689,
    UndeadStygianDoll2 = 690,
    UndeadSoulKiller2 = 691,
    Strangler2 = 692,
    StormCaster2 = 693,
    MawFiend2 = 694,
    BloodLord9 = 695,
    GhoulLord2 = 696,
    DarkLord2 = 697,
    UnholyCorpse2 = 698,
    DoomKnight2 = 699,
    DoomKnight3 = 700,
    OblivionKnight2 = 701,
    OblivionKnight3 = 702,
    Cadaver2 = 703,
    UberMephisto = 704,
    UberDiablo = 705,
    UberIzual = 706,
    Lilith = 707,
    UberDuriel = 708,
    UberBaal = 709,
    EvilHut2 = 710,
    DemonHole = 711,  // Dummy
    PitLord3 = 712,
    OblivionKnight4 = 713,
    Imp8 = 714,
    HellSwarm2 = 715,
    WorldKiller3 = 716,
    Arach3 = 717,
    SteelWeevil3 = 718,
    HellTemptress3 = 719,
    VileWitch3 = 720,
    FleshHunter2 = 721,
    DarkArcher3 = 722,
    BlackLancer3 = 723,
    HellWhip2 = 724,
    Returned3 = 725,
    HorrorArcher3 = 726,
    BurningDeadMage5 = 727,
    HorrorMage8 = 728,
    BoneMage6 = 729,
    HorrorMage9 = 730,
    DarkLord3 = 731,
    Specter3 = 732,
    BurningSoul3 = 733,

    Invalid,
    NpcNotApplicable = 0xFFFF
};

static bool npc_is_useless(int code) {
    switch (code) {
        case NpcCode::Gorgon:            // Unused
        case NpcCode::Gorgon2:           // Unused
        case NpcCode::Gorgon3:           // Unused
        case NpcCode::Gorgon4:           // Unused
        case NpcCode::ChaosHorde:        // Unused
        case NpcCode::ChaosHorde2:       // Unused
        case NpcCode::ChaosHorde3:       // Unused
        case NpcCode::ChaosHorde4:       // Unused
        case NpcCode::DarkGuard:         // Unused
        case NpcCode::DarkGuard2:        // Unused
        case NpcCode::DarkGuard3:        // Unused
        case NpcCode::DarkGuard4:        // Unused
        case NpcCode::DarkGuard5:        // Unused
        case NpcCode::BloodMage:         // Unused
        case NpcCode::BloodMage2:        // Unused
        case NpcCode::BloodMage3:        // Unused
        case NpcCode::BloodMage4:        // Unused
        case NpcCode::BloodMage5:        // Unused
        case NpcCode::FireBeast:         // Unused
        case NpcCode::IceGlobe:          // Unused
        case NpcCode::LightningBeast:    // Unused
        case NpcCode::PoisonOrb:         // Unused
        case NpcCode::Chicken:           // Dummy
        case NpcCode::Rat:               // Dummy
        case NpcCode::Rogue:             // Dummy
        case NpcCode::HellMeteor:        // Dummy
        case NpcCode::Bird:              // Dummy
        case NpcCode::Bird2:             // Dummy
        case NpcCode::Bat:               // Dummy
        case NpcCode::Cow:               // Dummy
        case NpcCode::Camel:             // Dummy
        case NpcCode::Act2Male:          // Dummy
        case NpcCode::Act2Female:        // Dummy
        case NpcCode::Act2Child:         // Dummy
        case NpcCode::Act2Guard:         // Dummy
        case NpcCode::Act2Vendor:        // Dummy
        case NpcCode::Act2Vendor2:       // Dummy
        case NpcCode::Bug:               // Dummy
        case NpcCode::Scorpion:          // Dummy
        case NpcCode::Rogue2:            // Dummy
        case NpcCode::Rogue3:            // Dummy
        case NpcCode::Familiar:          // Dummy
        case NpcCode::Act3Male:          // Dummy
        case NpcCode::Act3Female:        // Dummy
        case NpcCode::Snake:             // Dummy
        case NpcCode::Parrot:            // Dummy
        case NpcCode::Fish:              // Dummy
        case NpcCode::EvilHole:          // Dummy
        case NpcCode::EvilHole2:         // Dummy
        case NpcCode::EvilHole3:         // Dummy
        case NpcCode::EvilHole4:         // Dummy
        case NpcCode::EvilHole5:         // Dummy
        case NpcCode::InvisoSpawner:     // Dummy
        case NpcCode::MiniSpider:        // Dummy
        case NpcCode::BoneWall:          // Dummy
        case NpcCode::SevenTombs:        // Dummy
        case NpcCode::SpiritMummy:       // Dummy
        case NpcCode::Act2Guard4:        // Dummy
        case NpcCode::Act2Guard5:        // Dummy
        case NpcCode::Window:            // Dummy
        case NpcCode::Window2:           // Dummy
        case NpcCode::MephistoSpirit:    // Dummy
        case NpcCode::InvisiblePet:      // Dummy
        case NpcCode::DemonHole:         // Dummy
        case NpcCode::FireboltTrap:      // A trap
        case NpcCode::HorzMissileTrap:   // A trap
        case NpcCode::VertMissileTrap:   // A trap
        case NpcCode::PoisonCloudTrap:   // A trap
        case NpcCode::LightningTrap:     // A trap
        case NpcCode::MeleeTrap:         // A trap
        case NpcCode::Hephasto:          // ????
        case NpcCode::SlayerExp:         // ????
        case NpcCode::SuccubusExp:       // ????
        case NpcCode::CompellingOrbNpc:  // at mephisto's temple in travincal

        case NpcCode::DeckardCain:        // In Trist?
        case NpcCode::DarkWanderer:       // Act 3 guy outside town
        case NpcCode::Tyrael:             // Kill Him in act 4 for quest?
        case NpcCode::InjuredBarbarian:   // Dummy
        case NpcCode::InjuredBarbarian2:  // Dummy
        case NpcCode::InjuredBarbarian3:  // Dummy
        case NpcCode::Act5Townguard:      // Dummy
        case NpcCode::Act5Townguard2:     // Dummy
        case NpcCode::Tyrael3:            // Appears when u kill baal?
        case NpcCode::WakeOfDestruction:

        case NpcCode::BaalThrone:  // Baal thats sitting on throne

        case NpcCode::NecroSkeleton:  // Necro summon
        case NpcCode::NecroMage:      // Necro summon

        case NpcCode::Hydra:
        case NpcCode::Hydra2:
        case NpcCode::Hydra3:

        case NpcCode::Guard:              // Act 2 merc?
        case NpcCode::IronWolf:           // Act 3 merc?
        case NpcCode::Act5Hireling1Hand:  // Act 5 merc?
        case NpcCode::Act5Hireling2Hand:  // Act 5 merc?

        case NpcCode::ShadowWarrior:
        case NpcCode::ShadowMaster:
        case NpcCode::OakSage:
        case NpcCode::ClayGolem:
        case NpcCode::BloodGolem:
        case NpcCode::IronGolem:
        case NpcCode::FireGolem:

        case NpcCode::ChargedBoltSentry:
        case NpcCode::LightningSentry:
        case NpcCode::InfernoSentry:
        case NpcCode::DeathSentry:

        case NpcCode::Decoy:
        case NpcCode::Valkyrie:

        case NpcCode::DruidHawk:
        case NpcCode::DruidSpiritWolf:
        case NpcCode::DruidFenris:
        case NpcCode::DruidPlaguePoppy:
        case NpcCode::DruidCycleOfLife:
        case NpcCode::VineCreature:
        case NpcCode::DruidBear:
        case NpcCode::Wolf:
        case NpcCode::Bear:

        case NpcCode::HeartOfWolverine:
        case NpcCode::SpiritOfBarbs:

        case NpcCode::CatapultSpotterS:
        case NpcCode::CatapultSpotterE:
        case NpcCode::CatapultSpotterSiege:
        case NpcCode::CatapultSpotterW:

        case NpcCode::CatapultS:
        case NpcCode::CatapultE:
        case NpcCode::CatapultSiege:
        case NpcCode::CatapultW:

        case NpcCode::Act5Combatant:
        case NpcCode::Act5Combatant2:

        case NpcCode::BarricadeWallLeft:
        case NpcCode::BarricadeWallRight:

        case NpcCode::TrappedSoul:   //Act 4 "human chest"
        case NpcCode::TrappedSoul2:  //Act 4 "human chest"
        case NpcCode::Navi:          //Flavie in Blood Moor/Cold Plains transition
        case NpcCode::Izual2:        // Izuals ghost after you kill him for quest
        {
            return true;
        }
        default: {
            return false;
        }
    }
}

#endif
