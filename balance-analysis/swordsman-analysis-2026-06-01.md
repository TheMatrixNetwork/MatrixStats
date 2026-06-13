# Swordsman Stage Analysis (2026-06-01)

## Scope
- Levels: 3, 15, 25, 50, 60, 75, 100
- Builds: Duelist, Skirmisher, Brawler
- Source formulas: g:/Minecraft/TestMatrix/plugins/SkillsPro/Skills/Swordsman.yml and g:/Minecraft/TestMatrix/plugins/SkillsPro/config.yml

## Build Definitions
- Duelist: STR 35%, DEX 35%, ARC 10%, MIT 10%, VIT 10%
- Skirmisher: DEX 45%, STR 25%, ARC 15%, VIT 10%, MIT 5%
- Brawler: STR 40%, VIT 20%, MIT 15%, DEX 15%, ARC 5%, DEF 5%

## Notes
- Ability level assumption: level <10 => ability level 1; 10-24 => level 2; 25+ => level 3.
- Thousand-Cuts formula in YAML includes an extra ')' and is modeled as: max(1,(lvl+str)/30).
- MIT is fully included in calculations and feeds DamageCap.

## Results (Core)
| Level | Build | STR | DEX | MIT | DEF | MaxHP | GDef | Dodge% | Parry% | Dash | 1kCuts Total | Annihilation | Throw | DmgCap |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | Duelist | 1 | 1 | 0 | 0 | 20 | 0 | 5.14 | 10 | 2 | 3 | 0 | 0 | 5.1 |
| 3 | Skirmisher | 1 | 2 | 0 | 0 | 20 | 0 | 5.29 | 10 | 2 | 3 | 0 | 0 | 5.1 |
| 3 | Brawler | 2 | 1 | 1 | 0 | 20.5 | 0 | 5.14 | 10 | 2 | 3 | 0 | 0 | 5.1 |
| 15 | Duelist | 21 | 21 | 6 | 0 | 23 | 0 | 13 | 20 | 3 | 6 | 0 | 0 | 5.85 |
| 15 | Skirmisher | 15 | 27 | 3 | 0 | 23 | 0 | 13.86 | 20 | 3 | 6 | 0 | 0 | 5.78 |
| 15 | Brawler | 24 | 9 | 9 | 3 | 26 | 0.69 | 11.29 | 20 | 3 | 6 | 0 | 0 | 5.92 |
| 25 | Duelist | 51 | 51 | 15 | 0 | 27.5 | 0 | 22.29 | 30 | 5.04 | 16.2 | 0 | 0 | 7.19 |
| 25 | Skirmisher | 37 | 66 | 7 | 0 | 27.5 | 0 | 24.43 | 30 | 4.48 | 12 | 0 | 0 | 6.67 |
| 25 | Brawler | 58 | 22 | 22 | 7 | 34.5 | 1.06 | 18.14 | 30 | 5.32 | 18.3 | 0 | 0 | 7.65 |
| 50 | Duelist | 99 | 99 | 28 | 0 | 34 | 0 | 29.14 | 30 | 6.96 | 30.6 | 3.3 | 15 | 14.33 |
| 50 | Skirmisher | 71 | 100 | 14 | 0 | 34 | 0 | 29.29 | 30 | 5.84 | 22.2 | 2.37 | 15 | 10.9 |
| 50 | Brawler | 100 | 42 | 42 | 14 | 48.5 | 1.5 | 21 | 30 | 7 | 30.9 | 3.33 | 15 | 17.77 |
| 60 | Duelist | 100 | 100 | 30 | 0 | 35 | 0 | 29.29 | 30 | 7 | 30.9 | 3.33 | 15 | 18.34 |
| 60 | Skirmisher | 76 | 100 | 15 | 0 | 35 | 0 | 29.29 | 30 | 6.04 | 23.7 | 2.53 | 15 | 13.16 |
| 60 | Brawler | 100 | 45 | 45 | 15 | 50 | 1.55 | 21.43 | 30 | 7 | 30.9 | 3.33 | 15 | 23.53 |
| 75 | Duelist | 100 | 100 | 37 | 0 | 38.5 | 0 | 29.29 | 30 | 7 | 30.9 | 3.33 | 15 | 28.17 |
| 75 | Skirmisher | 92 | 100 | 18 | 0 | 38.5 | 0 | 29.29 | 30 | 6.68 | 28.5 | 3.07 | 15 | 18.19 |
| 75 | Brawler | 100 | 55 | 55 | 18 | 50 | 1.7 | 22.86 | 30 | 7 | 30.9 | 3.33 | 15 | 37.63 |
| 100 | Duelist | 100 | 100 | 50 | 0 | 45 | 0 | 29.29 | 30 | 7 | 30.9 | 3.33 | 15 | 55 |
| 100 | Skirmisher | 100 | 100 | 25 | 0 | 45 | 0 | 29.29 | 30 | 7 | 30.9 | 3.33 | 15 | 32.5 |
| 100 | Brawler | 100 | 75 | 75 | 25 | 50 | 2 | 25.71 | 30 | 7 | 30.9 | 3.33 | 15 | 77.5 |

## Pierce Check
- Pierce bonus scales as 10/20/30% for ability levels 1/2/3, but only applies if attacker DEF > defender DEF.
- See CSV/JSON columns: PierceWorksVsDEF0, PierceWorksVsDEF30, PierceWorksVsDEF60.
