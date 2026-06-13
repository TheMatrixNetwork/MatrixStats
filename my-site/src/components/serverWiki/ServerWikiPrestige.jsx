import React from "react";

const PRESTIGE_MAX = 10;

const tierRows = Array.from({ length: PRESTIGE_MAX }, (_, i) => {
  const tier = i + 1;
  return {
    tier,
    soulsCost: tier * 10000,
    moneyCost: tier * 10000,
    statPoints: tier * 25,
  };
});

const resets = [
  { label: "Level", detail: "Reset to 0 — the grind restarts.", tone: "border-rose-700/40 bg-rose-950/20" },
  { label: "XP", detail: "All experience is wiped.", tone: "border-red-700/40 bg-red-950/20" },
  { label: "Stats", detail: "Your stat allocations are cleared.", tone: "border-orange-700/40 bg-orange-950/20" },
  { label: "Ability Levels", detail: "Every ability drops back to its base.", tone: "border-amber-700/40 bg-amber-950/20" },
  { label: "Energy", detail: "Energy resets alongside your stats.", tone: "border-fuchsia-700/40 bg-fuchsia-950/20" },
];

const kept = [
  { label: "Your Class", detail: "You keep the class you earned.", tone: "border-emerald-700/40 bg-emerald-950/20" },
  { label: "Souls", detail: "Every soul you've collected stays with you.", tone: "border-teal-700/40 bg-teal-950/20" },
  { label: "Masteries", detail: "Mastery progress is never taken away.", tone: "border-cyan-700/40 bg-cyan-950/20" },
  { label: "Prestige Count", detail: "Your tier rises permanently.", tone: "border-lime-700/40 bg-lime-950/20" },
];

export default function ServerWikiPrestige({ onNavigate }) {
  const finalTierStatReward = tierRows[PRESTIGE_MAX - 1].statPoints;
  const totalSoulsSpent = tierRows.reduce((sum, row) => sum + row.soulsCost, 0);

  return (
    <section className="fade-in space-y-8">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-700/40 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        <button
          onClick={() => onNavigate("/server-wiki")}
          className="mb-6 rounded-full border border-slate-700/60 bg-slate-950/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-slate-500/70 hover:text-slate-100"
        >
          ← Back to Server Wiki
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">Skills System</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-100 lg:text-5xl">Prestige</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
          Reaching max level is just the beginning. Prestige is the choice to burn it all down and build something stronger — earning
          permanent power and a reputation that speaks for itself.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          There are 10 prestige tiers. Each one demands more than the last. Every prestige grants a fresh batch of stat points based
          on that tier, peaking at <span className="font-bold text-amber-300">+{finalTierStatReward.toLocaleString()} stat points</span>
          {" "}at Prestige 10. Those prestige reward points do not stack cumulatively, because stats are reset each time you prestige.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-2xl border border-amber-700/30 bg-amber-500/5 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-amber-300">10</p>
            <p className="mt-0.5 text-xs text-slate-400 uppercase tracking-wider">Max Prestige</p>
          </div>
          <div className="rounded-2xl border border-emerald-700/30 bg-emerald-500/5 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-300">+{finalTierStatReward}</p>
            <p className="mt-0.5 text-xs text-slate-400 uppercase tracking-wider">Prestige 10 Reward</p>
          </div>
          <div className="rounded-2xl border border-slate-700/30 bg-slate-800/40 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-slate-200">{(totalSoulsSpent / 1000).toFixed(0)}K</p>
            <p className="mt-0.5 text-xs text-slate-400 uppercase tracking-wider">Total Souls Spent</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-slate-100">How It Works</h2>
        <p className="mt-2 text-slate-400">
          Prestige is a voluntary reset. When you're ready, you pay the cost and your progression wipes — but your character grows
          permanently. Think of it less as starting over and more as shedding what you no longer need.
        </p>
        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-lg font-bold text-amber-400">1</div>
            <div>
              <p className="font-semibold text-slate-200">Hit Max Level</p>
              <p className="mt-1 text-sm text-slate-400">You need to reach the maximum level for your class before the option becomes available.</p>
            </div>
          </div>
          <div className="flex flex-1 gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-lg font-bold text-amber-400">2</div>
            <div>
              <p className="font-semibold text-slate-200">Pay the Cost</p>
              <p className="mt-1 text-sm text-slate-400">Each prestige tier has a souls and money cost. The price scales up with every tier you claim.</p>
            </div>
          </div>
          <div className="flex flex-1 gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-lg font-bold text-amber-400">3</div>
            <div>
              <p className="font-semibold text-slate-200">Rebuild Stronger</p>
              <p className="mt-1 text-sm text-slate-400">Your tier rises and you receive that tier's prestige stat reward. Then you level up all over again with the new prestige bonuses in play.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-indigo-700/40 bg-indigo-950/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">Important: Prestige Is Per Class</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Prestige is tied to each class separately on your character. If you are <span className="font-semibold text-indigo-300">Vampire 5</span>
            and switch to Swordsman, your vampire prestige stays saved.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You can level Swordsman to <span className="font-semibold text-amber-300">Prestige 10</span>, then swap back and still be
            {" "}<span className="font-semibold text-indigo-300">Vampire 5</span>. In other words, you are building a personal prestige track for each class you invest in.
          </p>
        </div>
      </div>

      {/* What resets vs what you keep */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-red-900/30 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">The sacrifice</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">What Resets</h2>
          <p className="mt-2 text-sm text-slate-400">These are wiped when you prestige. The road back is the whole point.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {resets.map((item) => (
              <li key={item.label} className={`rounded-xl border p-3 ${item.tone}`}>
                <div>
                  <p className="font-semibold text-slate-200">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-emerald-900/30 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">The reward</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">What You Keep</h2>
          <p className="mt-2 text-sm text-slate-400">These are yours permanently. No reset can take them.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {kept.map((item) => (
              <li key={item.label} className={`rounded-xl border p-3 ${item.tone}`}>
                <div>
                  <p className="font-semibold text-slate-200">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tier table */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-slate-100">Prestige Tiers</h2>
        <p className="mt-2 text-base text-slate-400">
          Every tier is a deliberate commitment. Here is exactly what each one costs and what you permanently walk away with.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-700/60">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-700/60 bg-slate-950/60 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Souls</th>
                <th className="px-5 py-3">Money</th>
                <th className="px-5 py-3 text-emerald-400">Stats Gained</th>
              </tr>
            </thead>
            <tbody>
              {tierRows.map((row) => (
                <tr
                  key={row.tier}
                  className={`border-t border-slate-800/60 transition-colors ${
                    row.tier === PRESTIGE_MAX ? "bg-amber-500/5" : "hover:bg-slate-800/30"
                  }`}
                >
                  <td className="px-5 py-3">
                    <span className={`font-bold ${row.tier === PRESTIGE_MAX ? "text-amber-300" : "text-slate-300"}`}>
                      {row.tier === PRESTIGE_MAX ? `★ ${row.tier}` : row.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{row.soulsCost.toLocaleString()}</td>
                  <td className="px-5 py-3 text-slate-300">${row.moneyCost.toLocaleString()}</td>
                  <td className="px-5 py-3 font-semibold text-emerald-400">+{row.statPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">★ Max prestige tier. The stats gained value is the reward granted for that prestige only.</p>
      </div>

      {/* Scaling & payoff */}
      <div className="rounded-3xl border border-purple-900/30 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">Long-term scaling</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">The Payoff</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-300">
          Prestige isn't just a vanity milestone — it is baked into how classes scale. Damage ceilings rise with your prestige tier,
          and abilities cost more energy at higher tiers too. The system is designed so that a fully prestiged player who has mastered
          their resource management will consistently outperform one who hasn't, even at the same raw level.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Prestige still matters long-term, but the power spike comes from the current tier's stat reward, the prestige-scaled class
          formulas, and the prestige marker itself. On this config, the biggest single prestige reward is{" "}
          <span className="font-semibold text-amber-300">+{finalTierStatReward.toLocaleString()} stat points</span> at Prestige 10,
          alongside the higher damage ceilings and steeper ability costs tied to prestige.
        </p>
        <div className="mt-5 rounded-2xl border border-purple-700/30 bg-slate-950/40 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">Might and Damage Cap</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Prestige directly amplifies how effective <span className="font-semibold text-red-300">Might (MIT)</span> is for damage-cap growth.
            As prestige rises, each MIT point contributes more than it did before, so the same build scales better at higher prestige.
          </p>
          <details className="mt-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Technical Details</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The MIT term is multiplied by <span className="font-semibold text-purple-300">(1 + prestige * 0.25)</span>. Example with a base MIT factor of 0.9:
              each MIT is worth 0.9 cap at Prestige 0, 1.8 at Prestige 4, and 3.15 at Prestige 10.
            </p>
          </details>
        </div>

        <div className="mt-4 rounded-2xl border border-red-700/30 bg-slate-950/40 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Higher Risk at Higher Prestige</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Death penalties now scale with both your skill level and prestige tier. XP loss and soul loss both use a
            prestige multiplier, so climbing higher makes death progressively more punishing.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            The multiplier is <span className="font-semibold text-red-300">(1 + prestige * 0.25)</span>. Religion still mitigates loss,
            but pushing prestige now comes with a real difficulty cost.
          </p>
        </div>
      </div>
    </section>
  );
}