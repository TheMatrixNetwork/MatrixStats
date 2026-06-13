# Juggernaut Stage Analysis (2026-06-01)

## Scope
- Levels: 3, 15, 25, 50, 60, 75, 100
- Builds: Fortress, Bruiser, Balanced
- Source formulas: g:/Minecraft/TestMatrix/plugins/SkillsPro/Skills/Juggernaut.yml and g:/Minecraft/TestMatrix/plugins/SkillsPro/config.yml

## Build Definitions
- Fortress: DEF 55%, VIT 20%, ARC 15%, MIT 10%, STR 0%
- Bruiser: DEF 40%, STR 35%, VIT 10%, ARC 10%, MIT 5%
- Balanced: DEF 35%, STR 25%, VIT 20%, ARC 10%, MIT 10%

## Results
| Level | Build | DEF | STR | ARC | MIT | GlobalDef | PassiveShield | Proc% | ExpMit/Hit | Throw | Chain | DmgCap |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | Fortress | 2 | 0 | 1 | 0 | 0.57 | 0.2 | 5 | 0.01 | 0.9 | 0 | 4.08 |
| 3 | Bruiser | 2 | 1 | 0 | 0 | 0.57 | 0.2 | 5 | 0.01 | 0.92 | 0 | 4.08 |
| 3 | Balanced | 1 | 1 | 0 | 0 | 0.4 | 0.1 | 5 | 0.01 | 0.92 | 0 | 4.08 |
| 15 | Fortress | 34 | 0 | 9 | 6 | 2.33 | 3.4 | 17.45 | 0.59 | 1.8 | 0 | 4.67 |
| 15 | Bruiser | 24 | 21 | 6 | 3 | 1.96 | 2.4 | 12.3 | 0.3 | 2.27 | 0 | 4.62 |
| 15 | Balanced | 21 | 15 | 6 | 6 | 1.83 | 2.1 | 10.8 | 0.23 | 2.13 | 0 | 4.67 |
| 25 | Fortress | 80 | 0 | 22 | 15 | 3.5 | 8 | 41.1 | 3.29 | 2.7 | 1.05 | 5.64 |
| 25 | Bruiser | 58 | 51 | 15 | 7 | 3.05 | 5.8 | 29.75 | 1.73 | 3.83 | 2.51 | 5.28 |
| 25 | Balanced | 51 | 37 | 15 | 15 | 2.86 | 5.1 | 26.25 | 1.34 | 3.52 | 2.11 | 5.64 |
| 50 | Fortress | 100 | 0 | 42 | 28 | 3.5 | 10 | 52.1 | 5.21 | 2.7 | 1.05 | 10.22 |
| 50 | Bruiser | 100 | 99 | 28 | 14 | 3.5 | 10 | 51.4 | 5.14 | 4.9 | 3.88 | 8.1 |
| 50 | Balanced | 99 | 71 | 28 | 28 | 3.5 | 9.9 | 50.9 | 5.04 | 4.28 | 3.08 | 10.22 |
| 60 | Fortress | 100 | 0 | 45 | 30 | 3.5 | 10 | 52.25 | 5.22 | 2.7 | 1.05 | 12.61 |
| 60 | Bruiser | 100 | 100 | 30 | 15 | 3.5 | 10 | 51.5 | 5.15 | 4.92 | 3.91 | 9.5 |
| 60 | Balanced | 100 | 76 | 30 | 30 | 3.5 | 10 | 51.5 | 5.15 | 4.39 | 3.22 | 12.61 |
| 75 | Fortress | 100 | 0 | 55 | 37 | 3.5 | 10 | 52.75 | 5.28 | 2.7 | 1.05 | 18.27 |
| 75 | Bruiser | 100 | 100 | 37 | 18 | 3.5 | 10 | 51.85 | 5.18 | 4.92 | 3.91 | 12.48 |
| 75 | Balanced | 100 | 92 | 37 | 37 | 3.5 | 10 | 51.85 | 5.18 | 4.74 | 3.68 | 18.27 |
| 100 | Fortress | 100 | 0 | 75 | 50 | 3.5 | 10 | 53.75 | 5.38 | 2.7 | 1.05 | 33 |
| 100 | Bruiser | 100 | 100 | 50 | 25 | 3.5 | 10 | 52.5 | 5.25 | 4.92 | 3.91 | 20.5 |
| 100 | Balanced | 100 | 100 | 50 | 50 | 3.5 | 10 | 52.5 | 5.25 | 4.92 | 3.91 | 33 |

## Notes
- Ability level assumption: level <10 => ability level 1; 10-24 => level 2; 25+ => level 3.
- Raw full metrics are in the JSON and CSV artifacts next to this file.
