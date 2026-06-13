# Vampire Stage Analysis (2026-06-01)

## Scope
- Levels: 3, 15, 25, 50, 60, 75, 100
- Builds: Hemomancer, Reaver, Nightlord
- Source formulas: g:/Minecraft/TestMatrix/plugins/SkillsPro/Skills/Vampire.yml and g:/Minecraft/TestMatrix/plugins/SkillsPro/config.yml

## Build Definitions
- Hemomancer: INT 45%, VIT 30%, STR 15%, ARC 10%
- Reaver: STR 40%, INT 25%, VIT 20%, ARC 10%, MIT 5%
- Nightlord: VIT 40%, INT 30%, STR 15%, ARC 10%, MIT 5%

## Assumptions
- Vampire unlock requirement is level 666. Stage values below are theoretical scaling snapshots once class is available.
- temperature = 0, radiation = 0.
- bloodwell variable in energy-regen is modeled as Blood Well ability level (1/2/3 by stage bracket).

## Results (Core)
| Level | Build | STR | INT | VIT | ARC | MIT | MaxHP | MaxBlood | Regen | PassiveDmg | BloodDrain | LustDmg | Bleed | Circuit | DmgCap |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | Hemomancer | 1 | 2 | 1 | 0 | 0 | 20.5 | 15.3 | 0.73 | 0.09 | 14.94 | 0.1 | 4 | 0 | 5.1 |
| 3 | Reaver | 2 | 1 | 1 | 0 | 0 | 20.5 | 15.25 | 0.73 | 0.07 | 14.97 | 0.15 | 4 | 0 | 5.1 |
| 3 | Nightlord | 1 | 1 | 2 | 0 | 0 | 21 | 15.25 | 0.73 | 0.05 | 14.97 | 0.1 | 4 | 0 | 5.1 |
| 15 | Hemomancer | 9 | 27 | 18 | 6 | 0 | 29 | 17.35 | 0.79 | 1.08 | 14.23 | 0.55 | 4 | 0 | 5.71 |
| 15 | Reaver | 24 | 15 | 12 | 6 | 3 | 26 | 16.75 | 0.76 | 0.98 | 14.57 | 1.3 | 4 | 0 | 5.78 |
| 15 | Nightlord | 9 | 18 | 24 | 6 | 3 | 32 | 16.9 | 0.77 | 0.78 | 14.49 | 0.55 | 4 | 0 | 5.78 |
| 25 | Hemomancer | 22 | 66 | 44 | 15 | 0 | 42 | 19.97 | 0.87 | 2.64 | 13.11 | 1.25 | 4 | 0 | 6.21 |
| 25 | Reaver | 58 | 37 | 29 | 15 | 7 | 34.5 | 18.52 | 0.81 | 2.39 | 13.94 | 3.05 | 4 | 0 | 6.67 |
| 25 | Nightlord | 22 | 44 | 58 | 15 | 7 | 49 | 18.87 | 0.82 | 1.91 | 13.74 | 1.25 | 4 | 0 | 6.67 |
| 50 | Hemomancer | 42 | 100 | 85 | 28 | 0 | 50 | 23.33 | 1.01 | 4.17 | 12.14 | 2.25 | 4 | 7 | 7.47 |
| 50 | Reaver | 100 | 71 | 57 | 28 | 14 | 48.5 | 21.88 | 0.95 | 4.37 | 12.97 | 5.15 | 4 | 5.84 | 10.9 |
| 50 | Nightlord | 42 | 85 | 100 | 28 | 14 | 50 | 22.58 | 0.98 | 3.67 | 12.57 | 2.25 | 4 | 6.4 | 10.9 |
| 60 | Hemomancer | 45 | 100 | 91 | 30 | 0 | 50 | 24 | 1.04 | 4.23 | 12.14 | 2.4 | 4 | 7 | 7.98 |
| 60 | Reaver | 100 | 76 | 61 | 30 | 15 | 50 | 22.8 | 0.99 | 4.53 | 12.83 | 5.15 | 4 | 6.04 | 13.16 |
| 60 | Nightlord | 45 | 91 | 100 | 30 | 15 | 50 | 23.55 | 1.02 | 3.93 | 12.4 | 2.4 | 4 | 6.64 | 13.16 |
| 75 | Hemomancer | 55 | 100 | 100 | 37 | 0 | 50 | 25 | 1.09 | 4.43 | 12.14 | 2.9 | 4 | 7 | 8.74 |
| 75 | Reaver | 100 | 92 | 74 | 37 | 18 | 50 | 24.6 | 1.07 | 5.07 | 12.37 | 5.15 | 4 | 6.68 | 18.19 |
| 75 | Nightlord | 55 | 100 | 100 | 37 | 18 | 50 | 25 | 1.09 | 4.43 | 12.14 | 2.9 | 4 | 7 | 18.19 |
| 100 | Hemomancer | 75 | 100 | 100 | 50 | 0 | 50 | 26.67 | 1.16 | 4.83 | 12.14 | 3.9 | 4 | 7 | 10 |
| 100 | Reaver | 100 | 100 | 100 | 50 | 25 | 50 | 26.67 | 1.16 | 5.33 | 12.14 | 5.15 | 4.5 | 7 | 32.5 |
| 100 | Nightlord | 75 | 100 | 100 | 50 | 25 | 50 | 26.67 | 1.16 | 4.83 | 12.14 | 3.9 | 4 | 7 | 32.5 |

## Notes
- Blood Circuit columns are zero before level 35 because the ability is locked.
- Eternal Darkness metrics are included in CSV/JSON and activate at level 25+ stages.
