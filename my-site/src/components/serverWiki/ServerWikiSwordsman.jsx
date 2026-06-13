import React, { useState } from "react";
import swordsmanImg from "../../assets/swordsman.jpg";

// Minecraft §color → CSS. Matches SkillsPro config.yml stat colors.
const STR = { color: "#55FF55" };   // &a green
const DEX = { color: "#FFAA00" };   // &6 gold
const ARC = { color: "#55FFFF" };   // &b aqua
const VIT = { color: "#AA0000" };   // &4 dark red
const INT = { color: "#5555FF" };   // &9 blue
const MIT = { color: "#FF5555" };   // &c red
const DEF = { color: "#00AAAA" };   // &3 dark aqua

function S({ label, style }) {
    return <span className="font-bold" style={style}>{label}</span>;
}

// Key label display names
const KEY_LABELS = {
    L: "Left Click",
    R: "Right Click",
    S: "Sneak",
};

// Whether a key is a "hold" modifier (displayed differently)
const HOLD_KEYS = new Set(["S"]);

function KeyCombo({ keys }) {
    const parts = keys.split("");
    // If the sequence starts with a hold key (S), treat it as held while the rest are pressed
    const hasHold = parts.length > 1 && HOLD_KEYS.has(parts[0]);
    const holdKey = hasHold ? parts[0] : null;
    const pressKeys = hasHold ? parts.slice(1) : parts;

  return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
          {holdKey && (
              <>
                  <kbd className="rounded-md border border-purple-500/60 bg-purple-950/70 px-2.5 py-1 text-sm font-semibold text-purple-300">
                      {KEY_LABELS[holdKey]}
                  </kbd>
                  <span className="text-base text-slate-400 font-semibold select-none">+</span>
              </>
          )}
          {pressKeys.map((k, i) => (
              <React.Fragment key={i}>
                  {i > 0 && (
                      <span className="text-base text-amber-500/70 font-bold select-none">→</span>
                  )}
                  <kbd className="rounded-md border border-slate-500/70 bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-200">
                      {KEY_LABELS[k] || k}
                  </kbd>
              </React.Fragment>
      ))}
    </span>
  );
}

function AbilityCard({ title, activation, flavor, description, scalingDesc, scalingFormula }) {
    const [open, setOpen] = useState(false);

  return (
      <article className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-7 shadow">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="text-2xl font-bold text-amber-300">{title}</h3>
        {activation && (
                  <div className="flex flex-col items-end gap-1.5">
                      <span className="text-xs uppercase tracking-widest text-slate-500">Activation Sequence</span>
            <KeyCombo keys={activation} />
                  </div>
              )}
          </div>

          {/* Flavor */}
          <p className="mt-4 text-lg italic text-slate-300 leading-relaxed">{flavor}</p>

          {/* Plain description */}
          <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>

          {/* Scaling section */}
          {scalingDesc && (
              <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/60 px-5 py-4 space-y-2">
                  <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
                      {scalingDesc}
                  </div>

                  {scalingFormula && (
                      <div className="pt-2">
                          <button
                              type="button"
                              onClick={() => setOpen((o) => !o)}
                              className="flex items-center gap-2 text-sm font-semibold text-amber-400/80 hover:text-amber-300 transition"
                          >
                              <span
                                  className="inline-block transition-transform duration-200"
                                  style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                              >
                                  ▶
                              </span>
                              {open ? "Hide Formula" : "Show Formula"}
                          </button>

                          {open && (
                              <div className="mt-3 rounded-lg border border-slate-700/40 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-amber-200">
                                  {scalingFormula}
                              </div>
                          )}
                      </div>
                  )}
        </div>
      )}
    </article>
  );
}

export default function ServerWikiSwordsman({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
                  className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* left text */}
          <div className="flex-1">
                      <p className="text-sm uppercase tracking-[0.4em] text-amber-500/80">Class Codex</p>
                      <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Swordsman</h1>

                      <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              Swordsmen are the <span className="text-amber-300 font-semibold">prime of all melee combat</span> — disciplined
              duelists who dominate through superior damage and close-range mastery. In a fair fight, few classes
              can weather the relentless pressure of a blade in trained hands.
            </p>
                      <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Their strength lies in the one-on-one — tight corridors, sword-to-sword trading, and the ability to
              out-mechanical opponents who fight poorly. Their weakness is range: a Swordsman caught in open
              space against a disciplined ranged build will struggle to close the gap.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                              <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                              <p className="mt-1 text-lg font-semibold">
                                  <S label="STR" style={STR} /> &nbsp;·&nbsp; <S label="DEX" style={DEX} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                              <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                              <p className="mt-1 text-lg font-semibold text-sky-400">Mana</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                              <p className="text-sm uppercase tracking-widest text-slate-500">Max Level</p>
                              <p className="mt-1 text-lg font-semibold text-slate-200">100</p>
              </div>
            </div>
          </div>

          {/* right image */}
          <div className="flex-shrink-0 lg:w-56 xl:w-64">
            <img
              src={swordsmanImg}
              alt="Swordsman"
              className="w-full rounded-2xl border border-slate-700/60 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
              <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Swordsman.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(20 + (VIT × 0.26), 46)",
              note: <><S label="VIT" style={VIT} /> scales your health pool up to 46 health (23 hearts).</>,
            },
            {
              label: "Max Energy",
              formula: "15 + (INT/15) + (lvl/4)",
                note: <><S label="INT" style={INT} /> and your level both grow your mana pool.</>,
            },
            {
              label: "Energy Regen",
              formula: "0.5 + (0.05 × max(lvl, min(125, ARC × max(1, lvl/80))))",
                note: <><S label="ARC" style={ARC} /> dramatically accelerates mana recovery at higher levels.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(50.5, 5 + max(0, lvl-1)·(5/99) + MIT·0.86·((lvl-1)/99)^1.84)",
                note: <><S label="MIT" style={MIT} /> raises your damage cap ceiling as you level.</>,
            },
          ].map(({ label, formula, note }) => (
              <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
                  <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-amber-300 break-all">{formula}</p>
                  <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
              <p className="mt-2 text-base text-slate-400">
                  For active abilities, each key in the activation sequence must be pressed one after another within a short
                  combo window. You must hold a sword unless otherwise noted.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            flavor="You've trained your off-hand to be just as lethal as your dominant. Every blow lands with practiced intent."
                      description="Unlocks offhand sword attacks, greatly increasing your damage output during sustained melee trades. Damage scales directly with your Strength — the harder you've trained your body, the harder you hit."
                      scalingDesc={
              <>
                    <p>Offhand damage grows with your <S label="STR" style={STR} />. More Strength means every offhand strike hits harder.</p>
                    <p className="text-slate-500 text-sm">Works on any sword-type item held in the offhand.</p>
              </>
            }
                      scalingFormula={
                        <p>damage = 1 + <S label="STR" style={STR} />/25</p>
                      }
          />

          <AbilityCard
            title="Parry"
            flavor="You read the incoming blow, shift your weight, and redirect its force back into your attacker."
                      description="While holding a sword, if your Dexterity beats your opponent's, you have a chance to reflect a portion of the incoming damage right back at them. Higher ability levels increase both how much you reflect and how often it triggers."
                      scalingDesc={
              <>
                              <p>Reflect % scales with your <S label="DEX" style={DEX} /> and level — higher DEX and higher level means more damage sent back.</p>
                              <p>Proc chance scales with level alone — the longer you've been fighting, the more reliable your parries become.</p>
                              <p className="text-slate-500 text-sm">Requires your DEX stat to exceed your attacker's. No sword = no parry.</p>
                          </>
                      }
                      scalingFormula={
                          <>
                              <p>reflect = <S label="DEX" style={DEX} />/5 + lvl×2 (%)</p>
                              <p>chance = lvl × 10 (%)</p>
              </>
            }
          />

          <AbilityCard
            title="Pierce"
            flavor="Your blade finds the gap in their armor — not by luck, but by knowing exactly where to strike."
            description="A passive ability that checks every hit: if your Defense outweighs the target's Defense, your strike deals bonus damage. No activation needed — it just fires whenever the condition is met."
                      scalingDesc={
              <>
                    <p>Bonus damage % scales with your level — the higher your level, the more damage you deal when you pierce through.</p>
                          <p className="text-slate-500 text-sm">Requires your <S label="DEF" style={DEF} /> to exceed target's <S label="DEF" style={DEF} />. Passive — no button to press.</p>
              </>
            }
                      scalingFormula={
                          <p>bonus damage = 100 × lvl / 10 (%)</p>
                      }
          />

          <AbilityCard
            title="Dodge"
            flavor="A split second. A lean. The blade passes through air where you were standing."
                      description="While holding a sword, you have a passive chance to fully evade incoming attacks. Pairs naturally with Parry — together they punish aggressive opponents who commit to trading with you."
                      scalingDesc={
              <>
                    <p>Evasion chance scales with both your <S label="DEX" style={DEX} /> and level — more of both means more evasion.</p>
                    <p className="text-slate-500 text-sm">Passive. Works on any sword-type item. No cooldown — can proc on every incoming hit.</p>
              </>
            }
                      scalingFormula={
                          <p>chance = <S label="DEX" style={DEX} />/7 + (lvl × 5) (%)</p>
                      }
          />

          <AbilityCard
            title="Dash"
            activation="LR"
            flavor="Close the gap before they can react. You're already inside their guard before they finish the thought."
                      description="A burst dash that lunges you toward your target, dealing impact damage and applying knockback on contact. Works as an engage to open a duel or as an escape when you need to reset. Dash range extends as your Arcane grows."
                      scalingDesc={
              <>
                              <p>Impact damage scales with your level and <S label="STR" style={STR} /> — higher Strength means a harder landing.</p>
                              <p>Dash range scales with your <S label="ARC" style={ARC} /> — more Arcane means you can close greater distances.</p>
                              <p className="text-slate-500 text-sm">Energy cost: 6 mana. Cooldown: 5 seconds.</p>
                          </>
                      }
                      scalingFormula={
                          <>
                              <p>damage = max(lvl+1, lvl + <S label="STR" style={STR} />/25)</p>
                              <p>range = max(2, <S label="ARC" style={ARC} />/20) blocks</p>
              </>
            }
          />

          <AbilityCard
            title="Thousand Cuts"
            activation="R"
            flavor="You don't kill them in one strike. You take them apart, piece by piece, until there's nothing left."
                      description="Right-click to enter an aggressive sword stance. Your next target receives a relentless flurry of rapid strikes — each one dealing damage and disorienting them for 2 seconds per hit, making it nearly impossible to fight back effectively."
                      scalingDesc={
              <>
                              <p>Damage per strike scales with your level and <S label="STR" style={STR} /> combined — both matter here, invest in both.</p>
                              <p>Hit count scales with level — higher level means more individual strikes in the flurry.</p>
                              <p>Cooldown decreases as your <S label="ARC" style={ARC} /> grows — more Arcane means this ability comes back faster.</p>
                              <p className="text-slate-500 text-sm">Energy cost: 20 mana.</p>
                          </>
                      }
                      scalingFormula={
                          <>
                              <p>damage/hit = max(1, (lvl + <S label="STR" style={STR} />) / 30)</p>
                              <p>hit count = lvl × 3</p>
                              <p>cooldown = 60 − <S label="ARC" style={ARC} />/5 (seconds)</p>
              </>
            }
          />

          <AbilityCard
            title="Annihilation"
            activation="SLLR"
            flavor="The air splits. Spectral swords orbit you in formation, and your enemy realizes too late — this fight was already over."
                      description="Summon a ring of spectral blades that orbit you and automatically attack nearby targets. You can also hurl them directly for a powerful thrown strike. The longer you invest in this ability, the longer it lasts and the wider its reach."
                      scalingDesc={
              <>
                              <p>Orbital blade damage and throw damage both scale with your <S label="STR" style={STR} /> — raw power feeds the spectral edge.</p>
                              <p>Duration scales with your level and <S label="ARC" style={ARC} /> — Arcane keeps the blades manifested longer.</p>
                              <p>Blade range scales with level — higher level means the swords orbit and reach farther out.</p>
                              <p>Cooldown is long, but your <S label="ARC" style={ARC} /> reduces it — invest in Arcane to use this more frequently.</p>
                          <p className="text-slate-500 text-sm">Energy cost: 30 mana. Sneak → Left → Left → Right to activate.</p>
                          </>
                      }
                      scalingFormula={
                          <>
                              <p>orbital damage = max(<S label="STR" style={STR} />/30, 1.5)</p>
                              <p>throw damage = min((<S label="STR" style={STR} />/5) + lvl, 15)</p>
                              <p>duration = 5 + (lvl × 3) + <S label="ARC" style={ARC} />/20 (seconds)</p>
                              <p>range = 7 + lvl (blocks)</p>
                              <p>cooldown = (30 + lvl×10) + 30 − <S label="ARC" style={ARC} />/5 (seconds)</p>
              </>
            }
          />
        </div>
      </div>

      {/* ── Build Notes ──────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">Build Notes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            {
                  stat: <S label="STR" style={STR} />,
                  desc: "Your primary damage stat. Boosts passive offhand strikes, Thousand Cuts, Dash impact, and both Annihilation damage types. Max this first.",
            },
            {
                stat: <S label="DEX" style={DEX} />,
                desc: "Your dueling survival stat. Higher DEX means more Parry reflects and more Dodge procs — both of which punish opponents who commit to trading with you.",
            },
            {
                stat: <S label="ARC" style={ARC} />,
                desc: "Reduces cooldowns and extends reach. Lowers Thousand Cuts and Annihilation cooldowns, and increases Dash range and Energy regen. Strong secondary investment.",
            },
            {
                stat: <><S label="VIT" style={VIT} /> / <S label="INT" style={INT} /> / <S label="MIT" style={MIT} /></>,
                desc: "Health pool, mana pool, and damage cap ceiling. Don't neglect these — they determine how long you can stay in a prolonged fight.",
            },
          ].map(({ stat, desc }, i) => (
              <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
                  <p className="text-xl font-bold">{stat}</p>
                  <p className="mt-2 text-base text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
