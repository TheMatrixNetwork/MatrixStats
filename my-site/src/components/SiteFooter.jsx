import React from "react";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-800/60 bg-black/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">About Us</h4>
          <p className="text-sm text-slate-400">
            Matrix Network is a competitive Minecraft server focused on delivering an enhhancec combat experience,
            and adventures you'll remember.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Useful Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Getting Started</li>
            <li>Server Status</li>
            <li>Support</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Socials</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Discord</li>
            <li>Twitter / X</li>
            <li>YouTube</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Donations / Store</h4>
          <p className="text-sm text-slate-400">
            Support the server with cosmetic upgrades and ranks from the Matrix Network store.
          </p>
        </div>
      </div>
    </footer>
  );
}
