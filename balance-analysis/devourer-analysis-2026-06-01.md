# Devourer Stage Analysis (2026-06-01)

## Scope
- Levels: 3, 15, 25, 50, 60, 75, 100
- Builds: Corruptor (ARC/DEX), Stalker (DEX), Hybrid (ARC/DEX balanced)
- Source formulas: g:/Minecraft/TestMatrix/plugins/SkillsPro/Skills/Devourer.yml
- Source behavior checks: SkillsPro Java ability handlers (DevourerPassive, Consume, Cloak, Blink, Disarm, Hook, Locate, Gliders)

## Assumptions
- Ability level bracket: 1 (<10), 2 (10-24), 3 (25+).
- Consume only triggers when damaging a player target.
- Cloak bonus damage applies only at ability level 3.

## Results (Core)
| Level | Build | ARC | DEX | VIT | MIT | MaxHP | Hearts | Regen | Passive Dmg/Tick | Passive Proc % | Consume No-Soul Dmg | Cloak Bonus Dmg | Blink Hits | Hook Range | Dmg Cap |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | Corruptor | 2 | 1 | 0 | 0 | 20 | 10 | 1.15 | 1 | 60.25 | 11 | 0.2 | 3 | 50 | 6.12 |
| 3 | Stalker | 1 | 2 | 1 | 0 | 20.5 | 10.25 | 1.15 | 1 | 60.5 | 11 | 0.4 | 3 | 50 | 6.12 |
| 3 | Hybrid | 1 | 1 | 1 | 0 | 20.5 | 10.25 | 1.15 | 1 | 60.25 | 11 | 0.2 | 3 | 50 | 6.12 |
| 15 | Corruptor | 27 | 21 | 6 | 0 | 23 | 11.5 | 2.35 | 6.59 | 65.25 | 12 | 4.2 | 6 | 50 | 6.85 |
| 15 | Stalker | 15 | 31 | 9 | 6 | 24.5 | 12.25 | 1.75 | 3.66 | 67.75 | 12 | 6.2 | 6 | 50 | 7 |
| 15 | Hybrid | 21 | 21 | 9 | 6 | 24.5 | 12.25 | 2.05 | 5.12 | 65.25 | 12 | 4.2 | 6 | 50 | 7 |
| 25 | Corruptor | 66 | 51 | 15 | 0 | 27.5 | 13.75 | 4.3 | 16.1 | 72.75 | 17 | 10.2 | 9 | 50 | 7.45 |
| 25 | Stalker | 37 | 73 | 22 | 15 | 31 | 15.5 | 2.85 | 9.02 | 78.25 | 24.33 | 14.6 | 9 | 50 | 8.5 |
| 25 | Hybrid | 51 | 51 | 22 | 15 | 31 | 15.5 | 3.55 | 12.44 | 72.75 | 17 | 10.2 | 9 | 50 | 8.5 |
| 50 | Corruptor | 100 | 99 | 28 | 0 | 34 | 17 | 6 | 24.39 | 84.75 | 33 | 19.8 | 9 | 50 | 8.97 |
| 50 | Stalker | 71 | 100 | 42 | 28 | 41 | 20.5 | 4.55 | 17.32 | 85 | 33.33 | 20 | 9 | 50 | 16.43 |
| 50 | Hybrid | 99 | 99 | 42 | 28 | 41 | 20.5 | 5.95 | 24.15 | 84.75 | 33 | 19.8 | 9 | 50 | 16.43 |
| 60 | Corruptor | 100 | 100 | 30 | 0 | 35 | 17.5 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 9.58 |
| 60 | Stalker | 76 | 100 | 45 | 30 | 42.5 | 21.25 | 4.8 | 18.54 | 85 | 33.33 | 20 | 9 | 50 | 20.91 |
| 60 | Hybrid | 100 | 100 | 45 | 30 | 42.5 | 21.25 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 20.91 |
| 75 | Corruptor | 100 | 100 | 37 | 0 | 38.5 | 19.25 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 10.48 |
| 75 | Stalker | 92 | 100 | 55 | 37 | 47.5 | 23.75 | 5.6 | 22.44 | 85 | 33.33 | 20 | 9 | 50 | 31.89 |
| 75 | Hybrid | 100 | 100 | 55 | 37 | 47.5 | 23.75 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 31.89 |
| 100 | Corruptor | 100 | 100 | 50 | 0 | 45 | 22.5 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 12 |
| 100 | Stalker | 100 | 100 | 75 | 50 | 57.5 | 28.75 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 62 |
| 100 | Hybrid | 100 | 100 | 75 | 50 | 57.5 | 28.75 | 6 | 24.39 | 85 | 33.33 | 20 | 9 | 50 | 62 |

## Notes
- Devourer primary damage identity is passive corrosion pressure (high proc + long duration), not burst skill damage.
- Most active abilities are utility/control (disarm, hook, blink reposition, locate, gliders).
- Damage cap is currently one of the highest class caps due to MIT curve.
